import { ipcMain } from 'electron'

ipcMain.on('sale:create', async (event, payload) => {
  console.log(payload)
})
