import { ipcMain } from 'electron'
import UserService from '../services/UserService'

ipcMain.on('user:login', async (event, { isConnected, ...user }) => {
  try {
    const response = await UserService.login(user, isConnected)
    event.reply('user:login', response)
  } catch (err) {
    console.error(err)
    event.reply('user:login', false)
  }
})

export const getCurrentSession = async (): Promise<string | null> => {
  return await UserService.getCurrentSession()
}
