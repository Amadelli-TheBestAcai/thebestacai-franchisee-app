import { SessionUser } from '../../models/entities'

import { ISessionUserRepository } from '../../repositories/interfaces/ISessionUserRepository'
import SessionUserRepository from '../../repositories/SessionUserRepository'

class GetSessionUserService {
  private _sessionUserRepository: ISessionUserRepository
  constructor(
    sessionUserRepository: ISessionUserRepository = new SessionUserRepository()
  ) {
    this._sessionUserRepository = sessionUserRepository
  }

  async execute(): Promise<SessionUser> {
    return this._sessionUserRepository.getSessionUser()
  }
}

export default new GetSessionUserService()
