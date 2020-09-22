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

ipcMain.on('sale:integrate', async (event, { cash_code, store_id }) => {
  try {
    SalesService.integrate(`${store_id}-${cash_code}`)
  } catch (err) {
    console.error(err)
  }
})
