import { IProductStoreRepository } from '../../repositories/interfaces/IProductStoreRepository'
import ProductStoreRepository from '../../repositories/ProductStoreRepository'

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
  private _productStoreRepository: IProductStoreRepository

  constructor(
    productStoreRepository: IProductStoreRepository = new ProductStoreRepository()
  ) {
    this._productStoreRepository = productStoreRepository
  }

  async execute(): Promise<Reponse> {
    const serfService = await this._productStoreRepository.getSelfService()
    return {
      product_id: serfService?.product_id,
      product_store_id: serfService?.id,
      name: serfService?.product.name,
      price_unit: +serfService?.price_unit,
      category: {
        id: serfService?.product.category_id,
        name: serfService?.product.category.name,
      },
    }
  }
}

export default new GetSelfServiceProductService()
