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

ipcMain.on('cashier:close', async (event, { isConnected, ...cashier }) => {
  if (!isConnected) {
    event.reply('cashier:close:response', {
      success: false,
      message: 'Sem conexão para fechar o caixa',
    })
  }
  try {
    await CashierService.closeCashier(cashier, isConnected)
    event.reply('cashier:close:response', {
      success: true,
      message: 'Caixa fechado com sucesso',
    })
  } catch (err) {
    console.error(err)
    event.reply('cashier:close:response', {
      success: false,
      message: 'Falha ao fechar o caixa',
    })
  }
})

ipcMain.on('cashier:history:get', async (event) => {
  try {
    const response = await CashierService.getCurrentCashHistory()
    event.reply('cashier:history:get:response', response)
  } catch (err) {
    console.error(err)
  }
})
