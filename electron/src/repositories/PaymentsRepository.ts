import {
  Repository,
  getRepository,
  DeepPartial,
  EntityRepository,
} from 'typeorm'
import { IPaymentsRepository } from './interfaces/IPaymentsRepository'
import { Payment } from '../models/entities'

@EntityRepository(Payment)
class PaymentsRepository implements IPaymentsRepository {
  private ormRepository: Repository<Payment>

  constructor() {
    this.ormRepository = getRepository(Payment)
  }

  async create(payload: DeepPartial<Payment>): Promise<Payment> {
    const payments = await this.ormRepository.create(payload)
    await this.ormRepository.save(payments)
    return payments
  }

  async getBySale(sale_id: string): Promise<Payment[]> {
    return await this.ormRepository.find({ where: { sale_id } })
  }

  async deleteById(id: string): Promise<void> {
    await this.ormRepository.softDelete({ id })
  }

  async deleteBySale(sale_id: string): Promise<void> {
    await this.ormRepository.softDelete({ sale_id })
  }
}

export default PaymentsRepository
