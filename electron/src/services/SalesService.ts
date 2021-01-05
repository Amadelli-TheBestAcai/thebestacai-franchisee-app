import SalesRepository from '../repositories/SalesRepository'
import CashierService from '../services/CashierService'
import ItemsService from '../services/ItemsService'
import PaymentsService from '../services/PaymentsService'
import StoreService from '../services/StoreService'
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
      cash_history_id: cashier.history_id,
      change_amount: 0,
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

  async finishSale(sale: CreateSaleDTO): Promise<void> {
    await SalesRepository.update(sale.id, {
      ...sale,
      is_current: false,
      to_integrate: true,
    })
    const hasInternet = await checkInternet()
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

  async getPending(): Promise<Sale[]> {
    return await SalesRepository.getPending()
  }

  async update(id: string, payload: UpdateSaleDTO): Promise<void> {
    return await SalesRepository.update(id, payload)
  }

  async integratePending(amount_on_close: number, code: string): Promise<void> {
    const sales = await SalesRepository.getPending()
    const { id: store } = await StoreService.getOne()
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
  ): Promise<{ isConnected: boolean; data: any[] }> {
    const isConnected = await checkInternet()
    if (!isConnected) {
      return {
        isConnected,
        data: [],
      }
    }
    const currentCash = await CashierService.getCurrentCashier()

    if (!currentCash) {
      return {
        isConnected,
        data: [],
      }
    }

    if (!withClosedCash && currentCash?.is_opened !== 1) {
      return {
        isConnected,
        data: [],
      }
    }
    const { store_id, code } = currentCash
    if (!store_id || !code) {
      return {
        isConnected,
        data: [],
      }
    }
    const {
      data: { data },
    } = await api.get(`/current_sales_history/${store_id}-${code}`)
    return {
      isConnected,
      data: data || [],
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
      await api.delete(`/sales/${id}`)
      const { data } = await this.getFromApi()
      return {
        success: true,
        data,
      }
    } catch (err) {
      console.log(err)
      return {
        success: false,
        data: [],
      }
    }
  }
}

export default new SalesService()
