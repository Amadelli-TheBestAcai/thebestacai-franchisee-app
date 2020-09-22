import SalesRepository from '../repositories/SalesRepository'
import ItemsService from '../services/ItemsService'
import PaymentsService from '../services/PaymentsService'
import api from '../utils/Api'
import { CreateSaleDTO } from '../models/dtos/CreateSaleDTO'

class SalesService {
  async create(sale: CreateSaleDTO): Promise<void> {
    const { items, payments, ...salePayload } = sale
    await ItemsService.create(items, salePayload.id)
    await PaymentsService.create(payments, salePayload.id)
    await SalesRepository.create(salePayload)
  }

  async delete(sale: string): Promise<void> {
    await ItemsService.deleteBySale(sale)
    await PaymentsService.deleteBySale(sale)
    await SalesRepository.deleteById(sale)
  }

  async integrate(cash_code: string): Promise<void> {
    const sales = await SalesRepository.getAll()
    await Promise.all(
      sales.map(async (sale) => {
        const items = await ItemsService.getItemsToIntegrate(sale.id)
        const payments = await PaymentsService.getPaymentsToIntegrate(sale.id)
        const { id, ...saleWithoutId } = sale
        const saleToIntegrate = {
          ...saleWithoutId,
          items,
          payments,
        }
        const { status } = await api.post(`/sales/${cash_code}`, [saleToIntegrate])
        if (status === 200) {
          await this.delete(id)
        } else {
          //TODO: criar endpoit para LOG
          //await api.post(`/logs`, saleToIntegrate)
          await this.delete(id)
        }
      })
    )
  }
}

export default new SalesService()
