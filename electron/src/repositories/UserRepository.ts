import { Repository, getRepository, DeepPartial } from 'typeorm'
import User from '../models/entities/User'

import { IUserRepository } from './interfaces/IUserRepository'

class UserRepository implements IUserRepository {
  private ormRepository: Repository<User>

  constructor() {
    this.ormRepository = getRepository(User)
  }

  async create(payload: DeepPartial<User>): Promise<User> {
    const user = await this.ormRepository.create(payload)
    await this.ormRepository.save(user)
    return user
  }

  async findByUsername(username: string): Promise<User> {
    return await this.ormRepository.findOne({ where: { username } })
  }

  async deleteById(id: string): Promise<void> {
    await this.ormRepository.delete({ id })
  }
}

export default UserRepository
