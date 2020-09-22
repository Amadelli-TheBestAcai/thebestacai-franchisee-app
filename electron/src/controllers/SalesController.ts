import { ipcMain } from 'electron'
import SalesService from '../services/SalesService'
import { sleep } from '../utils/Sleep'

ipcMain.on('sale:create', async (event, sale) => {
  try {
    await SalesService.create(sale)
    event.reply('sale:create', true)
  } catch (err) {
    console.error(err)
    event.reply('user:login', false)
  }
})

ipcMain.on('sale:integrate', async (event) => {
  while (true) {
    try {
      await sleep(5000)
    } catch (err) {
      console.error(err)
    }
  }
})
