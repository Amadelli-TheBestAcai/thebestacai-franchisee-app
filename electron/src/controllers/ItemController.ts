import { ipcMain } from 'electron'
import ItemsService from '../services/ItemsService'

ipcMain.on('item:add', async (event, { sale, ...payload }) => {
  try {
    await ItemsService.createOrUpdate(payload, sale)
    const items = await ItemsService.getBySale(sale)
    const total = await ItemsService.getTotalBySale(sale)
    event.reply('item:add:response', { total, items })
  } catch (err) {
    console.error(err)
  }
})

ipcMain.on('item:decress', async (event, { id, sale }) => {
  try {
    await ItemsService.decressQuantity(id)
    const items = await ItemsService.getBySale(sale)
    const total = await ItemsService.getTotalBySale(sale)
    event.reply('item:decress:response', { total, items })
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
