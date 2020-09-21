import { ipcMain } from 'electron'
import ProductsService from '../services/ProductsService'

ipcMain.on('products:get', async (event, isConnected) => {
  try {
    const response = await ProductsService.getProducts(isConnected)
    event.reply('products:get', response)
  } catch (err) {
    console.error(err)
    event.reply('products:get', [])
  }
})
