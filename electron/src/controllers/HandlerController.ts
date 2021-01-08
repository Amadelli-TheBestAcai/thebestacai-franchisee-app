import { ipcMain } from 'electron'
import HandlersService from '../services/HandlersService'
import { sendLog } from '../utils/ApiLog'

ipcMain.on('handler:create', async (event, handler) => {
  try {
    await HandlersService.create(handler)
    event.reply('handler:create:response', { success: true })
  } catch (err) {
    sendLog({
      title: 'Erro ao criar movimentação',
      payload: { err: err.message, handler },
    })
    event.reply('handler:create:response', { success: false })
    console.error(err)
  }
})

ipcMain.on('handler:api:get', async (event) => {
  try {
    const { isConnected, data } = await HandlersService.getHandlerByCash()
    event.reply('handler:api:get:response', { isConnected, data })
  } catch (err) {
    sendLog({
      title: 'Erro ao obter movimentações',
      payload: err.message,
    })
    event.reply('handler:api:get:response', { isConnected: false, data: [] })
    console.error(err)
  }
})

ipcMain.on('handler:delete', async (event, id) => {
  try {
    const { success, data } = await HandlersService.delete(id)
    event.reply('handler:delete:response', { success, data })
  } catch (err) {
    sendLog({
      title: 'Erro ao remover movimentação',
      payload: { err: err.message, id },
    })
    event.reply('handler:delete:response', {
      success: false,
      data: [],
    })
    console.error(err)
  }
})
