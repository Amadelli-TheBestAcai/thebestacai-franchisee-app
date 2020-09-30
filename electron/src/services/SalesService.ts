import SalesRepository from '../repositories/SalesRepository'
import ItemsService from '../services/ItemsService'
import PaymentsService from '../services/PaymentsService'
import api from '../utils/Api'
import { CreateSaleDTO } from '../models/dtos/CreateSaleDTO'
import { Sale } from '../models/Sale'
import { v4 as uuidv4 } from 'uuid'
import { getNow } from '../utils/DateHandler'
class SalesService {
  async create(): Promise<CreateSaleDTO> {
    const newSale: CreateSaleDTO = {
      id: uuidv4(),
      change_amount: 0,
      type: 'STORE',
      discount: 0,
      to_integrate: false,
      is_current: true,
      created_at: getNow(),
    }
    await SalesRepository.create(newSale)
    return newSale
  }

  async getCurrentSale(): Promise<CreateSaleDTO> {
    const currentSale = await SalesRepository.getCurrentSale()
    if (currentSale) {
      return currentSale
    } else {
      const newSale: CreateSaleDTO = {
        id: uuidv4(),
        change_amount: 0,
        type: 'STORE',
        discount: 0,
        to_integrate: false,
        is_current: true,
        created_at: getNow(),
      }
      await SalesRepository.create(newSale)
      return newSale
    }
  }

  async finishSale(sale: CreateSaleDTO): Promise<void> {
    const payload: CreateSaleDTO = {
      ...sale,
      is_current: false,
      to_integrate: true,
    }
    await SalesRepository.update(sale.id, payload)
  }

  async delete(sale: string): Promise<void> {
    await ItemsService.deleteBySale(sale)
    await PaymentsService.deleteBySale(sale)
    await SalesRepository.deleteById(sale)
  }

  async integrate(cash_code: string): Promise<void> {
    const sales = await SalesRepository.getToIntegrate()
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

  async getSalesCommands(): Promise<Sale[]> {
    const sales = await SalesRepository.getCommands()
    return sales || []
  }

  async createCommand(id: string, name: string): Promise<CreateSaleDTO> {
    await SalesRepository.createCommand(id, name)
    return await this.create()
  }

  async change(id: string, name: string): Promise<void> {
    const currentSale = await this.getCurrentSale()
    await SalesRepository.update(currentSale.id, { is_current: false, name })
    await SalesRepository.update(id, { is_current: true })
  }
}

export default new SalesService()
