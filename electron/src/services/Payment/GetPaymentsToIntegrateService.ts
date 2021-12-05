import { IPaymentsRepository } from '../../repositories/interfaces/IPaymentsRepository'
import PaymentsRepository from '../../repositories/PaymentsRepository'

type Response = {
  amount: number
  type: number
}
class GetPaymentsToIntegrateService {
  private _paymentRepository: IPaymentsRepository
  constructor(
    paymentRepository: IPaymentsRepository = new PaymentsRepository()
  ) {
    this._paymentRepository = paymentRepository
  }

  async execute(sale_id: string): Promise<Response[]> {
    const payments = await this._paymentRepository.getBySale(sale_id)
    return payments.map((payment) => ({
      amount: payment.amount,
      type: +payment.type,
    }))
  }
}

export default new GetPaymentsToIntegrateService()
