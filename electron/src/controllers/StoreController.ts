import { ipcMain } from 'electron'

import CreateStoreService from '../services/Store/CreateStoreService'
import GetCurrentStoreService from '../services/Store/GetCurrentStoreService'
import FindAllStoresByUser from '../services/Store/FindAllStoresByUser'
import FindAllProductsService from '../services/Product/FindAllProductsService'
import GetDecodedTokenService from '../services/User/GetDecodedTokenService'

import { sendLog } from '../utils/ApiLog'

ipcMain.on('store:create', async (event, id) => {
  try {
    await CreateStoreService.execute(id)
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
    const store = await GetCurrentStoreService.execute()
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
    const { id } = await GetDecodedTokenService.execute()
    const stores = await FindAllStoresByUser.execute(id)
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
    const products = await FindAllProductsService.execute()
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
