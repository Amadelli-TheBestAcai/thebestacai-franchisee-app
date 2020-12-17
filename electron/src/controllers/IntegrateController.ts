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

let SHOULD_INTEGRATE = true

ipcMain.on('integrate:online', async () => {
  if (SHOULD_INTEGRATE) {
    SHOULD_INTEGRATE = false
    await IntegrateService.integrateOnline()
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
    console.log(response)
    event.reply('integrate:checkAppVersion:response', response)
  } catch (err) {
    console.error(err)
    event.reply('integrate:checkAppVersion:response', false)
  }
})
