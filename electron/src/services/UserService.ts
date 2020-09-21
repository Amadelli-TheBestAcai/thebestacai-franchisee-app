import UserRepository from '../repositories/UserRepository'
import api from '../../../shared/services/Api'
import { hash, compare } from '../../../shared/Utils/Bcrypt'

class UserService {
  async create({ username, password, access_token }) {
    const oldUser = await UserRepository.findByUsername(username)
    if (oldUser) {
      await UserRepository.deleteById(oldUser.id)
    }
    const hashedPassword = await hash(password)
    const user = oldUser
      ? { id: oldUser.id, username, access_token, password: hashedPassword }
      : { username, access_token, password: hashedPassword }
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

  async login(user, isConnected): Promise<boolean> {
    if (isConnected) {
      const access_token = await this.onlineLogin(user)
      if (access_token) {
        await this.create({ ...user, access_token })
        return true
      }
      return false
    }
    return await this.offlineLogin(user)
  }
}

export default new UserService()
