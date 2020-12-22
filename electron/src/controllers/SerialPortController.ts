import { ipcMain } from 'electron'
import { getWeigthByBalance } from '../services/GetWeightByBalance'

ipcMain.on('balance:get', async (event) => {
  const weight = await getWeigthByBalance()
  event.reply('balance:get:response', weight)
})
