import { ipcMain } from 'electron'
import ItemsService from '../services/ItemsService'

ipcMain.on('payment:add', async (event, { sale, ...payload }) => {
  try {
    await ItemsService.createOrUpdate(payload, sale)
    const items = await ItemsService.getBySale(sale)
    const total = await ItemsService.getTotalBySale(sale)
    event.reply('item:add:response', { total, items })
  } catch (err) {
    console.error(err)
  }
})
