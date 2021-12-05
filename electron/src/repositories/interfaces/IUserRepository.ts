import { DeepPartial } from 'typeorm'
import User from '../../models/entities/User'

export interface IUserRepository {
  create(payload: DeepPartial<User>): Promise<User>

  findByUsername(username: string): Promise<User>

  deleteById(id: string): Promise<void>
}
