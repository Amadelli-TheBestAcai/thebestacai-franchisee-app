import api from '../utils/Api'
import StoreService from '../services/StoreService'
import ProductsRepository from '../repositories/ProductsRepository'
import { formaterToCategory } from '../utils/ProductFormater'
class ProductsService {
  async updateAllProducts(products) {
    if (products) {
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
  }

  async getOnlineProducts() {
    const store = await StoreService.getOne()
    if (!store) {
      return
    }
    const {
      data: { data },
    } = await api.get(`products_store/${store.id}`)
    this.updateAllProducts(data)
  }

  async getProducts() {
    const products = await ProductsRepository.getAll()
    const formatedProducts = products.map((product) => ({
      product_id: product.product_id,
      name: product.name,
      price_unit: product.price_unit,
      category: { id: product.category_id, name: product.category_name },
    }))
    return formaterToCategory(formatedProducts)
  }

  async getSelfService() {
    const serfService = await ProductsRepository.getSelfService()
    return {
      product_id: serfService.product_id,
      name: serfService.name,
      price_unit: serfService.price_unit,
      category: {
        id: serfService.category_id,
        name: serfService.category_name,
      },
    }
  }
}

export default new ProductsService()
