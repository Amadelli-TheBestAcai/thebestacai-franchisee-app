import { DeepPartial } from 'typeorm'
import SessionUser from '../../models/entities/SessionUser'

export interface ISessionUserRepository {
  getSessionUser(): Promise<SessionUser>

  create(payload: DeepPartial<SessionUser>): Promise<SessionUser>
}
