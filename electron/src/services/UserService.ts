import UserRepository from '../repositories/UserRepository'
import api from '../Utils/Api'
import { hash, compare } from '../../../shared/Utils/Bcrypt'

export const TOKEN_KEY = 'access-token'
export const TOKEN_SECRET_KEY =
  'A2aF103fP7899.RfKMfs78STuXTTeSMABXJp77lJCIttNqlMal1Vea.AUSW.'

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

  getTokenInfo = async () => {
    const accessToken = await this.getCurrentSession()
    if (accessToken === null) {
      return null
    }
    try {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      const result = await promisify(jwt.verify)(accessToken, TOKEN_SECRET_KEY)
      return result
    } catch (err) {
      return null
    }
  }
}

export default new UserService()
