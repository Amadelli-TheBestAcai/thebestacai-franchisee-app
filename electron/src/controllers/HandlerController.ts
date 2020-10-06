import { ipcMain } from 'electron'
import HandlersService from '../services/HandlersService'

ipcMain.on('handler:create', async (event, handler) => {
  try {
    await HandlersService.create(handler)
    event.reply('handler:create:response', { success: true })
  } catch (err) {
    event.reply('handler:create:response', { success: false })
    console.error(err)
  }
})

ipcMain.on('handler:integrate', async (event) => {
  try {
    await HandlersService.integrate()
  } catch (err) {
    console.error(err)
  }
})
