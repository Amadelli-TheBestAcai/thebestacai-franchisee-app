import { ipcMain } from 'electron'
import ItemsService from '../services/ItemsService'

ipcMain.on('item:add', async (event, { sale, ...payload }) => {
  try {
    await ItemsService.createOrUpdate(payload, sale)
    event.reply('item:add:response', true)
  } catch (err) {
    console.error(err)
    event.reply('item:add:response', false)
  }
})
