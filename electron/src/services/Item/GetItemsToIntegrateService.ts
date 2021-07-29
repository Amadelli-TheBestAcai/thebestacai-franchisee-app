import { IItemsRepository } from '../../repositories/interfaces/IItemsRepository'
import ItemsRepository from '../../repositories/ItemsRepository'

import { TokenUserDTO } from '../../models/dtos/user/TokenUserDTO'
import { Item } from '../../models/entities'

type Response = {
  oldItemPayload: {
    product_id: number
    store_product_id: number
    quantity: number
    update_stock: boolean
    user_id: number
  }[]
  newItemPayload: Item[]
}

class GetItemsToIntegrateService {
  private _itemRepository: IItemsRepository

  constructor(itemRepository: IItemsRepository = new ItemsRepository()) {
    this._itemRepository = itemRepository
  }

  async execute(sale_id: string, user: TokenUserDTO): Promise<Response> {
    const items = await this._itemRepository.getBySale(sale_id)
    const oldItemPayload = items.map((item) => ({
      product_id: item.product_id,
      store_product_id: item.product_store_id,
      quantity: item.quantity,
      update_stock: item.category_id !== 1,
      user_id: user.id,
    }))
    return {
      oldItemPayload,
      newItemPayload: items,
    }
  }
}

export default new GetItemsToIntegrateService()

const t = {
  id: '83ce4282-337a-4481-b3d8-954a8ff57f01',
  name: '├ígua 500ml',
  product_id: 2,
  category_id: 2,
  product_store_id: 3160,
  productStore: {
    id: 3160,
    product_id: 2,
    product: {
      id: 2,
      name: '├ígua 500ml',
      category_id: 2,
      category: {
        id: 2,
        name: 'Bebidas',
        sort: null,
        created_at: '2020-07-22T17:39:53.000Z',
        deleted_at: null,
      },
      product_store_id: 3160,
      price_buy: null,
      permission_store: true,
      permission_order: false,
      permission_purchase: true,
      cod_product: '',
      cod_ncm: null,
      brand: '',
      unity: null,
      weight: null,
      price_sell: null,
      description: '',
      created_at: '2020-07-22T17:39:53.000Z',
      deleted_at: null,
    },
    store_id: 4,
    price_unit: 3,
    permission: false,
    price_sell: null,
    unity: null,
    unity_taxable: null,
    price_taxable: null,
    cfop: null,
    icms_origin: null,
    icms_tax_situation: null,
    tax_regime: null,
    pis_tax_situation: null,
    pis_aliquot_value: null,
    pis_aliquot_percentage: null,
    cofins_tax_situation: null,
    cofins_aliquot_value: null,
    cofins_aliquot_percentage: null,
    additional_information: null,
    price_permission: false,
    icms_aliquot_percentage: null,
    bc_icms: null,
    bc_icms_st: null,
    redution_icms: null,
    aliquot_final_consumer: null,
    quantity: -1,
    created_at: '2023-03-02T14:26:00.000Z',
    deleted_at: null,
  },
  price_unit: 3,
  quantity: 1,
  total: 3,
  sale_id: 'a8925897-5bc3-4907-9352-f486316bc1a8',
  created_at: '2021-07-29T17:16:34.000Z',
  deleted_at: null,
}
