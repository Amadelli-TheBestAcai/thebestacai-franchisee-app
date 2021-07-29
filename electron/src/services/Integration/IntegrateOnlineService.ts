import api from '../../utils/Api'
import rabbitMQ from '../../utils/RabbitMQ'
import { sendLog } from '../../utils/ApiLog'

import { ISalesRepository } from '../../repositories/interfaces/ISalesRepository'
import SalesRepository from '../../repositories/SalesRepository'

import { ICashHandlerRepository } from '../../repositories/interfaces/ICashHandlerRepository'
import CashHandlerRepository from '../../repositories/CashHandlerRepository'

import {
  formatHandlesToIntegrate,
  formatSalesToIntegrate,
  getQuantityItems,
} from '../../utils/IntegrateFormater'

import GetItemsToIntegrateService from '../Item/GetItemsToIntegrateService'
import GetDecodedTokenService from '../User/GetDecodedTokenService'
import GetPaymentsToIntegrateService from '../Payment/GetPaymentsToIntegrateService'

class IntegrateOfflineService {
  private _saleRepository: ISalesRepository
  private _cashHandlerRepository: ICashHandlerRepository
  constructor(
    saleRepository: ISalesRepository = new SalesRepository(),
    cashHandlerRepository: ICashHandlerRepository = new CashHandlerRepository()
  ) {
    this._saleRepository = saleRepository
    this._cashHandlerRepository = cashHandlerRepository
  }

  async execute(): Promise<void> {
    const sales = await this._saleRepository.getOnline()
    const formatedSales = formatSalesToIntegrate(sales)
    const currentUser = await GetDecodedTokenService.execute()
    await Promise.all(
      formatedSales.map(async ({ id, store_id, cash_code, ...payload }) => {
        const {
          newItemPayload,
          oldItemPayload,
        } = await GetItemsToIntegrateService.execute(id, currentUser)
        const quantity = getQuantityItems(oldItemPayload)
        const payments = await GetPaymentsToIntegrateService.execute(id)
        const saleToIntegrate = {
          ...payload,
          quantity,
          oldItemPayload,
          payments,
        }
        const saleToIntegrateInHandler = {
          quantity,
          change_amount: payload.change_amount,
          type: payload.type,
          discount: payload.discount,
          nfce_ref: payload.nfce_id,
          cash_id: payload.cash_id,
          client_id: currentUser.id,
          cash_history_id: payload.cash_history_id,
          items: newItemPayload.map(({ id, ...item }) => ({
            ...item,
            product_id: item.productStore.product,
          })),
          payments,
        }
        try {
          await api.post(`/sales/${store_id}-${cash_code}`, [saleToIntegrate])
          await rabbitMQ.publishInQueue(
            'sales-transfer',
            JSON.stringify([saleToIntegrateInHandler])
          )
          await this._saleRepository.update(id, { to_integrate: false })
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

    const handlers = await this._cashHandlerRepository.getOnlineHandlers()
    const formatedHandler = formatHandlesToIntegrate(handlers)
    await Promise.all(
      formatedHandler.map(async ({ id, store_id, cash_code, ...payload }) => {
        try {
          await api.post(`/cash_handler/${store_id}-${cash_code}`, [payload])
          await this._cashHandlerRepository.update(id, { to_integrate: false })
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
}

export default new IntegrateOfflineService()
