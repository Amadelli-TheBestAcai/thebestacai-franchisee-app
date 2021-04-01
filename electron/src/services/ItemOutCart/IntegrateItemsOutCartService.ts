import api from '../../utils/Api'
import { sendLog } from '../../utils/ApiLog'

import { IItemOutCartRepository } from '../../repositories/interfaces/IItemOutCartRepository'
import ItemsOutCartRepository from '../../repositories/ItemsOutCartRepository'

class IntegrateItemsOutCartService {
  private _itemOutCartRepository: IItemOutCartRepository
  constructor(
    itemOutCartRepository: IItemOutCartRepository = new ItemsOutCartRepository()
  ) {
    this._itemOutCartRepository = itemOutCartRepository
  }

  async execute(): Promise<void> {
    const itemsOutCart = await this._itemOutCartRepository.getAllToIntegrate()
    await Promise.all(
      itemsOutCart.map(async (item) => {
        const { id, store_id, cash_code, ...payload } = item
        try {
          await api.post(`/items_out_cart/${store_id}-${cash_code}`, [payload])
          await this._itemOutCartRepository.update(id, { integrated: true })
        } catch (err) {
          sendLog({
            title: 'Erro ao integrar itens removidos do pedido',
            payload: { err: err.message, params: { item } },
          })
          console.log(err)
        }
      })
    )
  }
}

export default new IntegrateItemsOutCartService()
