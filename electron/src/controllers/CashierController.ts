import { ipcMain } from 'electron'
import CashierService from '../services/CashierService'
import SalesService from '../services/SalesService'
import { checkInternet } from '../utils/InternetConnection'

ipcMain.on('cashier:get', async (event) => {
  try {
    const cashes = await CashierService.getCashes()
    const current = await CashierService.getCurrentCashier()
    const is_connected = await checkInternet()
    const sales = await SalesService.getPending()
    event.reply('cashier:get:response', {
      cashes,
      current,
      is_connected,
      has_pending: !!sales.length,
    })
  } catch (err) {
    console.error(err)
    event.reply('cashier:get:response', [])
  }
})

ipcMain.on('cashier:open', async (event, { ...cashier }) => {
  try {
    await CashierService.openCashier(cashier)
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

ipcMain.on('cashier:close', async (event, { ...cashier }) => {
  try {
    await CashierService.closeCashier(cashier)
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

ipcMain.on('cashier:balance:get', async (event) => {
  try {
    const response = await CashierService.getBalance()
    event.reply('cashier:balance:get:response', response)
  } catch (err) {
    console.error(err)
  }
})

ipcMain.on('cashier:update:observation', async (event, observation) => {
  try {
    await CashierService.updateObservation(observation)
    event.reply('cashier:update:observation:response', true)
  } catch (err) {
    event.reply('cashier:update:observation:response', false)
    console.error(err)
  }
})
