import UserRepository from '../repositories/UserRepository'
import jwt_decode from 'jwt-decode'
import api from '../utils/Api'
import { hash, compare } from '../utils/Bcrypt'

class UserService {
  async create({ username, password }) {
    const oldUser = await UserRepository.findByUsername(username)
    if (oldUser) {
      await UserRepository.deleteById(oldUser.id)
    }
    const hashedPassword = await hash(password)
    const user = oldUser
      ? { id: oldUser.id, username, password: hashedPassword }
      : { username, password: hashedPassword }
    return await UserRepository.create(user)
  }

  async offlineLogin({ username, password }): Promise<boolean> {
    const user = await UserRepository.findByUsername(username)
    if (!user) {
      return false
    }
    const isValidUser = compare(password, user.password)
    if (!isValidUser) {
      return false
    }
    return true
  }

  async onlineLogin({ username, password }): Promise<null | string> {
    const {
      data: { access_token },
    } = await api.post('auth/login', { username, password })
    if (!access_token) {
      return null
    }
    return access_token
  }

  async createOrUpdateSession(access_token: string): Promise<void> {
    const oldSession = await UserRepository.getSessionUser()
    if (oldSession) {
      await UserRepository.deleteSessionUser(oldSession.id)
      await UserRepository.updateSessionUser({
        id: oldSession.id,
        access_token,
      })
    } else {
      await UserRepository.updateSessionUser({ access_token })
    }
  }

  async login(user, isConnected): Promise<boolean> {
    if (isConnected) {
      const access_token = await this.onlineLogin(user)
      if (access_token) {
        await this.create(user)
        await this.createOrUpdateSession(access_token)
        return true
      }
      return false
    }
    return await this.offlineLogin(user)
  }

  async getCurrentSession(): Promise<string | null> {
    const session = await UserRepository.getSessionUser()
    if (session) {
      return session.access_token
    }
    return null
  }

  async getTokenInfo() {
    const accessToken = await this.getCurrentSession()
    if (accessToken === null) {
      return null
    }
    try {
      const decodedToken = jwt_decode(accessToken)
      return decodedToken
    } catch (err) {
      console.error(err)
      return null
    }
  }
}

export default new UserService()
