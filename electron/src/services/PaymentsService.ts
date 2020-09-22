import PaymentsRepository from '../repositories/PaymentsRepository'
import { Payment } from '../models/Payment'
import { IntegratePaymentsDTO } from '../models/dtos/payments/IntegratePaymentsDTO'
class PaymentsService {
  async create(payments, sale_id) {
    const paymentsWithSaleId = payments.map((payments) => ({
      ...payments,
      sale_id,
    }))
    return await PaymentsRepository.create(paymentsWithSaleId)
  }

  async getBySale(sale_id: string): Promise<Payment[]> {
    return await PaymentsRepository.getBySale(sale_id)
  }

  async getPaymentsToIntegrate(
    sale_id: string
  ): Promise<IntegratePaymentsDTO[]> {
    const payments = await PaymentsRepository.getBySale(sale_id)
    return payments.map((payment) => ({
      amount: payment.amount,
      type: payment.type,
    }))
  }

  async deleteBySale(sale_id: string): Promise<void> {
    await PaymentsRepository.deleteBySale(sale_id)
  }
}

export default new PaymentsService()
