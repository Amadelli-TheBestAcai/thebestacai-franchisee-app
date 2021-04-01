import { IItemOutCartRepository } from '../../repositories/interfaces/IItemOutCartRepository'
import { IStoreCashRepository } from '../../repositories/interfaces/IStoreCashRepository'
import ItemsOutCartRepository from '../../repositories/ItemsOutCartRepository'
import StoreCashRepository from '../../repositories/StoreCashRepository'

type Response = {
  success: boolean
  message: string
}

class CreateItemOutCartService {
  private _itemOutCartRepository: IItemOutCartRepository
  private _storeCashRepository: IStoreCashRepository
  constructor(
    itemOutCartRepository: IItemOutCartRepository = new ItemsOutCartRepository(),
    storeCashRepository: IStoreCashRepository = new StoreCashRepository()
  ) {
    this._itemOutCartRepository = itemOutCartRepository
    this._storeCashRepository = storeCashRepository
  }

  async execute(reason: string, product_id: number): Promise<Response> {
    const storeCash = await this._storeCashRepository.getOne()

    if (!storeCash) {
      return { success: false, message: 'Erro ao obter caixa atual' }
    }

    const { store_id, code } = storeCash
    if (!store_id || !code) {
      return { success: false, message: 'Erro ao obter caixa atual' }
    }

    await this._itemOutCartRepository.create({
      cash_code: code,
      store_id,
      reason,
      product_id,
    })

    return { success: true, message: 'Exclusão de item cadastrada com sucesso' }
  }
}

export default new CreateItemOutCartService()
