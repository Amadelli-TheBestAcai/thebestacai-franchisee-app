import { ipcMain } from 'electron'
import SalesService from '../services/SalesService'

ipcMain.on('sale:getCurrent', async (event) => {
  try {
    const sale = await SalesService.getCurrentSale()
    event.reply('sale:getCurrent:response', sale)
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

ipcMain.on('sale:integrate', async (event) => {
  try {
    await SalesService.integrate()
  } catch (err) {
    console.error(err)
  }
})

ipcMain.on('sale:finish', async (event, sale) => {
  await SalesService.finishSale(sale)
  const newSale = await SalesService.getCurrentSale()
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
