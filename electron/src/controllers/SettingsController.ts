import { ipcMain } from 'electron'
import GetSettingsService from '../services/Setting/GetSettingsService'
import UpdateSettingsService from '../services/Setting/UpdateSettingsService'
import { sendLog } from '../utils/ApiLog'
import Printer from 'printer'

ipcMain.on('configuration:get', async (event) => {
  try {
    const setting = await GetSettingsService.execute()
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
    const setting = await UpdateSettingsService.execute(payload)
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

ipcMain.on('configuration:printers:get', async (event) => {
  event.reply(
    'configuration:printers:get:response',
    Printer.getPrinters().map((printer) => printer.name)
  )
})
