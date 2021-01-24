import { ipcMain } from 'electron'
import StoreService from '../services/StoreService'
import { sendLog } from '../utils/ApiLog'

ipcMain.on('store:create', async (event, id) => {
  try {
    await StoreService.create(id)
    event.reply('store:create:response', { success: true })
  } catch (err) {
    sendLog({
      title: 'Erro ao criar loja',
      payload: { err: err.message, params: { id } },
    })
    event.reply('store:create:response', { success: false })
    console.error(err)
  }
})

ipcMain.on('store:get', async (event) => {
  try {
    const store = await StoreService.getOne()
    event.reply('store:get:response', { success: true, store })
  } catch (err) {
    sendLog({
      title: 'Erro ao obter loja',
      payload: err.message,
    })
    event.reply('store:get:response', { success: false })
    console.error(err)
  }
})

ipcMain.on('store:getAll', async (event) => {
  try {
    const stores = await StoreService.getStoreByUser()
    event.reply('store:getAll:response', { success: true, stores })
  } catch (err) {
    sendLog({
      title: 'Erro ao obter lojas do franqueado',
      payload: err.message,
    })
    event.reply('store:getAll:response', { success: false, stores: [] })
    console.error(err)
  }
})

ipcMain.on('store:products:get', async (event) => {
  try {
    const products = await StoreService.getAllProducts()
    event.reply('store:products:get:response', products)
  } catch (err) {
    sendLog({
      title: 'Erro ao obter todos os produtos da loja',
      payload: err.message,
    })
    event.reply('store:products:get:response', [])
    console.error(err)
  }
})
