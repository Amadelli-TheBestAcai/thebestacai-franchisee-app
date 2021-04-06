import { replaceSpecialChars } from '../../../../shared/utils/replaceSpecialChars'

import { IProductsRepository } from '../../repositories/interfaces/IProductsRepository'
import ProductsRepository from '../../repositories/ProductsRepository'

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
  private _productRepository: IProductsRepository

  constructor(
    productRepository: IProductsRepository = new ProductsRepository()
  ) {
    this._productRepository = productRepository
  }

  async execute(): Promise<Response[]> {
    const products = await this._productRepository.getAll()

    const ordenedProducts = products
      .map((product) => ({
        product_id: product.product_id,
        product_store_id: product.product_store_id,
        name: product.name,
        price_unit: +product.price_unit,
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
