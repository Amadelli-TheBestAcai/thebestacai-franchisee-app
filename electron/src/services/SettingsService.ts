import SettingsRepository from '../repositories/SettingsRepository'
import { Settings } from '../../../shared/models/settings'
import { v4 as uuidv4 } from 'uuid'

class SettingsService {
  async update(setting: Settings): Promise<Settings> {
    await SettingsRepository.update(setting.id, setting)
    return await this.getOneOrCreate()
  }

  async getOneOrCreate(): Promise<Settings> {
    const setting = await SettingsRepository.getOne()
    if (!setting) {
      const newSetting: Settings = {
        id: uuidv4(),
        disabled_balance: false,
        balance_port: 'COM1',
      }
      await SettingsRepository.create(newSetting)
      return newSetting
    }
    return setting
  }
}

export default new SettingsService()
