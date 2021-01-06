import { ipcMain } from 'electron'
import PaymentsService from '../services/PaymentsService'
import { sendLog } from '../utils/ApiLog'

ipcMain.on('payment:get', async (event, sale) => {
  try {
    const payments = await PaymentsService.getBySale(sale)
    event.returnValue = payments
  } catch (err) {
    await sendLog({
      title: 'Erro ao obter pagamentos do pedido',
      payload: { err: err.message, params: { sale } },
    })
    console.error(err)
  }
})

ipcMain.on('payment:add', async (event, { sale, ...payload }) => {
  try {
    await PaymentsService.create(payload, sale)
    const payments = await PaymentsService.getBySale(sale)
    event.reply('payment:add:response', payments)
  } catch (err) {
    await sendLog({
      title: 'Erro ao adicionar pagamentos ao pedido',
      payload: { err: err.message, params: { sale, payload } },
    })
    console.error(err)
  }
})

ipcMain.on('payment:remove', async (event, { id, sale }) => {
  try {
    await PaymentsService.deleteById(id)
    const payments = await PaymentsService.getBySale(sale)
    event.reply('payment:remove:response', payments)
  } catch (err) {
    await sendLog({
      title: 'Erro ao remover pagamentos do pedido',
      payload: { err: err.message, params: { id, sale } },
    })
    console.error(err)
  }
})
