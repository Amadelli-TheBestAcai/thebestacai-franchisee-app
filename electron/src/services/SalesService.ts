import SalesRepository from '../repositories/SalesRepository'
import CashierService from '../services/CashierService'
import ItemsService from '../services/ItemsService'
import PaymentsService from '../services/PaymentsService'
import GetCurrentStoreService from './Store/GetCurrentStoreService'
import IntegrateService from '../services/IntegrateService'

import api from '../utils/Api'
import { CreateSaleDTO } from '../models/dtos/sales/CreateSaleDTO'
import { UpdateSaleDTO } from '../models/dtos/sales/UpdateSaleDTO'
import { Sale } from '../models/Sale'
import { Item } from '../models/Item'
import { Payment } from '../models/Payment'
import { v4 as uuidv4 } from 'uuid'
import { checkInternet } from '../utils/InternetConnection'
import { getNow } from '../utils/DateHandler'
import { sendLog } from '../utils/ApiLog'
import { printSale } from '../utils/PrintSale'

import { AppSale } from '../../../shared/models/appSales'
import { SaleOption } from '../../../shared/models/saleOption'
import { IntegrateAppSalesDTO } from '../../../shared/dtos/appSales/IntegrateAppSalesDTO'
class SalesService {
  async create(): Promise<CreateSaleDTO> {
    const cashier = await CashierService.getCurrentCashier()
    if (!cashier && cashier?.is_opened !== 1) {
      return null
    }
    const newSale: CreateSaleDTO = {
      id: uuidv4(),
      store_id: cashier.store_id,
      cash_id: cashier.cash_id,
      cash_code: cashier.code,
      change_amount: 0,
      total: 0,
      type: 'STORE',
      discount: 0,
      to_integrate: false,
      is_current: true,
      created_at: getNow(),
    }
    await SalesRepository.create(newSale)
    return newSale
  }

  async getCurrentSale(): Promise<{
    sale: CreateSaleDTO
    items: Item[]
    payments: Payment[]
  }> {
    const currentSale = await SalesRepository.getCurrentSale()
    if (currentSale) {
      const items = await ItemsService.getBySale(currentSale.id)
      const payments = await PaymentsService.getBySale(currentSale.id)
      return { sale: currentSale, items, payments }
    } else {
      const newSale = await this.create()
      return { sale: newSale, items: [], payments: [] }
    }
  }

  async finishSale(
    payload: CreateSaleDTO,
    options?: SaleOption
  ): Promise<void> {
    const cashier = await CashierService.getCurrentCashier()
    const sale = await SalesRepository.getById(payload.id)
    if (sale) {
      await SalesRepository.update(payload.id, {
        ...payload,
        is_current: false,
        to_integrate: true,
        cash_history_id: cashier.history_id,
      })
    } else {
      await SalesRepository.create(payload)
    }
    const hasInternet = await checkInternet()
    if (options?.emit_nfce && !hasInternet) {
      // TODO: retornar erro avisando indisponibilidade de internet
    } else if (options?.emit_nfce && options.printer) {
      // TODO: emitir nota fiscal e gerar cupom
    } else if (options?.emit_nfce && !options.printer) {
      // TODO: emitir nota fiscal e NAO gerar cupom
    } else if (options?.printer) {
      printSale(payload)
    }
    if (hasInternet) {
      await IntegrateService.integrateOnlineSales()
    }
  }

  async delete(sale: string): Promise<void> {
    await ItemsService.deleteBySale(sale)
    await PaymentsService.deleteBySale(sale)
    await SalesRepository.deleteById(sale)
  }

  async getSalesCommands(): Promise<Sale[]> {
    const sales = await SalesRepository.getCommands()
    const salesWithOutCurrent = sales.filter((sale) => sale.is_current === 0)
    return salesWithOutCurrent
  }

  async createCommand(id: string, name: string): Promise<CreateSaleDTO> {
    await SalesRepository.createCommand(id, name)
    return await this.create()
  }

  async transferItemsCommand(oldSale: string): Promise<void> {
    const {
      sale: { id: currentSale },
    } = await this.getCurrentSale()
    const items = await ItemsService.getBySale(oldSale)
    await Promise.all(
      items.map(async (item) => {
        const oldItem = await ItemsService.getByProductAndSale(
          currentSale,
          item.product_id
        )
        if (oldItem && oldItem.product_id !== 1) {
          const newItem: Item = {
            ...oldItem,
            quantity: +oldItem.quantity + +item.quantity,
            total: +oldItem.total + +item.total,
          }
          await ItemsService.updateByProductAndSale(
            item.product_id,
            currentSale,
            {
              ...newItem,
              sale_id: currentSale,
            }
          )
        } else {
          await ItemsService.createOrUpdate(
            { ...item, sale_id: currentSale },
            currentSale
          )
        }
      })
    )
    await ItemsService.updateQuantityAndTotal(currentSale)
    await ItemsService.deleteBySale(oldSale)
    await SalesRepository.deleteById(oldSale)
  }

  async getOffline(): Promise<Sale[]> {
    return await SalesRepository.getOffline()
  }

  async update(id: string, payload: UpdateSaleDTO): Promise<void> {
    return await SalesRepository.update(id, payload)
  }

  async integrateOffline(amount_on_close: number, code: string): Promise<void> {
    const sales = await SalesRepository.getOffline()
    const { store_id: store } = await GetCurrentStoreService.execute()
    const {
      amount_on_open,
      id: cashId,
    } = await CashierService.getCurrentCashier()
    const {
      data: {
        data: { cash_id, history_id },
      },
    } = await api.put(`/store_cashes/${store}-${code}/open`, {
      amount_on_open,
    })
    await Promise.all(
      sales.map(async (sale) => {
        const items = await ItemsService.getItemsToIntegrate(sale.id)
        const payments = await PaymentsService.getPaymentsToIntegrate(sale.id)
        const formatedSale = {
          change_amount: sale.change_amount,
          type: sale.type,
          discount: sale.discount,
          cash_id,
          history_id,
          payments,
          items,
        }
        try {
          await api.post(`/sales/${store}-${code}`, [formatedSale])
          await SalesRepository.update(sale.id, { to_integrate: false })
        } catch (err) {
          sendLog({
            title: 'Erro ao integrar vendas pendentes',
            payload: { err: err.message, params: { sale } },
          })
          console.log(err)
        }
      })
    )
    await api.put(`/store_cashes/${store}-${code}/close`, {
      amount_on_close,
    })
    await CashierService.closeLocalCashier(cashId)
  }

  async getFromApi(
    withClosedCash = false
  ): Promise<{ isConnected: boolean; sales: any[]; appSales: any[] }> {
    const isConnected = await checkInternet()
    if (!isConnected) {
      return {
        isConnected,
        sales: [],
        appSales: [],
      }
    }
    const currentCash = await CashierService.getCurrentCashier()

    if (!currentCash) {
      return {
        isConnected,
        sales: [],
        appSales: [],
      }
    }

    if (!withClosedCash && currentCash?.is_opened !== 1) {
      return {
        isConnected,
        sales: [],
        appSales: [],
      }
    }
    const { store_id, code } = currentCash
    if (!store_id || !code) {
      return {
        isConnected,
        sales: [],
        appSales: [],
      }
    }
    const {
      data: {
        data: { sales, appSales },
      },
    } = await api.get(`/current_sales_history/${store_id}-${code}`)
    return {
      isConnected,
      sales,
      appSales,
    }
  }

  async deleteFromApi(id: number): Promise<{ success: boolean; data: any[] }> {
    const isConnected = await checkInternet()
    if (!isConnected) {
      return {
        success: false,
        data: [],
      }
    }

    const currentCash = await CashierService.getCurrentCashier()
    if (!currentCash || currentCash?.is_opened !== 1) {
      return {
        success: false,
        data: [],
      }
    }
    const { store_id, code } = currentCash
    if (!store_id || !code) {
      return {
        success: false,
        data: [],
      }
    }

    try {
      await api.delete(`/sales/${id}?storeId=${store_id}`)
      const { sales } = await this.getFromApi()
      return {
        success: true,
        data: sales,
      }
    } catch (err) {
      sendLog({
        title: 'Erro ao remover venda pela api',
        payload: { err: err.message, params: { id } },
      })
      console.log(err)
      return {
        success: false,
        data: [],
      }
    }
  }

  async getAppSalesToIntegrate(): Promise<{
    hasInternet: boolean
    sales: AppSale[]
  }> {
    const isConnected = await checkInternet()
    if (!isConnected) {
      return {
        hasInternet: false,
        sales: [],
      }
    }

    const currentCash = await CashierService.getCurrentCashier()
    if (!currentCash || currentCash?.is_opened !== 1) {
      throw new Error('Caixa fechado')
    }

    const { store_id } = currentCash
    if (!store_id) {
      throw new Error('Id da loja não encontrado')
    }

    const {
      data: { content },
    } = await api.get(`/app_sale/${store_id}/toIntegrate`)

    return {
      hasInternet: true,
      sales: content,
    }
  }

  async integrateAppSales(payload): Promise<void> {
    const currentCash = await CashierService.getCurrentCashier()

    if (!currentCash || currentCash?.is_opened !== 1) {
      throw new Error('Caixa fechado')
    }

    const { store_id } = currentCash
    if (!store_id) {
      throw new Error('Id da loja não encontrado')
    }

    await api.post(`/sales/${store_id}-${currentCash.code}`, payload)
  }

  async getToIntegrate(): Promise<Sale[]> {
    return await SalesRepository.getToIntegrate()
  }
}

export default new SalesService()
