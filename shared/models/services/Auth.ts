import jwt from 'jsonwebtoken'
import { promisify } from 'util'

import { User } from '../entities/user'
import { UserRoles } from '../enums/userRole'

export const TOKEN_KEY = 'access-token'
export const TOKEN_SECRET_KEY =
  'A2aF103fP7899.RfKMfs78STuXTTeSMABXJp77lJCIttNqlMal1Vea.AUSW.'

export const getToken = () => localStorage.getItem(TOKEN_KEY)

export const getTokenInfo = async (): Promise<User | null> => {
  const accessToken = getToken()
  if (accessToken === null) {
    return null
  }
  try {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const result: User = await promisify(jwt.verify)(
      accessToken,
      TOKEN_SECRET_KEY
    )
    result.role = UserRoles[result.role]
    return result
  } catch (err) {
    return null
  }
}

export const verifyPermission = async (roles) => {
  const token = getToken()
  if (token === null) {
    return false
  }
  const decoded = await getTokenInfo()
  if (!decoded) {
    return false
  }
  if (decoded?.role === UserRoles[0]) {
    return true
  }
  return roles.some((role) => UserRoles[role] === decoded?.role)
}

export const isAuthenticated = async () => {
  const token = getToken()
  if (token === null) {
    return false
  }
  const decoded = await getTokenInfo()
  if (!decoded) {
    return false
  }
  return true
}

export const login = (token: string) => {
  localStorage.setItem(TOKEN_KEY, token)
}

export const logout = () => {
  localStorage.removeItem(TOKEN_KEY)
}
