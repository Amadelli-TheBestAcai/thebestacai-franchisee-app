import api from '../Utils/Api'
import UserService from '../services/UserService'
import ProductsRepository from '../repositories/ProductsRepository'

class ProductsService {
  async updateAllProducts(products) {
    const formatedProducts = products.map((product) => ({
      product_id: product.product_id,
      name: product.name,
      price_unit: product.price_unit,
      category_id: product.category.id,
      category_name: product.category.name,
    }))
    await ProductsRepository.deleteAll()
    await ProductsRepository.create(formatedProducts)
  }

  async getOnlineProducts() {
    const { store } = await UserService.getTokenInfo()
    const {
      data: { data },
    } = await api.get(`products_store/${store}`)
    this.updateAllProducts(data)
    return data
  }

  async getOfflineProducts() {
    const products = await ProductsRepository.getAll()
    const formatedProducts = products.map((product) => ({
      product_id: product.product_id,
      name: product.name,
      price_unit: product.price_unit,
      category: { id: product.category_id, name: product.category_name },
    }))
    return formatedProducts
  }

  async getProducts(isConnected: boolean) {
    if (isConnected) {
      return await this.getOnlineProducts()
    }
    return await this.getOfflineProducts()
  }
}

export default new ProductsService()
