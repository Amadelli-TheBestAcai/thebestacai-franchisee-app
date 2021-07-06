import apiNfe from '../../utils/ApiNfe'
import { IItemsRepository } from '../../repositories/interfaces/IItemsRepository'
import ItemsRepository from '../../repositories/ItemsRepository'

import { ISalesRepository } from '../../repositories/interfaces/ISalesRepository'
import SalesRepository from '../../repositories/SalesRepository'

import { IStoreCashRepository } from '../../repositories/interfaces/IStoreCashRepository'
import StoreCashRepository from '../../repositories/StoreCashRepository'

import { IStoreRepository } from '../../repositories/interfaces/IStoreRepository'
import StoreRepository from '../../repositories/StoreRepository'

import { IProductsRepository } from '../../repositories/interfaces/IProductsRepository'
import ProductsRepository from '../../repositories/ProductsRepository'

import { checkInternet } from '../../utils/InternetConnection'

import IntegrateOnlineService from '../Integration/IntegrateOnlineService'

import { Nfe } from '../../../../shared/models/nfe'

const ambiente = process.env.NODE_ENV === 'development' ? 2 : 1

class EmitNfCeService {
  private _itemRepository: IItemsRepository
  private _saleRepository: ISalesRepository
  private _storeCashRepository: IStoreCashRepository
  private _storeRepository: IStoreRepository
  private _productRepository: IProductsRepository

  constructor(
    itemRepository: IItemsRepository = new ItemsRepository(),
    saleRepository: ISalesRepository = new SalesRepository(),
    storeCashRepository: IStoreCashRepository = new StoreCashRepository(),
    storeRepository: IStoreRepository = new StoreRepository(),
    productRepository: IProductsRepository = new ProductsRepository()
  ) {
    this._itemRepository = itemRepository
    this._saleRepository = saleRepository
    this._storeCashRepository = storeCashRepository
    this._storeRepository = storeRepository
    this._productRepository = productRepository
  }

  async execute(nfe: Nfe): Promise<{ error: boolean; message: string }> {
    const hasInternet = await checkInternet()
    if (!hasInternet) {
      return {
        error: true,
        message: 'Dispositivo sem conexão',
      }
    }

    const store = await this._storeRepository.findCurrent()

    if (!store.token_nfce) {
      return {
        error: true,
        message:
          'Sessão não autenticada para emissão de NFCe. Refaça o login e tente novamente',
      }
    }

    const storeCash = await this._storeCashRepository.getOne()

    if (!storeCash.is_opened) {
      return {
        error: true,
        message:
          'Caixa atualmente fechado. Abra o caixa para realizar a emissão',
      }
    }

    try {
      const {
        data: { erro: nfe_erro, url: nfe_url, id: nfe_id },
      } = await apiNfe.post('/emitirNFCe', { ...nfe, ambiente })
    } catch {
      return {
        error: true,
        message:
          'Serviço temporariamente indisponível. Tente novamente mais tarde',
      }
    }
    const sale = {
      cash_code: storeCash.code,
      store_id: store.store_id,
      cash_id: storeCash.cash_id,
      cash_history_id: storeCash.history_id,
      change_amount: nfe.troco,
      type: 'STORE',
      discount: 0,
      total: 0,
      quantity: nfe.produtos.length,
      to_integrate: false,
      is_current: false,
    }

    const saleResponse = await this._saleRepository.create(sale)

    await Promise.all(
      nfe.produtos.map(async (produto) => {
        const product = await this._productRepository.getByProductId(
          produto.idItem
        )

        const payload = {
          name: product.name,
          price_unit: +product.price_unit,
          product_id: product.product_id,
          product_store_id: product.product_store_id,
          category_id: product.category_id,
          quantity: produto.quantidadeComercial,
          sale_id: saleResponse.id,
          total: +product.price_unit * +produto.quantidadeComercial,
        }

        await this._itemRepository.create({ ...payload })
      })
    )

    await this._saleRepository.update(saleResponse.id, { to_integrate: true })

    await IntegrateOnlineService.execute()

    return {
      error: false,
      message: 'NFCe emitida com sucesso',
    }
  }
}

export default new EmitNfCeService()
