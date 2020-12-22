import { ipcMain } from 'electron'
import { getWeigthByBalance } from '../services/GetWeightByBalance'

ipcMain.on('balance:get', async (event) => {
  try {
    const weight = await getWeigthByBalance()
    event.reply('balance:get:response', { weight })
  } catch (err) {
    console.log(err)
    event.reply('balance:get:response', { error: true })
  }
})
