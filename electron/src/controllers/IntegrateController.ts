import { ipcMain } from 'electron'
import IntegrateService from '../services/IntegrateService'

ipcMain.on('integrate:offline', async (event, { code, amount_on_close }) => {
  try {
    await IntegrateService.integrateOffline(code, amount_on_close)
    event.reply('integrate:offline:response', true)
  } catch (err) {
    console.error(err)
    event.reply('integrate:offline:response', false)
  }
})

ipcMain.on('integrate:online', async () => {
  await IntegrateService.integrateOnline()
})
