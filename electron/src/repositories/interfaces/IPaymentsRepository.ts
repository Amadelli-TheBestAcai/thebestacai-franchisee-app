import { DeepPartial } from 'typeorm'
import { Payment } from '../../models/entities'

export interface IPaymentsRepository {
  create(payload: DeepPartial<Payment>): Promise<Payment>
  getBySale(sale_id: string): Promise<Payment[]>
  deleteById(id: string): Promise<void>
  deleteBySale(sale_id: string): Promise<void>
}
