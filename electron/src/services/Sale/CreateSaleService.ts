import { IStoreCashRepository } from '../../repositories/interfaces/IStoreCashRepository'
import StoreCashRepository from '../../repositories/StoreCashRepository'

import { ISalesRepository } from '../../repositories/interfaces/ISalesRepository'
import SalesRepository from '../../repositories/SalesRepository'

import { Sale } from '../../models/entities'

class CreateSaleService {
  private _saleRepository: ISalesRepository
  private _storeCashRepository: IStoreCashRepository

  constructor(
    saleRepository: ISalesRepository = new SalesRepository(),
    storeCashRepository: IStoreCashRepository = new StoreCashRepository()
  ) {
    this._saleRepository = saleRepository
    this._storeCashRepository = storeCashRepository
  }

  async execute(): Promise<Sale> {
    const cashier = await this._storeCashRepository.getOne()
    if (!cashier && !cashier.is_opened) {
      return null
    }
    const newSale = {
      store_id: cashier.store_id,
      cash_id: cashier.cash_id,
      cash_code: cashier.code,
      change_amount: 0,
      total: 0,
      type: 'STORE',
      discount: 0,
      to_integrate: false,
      is_current: true,
    }
    return await this._saleRepository.create({ ...newSale })
  }
}

export default new CreateSaleService()
