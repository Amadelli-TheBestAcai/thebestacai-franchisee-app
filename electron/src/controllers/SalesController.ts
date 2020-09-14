import { ipcMain } from 'electron'
import SalesService from "../services/SalesService"
ipcMain.on('sale:create', async (event, payload) => {

  console.log(payload)
  const sale= {
    client_id: 1,
    quantity: 2,
    change_amount: 3.50,
    cash_id: 1,
    type: 1,
    discount: 0.5
  }
  SalesService.create(sale)
})
