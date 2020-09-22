import { ipcMain } from 'electron'
import SalesService from '../services/SalesService'

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
  try {
    // await SalesService.integrate('1-01')
  } catch (err) {
    console.error(err)
  }
})
