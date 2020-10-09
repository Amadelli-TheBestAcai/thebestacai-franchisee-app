import { ipcMain } from 'electron'
import ItemsOutCartService from '../services/ItemsOutCartService'

ipcMain.on('itemOutCart:create', async (event, { reason, product_id }) => {
  try {
    const { success, message } = await ItemsOutCartService.create(
      reason,
      product_id
    )
    event.reply('itemOutCart:create:response', { success, message })
  } catch (err) {
    console.error(err)
  }
})
