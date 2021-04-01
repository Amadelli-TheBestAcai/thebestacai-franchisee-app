import { ISettingRepository } from '../../repositories/interfaces/ISettingRepository'
import SettingsRepository from '../../repositories/SettingsRepository'

type Props = {
  id: string
  disabled_balance: boolean
  balance_port: string
  printer: string
}

class UpdateSettingsService {
  private _settingsRepository: ISettingRepository
  constructor(
    settingsRepository: ISettingRepository = new SettingsRepository()
  ) {
    this._settingsRepository = settingsRepository
  }

  async execute({ id, ...props }: Props): Promise<void> {
    this._settingsRepository.update(id, props)
  }
}

export default new UpdateSettingsService()
