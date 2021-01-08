import { ipcMain } from 'electron'
import ItemsOutCartService from '../services/ItemsOutCartService'
import { sendLog } from '../utils/ApiLog'

ipcMain.on('itemOutCart:create', async (event, { reason, product_id }) => {
  try {
    const { success, message } = await ItemsOutCartService.create(
      reason,
      product_id
    )
    event.reply('itemOutCart:create:response', { success, message })
  } catch (err) {
    sendLog({
      title: 'Erro ao remover item do pedido',
      payload: { err: err.message, item: { reason, product_id } },
    })
    console.error(err)
  }
})
