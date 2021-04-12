import { ipcMain } from 'electron'
import { getCustomRepository } from 'typeorm'
import ItemsService from '../services/ItemsService'
import SalesService from '../services/SalesService'
import CreateOrUpdateItemService from '../services/Item/CreateOrUpdateItemService'
import DecressItemQuantityService from '../services/Item/DecressItemQuantityService'
import UpdateTotalSaleService from '../services/Sale/UpdateTotalSaleService'
import ItemsRepository from '../repositories/ItemsRepository'
import { sendLog } from '../utils/ApiLog'

const _itemRepository = getCustomRepository(ItemsRepository)

ipcMain.on('item:add', async (event, { sale, ...payload }) => {
  try {
    await CreateOrUpdateItemService.execute(payload, sale)
    await UpdateTotalSaleService.execute(sale)
    const items = await _itemRepository.getBySale(sale)
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
    await DecressItemQuantityService.execute(id)
    await UpdateTotalSaleService.execute(sale)
    const items = await _itemRepository.getBySale(sale)
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
    const items = await _itemRepository.getBySale(sale)
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
    const total = await _itemRepository.getTotalBySale(sale)
    event.returnValue = total
  } catch (err) {
    sendLog({
      title: 'Erro ao obter valor total de itens do pedido',
      payload: { err: err.message, params: { sale } },
    })
    console.error(err)
  }
})
