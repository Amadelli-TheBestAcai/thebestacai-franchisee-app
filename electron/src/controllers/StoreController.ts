import { ipcMain } from 'electron'
import StoreService from '../services/StoreService'

ipcMain.on('store:create', async (event, id) => {
  try {
    await StoreService.create(id)
    event.reply('store:create:response', { success: true })
  } catch (err) {
    event.reply('store:create:response', { success: false })
    console.error(err)
  }
})

ipcMain.on('store:get', async (event) => {
  try {
    const store = await StoreService.getOne()
    event.reply('store:get:response', { success: true, store })
  } catch (err) {
    event.reply('store:get:response', { success: false })
    console.error(err)
  }
})

ipcMain.on('store:getAll', async (event) => {
  try {
    const stores = await StoreService.getStoreByUser()
    event.reply('store:getAll:response', { success: true, stores })
  } catch (err) {
    event.reply('store:getAll:response', { success: false, stores: [] })
    console.error(err)
  }
})
