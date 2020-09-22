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
        try {
          await api.post(`/sales/${cash_code}`, [saleToIntegrate])
          await this.delete(id)
          console.log('Venda integrada com sucesso')
        } catch (err) {
          // TODO: Criar integração de log de vendas com erro
          console.error(err)
        }
      })
    )
  }
}

export default new SalesService()
