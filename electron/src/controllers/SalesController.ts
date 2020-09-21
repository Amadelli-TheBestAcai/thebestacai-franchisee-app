import { ipcMain } from 'electron'
import SalesService from '../services/SalesService'
ipcMain.on('sale:create', async (event, { isConnected, sale }) => {
  console.log({ isConnected, sale })
})
