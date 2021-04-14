import { ipcMain } from 'electron'
import { getCustomRepository } from 'typeorm'
import GetCurrentStoreCashService from '../services/StoreCash/GetCurrentStoreCashService'
import CreateSaleService from '../services/Sale/CreateSaleService'
import GetSalesFromApiService from '../services/Sale/GetSalesFromApiService'
import DeleteSalesFromApiService from '../services/Sale/DeleteSalesFromApiService'
import TransferCommandItems from '../services/Sale/TransferCommandItems'
import GetAppSalesToIntegrateService from '../services/Sale/GetAppSalesToIntegrateService'
import IntegrateAppSalesService from '../services/Sale/IntegrateAppSalesService'
import FinishSaleService from '../services/Sale/FinishSaleService'
import GetCurrentSaleService from '../services/Sale/GetCurrentSaleService'
import { sendLog } from '../utils/ApiLog'
import { printSale } from '../utils/PrintSale'
import SalesRepository from '../repositories/SalesRepository'

const _salesRepository = getCustomRepository(SalesRepository)

ipcMain.on('sale:create', async (event) => {
  try {
    const sale = await CreateSaleService.execute()
    event.reply('sale:create:response', sale)
  } catch (err) {
    sendLog({
      title: 'Erro criar venda',
      payload: err.message,
    })
    console.error(err)
  }
})

ipcMain.on('sale:addDelivery', async (event, sale) => {
  try {
    await FinishSaleService.execute(sale)
    event.reply('sale:addDelivery:response', true)
  } catch (err) {
    sendLog({
      title: 'Erro ao finalizar venda',
      payload: { err: err.message, sale },
    })
    event.reply('sale:addDelivery:response', false)
    console.error(err)
  }
})

ipcMain.on('sale:getCurrent', async (event) => {
  try {
    const { sale, items, payments } = await GetCurrentSaleService.execute()
    const cashier = await GetCurrentStoreCashService.execute()
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
    const sales = await _salesRepository.getCommands()
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
    await _salesRepository.createCommand(id, name)
    const sale = await CreateSaleService.execute()
    event.reply('sale:command:create:response', sale)
  } catch (err) {
    sendLog({
      title: 'Erro ao criar comanda',
      payload: { err: err.message, params: { id, name } },
    })
    console.error(err)
  }
})

ipcMain.on('sale:finish', async (event, { sale, saleOptions }) => {
  try {
    await FinishSaleService.execute(sale, saleOptions)
    const { sale: newSale } = await GetCurrentSaleService.execute()
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
    await TransferCommandItems.execute(sale)
    const sales = await _salesRepository.getCommands()
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
    await _salesRepository.deleteById(sale)
    const sales = await _salesRepository.getCommands()
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
    const { isConnected, sales } = await GetSalesFromApiService.execute()
    event.reply('sale:api:get:response', { isConnected, data: sales })
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
    const success = await DeleteSalesFromApiService.execute(id)
    const data = await GetSalesFromApiService.execute()
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

ipcMain.on('appSale:get', async (event) => {
  try {
    const { hasInternet, sales } = await GetAppSalesToIntegrateService.execute()
    event.reply('appSale:get:response', { hasInternet, sales })
  } catch (err) {
    sendLog({
      title: 'Erro ao obter vendas do APP',
      payload: { err: err.message },
    })
    event.reply('appSale:get:response', { hasInternet: false, sales: [] })
    console.error(err)
  }
})

ipcMain.on('appSale:integrate', async (event, sales) => {
  try {
    await IntegrateAppSalesService.execute(sales)
    event.reply('appSale:integrate:response', true)
  } catch (err) {
    sendLog({
      title: 'Erro ao integrar vendas do app',
      payload: { err: err.message },
    })
    event.reply('appSale:integrate:response', false)
    console.error(err)
  }
})

ipcMain.on('sale:print', async (event, payload) => {
  printSale(payload)
})
