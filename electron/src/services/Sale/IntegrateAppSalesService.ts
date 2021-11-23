import api from '../../utils/Api'
import apiSalesHandler from '../../utils/ApiSalesHandler'
import GetDecodedTokenService from '../User/GetDecodedTokenService'
import { IStoreCashRepository } from '../../repositories/interfaces/IStoreCashRepository'
import StoreCashRepository from '../../repositories/StoreCashRepository'

class IntegrateAppSalesService {
  private _storeCashRepository: IStoreCashRepository

  constructor(
    storeCashRepository: IStoreCashRepository = new StoreCashRepository()
  ) {
    this._storeCashRepository = storeCashRepository
  }

  async execute(salesToIntegrate, appSalesId): Promise<void> {
    const currentCash = await this._storeCashRepository.getOne()
    const currentUser = await GetDecodedTokenService.execute()
    if (!currentCash || !currentCash?.is_opened) {
      throw new Error('Caixa fechado')
    }

    const { store_id } = currentCash
    if (!store_id) {
      throw new Error('Id da loja não encontrado')
    }

    const { history_id } = currentCash
    if (!store_id) {
      throw new Error('Histórico não encontrado')
    }

    await Promise.all(
      salesToIntegrate.map(async (sale) => {
        const payload = {
          ...sale,
          user_id: currentUser.id,
          nfce_id: null,
          nfce_url: null,
          nfce_ref: null,
        }
        await apiSalesHandler.post('/sales', [payload])
      })
    )

    await api.post('/app_sale/integrate', {
      historyId: history_id,
      payload: appSalesId,
    })
  }
}

export default new IntegrateAppSalesService()
