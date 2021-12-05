import jwt_decode from 'jwt-decode'
import { TokenUserDTO } from '../../models/dtos/user/TokenUserDTO'

import { ISessionUserRepository } from '../../repositories/interfaces/ISessionUserRepository'
import SessionUserRepository from '../../repositories/SessionUserRepository'

class GetDecodedTokenService {
  private _sessionUserRepository: ISessionUserRepository
  constructor(
    sessionUserRepository: ISessionUserRepository = new SessionUserRepository()
  ) {
    this._sessionUserRepository = sessionUserRepository
  }

  async execute(): Promise<TokenUserDTO> {
    const sessionUser = await this._sessionUserRepository.getSessionUser()
    if (!sessionUser) {
      return null
    }
    try {
      const decodedToken = jwt_decode(sessionUser.access_token)
      return decodedToken
    } catch (err) {
      console.error(err)
      return null
    }
  }
}

export default new GetDecodedTokenService()
