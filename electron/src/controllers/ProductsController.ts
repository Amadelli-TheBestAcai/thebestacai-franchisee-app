import { ipcMain } from 'electron'
import ProductsService from '../services/ProductsService'
import { sendLog } from '../utils/ApiLog'

ipcMain.on('products:get', async (event) => {
  try {
    const response = await ProductsService.getProducts()
    event.returnValue = response
  } catch (err) {
    sendLog({
      title: 'Erro ao obter produtos',
      payload: err.message,
    })
    console.error(err)
    event.returnValue = []
  }
})

ipcMain.on('products:refresh', async (event) => {
  try {
    await ProductsService.getOnlineProducts()
    event.reply('products:refresh:response', { success: true })
  } catch (err) {
    sendLog({
      title: 'Erro ao atualizar base de produtos',
      payload: err.message,
    })
    console.error(err)
    event.reply('products:refresh:response', { success: false })
  }
})

ipcMain.on('products:get:selfService', async (event) => {
  try {
    const item = await ProductsService.getSelfService()
    event.reply('products:get:selfService:response', item)
  } catch (err) {
    sendLog({
      title: 'Erro ao obter produto Self-Service',
      payload: err.message,
    })
    console.error(err)
  }
})
