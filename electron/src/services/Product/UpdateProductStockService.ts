import api from '../../utils/Api'
import { checkInternet } from '../../utils/InternetConnection'

class UpdateProductStockService {
  async execute(id: number, quantity: number): Promise<void> {
    const hasInternet = await checkInternet()
    if (!hasInternet) {
      return
    }

    await api.patch(`/products_store/${id}/quantity`, {
      quantity,
    })
  }
}

export default new UpdateProductStockService()
