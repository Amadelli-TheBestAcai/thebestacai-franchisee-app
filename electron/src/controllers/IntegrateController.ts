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

ipcMain.on('integrate:shouldUpdateApp', async (event) => {
  try {
    const response = await IntegrateService.shouldUpdateApp()
    event.reply('integrate:shouldUpdateApp:response', response)
  } catch (err) {
    console.error(err)
    event.reply('integrate:shouldUpdateApp:response', false)
  }
})

ipcMain.on('integrate:checkAppVersion', async (event) => {
  try {
    const response = await IntegrateService.appAlreadyUpdated()
    event.reply('integrate:checkAppVersion:response', response)
  } catch (err) {
    console.error(err)
    event.reply('integrate:checkAppVersion:response', false)
  }
})
