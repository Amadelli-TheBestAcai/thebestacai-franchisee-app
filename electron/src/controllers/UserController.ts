import { ipcMain } from 'electron'
import api from '../../../shared/models/services/Api'

ipcMain.on('user:login', async (event, user) => {
  const {
    data: { access_token },
  } = await api.post('auth/login', user)
  event.reply('user:login', access_token)
})
