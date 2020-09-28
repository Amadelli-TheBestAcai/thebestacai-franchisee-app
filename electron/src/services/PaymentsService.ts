import PaymentsRepository from '../repositories/PaymentsRepository'
import { Payment } from '../models/Payment'
import { IntegratePaymentsDTO } from '../models/dtos/payments/IntegratePaymentsDTO'
import { CreatePaymentDTO } from '../models/dtos/payments/CreatePaymentDTO'
import { v4 as uuidv4 } from 'uuid'

class PaymentsService {
  async create(payment: CreatePaymentDTO, sale_id: string): Promise<void> {
    const newPayment = { id: uuidv4(), sale_id, ...payment }
    return await PaymentsRepository.create(newPayment)
  }

  async getBySale(sale_id: string): Promise<Payment[]> {
    return await PaymentsRepository.getBySale(sale_id)
  }

  async deleteById(id: string): Promise<void> {
    await PaymentsRepository.deleteById(id)
  }

  async deleteBySale(sale_id: string): Promise<void> {
    await PaymentsRepository.deleteBySale(sale_id)
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
}

export default new PaymentsService()
