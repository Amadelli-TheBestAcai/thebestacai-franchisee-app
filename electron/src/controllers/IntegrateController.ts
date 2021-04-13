import { ipcMain } from 'electron'
import { getCustomRepository } from 'typeorm'
import IntegrateOfflineService from '../services/Integration/IntegrateOfflineService'
import IntegrateOnlineService from '../services/Integration/IntegrateOnlineService'
import { sendLog } from '../utils/ApiLog'

import SalesRepository from '../repositories/SalesRepository'
import CashHandlerRepository from '../repositories/CashHandlerRepository'

const _saleRepository = getCustomRepository(SalesRepository)
const _cashHandlerRepository = getCustomRepository(CashHandlerRepository)

ipcMain.on('integrate:offline', async (event, { code, amount_on_close }) => {
  try {
    await IntegrateOfflineService.execute(code, amount_on_close)
    event.reply('integrate:offline:response', true)
  } catch (err) {
    sendLog({
      title: 'Erro ao integrar vendas offline',
      payload: { err: err.message, cashToClose: { code, amount_on_close } },
    })
    console.error(err)
    event.reply('integrate:offline:response', false)
  }
})

ipcMain.on('integrate:shouldUpdateApp', async (event) => {
  try {
    event.reply('integrate:shouldUpdateApp:response', true)
  } catch (err) {
    sendLog({
      title: 'Erro ao obter versão atual do caixa',
      payload: err.message,
    })
    console.error(err)
    event.reply('integrate:shouldUpdateApp:response', false)
  }
})

ipcMain.on('integrate:checkAppVersion', async (event) => {
  try {
    event.reply('integrate:checkAppVersion:response', true)
  } catch (err) {
    sendLog({
      title: 'Erro ao checkar nova versão para o APP',
      payload: err.message,
    })
    console.error(err)
    event.reply('integrate:checkAppVersion:response', false)
  }
})

ipcMain.on('integrate:status', async (event) => {
  try {
    const sales = await _saleRepository.getOnline()
    const handlers = await _cashHandlerRepository.getOnlineHandlers()
    event.reply('integrate:status:response', { sales, handlers })
  } catch (err) {
    sendLog({
      title: 'Erro ao obter vendas e movimentações feitas no modo online',
      payload: err.message,
    })
    console.error(err)
    event.reply('integrate:status:response', { sales: [], handlers: [] })
  }
})

ipcMain.on('integrate:integrate', async (event) => {
  try {
    await IntegrateOnlineService.execute()
    event.reply('integrate:integrate:response', true)
  } catch (err) {
    sendLog({
      title: 'Erro ao obter vendas e movimentações feitas no modo online',
      payload: err.message,
    })
    console.error(err)
    event.reply('integrate:integrate:response', false)
  }
})
