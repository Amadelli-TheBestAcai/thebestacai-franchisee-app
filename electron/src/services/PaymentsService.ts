import PaymentsRepository from '../repositories/PaymentsRepository'

class PaymentsService {
  async create(payments, sale_id) {
    const paymentsWithSaleId = payments.map((payments) => ({
      ...payments,
      sale_id,
    }))
    return await PaymentsRepository.create(paymentsWithSaleId)
  }
}

export default new PaymentsService()
