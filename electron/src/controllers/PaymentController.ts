import { ipcMain } from 'electron'
import { getCustomRepository } from 'typeorm'
import PaymentsRepository from '../repositories/PaymentsRepository'
import CreatePaymentService from '../services/Payment/CreatePaymentService'
import UpdateTotalSaleService from '../services/Sale/UpdateTotalSaleService'
import { sendLog } from '../utils/ApiLog'

const _paymentRepository = getCustomRepository(PaymentsRepository)

ipcMain.on('payment:get', async (event, sale) => {
  try {
    const payments = await _paymentRepository.getBySale(sale)
    event.returnValue = payments
  } catch (err) {
    sendLog({
      title: 'Erro ao obter pagamentos do pedido',
      payload: { err: err.message, params: { sale } },
    })
    console.error(err)
  }
})

ipcMain.on('payment:add', async (event, { sale, ...payload }) => {
  try {
    await CreatePaymentService.execute(payload, sale)
    await UpdateTotalSaleService.execute(sale)
    const payments = await _paymentRepository.getBySale(sale)
    event.reply('payment:add:response', payments)
  } catch (err) {
    sendLog({
      title: 'Erro ao adicionar pagamentos ao pedido',
      payload: { err: err.message, params: { sale, payload } },
    })
    console.error(err)
  }
})

ipcMain.on('payment:remove', async (event, { id, sale }) => {
  try {
    await _paymentRepository.deleteById(id)
    const payments = await _paymentRepository.getBySale(sale)
    event.reply('payment:remove:response', payments)
  } catch (err) {
    sendLog({
      title: 'Erro ao remover pagamentos do pedido',
      payload: { err: err.message, params: { id, sale } },
    })
    console.error(err)
  }
})
