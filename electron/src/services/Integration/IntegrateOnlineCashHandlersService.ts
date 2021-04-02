import api from '../../utils/Api'
import { sendLog } from '../../utils/ApiLog'
import { formatHandlesToIntegrate } from '../../utils/IntegrateFormater'

import { ICashHandlerRepository } from '../../repositories/interfaces/ICashHandlerRepository'
import CashHandlerRepository from '../../repositories/CashHandlerRepository'

class IntegrateOnlineCashHandlersService {
  private _cashHandlerRepository: ICashHandlerRepository
  constructor(
    storeCashRepository: ICashHandlerRepository = new CashHandlerRepository()
  ) {
    this._cashHandlerRepository = storeCashRepository
  }

  async execute(): Promise<void> {
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
        }
      })
    )
  }
}

export default new IntegrateOnlineCashHandlersService()
