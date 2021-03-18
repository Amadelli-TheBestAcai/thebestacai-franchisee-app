import { Repository, getRepository, DeepPartial } from 'typeorm'
import SessionUser from '../models/entities/SessionUser'

import { ISessionUserRepository } from './interfaces/ISessionUserRepository'

class SessionUserRepository implements ISessionUserRepository {
  private ormRepository: Repository<SessionUser>

  constructor() {
    this.ormRepository = getRepository(SessionUser)
  }

  async getSessionUser(): Promise<SessionUser> {
    return await this.ormRepository.findOne()
  }

  async create(payload: DeepPartial<SessionUser>): Promise<SessionUser> {
    this.ormRepository.softDelete({})

    const sessionUser = this.ormRepository.create(payload)
    await this.ormRepository.save(sessionUser)
    return sessionUser
  }
}

export default SessionUserRepository
