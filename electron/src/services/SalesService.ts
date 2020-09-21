import SalesRepository from '../repositories/SalesRepository'
import ItemsService from '../services/ItemsService'
import PaymentsService from '../services/PaymentsService'

class SalesService {
  async create(sale) {
    const { items, payments, total_sold, ...salePayload } = sale
    await ItemsService.create(items, salePayload.id)
    await PaymentsService.create(payments, salePayload.id)
    await SalesRepository.create(salePayload)
  }
}

export default new SalesService()
