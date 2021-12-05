import { IPaymentsRepository } from '../../repositories/interfaces/IPaymentsRepository'
import PaymentsRepository from '../../repositories/PaymentsRepository'

import { ISalesRepository } from '../../repositories/interfaces/ISalesRepository'
import SalesRepository from '../../repositories/SalesRepository'

import { DeepPartial } from 'typeorm'
import { Sale, Payment } from '../../models/entities'

import { checkInternet } from '../../utils/InternetConnection'

import IntegrateOnlineService from '../Integration/IntegrateOnlineService'

class FinishDeliverySaleService {
  private _saleRepository: ISalesRepository
  private _paymentRepository: IPaymentsRepository

  constructor(
    saleRepository: ISalesRepository = new SalesRepository(),
    paymentRepository: IPaymentsRepository = new PaymentsRepository()
  ) {
    this._saleRepository = saleRepository
    this._paymentRepository = paymentRepository
  }

  async execute(
    sale: DeepPartial<Sale>,
    payment: DeepPartial<Payment>
  ): Promise<void> {
    const { id } = await this._saleRepository.create(sale)
    await this._paymentRepository.create({
      amount: payment.amount,
      type: payment.type,
      sale_id: id,
    })
    const hasInternet = await checkInternet()
    if (hasInternet) {
      await IntegrateOnlineService.execute()
    }
  }
}

export default new FinishDeliverySaleService()
