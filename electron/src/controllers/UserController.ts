import { ipcMain } from 'electron'
import UserService from '../services/UserService'

ipcMain.on('user:login', async (event, user) => {
  try {
    const response = await UserService.login(user)
    const currentUser = await UserService.getTokenInfo()
    event.reply('user:login', { isValid: response, user: currentUser })
  } catch (err) {
    console.error(err)
    event.reply('user:login', false)
  }
})

ipcMain.on('user:get', async (event) => {
  try {
    const user = await UserService.getTokenInfo()
    event.reply('user:get:response', user)
  } catch (err) {
    console.error(err)
    event.reply('user:get:response', null)
  }
})
