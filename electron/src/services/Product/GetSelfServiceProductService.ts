import { IProductsRepository } from '../../repositories/interfaces/IProductsRepository'
import ProductsRepository from '../../repositories/ProductsRepository'

type Reponse = {
  product_id: number
  product_store_id: number
  name: string
  price_unit: number
  category: {
    id: number
    name: string
  }
}

class GetSelfServiceProductService {
  private _productRepository: IProductsRepository

  constructor(
    productRepository: IProductsRepository = new ProductsRepository()
  ) {
    this._productRepository = productRepository
  }

  async execute(): Promise<Reponse> {
    const serfService = await this._productRepository.getSelfService()
    return {
      product_id: serfService?.product_id,
      product_store_id: serfService?.product_store_id,
      name: serfService?.name,
      price_unit: +serfService?.price_unit,
      category: {
        id: serfService?.category_id,
        name: serfService?.category_name,
      },
    }
  }
}

export default new GetSelfServiceProductService()
