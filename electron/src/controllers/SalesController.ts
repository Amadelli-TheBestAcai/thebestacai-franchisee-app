import { ipcMain } from 'electron'
import SalesService from '../services/SalesService'
import CashierService from '../services/CashierService'
import { sendLog } from '../utils/ApiLog'

ipcMain.on('sale:create', async (event) => {
  try {
    const sale = await SalesService.create()
    event.reply('sale:create:response', sale)
  } catch (err) {
    sendLog({
      title: 'Erro criar venda',
      payload: err.message,
    })
    console.error(err)
  }
})

ipcMain.on('sale:add', async (event, sale) => {
  try {
    await SalesService.finishSale(sale)
    event.reply('sale:add:response', true)
  } catch (err) {
    sendLog({
      title: 'Erro ao finalizar venda',
      payload: { err: err.message, sale },
    })
    event.reply('sale:add:response', false)
    console.error(err)
  }
})

ipcMain.on('sale:getCurrent', async (event) => {
  try {
    const { sale, items, payments } = await SalesService.getCurrentSale()
    const cashier = await CashierService.getCurrentCashier()
    event.reply('sale:getCurrent:response', { sale, items, payments, cashier })
  } catch (err) {
    sendLog({
      title: 'Erro ao obter venda atual',
      payload: err.message,
    })
    console.error(err)
  }
})

ipcMain.on('sale:command:get', async (event) => {
  try {
    const sales = await SalesService.getSalesCommands()
    event.reply('sale:command:get:response', sales)
  } catch (err) {
    sendLog({
      title: 'Erro ao obter comandas',
      payload: err.message,
    })
    console.error(err)
    event.reply('sale:command:get:response', [])
  }
})

ipcMain.on('sale:command:create', async (event, { id, name }) => {
  try {
    const sale = await SalesService.createCommand(id, name)
    event.reply('sale:command:create:response', sale)
  } catch (err) {
    sendLog({
      title: 'Erro ao criar comanda',
      payload: { err: err.message, params: { id, name } },
    })
    console.error(err)
  }
})

ipcMain.on('sale:finish', async (event, sale) => {
  try {
    await SalesService.finishSale(sale)
    const { sale: newSale } = await SalesService.getCurrentSale()
    event.reply('sale:finish:response', newSale)
  } catch (err) {
    sendLog({
      title: 'Erro ao finalizar venda',
      payload: { err: err.message, params: { sale } },
    })
    console.error(err)
  }
})

ipcMain.on('sale:command:transfer', async (event, sale) => {
  try {
    await SalesService.transferItemsCommand(sale)
    const sales = await SalesService.getSalesCommands()
    event.reply('sale:command:transfer:response', sales)
  } catch (err) {
    sendLog({
      title: 'Erro ao obter items da comanda',
      payload: { err: err.message, params: { sale } },
    })
    console.error(err)
  }
})

ipcMain.on('sale:command:remove', async (event, sale) => {
  try {
    await SalesService.delete(sale)
    const sales = await SalesService.getSalesCommands()
    event.reply('sale:command:remove:response', sales)
  } catch (err) {
    sendLog({
      title: 'Erro ao remover comanda',
      payload: { err: err.message, params: { sale } },
    })
    console.error(err)
  }
})

ipcMain.on('sale:api:get', async (event) => {
  try {
    const { isConnected, data } = await SalesService.getFromApi()
    event.reply('sale:api:get:response', { isConnected, data })
  } catch (err) {
    sendLog({
      title: 'Erro ao obter vendas da api',
      payload: err.message,
    })
    event.reply('sale:api:get:response', { isConnected: false, data: [] })
    console.error(err)
  }
})

ipcMain.on('sale:api:delete', async (event, id) => {
  try {
    const { success, data } = await SalesService.deleteFromApi(id)
    event.reply('sale:api:delete:response', { success, data })
  } catch (err) {
    sendLog({
      title: 'Erro ao remover vendas da api',
      payload: { err: err.message, params: { id } },
    })
    event.reply('sale:api:delete:response', { success: false, data: [] })
    console.error(err)
  }
})
