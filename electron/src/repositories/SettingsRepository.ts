import { Repository, getRepository, DeepPartial } from 'typeorm'
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity'
import Settings from '../models/entities/Settings'

import { ISettingRepository } from './interfaces/ISettingRepository'

class SettingsRepository implements ISettingRepository {
  private ormRepository: Repository<Settings>

  constructor() {
    this.ormRepository = getRepository(Settings)
  }

  async create(payload: DeepPartial<Settings>): Promise<Settings> {
    const settings = this.ormRepository.create(payload)
    await this.ormRepository.save(settings)
    return settings
  }

  async update(
    id: string,
    payload: QueryDeepPartialEntity<Settings>
  ): Promise<void> {
    await this.ormRepository.update(id, payload)
  }

  async getOne(): Promise<Settings> {
    return await this.ormRepository.findOne()
  }
}

export default SettingsRepository
