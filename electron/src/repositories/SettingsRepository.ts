import knex from '../database'
import { Settings } from '../../../shared/models/settings'

class SettingsRepository {
  async create(payload: Settings): Promise<void> {
    await knex('settings').insert(payload)
  }

  async update(id: string, payload: Settings): Promise<void> {
    await knex('settings').where({ id }).update(payload)
  }

  async getOne(): Promise<Settings | null> {
    const store = await knex('settings')
    return store[0]
  }
}

export default new SettingsRepository()
