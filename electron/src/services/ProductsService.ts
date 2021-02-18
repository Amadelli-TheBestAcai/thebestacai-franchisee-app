import api from '../utils/Api'

import StoreService from '../services/StoreService'

import ProductsRepository from '../repositories/ProductsRepository'

import { replaceSpecialChars } from '../../../shared/utils/replaceSpecialChars'
import { formaterToCategory } from '../utils/ProductFormater'
import { checkInternet } from '../utils/InternetConnection'

import { Audit as AuditModel } from '../../../shared/models/audit'
class ProductsService {
  async updateAllProducts(products) {
    const formatedProducts = products.map((productStore) => ({
      product_store_id: productStore.id,
      product_id: productStore.product_id,
      name: productStore.product.name,
      price_unit: productStore.price_unit,
      category_id: productStore.product.category_id,
      category_name: productStore.product.category.name,
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

    const {
      data: { content },
    } = await api.get(`products_store/store/${store.id}`)
    this.updateAllProducts(content)
  }

  async getProducts() {
    const products = await ProductsRepository.getAll()
    const formatedProducts = products
      .map((product) => ({
        product_id: product.product_id,
        product_store_id: product.product_store_id,
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
      product_store_id: serfService?.product_store_id,
      name: serfService?.name,
      price_unit: serfService?.price_unit,
      category: {
        id: serfService?.category_id,
        name: serfService?.category_name,
      },
    }
  }

  async updateStock(id: number, quantity: number): Promise<void> {
    const hasInternet = await checkInternet()
    if (!hasInternet) {
      return
    }

    await api.patch(`/products_store/${id}/quantity`, {
      quantity,
    })
  }

  async getAudit(
    id,
    page,
    size
  ): Promise<{ audits: AuditModel[]; totalElements: number }> {
    const hasInternet = await checkInternet()
    if (!hasInternet) {
      return { audits: [], totalElements: 0 }
    }

    const {
      data: { content, totalElements },
    } = await api.get(`/products_store_history/${id}?page=${page}&size=${size}`)

    return { audits: content, totalElements: totalElements }
  }

  async getCategoriesWithProducts() {
    const hasInternet = await checkInternet()
    const store = await StoreService.getOne()
    if (!hasInternet) {
      return {
        hasInternet,
        categoryWithProducts: [],
        store: null,
      }
    }
    const {
      data: { content },
    } = await api.get('/product_categories/products/purchases')

    return {
      hasInternet: true,
      store: store.id,
      categoryWithProducts: content
    }
  }
}

export default new ProductsService()
