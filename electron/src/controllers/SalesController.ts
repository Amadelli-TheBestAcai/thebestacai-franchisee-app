import { ipcMain } from 'electron'
import SalesService from '../services/SalesService'
ipcMain.on('sale:create', async (event, payload) => {
  // SalesService.create(payload)
})
