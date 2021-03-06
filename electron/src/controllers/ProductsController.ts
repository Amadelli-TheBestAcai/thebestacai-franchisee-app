import { ipcMain } from 'electron'
import ProductsService from '../services/ProductsService'

ipcMain.on('products:get', async (event, isConnected) => {
  try {
    const response = await ProductsService.getProducts()
    event.returnValue = response
  } catch (err) {
    console.error(err)
    event.returnValue = []
  }
})

ipcMain.on('products:refresh', async (event) => {
  try {
    await ProductsService.getOnlineProducts()
    event.reply('products:refresh:response', { success: true })
  } catch (err) {
    console.error(err)
    event.reply('products:refresh:response', { success: false })
  }
})

ipcMain.on('products:get:selfService', async (event) => {
  try {
    const item = await ProductsService.getSelfService()
    event.reply('products:get:selfService:response', item)
  } catch (err) {
    console.error(err)
  }
})
