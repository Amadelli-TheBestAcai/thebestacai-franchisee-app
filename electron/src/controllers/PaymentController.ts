import { ipcMain } from 'electron'
import PaymentsService from '../services/PaymentsService'

ipcMain.on('payment:get', async (event, sale) => {
  try {
    const payments = await PaymentsService.getBySale(sale)
    event.returnValue = payments
  } catch (err) {
    console.error(err)
  }
})

ipcMain.on('payment:add', async (event, { sale, ...payload }) => {
  try {
    await PaymentsService.create(payload, sale)
    const payments = await PaymentsService.getBySale(sale)
    event.reply('payment:add:response', payments)
  } catch (err) {
    console.error(err)
  }
})

ipcMain.on('payment:remove', async (event, { id, sale }) => {
  try {
    await PaymentsService.deleteById(id)
    const payments = await PaymentsService.getBySale(sale)
    event.reply('payment:remove:response', payments)
  } catch (err) {
    console.error(err)
  }
})
