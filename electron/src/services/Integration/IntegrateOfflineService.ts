import api from '../../utils/Api'
import { sendLog } from '../../utils/ApiLog'

import { IStoreCashRepository } from '../../repositories/interfaces/IStoreCashRepository'
import StoreCashRepository from '../../repositories/StoreCashRepository'

import { IStoreRepository } from '../../repositories/interfaces/IStoreRepository'
import StoreRepository from '../../repositories/StoreRepository'

import { ISalesRepository } from '../../repositories/interfaces/ISalesRepository'
import SalesRepository from '../../repositories/SalesRepository'

import { ICashHandlerRepository } from '../../repositories/interfaces/ICashHandlerRepository'
import CashHandlerRepository from '../../repositories/CashHandlerRepository'

import { IntegratePaymentsDTO } from '../../models/dtos/payments/IntegratePaymentsDTO'
import { PaymentType } from '../../../../shared/enums/paymentType'

import {
  formatHandlesToIntegrate,
  formatSalesToIntegrate,
  getInOutHandlers,
  getQuantityItems,
  getAmountOnCash,
} from '../../utils/IntegrateFormater'

import GetItemsToIntegrateService from '../Item/GetItemsToIntegrateService'
import GetDecodedTokenService from '../User/GetDecodedTokenService'
import GetPaymentsToIntegrateService from '../Payment/GetPaymentsToIntegrateService'

class IntegrateOnlineService {
  private _storeCashRepository: IStoreCashRepository
  private _storeRepository: IStoreRepository
  private _saleRepository: ISalesRepository
  private _cashHandlerRepository: ICashHandlerRepository
  constructor(
    storeCashRepository: IStoreCashRepository = new StoreCashRepository(),
    storeRepository: IStoreRepository = new StoreRepository(),
    saleRepository: ISalesRepository = new SalesRepository(),
    cashHandlerRepository: ICashHandlerRepository = new CashHandlerRepository()
  ) {
    this._storeCashRepository = storeCashRepository
    this._storeRepository = storeRepository
    this._saleRepository = saleRepository
    this._cashHandlerRepository = cashHandlerRepository
  }

  async execute(code: string, amount_on_close: number): Promise<void> {
    try {
      const { store_id: store } = await this._storeRepository.findCurrent()

      const {
        amount_on_open,
        id: localCashId,
      } = await this._storeCashRepository.getOne()

      const {
        data: {
          data: { cash_id, history_id },
        },
      } = await api.put(`/store_cashes/${store}-${code}/open`, {
        amount_on_open,
      })

      const sales = await this._saleRepository.getOffline()
      const formatedSales = formatSalesToIntegrate(sales, cash_id, history_id)

      let allPayments: IntegratePaymentsDTO[] = []
      const currentUser = await GetDecodedTokenService.execute()
      await Promise.all(
        formatedSales.map(async ({ id, cash_code, store_id, ...payload }) => {
          const { oldItemPayload } = await GetItemsToIntegrateService.execute(
            id,
            currentUser
          )
          const quantity = getQuantityItems(oldItemPayload)
          const payments = await GetPaymentsToIntegrateService.execute(id)
          allPayments = [...payments, ...allPayments]
          const formatedPayments = payments.map((payment) => ({
            ...payment,
            type: PaymentType[payment.type],
          }))
          const saleToIntegrate = {
            ...payload,
            quantity,
            oldItemPayload,
            formatedPayments,
          }
          try {
            await api.post(`/sales/${store}-${code}`, [saleToIntegrate])
            await this._saleRepository.update(id, { to_integrate: false })
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

      const handlers = await this._cashHandlerRepository.getOfflineHandlers()
      const formatedHandler = formatHandlesToIntegrate(
        handlers,
        cash_id,
        history_id
      )

      await Promise.all(
        formatedHandler.map(async ({ id, cash_code, store_id, ...payload }) => {
          try {
            await api.post(`/cash_handler/${store}-${code}`, [payload])
            await this._cashHandlerRepository.update(id, {
              to_integrate: false,
            })
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

      await this._storeCashRepository.update(localCashId, { is_opened: false })
    } catch (err) {
      sendLog({
        title: 'Erro ao realizar integração de vendas offline',
        payload: err.message,
      })
    }
  }
}

export default new IntegrateOnlineService()
