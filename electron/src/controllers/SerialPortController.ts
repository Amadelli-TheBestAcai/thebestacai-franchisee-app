import { ipcMain } from 'electron'
import { getWeigthByBalance } from '../services/GetWeightByBalance'
import { sendLog } from '../utils/ApiLog'

ipcMain.on('balance:get', async (event) => {
  try {
    const weight = await getWeigthByBalance()
    event.reply('balance:get:response', { weight })
  } catch (err) {
    await sendLog({
      title: 'Erro ao obter peso da balança',
      payload: err.message,
    })
    console.log(err)
    event.reply('balance:get:response', { error: true })
  }
})
