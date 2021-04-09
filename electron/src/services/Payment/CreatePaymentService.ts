import { DeepPartial } from 'typeorm'
import { IPaymentsRepository } from '../../repositories/interfaces/IPaymentsRepository'
import PaymentsRepository from '../../repositories/PaymentsRepository'

import { Payment } from '../../models/entities'

class CreatePaymentService {
  private _paymentRepository: IPaymentsRepository
  constructor(
    paymentRepository: IPaymentsRepository = new PaymentsRepository()
  ) {
    this._paymentRepository = paymentRepository
  }

  async execute(
    payload: DeepPartial<Payment>[],
    sale_id: string
  ): Promise<Payment> {
    return await this._paymentRepository.create({ ...payload, sale_id })
  }
}

export default new CreatePaymentService()
