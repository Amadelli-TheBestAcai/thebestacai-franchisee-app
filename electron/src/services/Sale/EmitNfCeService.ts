import api from '../../utils/ApiSalesHandler'
import apiNfe from '../../utils/ApiNfe'
import envConfig from '../../../../env-config.js'

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

const ambiente = +envConfig.NFCe_AMBIENTE

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

  async execute(
    nfe: Nfe,
    saleIdToUpdate?: number
  ): Promise<{ error: boolean; message: string }> {
    const hasInternet = await checkInternet()
    if (!hasInternet) {
      return {
        error: true,
        message: 'Dispositivo sem conexão',
      }
    }

    const store = await this._storeRepository.findCurrent()

    const storeCash = await this._storeCashRepository.getOne()

    if (!storeCash || !storeCash.is_opened) {
      return {
        error: true,
        message:
          'Caixa atualmente fechado. Abra o caixa para realizar a emissão',
      }
    }

    let sale = {
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
      nfce_id: null,
      nfce_url: null,
    }

    try {
      console.log({
        nfce_payload: {
          ambiente,
          idEmpresa: store.store_id,
          ...nfe,
        },
      })
      const {
        data: {
          erro: nfe_erro,
          url: nfce_url,
          id: nfce_id,
          message: nfe_message,
          erros: nfe_erros,
        },
      } = await apiNfe.post('/emitirNFCe', {
        ambiente,
        idEmpresa: store.store_id,
        ...nfe,
      })

      console.log({ nfe_erro })
      if (nfe_erro || nfe_erros?.length) {
        return {
          error: true,
          message: nfe_message || nfe_erros.join(', '),
        }
      }
      if (!nfce_url || !nfce_id) {
        return {
          error: true,
          message:
            'Serviço temporariamente indisponível. Tente novamente mais tarde',
        }
      }
      sale = {
        ...sale,
        nfce_id,
        nfce_url,
      }
    } catch (error) {
      console.log({ message: error.message, error })
      return {
        error: true,
        message: error?.response?.data?.mensagem.includes('XML')
          ? 'Produtos com dados tributários inválidos ou serviço indisponível. Contate o suporte'
          : error?.response?.data?.mensagem
          ? error.response.data.mensagem
          : 'Serviço temporariamente indisponível. Tente novamente mais tarde',
      }
    }

    const saleResponse = await this._saleRepository.create(sale)
    if (!saleIdToUpdate) {
      try {
        await Promise.all(
          nfe.produtos.map(async (produto) => {
            const product = await this._productRepository.getByProductId(
              produto.codigo
            )

            const payload = {
              name: product.name,
              price_unit: +product.price_sell,
              product_id: product.id,
              product_store_id: product.product_store_id,
              category_id: product.category_id,
              quantity: produto.quantidadeComercial,
              sale_id: saleResponse.id,
              total: +product.price_sell * +produto.quantidadeComercial,
            }

            await this._itemRepository.create({ ...payload })
          })
        )

        await this._saleRepository.update(saleResponse.id, {
          to_integrate: true,
        })

        await IntegrateOnlineService.execute()
      } catch (error) {
        console.log(error)
      }
    } else {
      try {
        await api.put(`/sales/${saleIdToUpdate}`, {
          nfce_id: sale.nfce_id,
          nfce_url: sale.nfce_url,
        })
      } catch {
        return {
          error: true,
          message: `Nfce emita mas houve falha ao vincular na venda, solicite suporte informando a chave gerada: ${sale.nfce_id}`,
        }
      }
    }

    return {
      error: false,
      message: 'NFCe emitida com sucesso',
    }
  }
}

export default new EmitNfCeService()
