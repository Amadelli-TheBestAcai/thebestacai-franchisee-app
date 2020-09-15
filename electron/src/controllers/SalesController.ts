import { ipcMain } from 'electron'
import SalesService from '../services/SalesService'
ipcMain.on('sale:create', async (event, payload) => {
  console.log(payload)
  // SalesService.create(payload)
})
