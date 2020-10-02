import { ipcMain } from 'electron'
import ItemsService from '../services/ItemsService'
import SalesService from '../services/SalesService'

ipcMain.on('item:add', async (event, { sale, ...payload }) => {
  try {
    await ItemsService.createOrUpdate(payload, sale)
    const items = await ItemsService.getBySale(sale)
    const currentSale = await SalesService.getCurrentSale()
    event.reply('item:add:response', { sale: currentSale, items })
  } catch (err) {
    console.error(err)
  }
})

ipcMain.on('item:decress', async (event, { id, sale }) => {
  try {
    await ItemsService.decressQuantity(id, sale)
    const items = await ItemsService.getBySale(sale)
    const currentSale = await SalesService.getCurrentSale()
    event.reply('item:decress:response', { sale: currentSale, items })
  } catch (err) {
    console.error(err)
  }
})

ipcMain.on('item:get', async (event, sale) => {
  try {
    const items = await ItemsService.getBySale(sale)
    event.returnValue = items
  } catch (err) {
    console.error(err)
  }
})

ipcMain.on('item:total', async (event, sale) => {
  try {
    const total = await ItemsService.getTotalBySale(sale)
    event.returnValue = total
  } catch (err) {
    console.error(err)
  }
})
