import { ipcMain } from 'electron'
import FindStoreCashesService from '../services/StoreCash/FindStoreCashesService'
import UpdateStoreCashObservationService from '../services/StoreCash/UpdateStoreCashObservationService'
import GetCurrentStoreCashService from '../services/StoreCash/GetCurrentStoreCashService'
import FindStoreCashBalanceService from '../services/StoreCash/FindStoreCashBalanceService'
import FindStoreCashHistoryService from '../services/StoreCash/FindStoreCashHistoryService'
import OpenStoreCashService from '../services/StoreCash/OpenStoreCashService'
import CloseStoreCashService from '../services/StoreCash/CloseStoreCashService'
import SalesService from '../services/SalesService'
import IntegrateService from '../services/IntegrateService'
import { checkInternet } from '../utils/InternetConnection'
import { sendLog } from '../utils/ApiLog'

ipcMain.on('cashier:get', async (event) => {
  try {
    const cashes = await FindStoreCashesService.execute()
    const current = await GetCurrentStoreCashService.execute()
    const is_connected = await checkInternet()
    const sales = await SalesService.getOffline()
    event.reply('cashier:get:response', {
      cashes,
      current,
      is_connected,
      has_pending: !!sales.length,
    })
  } catch (err) {
    sendLog({
      title: 'Erro ao obter caixas online',
      payload: err.message,
    })
    console.error(err)
    event.reply('cashier:get:response', [])
  }
})

ipcMain.on('cashier:open', async (event, { ...cashier }) => {
  try {
    await OpenStoreCashService.execute(cashier)
    event.reply('cashier:open:response', {
      success: true,
      message: 'Caixa aberto com sucesso',
    })
  } catch (err) {
    console.error(err.message)
    sendLog({
      title: 'Erro ao abrir caixa',
      payload: { err: err.message, cashier },
    })
    event.reply('cashier:open:response', {
      success: false,
      message: 'Falha ao abrir o caixa',
    })
  }
})

ipcMain.on('cashier:close', async (event, { ...cashier }) => {
  try {
    // await IntegrateService.integrateOnlineSales()
    // await IntegrateService.integrateOnlineHandlers()
    await CloseStoreCashService.execute(cashier)
    event.reply('cashier:close:response', {
      success: true,
      message: 'Caixa fechado com sucesso',
    })
  } catch (err) {
    console.error(err)
    sendLog({
      title: 'Erro ao obter fechar caixa',
      payload: { err: err.message, cashier },
    })
    event.reply('cashier:close:response', {
      success: false,
      message: 'Falha ao fechar o caixa',
    })
  }
})

ipcMain.on('cashier:history:get', async (event) => {
  try {
    const response = await FindStoreCashHistoryService.execute()
    event.reply('cashier:history:get:response', response)
  } catch (err) {
    sendLog({
      title: 'Erro ao obter histórico do caixa',
      payload: err.message,
    })
    console.error(err)
  }
})

ipcMain.on('cashier:balance:get', async (event) => {
  try {
    const response = await FindStoreCashBalanceService.execute()
    event.reply('cashier:balance:get:response', response)
  } catch (err) {
    sendLog({
      title: 'Erro ao obter balanço do caixa',
      payload: err.message,
    })
    console.error(err)
  }
})

ipcMain.on('cashier:update:observation', async (event, observation) => {
  try {
    await UpdateStoreCashObservationService.execute(observation)
    event.reply('cashier:update:observation:response', true)
  } catch (err) {
    sendLog({
      title: 'Erro ao cadastrar observação de caixa negativo',
      payload: { err: err.message, observation },
    })
    event.reply('cashier:update:observation:response', false)
    console.error(err)
  }
})
