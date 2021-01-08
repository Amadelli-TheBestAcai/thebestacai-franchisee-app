import { ipcMain } from 'electron'
import SettingsService from '../services/SettingsService'
import { sendLog } from '../utils/ApiLog'

ipcMain.on('configuration:get', async (event) => {
  try {
    const setting = await SettingsService.getOneOrCreate()
    event.reply('configuration:get:response', setting)
  } catch (err) {
    sendLog({
      title: 'Erro ao obter dados das configurações',
      payload: err.message,
    })
    console.log(err)
    event.reply('configuration:get:response', null)
  }
})

ipcMain.on('configuration:update', async (event, payload) => {
  try {
    const setting = await SettingsService.update(payload)
    event.reply('configuration:update:response', { setting, status: true })
  } catch (err) {
    sendLog({
      title: 'Erro ao atualizar dados das configurações',
      payload: { err: err.message, params: { payload } },
    })
    console.log(err)
    event.reply('configuration:update:response', { status: false })
  }
})
