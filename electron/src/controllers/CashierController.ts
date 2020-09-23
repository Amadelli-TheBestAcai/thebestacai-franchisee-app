import { ipcMain } from 'electron'
import CashierService from '../services/CashierService'

ipcMain.on('cashier:get', async (event, isConnected) => {
  try {
    const response = await CashierService.getCashes(isConnected)
    console.log(response)
    event.reply('pcashier:get', response)
  } catch (err) {
    console.error(err)
    event.reply('pcashier:get', [])
  }
})
