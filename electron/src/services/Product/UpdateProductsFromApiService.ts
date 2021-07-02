import api from '../../utils/Api'
import { checkInternet } from '../../utils/InternetConnection'

import { IStoreRepository } from '../../repositories/interfaces/IStoreRepository'
import StoreRepository from '../../repositories/StoreRepository'
import { IProductsRepository } from '../../repositories/interfaces/IProductsRepository'
import ProductsRepository from '../../repositories/ProductsRepository'

class UpdateProductsFromApiService {
  private _storeRepository: IStoreRepository
  private _productRepository: IProductsRepository

  constructor(
    storeRepository: IStoreRepository = new StoreRepository(),
    productRepository: IProductsRepository = new ProductsRepository()
  ) {
    this._storeRepository = storeRepository
    this._productRepository = productRepository
  }

  async execute(): Promise<void> {
    const hasInternet = await checkInternet()
    if (!hasInternet) {
      return
    }
    const store = await this._storeRepository.findCurrent()
    if (!store) {
      return
    }

    const {
      data: { content },
    } = await api.get(`products_store/store/${store.store_id}`)

    const formatedProducts = content.map((productStore) => ({
      product_store_id: productStore.id,
      product_id: productStore.product_id,
      name: productStore.product.name,
      price_unit: productStore.price_unit,
      category_id: productStore.product.category_id,
      category_name: productStore.product.category.name,
      unity_taxable: productStore.unity_taxable,
      cod_ncm: productStore.product.cod_ncm,
      cfop: productStore.cfop,
      price_taxable: productStore.price_taxable,
      icms_tax_situation: productStore.icms_tax_situation,
      icms_origin: productStore.icms_origin,
      additional_information: productStore.additional_information,
    }))

    if (formatedProducts.length) {
      await this._productRepository.deleteAll()
      await this._productRepository.createMany(formatedProducts)
    }
  }
}

export default new UpdateProductsFromApiService()
