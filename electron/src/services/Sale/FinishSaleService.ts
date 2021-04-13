import { IStoreCashRepository } from '../../repositories/interfaces/IStoreCashRepository'
import StoreCashRepository from '../../repositories/StoreCashRepository'

import { ISalesRepository } from '../../repositories/interfaces/ISalesRepository'
import SalesRepository from '../../repositories/SalesRepository'

import { CreateSaleDTO } from '../../models/dtos/sales/CreateSaleDTO'
import { SaleOption } from '../../../../shared/models/saleOption'

import { checkInternet } from '../../utils/InternetConnection'
import { printSale } from '../../utils/PrintSale'

import IntegrateOnlineService from '../Integration/IntegrateOnlineService'

class FinishSaleService {
  private _saleRepository: ISalesRepository
  private _storeCashRepository: IStoreCashRepository

  constructor(
    saleRepository: ISalesRepository = new SalesRepository(),
    storeCashRepository: IStoreCashRepository = new StoreCashRepository()
  ) {
    this._saleRepository = saleRepository
    this._storeCashRepository = storeCashRepository
  }

  async execute(payload: CreateSaleDTO, options?: SaleOption): Promise<void> {
    const cashier = await this._storeCashRepository.getOne()
    const sale = await this._saleRepository.getById(payload.id)
    if (sale) {
      await this._saleRepository.update(payload.id, {
        ...payload,
        is_current: false,
        to_integrate: true,
        cash_history_id: cashier.history_id,
      })
    } else {
      await this._saleRepository.create({ ...payload })
    }
    const hasInternet = await checkInternet()
    if (options?.emit_nfce && !hasInternet) {
      // TODO: retornar erro avisando indisponibilidade de internet
    } else if (options?.emit_nfce && options.printer) {
      // TODO: emitir nota fiscal e gerar cupom
    } else if (options?.emit_nfce && !options.printer) {
      // TODO: emitir nota fiscal e NAO gerar cupom
    } else if (options?.printer) {
      printSale(payload)
    }
    if (hasInternet) {
      await IntegrateOnlineService.execute()
    }
  }
}

export default new FinishSaleService()
