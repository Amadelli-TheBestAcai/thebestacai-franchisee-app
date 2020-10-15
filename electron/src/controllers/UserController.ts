import { ipcMain } from 'electron'
import UserService from '../services/UserService'
import ProductsService from '../services/ProductsService'
import { checkInternet } from '../utils/InternetConnection'

ipcMain.on('user:login', async (event, user) => {
  try {
    const response = await UserService.login(user)
    const isConnected = await checkInternet()
    if (response && isConnected) {
      await ProductsService.getOnlineProducts()
    }
    event.reply('user:login', response)
  } catch (err) {
    console.error(err)
    event.reply('user:login', false)
  }
})
