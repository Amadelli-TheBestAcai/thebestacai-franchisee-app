import { ipcMain } from 'electron'
import UserService from '../services/UserService'

ipcMain.on('user:login', async (event, user) => {
  try {
    const response = await UserService.login(user)
    event.reply('user:login', response)
  } catch (err) {
    console.error(err)
    event.reply('user:login', false)
  }
})
