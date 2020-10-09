import ItemsOutCartRepository from '../repositories/ItemsOutCartRepository'
import CashierRepository from '../repositories/CashierRepository'

import api from '../utils/Api'
import { checkInternet } from '../utils/InternetConnection'

class ItemsOutCartService {
  async create(
    reason: string,
    product_id: number
  ): Promise<{ success: boolean; message: string }> {
    const currentCash = await CashierRepository.get()
    const haveInternet = await checkInternet()

    if (!currentCash) {
      return { success: false, message: 'Erro ao obter caixa atual' }
    }

    const { store_id, code } = currentCash
    if (!store_id || !code) {
      return { success: false, message: 'Erro ao obter caixa atual' }
    }

    await ItemsOutCartRepository.create({
      cash_code: code,
      store_id,
      reason,
      product_id,
    })

    if (haveInternet) {
      this.integrate()
    }

    return { success: true, message: 'Exclusão de item cadastrada com sucesso' }
  }

  async integrate(): Promise<void> {
    const itemsOutCart = await await ItemsOutCartRepository.getAll()
    await Promise.all(
      itemsOutCart.map(async (item) => {
        const { id, store_id, cash_code, ...payload } = item
        try {
          await api.post(`/items_out_cart/${store_id}-${cash_code}`, [payload])
          await ItemsOutCartRepository.deleteById(id)
        } catch (err) {
          console.log(err)
        }
      })
    )
  }
}

export default new ItemsOutCartService()
