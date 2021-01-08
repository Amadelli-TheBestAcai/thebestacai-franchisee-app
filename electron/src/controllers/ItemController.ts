import { ipcMain } from 'electron'
import ItemsService from '../services/ItemsService'
import SalesService from '../services/SalesService'
import { sendLog } from '../utils/ApiLog'

ipcMain.on('item:add', async (event, { sale, ...payload }) => {
  try {
    await ItemsService.createOrUpdate(payload, sale)
    const items = await ItemsService.getBySale(sale)
    const { sale: currentSale } = await SalesService.getCurrentSale()
    event.reply('item:add:response', { sale: currentSale, items })
  } catch (err) {
    sendLog({
      title: 'Erro ao adicionar item',
      payload: { err: err.message, item: { sale, ...payload } },
    })
    console.error(err)
  }
})

ipcMain.on('item:decress', async (event, { id, sale }) => {
  try {
    await ItemsService.decressQuantity(id, sale)
    const items = await ItemsService.getBySale(sale)
    const { sale: currentSale } = await SalesService.getCurrentSale()
    event.reply('item:decress:response', { sale: currentSale, items })
  } catch (err) {
    sendLog({
      title: 'Erro ao diminuir item do pedido',
      payload: { err: err.message, params: { id, sale } },
    })
    console.error(err)
  }
})

ipcMain.on('item:get', async (event, sale) => {
  try {
    const items = await ItemsService.getBySale(sale)
    event.returnValue = items
  } catch (err) {
    sendLog({
      title: 'Erro ao obter itens do pedido',
      payload: { err: err.message, params: { sale } },
    })
    console.error(err)
  }
})

ipcMain.on('item:total', async (event, sale) => {
  try {
    const total = await ItemsService.getTotalBySale(sale)
    event.returnValue = total
  } catch (err) {
    sendLog({
      title: 'Erro ao obter valor total de itens do pedido',
      payload: { err: err.message, params: { sale } },
    })
    console.error(err)
  }
})
