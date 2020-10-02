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
