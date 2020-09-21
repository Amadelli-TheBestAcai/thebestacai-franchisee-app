import api from '../Utils/Api'
import UserService from '../services/UserService'

class ProductsService {
  async getOnlineProducts() {
    const { store } = await UserService.getTokenInfo()
    const {
      data: { data },
    } = await api.get(`products_store/${store}`)
    console.log(data)
    return data
  }

  async getOfflineProducts() {}

  async getProducts(isConnected: boolean) {
    console.log(isConnected)
    if (isConnected) {
      return await this.getOnlineProducts()
    }
    return await this.getOfflineProducts()
  }
}

export default new ProductsService()
