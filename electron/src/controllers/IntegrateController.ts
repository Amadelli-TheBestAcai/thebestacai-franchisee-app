import { ipcMain } from 'electron'
import IntegrateService from '../services/IntegrateService'
import { sendLog } from '../utils/ApiLog'

ipcMain.on('integrate:offline', async (event, { code, amount_on_close }) => {
  try {
    await IntegrateService.integrateOffline(code, amount_on_close)
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
    const response = await IntegrateService.shouldUpdateApp()
    event.reply('integrate:shouldUpdateApp:response', response)
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
    const response = await IntegrateService.appAlreadyUpdated()
    event.reply('integrate:checkAppVersion:response', response)
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
    const sales = await IntegrateService.getOnlineSales()
    const handlers = await IntegrateService.getOnlineHandlers()
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
    await IntegrateService.integrateOnlineSales()
    await IntegrateService.integrateOnlineHandlers()
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
