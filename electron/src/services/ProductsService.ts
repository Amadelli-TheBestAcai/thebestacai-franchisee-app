import api from '../utils/Api'
import StoreService from '../services/StoreService'
import ProductsRepository from '../repositories/ProductsRepository'
import { replaceSpecialChars } from '../utils/replaceSpecialChars'
import { formaterToCategory } from '../utils/ProductFormater'
import { checkInternet } from '../utils/InternetConnection'
class ProductsService {
  async updateAllProducts(products) {
    const formatedProducts = products.map((productStore) => ({
      product_id: productStore.product_id,
      name: productStore.product.name,
      price_unit: productStore.price_unit,
      category_id: productStore.product.category_id,
      category_name: productStore.product.category.name,
    }))
    await ProductsRepository.deleteAll()
    await ProductsRepository.create(formatedProducts)
  }

  async updateAllProductsOldVersion(products) {
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
    const hasInternet = await checkInternet()
    if (!hasInternet) {
      return
    }
    const store = await StoreService.getOne()
    if (!store) {
      return
    }

    const isDev = process.env.NODE_ENV === 'development'
    if (isDev) {
      const {
        data: { content },
      } = await api.get(`products_store/store/${store.id}`)
      this.updateAllProducts(content)
    } else {
      const {
        data: { data },
      } = await api.get(`products_store/${store.id}`)
      this.updateAllProductsOldVersion(data)
    }
  }

  async getProducts() {
    const products = await ProductsRepository.getAll()
    const formatedProducts = products
      .map((product) => ({
        product_id: product.product_id,
        name: product.name,
        price_unit: product.price_unit,
        category: { id: product.category_id, name: product.category_name },
      }))
      .sort((firstProduct, secoundProduct) =>
        replaceSpecialChars(firstProduct.name) >
        replaceSpecialChars(secoundProduct.name)
          ? 1
          : replaceSpecialChars(secoundProduct.name) >
            replaceSpecialChars(firstProduct.name)
          ? -1
          : 0
      )
    return formaterToCategory(formatedProducts)
  }

  async getSelfService() {
    const serfService = await ProductsRepository.getSelfService()
    return {
      product_id: serfService?.product_id,
      name: serfService?.name,
      price_unit: serfService?.price_unit,
      category: {
        id: serfService?.category_id,
        name: serfService?.category_name,
      },
    }
  }
}

export default new ProductsService()
