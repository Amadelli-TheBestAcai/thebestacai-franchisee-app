import { replaceSpecialChars } from '../../../../shared/utils/replaceSpecialChars'

import { IProductStoreRepository } from '../../repositories/interfaces/IProductStoreRepository'
import ProductStoreRepository from '../../repositories/ProductStoreRepository'

type Response = {
  category: string
  products: {
    product_id: number
    product_store_id: number
    name: string
    price_unit: number
    category: {
      id: number
      name: string
    }
  }[]
}
class GetAllProductsByStore {
  private _productStoreRepository: IProductStoreRepository

  constructor(
    productStoreRepository: IProductStoreRepository = new ProductStoreRepository()
  ) {
    this._productStoreRepository = productStoreRepository
  }

  async execute(): Promise<Response[]> {
    const products = await this._productStoreRepository.getAll()

    const ordenedProducts = products
      .map((product) => ({
        product_id: product.product_id,
        product_store_id: product.id,
        name: product.product.name,
        price_unit: +product.price_unit,
        category: {
          id: product.product.category_id,
          name: product.product.category.name,
        },
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

    const allCategories = ordenedProducts.map((product) => +product.category.id)

    let cleanedCategories = Array.from(new Set(allCategories))
    cleanedCategories = cleanedCategories.filter(
      (category) => category !== 1 && category !== 999
    )

    const formatedProducts = cleanedCategories.map((categoryId) => {
      const productsByCategory = ordenedProducts.filter(
        (product) => +product.category.id === categoryId
      )
      const category = productsByCategory[0].category.name
      return {
        category,
        products: productsByCategory,
      }
    })

    return formatedProducts
  }
}

export default new GetAllProductsByStore()
