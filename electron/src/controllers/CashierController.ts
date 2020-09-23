import { ipcMain } from 'electron'
import CashierService from '../services/CashierService'

ipcMain.on('cashier:get', async (event, isConnected) => {
  try {
    const response = await CashierService.getCashes(isConnected)
    event.reply('cashier:getResult', response)
  } catch (err) {
    console.error(err)
    event.reply('cashier:getResult', [])
  }
})
