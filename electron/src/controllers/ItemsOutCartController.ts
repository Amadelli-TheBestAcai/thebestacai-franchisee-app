import { ipcMain } from 'electron'
import CreateItemOutCartService from '../services/ItemOutCart/CreateItemOutCartService'
import IntegrateItemsOutCartService from '../services/ItemOutCart/IntegrateItemsOutCartService'
import { sendLog } from '../utils/ApiLog'
import { checkInternet } from '../utils/InternetConnection'

ipcMain.on('itemOutCart:create', async (event, { reason, product_id }) => {
  try {
    const { success, message } = await CreateItemOutCartService.execute(
      reason,
      product_id
    )
    const hasInternet = await checkInternet()
    if (hasInternet) {
      await IntegrateItemsOutCartService.execute()
    }
    event.reply('itemOutCart:create:response', { success, message })
  } catch (err) {
    sendLog({
      title: 'Erro ao remover item do pedido',
      payload: { err: err.message, item: { reason, product_id } },
    })
    console.error(err)
  }
})
