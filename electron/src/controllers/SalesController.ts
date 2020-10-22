import { ipcMain } from 'electron'
import SalesService from '../services/SalesService'
import CashierService from '../services/CashierService'

ipcMain.on('sale:getCurrent', async (event) => {
  try {
    const { sale, items, payments } = await SalesService.getCurrentSale()
    const cashier = await CashierService.getCurrentCashier()
    event.reply('sale:getCurrent:response', { sale, items, payments, cashier })
  } catch (err) {
    console.error(err)
  }
})

ipcMain.on('sale:command:get', async (event) => {
  try {
    const sales = await SalesService.getSalesCommands()
    event.reply('sale:command:get:response', sales)
  } catch (err) {
    console.error(err)
    event.reply('sale:command:get:response', [])
  }
})

ipcMain.on('sale:command:create', async (event, { id, name }) => {
  try {
    const sale = await SalesService.createCommand(id, name)
    event.reply('sale:command:create:response', sale)
  } catch (err) {
    console.error(err)
  }
})

ipcMain.on('sale:finish', async (event, sale) => {
  await SalesService.finishSale(sale)
  const { sale: newSale } = await SalesService.getCurrentSale()
  event.reply('sale:finish:response', newSale)
})

ipcMain.on('sale:command:transfer', async (event, sale) => {
  try {
    await SalesService.transferItemsCommand(sale)
    const sales = await SalesService.getSalesCommands()
    event.reply('sale:command:transfer:response', sales)
  } catch (err) {
    console.error(err)
  }
})

ipcMain.on('sale:command:remove', async (event, sale) => {
  try {
    await SalesService.delete(sale)
    const sales = await SalesService.getSalesCommands()
    event.reply('sale:command:remove:response', sales)
  } catch (err) {
    console.error(err)
  }
})

ipcMain.on('sale:integrate:pending', async (event, { cash, amount }) => {
  try {
    await SalesService.integratePending(amount, cash)
    event.reply('sale:integrate:pending:response', true)
  } catch (err) {
    event.reply('sale:integrate:pending:response', false)
    console.error(err)
  }
})

ipcMain.on('sale:api:get', async (event) => {
  try {
    const { isConnected, data } = await SalesService.getFromApi()
    event.reply('sale:api:get:response', { isConnected, data })
  } catch (err) {
    event.reply('sale:api:get:response', { isConnected: false, data: [] })
    console.error(err)
  }
})

ipcMain.on('sale:api:delete', async (event, id) => {
  try {
    const { success, data } = await SalesService.deleteFromApi(id)
    event.reply('sale:api:delete:response', { success, data })
  } catch (err) {
    event.reply('sale:api:delete:response', { success: false, data: [] })
    console.error(err)
  }
})
