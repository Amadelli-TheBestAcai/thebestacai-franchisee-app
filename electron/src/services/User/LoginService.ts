import api from '../../utils/ApiAuth'
import { compare, hash } from '../../utils/Bcrypt'
import { checkInternet } from '../../utils/InternetConnection'
import { LoginUserDTO } from '../../models/dtos/user/LoginUserDTO'

import { IUserRepository } from '../../repositories/interfaces/IUserRepository'
import { ISessionUserRepository } from '../../repositories/interfaces/ISessionUserRepository'

import UsersRepository from '../../repositories/UserRepository'
import SessionUserRepository from '../../repositories/SessionUserRepository'

class LoginService {
  private _userRepository: IUserRepository
  private _sessionUserRepository: ISessionUserRepository
  constructor(
    userRepository: IUserRepository = new UsersRepository(),
    sessionUserRepository: ISessionUserRepository = new SessionUserRepository()
  ) {
    this._userRepository = userRepository
    this._sessionUserRepository = sessionUserRepository
  }

  async execute(
    user: LoginUserDTO
  ): Promise<{ isValid: boolean; token?: string }> {
    const isConnected = await checkInternet()
    if (isConnected) {
      const access_token = await this.onlineLogin(user)
      if (access_token) {
        const hashedPassword = await hash(user.password)

        await this._userRepository.create({
          username: user.username,
          password: hashedPassword,
        })

        await this._sessionUserRepository.create({ access_token })

        return { isValid: true, token: access_token }
      }
      return { isValid: false, token: null }
    }
    return await this.offlineLogin(user)
  }

  async offlineLogin({
    username,
    password,
  }): Promise<{ isValid: boolean; token?: string }> {
    const user = await this._userRepository.findByUsername(username)
    if (!user) {
      return { isValid: false, token: null }
    }

    const isValid = await compare(password, user.password)
    return { isValid, token: null }
  }

  async onlineLogin({ username, password }): Promise<null | string> {
    const {
      data: { access_token },
    } = await api.post('user/login', { username, password })
    if (!access_token) {
      return null
    }
    return access_token
  }
}

export default new LoginService()
