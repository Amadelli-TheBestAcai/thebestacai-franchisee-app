import { ipcMain } from 'electron'
import SalesService from '../services/SalesService'

ipcMain.on('sale:getCurrent', async (event) => {
  const sale = await SalesService.getCurrentSale()
  event.returnValue = sale
})

ipcMain.on('sale:integrate', async (event) => {
  try {
    await SalesService.integrate('2-05')
  } catch (err) {
    console.error(err)
  }
})

ipcMain.on('sale:finish', async (event, sale) => {
  await SalesService.finishSale(sale)
  const newSale = await SalesService.getCurrentSale()
  event.reply('sale:finish:response', newSale)
})
