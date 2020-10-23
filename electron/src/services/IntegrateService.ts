import IntegrateRepository from '../repositories/IntegrateRepository'

import CashierService from '../services/CashierService'
import UserService from '../services/UserService'
import SalesService from '../services/SalesService'
import HandlersService from '../services/HandlersService'

import ItemsService from '../services/ItemsService'
import PaymentsService from '../services/PaymentsService'

import api from '../utils/Api'
import { checkInternet } from '../utils/InternetConnection'
import { sleep } from '../utils/Sleep'

import { IntegratePaymentsDTO } from '../models/dtos/payments/IntegratePaymentsDTO'
import { PaymentType } from '../../../shared/enums/PaymentType'

import {
  formatHandlesToIntegrate,
  formatSalesToIntegrate,
  getInOutHandlers,
  getQuantityItems,
  getAmountOnCash,
} from '../utils/IntegrateFormater'

class IntegrateService {
  async integrateOffline(code: string, amount_on_close: number): Promise<void> {
    const { store } = await UserService.getTokenInfo()

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
        let payments = await PaymentsService.getPaymentsToIntegrate(id)
        allPayments = [...payments, ...allPayments]
        payments = payments.map((payment) => ({
          ...payment,
          type: PaymentType[payment.type],
        }))
        const saleToIntegrate = {
          ...payload,
          quantity,
          items,
          payments,
        }
        try {
          await api.post(`/sales/${store}-${code}`, [saleToIntegrate])
          await SalesService.update(id, { to_integrate: false })
        } catch (err) {
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
  }

  async integrateOnline(): Promise<void> {
    console.log('Inicializando integracao de vendas')
    while (true) {
      const isConnected = await checkInternet()

      if (!isConnected) {
        return
      }

      const currentCash = await CashierService.getCurrentCashier()

      if (!currentCash || !currentCash.history_id || !currentCash.is_opened) {
        return
      }

      const sales = await IntegrateRepository.getOnlineSales()
      const formatedSales = formatSalesToIntegrate(sales)

      await Promise.all(
        formatedSales.map(async ({ id, store_id, cash_code, ...payload }) => {
          const items = await ItemsService.getItemsToIntegrate(id)
          const quantity = getQuantityItems(items)
          let payments = await PaymentsService.getPaymentsToIntegrate(id)
          payments = payments.map((payment) => ({
            ...payment,
            type: PaymentType[payment.type],
          }))
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
            console.log(err)
          }
        })
      )

      const handlers = await IntegrateRepository.getOnlineHandlers()
      const formatedHandler = formatHandlesToIntegrate(handlers)

      await Promise.all(
        formatedHandler.map(async ({ id, store_id, cash_code, ...payload }) => {
          try {
            await api.post(`/cash_handler/${store_id}-${cash_code}`, [payload])
            await HandlersService.update(id, { to_integrate: false })
          } catch (err) {
            console.log(err)
          }
        })
      )

      await sleep(5000)
    }
  }
}

export default new IntegrateService()
