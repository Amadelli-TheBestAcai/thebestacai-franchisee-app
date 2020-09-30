import { ipcMain } from 'electron'
import CashierService from '../services/CashierService'

ipcMain.on('cashier:get', async (event, isConnected) => {
  try {
    const cashes = await CashierService.getCashes(isConnected)
    const current = await CashierService.getCurrentCashier()
    event.reply('cashier:get:response', { cashes, current })
  } catch (err) {
    console.error(err)
    event.reply('cashier:get:response', [])
  }
})

ipcMain.on('cashier:open', async (event, { isConnected, ...cashier }) => {
  try {
    await CashierService.openCashier(cashier, isConnected)
    event.reply('cashier:open:response', {
      success: true,
      message: 'Caixa aberto com sucesso',
    })
  } catch (err) {
    console.error(err)
    event.reply('cashier:open:response', {
      success: false,
      message: 'Falha ao abrir o caixa',
    })
  }
})
