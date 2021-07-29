import api from '../../utils/Api'
import { checkInternet } from '../../utils/InternetConnection'

import { IStoreRepository } from '../../repositories/interfaces/IStoreRepository'
import StoreRepository from '../../repositories/StoreRepository'

import { IProductStoreRepository } from '../../repositories/interfaces/IProductStoreRepository'
import ProductStoreRepository from '../../repositories/ProductStoreRepository'
import { IProductsRepository } from '../../repositories/interfaces/IProductsRepository'
import ProductsRepository from '../../repositories/ProductsRepository'
import { IProductCategoryRepository } from '../../repositories/interfaces/IProductCategoryRepository'
import ProductCategoryRepository from '../../repositories/ProductCategoryRepository'

import moment from 'moment'

class UpdateProductsFromApiService {
  private _storeRepository: IStoreRepository
  private _productStoreRepository: IProductStoreRepository
  private _productCategoryRepository: IProductCategoryRepository
  private _productsRepository: IProductsRepository

  constructor(
    storeRepository: IStoreRepository = new StoreRepository(),
    productStoreRepository: IProductStoreRepository = new ProductStoreRepository(),
    productCategoryRepository: IProductCategoryRepository = new ProductCategoryRepository(),
    productsRepository: IProductsRepository = new ProductsRepository()
  ) {
    this._storeRepository = storeRepository
    this._productStoreRepository = productStoreRepository
    this._productCategoryRepository = productCategoryRepository
    this._productsRepository = productsRepository
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

    const payload = {
      product: [],
      storeProduct: [],
      category: [],
    }
    content.forEach((item) => {
      const { product, ...storeProduct } = item
      const { category, ...productProps } = product
      payload.product = [
        ...payload.product,
        {
          ...productProps,
          product_store_id: +storeProduct.id,
          created_at: moment(
            productProps.created_at,
            'DD/MM/YYYY hh:mm:ss'
          ).toDate(),
        },
      ]
      payload.storeProduct = [
        ...payload.storeProduct,
        {
          ...storeProduct,
          created_at: moment(
            storeProduct.created_at,
            'DD/MM/YYYY hh:mm:ss'
          ).toDate(),
        },
      ]
      payload.category = [
        ...payload.category,
        {
          ...category,
          created_at: moment(
            category.created_at,
            'DD/MM/YYYY hh:mm:ss'
          ).toDate(),
        },
      ]
    })

    payload.category = Array.from(
      new Set(payload.category.map((item) => item.id))
    ).map((id) => {
      return payload.category.find((item) => item.id === id)
    })

    if (content.length) {
      await this._productStoreRepository.createMany(payload.storeProduct)
      await this._productCategoryRepository.createMany(payload.category)
      await this._productsRepository.createMany(payload.product)
    }
  }
}

export default new UpdateProductsFromApiService()
