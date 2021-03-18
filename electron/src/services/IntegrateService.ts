import IntegrateRepository from '../repositories/IntegrateRepository'

import CashierService from '../services/CashierService'
import StoreService from '../services/StoreService'
import SalesService from '../services/SalesService'
import HandlersService from '../services/HandlersService'

import ItemsService from '../services/ItemsService'
import PaymentsService from '../services/PaymentsService'

import api from '../utils/Api'
import { sendLog } from '../utils/ApiLog'
import { checkInternet } from '../utils/InternetConnection'

import { IntegratePaymentsDTO } from '../models/dtos/payments/IntegratePaymentsDTO'
import { Sale } from '../models/Sale'
import { Handler } from '../models/Handler'
import { PaymentType } from '../../../shared/enums/paymentType'

import {
  formatHandlesToIntegrate,
  formatSalesToIntegrate,
  getInOutHandlers,
  getQuantityItems,
  getAmountOnCash,
} from '../utils/IntegrateFormater'

// eslint-disable-next-line @typescript-eslint/no-var-requires
const pkg = require('../../../package.json')

class IntegrateService {
  async integrateOffline(code: string, amount_on_close: number): Promise<void> {
    try {
      const { id: store } = await StoreService.getOne()

      const {
        amount_on_open,
        id: localCashId,
      } = await CashierService.getCurrentCashier()

      const {
        data: {
          data: { cash_id, history_id },
        },
      } = await api.put(`/store_cashes/${store}-${code}/open`, {
        amount_on_open,
      })

      const sales = await IntegrateRepository.getOfflineSales()
      const formatedSales = formatSalesToIntegrate(sales, cash_id, history_id)

      let allPayments: IntegratePaymentsDTO[] = []
      await Promise.all(
        formatedSales.map(async ({ id, cash_code, store_id, ...payload }) => {
          const items = await ItemsService.getItemsToIntegrate(id)
          const quantity = getQuantityItems(items)
          const payments = await PaymentsService.getPaymentsToIntegrate(id)
          allPayments = [...payments, ...allPayments]
          const formatedPayments = payments.map((payment) => ({
            ...payment,
            type: PaymentType[payment.type],
          }))
          const saleToIntegrate = {
            ...payload,
            quantity,
            items,
            formatedPayments,
          }
          try {
            await api.post(`/sales/${store}-${code}`, [saleToIntegrate])
            await SalesService.update(id, { to_integrate: false })
          } catch (err) {
            sendLog({
              title: 'Erro ao ao integrar venda offline',
              payload: {
                err: err.message,
                params: { store, code, sale: saleToIntegrate },
              },
            })
            console.log(err)
          }
        })
      )

      const handlers = await IntegrateRepository.getOfflineHandlers()
      const formatedHandler = formatHandlesToIntegrate(
        handlers,
        cash_id,
        history_id
      )

      await Promise.all(
        formatedHandler.map(async ({ id, cash_code, store_id, ...payload }) => {
          try {
            await api.post(`/cash_handler/${store}-${code}`, [payload])
            await HandlersService.update(id, { to_integrate: false })
          } catch (err) {
            sendLog({
              title: 'Erro ao ao integrar handler offline',
              payload: {
                err: err.message,
                params: { store, code, handler: payload },
              },
            })
            console.log(err)
          }
        })
      )

      const intOutValues = getInOutHandlers(handlers)
      const amount_on_cash = getAmountOnCash(allPayments, sales)

      const result_cash =
        +amount_on_close +
        +intOutValues.amount_in -
        +amount_on_cash -
        +amount_on_open -
        +intOutValues.amount_out

      await api.put(`/store_cashes/${store}-${code}/close`, {
        offlineIntegrate: true,
        amount_on_close,
        result_cash,
        in_result: intOutValues.amount_in,
        out_result: intOutValues.amount_out,
        amount_on_cash,
      })

      await CashierService.closeLocalCashier(localCashId)
    } catch (err) {
      sendLog({
        title: 'Erro ao realizar integração de vendas offline',
        payload: err.message,
      })
    }
  }

  async integrateOnlineSales(): Promise<void> {
    const sales = await IntegrateRepository.getOnlineSales()
    const formatedSales = formatSalesToIntegrate(sales)
    await Promise.all(
      formatedSales.map(async ({ id, store_id, cash_code, ...payload }) => {
        const items = await ItemsService.getItemsToIntegrate(id)
        const quantity = getQuantityItems(items)
        const payments = await PaymentsService.getPaymentsToIntegrate(id)
        const saleToIntegrate = {
          ...payload,
          quantity,
          items,
          payments,
        }
        try {
          await api.post(`/sales/${store_id}-${cash_code}`, [saleToIntegrate])
          await SalesService.update(id, { to_integrate: false })
        } catch (err) {
          sendLog({
            title: 'Erro ao integrar de venda online',
            payload: {
              err: err.message,
              params: {
                store_id,
                cash_code,
                sale: saleToIntegrate,
              },
            },
          })
          console.log(err)
        }
      })
    )
  }

  async integrateOnlineHandlers(): Promise<void> {
    const handlers = await IntegrateRepository.getOnlineHandlers()
    const formatedHandler = formatHandlesToIntegrate(handlers)
    await Promise.all(
      formatedHandler.map(async ({ id, store_id, cash_code, ...payload }) => {
        try {
          await api.post(`/cash_handler/${store_id}-${cash_code}`, [payload])
          await HandlersService.update(id, { to_integrate: false })
        } catch (err) {
          sendLog({
            title: 'Erro ao integrar de movimentação online',
            payload: {
              err: err.message,
              params: {
                store_id,
                cash_code,
                handler: payload,
              },
            },
          })
          console.log(err)
        }
      })
    )
  }

  async shouldUpdateApp(): Promise<boolean> {
    const currentCash = await CashierService.getCurrentCashier()
    if (currentCash && currentCash.is_opened === 1) {
      return false
    }
    const sales = await IntegrateRepository.getOnlineSales()
    if (sales.length > 0) {
      return false
    }
    return true
  }

  async appAlreadyUpdated(): Promise<boolean> {
    const hasInternet = await checkInternet()
    if (!hasInternet) {
      return true
    }
    // const {
    //   data: {
    //     data: { version },
    //   },
    // } = await api.get('/version')
    // if (pkg.version === version) {
    //   return true
    // }
    return true
  }

  async getOnlineSales(): Promise<Sale[]> {
    return await IntegrateRepository.getOnlineSales()
  }

  async getOnlineHandlers(): Promise<Handler[]> {
    return await IntegrateRepository.getOnlineHandlers()
  }
}

export default new IntegrateService()
