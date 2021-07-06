import { ipcMain } from 'electron'
import FindAllCategoriesWithProductsService from '../services/Product/FindAllCategoriesWithProductsService'
import GetProductAuditsService from '../services/Product/GetProductAuditsService'
import GetSelfServiceProductService from '../services/Product/GetSelfServiceProductService'
import UpdateProductStockService from '../services/Product/UpdateProductStockService'
import UpdateProductsFromApiService from '../services/Product/UpdateProductsFromApiService'
import GetAllProductsByStore from '../services/Product/GetAllProductsByStore'
import GetCurrentStoreService from '../services/Store/GetCurrentStoreService'
import { checkInternet } from '../utils/InternetConnection'
import { sendLog } from '../utils/ApiLog'
import { IProductsRepository } from '../repositories/interfaces/IProductsRepository'
import ProductsRepository from '../repositories/ProductsRepository'

const productRepository: IProductsRepository = new ProductsRepository()

ipcMain.on('products:get', async (event) => {
  try {
    const response = await GetAllProductsByStore.execute()
    event.returnValue = response
  } catch (err) {
    sendLog({
      title: 'Erro ao obter produtos',
      payload: err.message,
    })
    console.error(err)
    event.returnValue = []
  }
})

ipcMain.on('products:refresh', async (event) => {
  try {
    await UpdateProductsFromApiService.execute()
    event.reply('products:refresh:response', { success: true })
  } catch (err) {
    sendLog({
      title: 'Erro ao atualizar base de produtos',
      payload: err.message,
    })
    console.error(err)
    event.reply('products:refresh:response', { success: false })
  }
})

ipcMain.on('products:get:selfService', async (event) => {
  try {
    const item = await GetSelfServiceProductService.execute()
    event.reply('products:get:selfService:response', item)
  } catch (err) {
    sendLog({
      title: 'Erro ao obter produto Self-Service',
      payload: err.message,
    })
    console.error(err)
  }
})

ipcMain.on('products:stock:update', async (event, { id, quantity }) => {
  try {
    await UpdateProductStockService.execute(id, quantity)
    event.reply('products:stock:update:response', true)
  } catch (err) {
    sendLog({
      title: 'Erro ao atualizar estoque',
      payload: err.message,
    })
    event.reply('products:stock:update:response', false)
    console.error(err)
  }
})

ipcMain.on('products:category:all', async (event) => {
  try {
    const hasInternet = checkInternet()
    const categoryWithProducts = await FindAllCategoriesWithProductsService.execute()
    const store = await GetCurrentStoreService.execute()
    event.reply('products:category:all:response', {
      hasInternet,
      store: store.store_id,
      categoryWithProducts,
    })
  } catch (err) {
    sendLog({
      title: 'Erro ao obter todas as categorias com produtos',
      payload: err.message,
    })
    event.reply('products:category:all:response', {
      hasInternet: false,
      store: null,
      categoryWithProducts: [],
    })
    console.error(err)
  }
})

ipcMain.on('products:audit:get', async (event, { id, page, size }) => {
  try {
    const { audits, totalElements } = await GetProductAuditsService.execute(
      id,
      page,
      size
    )
    event.reply('products:audit:get:response', {
      audits,
      totalElements,
      status: true,
    })
  } catch (err) {
    sendLog({
      title: 'Erro ao obter histórico de auditoria do produto',
      payload: err.message,
    })
    event.reply('products:audit:get:response', {
      audits: [],
      totalElements: 0,
      status: false,
    })
    console.error(err)
  }
})

ipcMain.on('products:nfe', async (event) => {
  try {
    const content = await productRepository.getAll()
    event.reply('products:nfe:response', { content, error: false })
  } catch (err) {
    sendLog({
      title: 'Erro ao obter produtos para nfe',
      payload: err.message,
    })
    event.reply('products:nfe:response', { content: [], error: true })
    console.error(err)
  }
})
