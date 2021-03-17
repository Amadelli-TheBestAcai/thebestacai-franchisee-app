import { Repository, getRepository } from 'typeorm'
import User from '../models/entities/User'

class UserRepository {
  private ormRepository: Repository<User>

  constructor() {
    this.ormRepository = getRepository(User)
  }

  async create(payload) {
    const user = await this.ormRepository.create({ ...payload })
    await this.ormRepository.save(user)
    return user
  }

  async findAll(): Promise<User[]> {
    return await this.ormRepository.find()
  }
}

export default new UserRepository()
