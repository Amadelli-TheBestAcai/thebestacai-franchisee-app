import { ISettingRepository } from '../../repositories/interfaces/ISettingRepository'
import SettingsRepository from '../../repositories/SettingsRepository'
import { Settings } from '../../models/entities'

class GetSettingsService {
  private _settingsRepository: ISettingRepository
  constructor(
    settingsRepository: ISettingRepository = new SettingsRepository()
  ) {
    this._settingsRepository = settingsRepository
  }

  async execute(): Promise<Settings> {
    const settings = await this._settingsRepository.getOne()
    if (!settings) {
      return await this._settingsRepository.create({
        disabled_balance: false,
        balance_port: 'COM1',
        printer: 'EPSON TM-T20X Receipt',
      })
    }
    return settings
  }
}

export default new GetSettingsService()
