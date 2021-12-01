import { ipcMain } from 'electron'
import CreateCashHandlerService from '../services/CashHandler/CreateCashHandlerService'
import IntegrateOnlineCashHandlersService from '../services/Integration/IntegrateOnlineCashHandlersService'
import GetCashHandlersByStoreCashService from '../services/CashHandler/GetCashHandlersByStoreCashService'
import DeleteCashHandlerFromApiService from '../services/CashHandler/DeleteCashHandlerFromApiService'
import { printHandler } from '../utils/PrintHandler'
import { sendLog } from '../utils/ApiLog'
import { checkInternet } from '../utils/InternetConnection'

ipcMain.on(
  'handler:create',
  async (event, { handler, shopOrder, sendToShop }) => {
    try {
      await CreateCashHandlerService.execute({
        cashHandler: handler,
        shopOrder,
        sendToShop,
      })
      await IntegrateOnlineCashHandlersService.execute()
      event.reply('handler:create:response', { success: true })
    } catch (err) {
      sendLog({
        title: 'Erro ao criar movimentação',
        payload: { err: err.message, handler },
      })
      event.reply('handler:create:response', { success: false })
      console.error(err)
    }
  }
)

ipcMain.on('handler:api:get', async (event) => {
  try {
    const data = await GetCashHandlersByStoreCashService.execute()
    const isConnected = await checkInternet()
    event.reply('handler:api:get:response', { isConnected, data })
  } catch (err) {
    sendLog({
      title: 'Erro ao obter movimentações',
      payload: err.message,
    })
    event.reply('handler:api:get:response', { isConnected: false, data: [] })
    console.error(err)
  }
})

ipcMain.on('handler:delete', async (event, id) => {
  try {
    const success = await DeleteCashHandlerFromApiService.execute(id)
    const data = await GetCashHandlersByStoreCashService.execute()
    event.reply('handler:delete:response', { success, data })
  } catch (err) {
    sendLog({
      title: 'Erro ao remover movimentação',
      payload: { err: err.message, id },
    })
    event.reply('handler:delete:response', {
      success: false,
      data: [],
    })
    console.error(err)
  }
})

ipcMain.on('handler:print', async (event, payload) => {
  printHandler(payload)
})
