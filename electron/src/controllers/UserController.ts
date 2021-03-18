import { ipcMain } from 'electron'
import LoginService from '../services/User/LoginService'
import GetDecodedTokenService from '../services/User/GetDecodedTokenService'
import { sendLog } from '../utils/ApiLog'

ipcMain.on('user:login', async (event, user) => {
  try {
    const response = await LoginService.execute(user)
    const currentUser = await GetDecodedTokenService.execute()
    event.reply('user:login', { isValid: response, user: currentUser })
  } catch (err) {
    sendLog({
      title: 'Erro ao realizar login',
      payload: { err: err.message, params: { user } },
    })
    console.error(err)
    event.reply('user:login', false)
  }
})

ipcMain.on('user:get', async (event) => {
  try {
    const user = await GetDecodedTokenService.execute()
    event.reply('user:get:response', user)
  } catch (err) {
    sendLog({
      title: 'Erro ao obter usuario pelo token',
      payload: err.message,
    })
    console.error(err)
    event.reply('user:get:response', null)
  }
})
