import { ipcMain } from 'electron'
import UserService from '../services/UserService'
import ProductsService from '../services/ProductsService'

ipcMain.on('user:login', async (event, { isConnected, ...user }) => {
  try {
    const response = await UserService.login(user, isConnected)
    if (response && isConnected) {
      await ProductsService.getOnlineProducts()
    }
    event.reply('user:login', response)
  } catch (err) {
    console.error(err)
    event.reply('user:login', false)
  }
})
