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

ipcMain.on('handler:get', async (event, handler) => {
  try {
    const { isConnected, data } = await HandlersService.getHandlerByCash()
    event.reply('handler:get:response', { isConnected, data })
  } catch (err) {
    event.reply('handler:get:response', { isConnected: false, data: [] })
    console.error(err)
  }
})

ipcMain.on('handler:delete', async (event, id) => {
  try {
    const { success, data } = await HandlersService.delete(id)
    event.reply('handler:delete:response', { success, data })
  } catch (err) {
    event.reply('handler:delete:response', {
      success: false,
      data: [],
    })
    console.error(err)
  }
})
