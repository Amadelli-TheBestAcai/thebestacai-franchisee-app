import GetSettingsService from '../services/Setting/GetSettingsService'
import GetCurrentStoreService from '../services/Store/GetCurrentStoreService'
import { replaceSpecialChars } from '../../../shared/utils/replaceSpecialChars'

import Printer from 'printer'
import {
  printer as ThermalPrinter,
  types as TermalTypes,
} from 'node-thermal-printer'

let printerFormater: ThermalPrinter = null

export const printSale = async (sale): Promise<void> => {
  if (!printerFormater) {
    printerFormater = new ThermalPrinter({
      type: TermalTypes.EPSON,
      interface: 'tcp://xxx.xxx.xxx.xxx',
      characterSet: 'SLOVENIA',
      removeSpecialCharacters: false,
      lineCharacter: '=',
      options: {
        timeout: 5000,
      },
    })
  }
  const store = await GetCurrentStoreService.execute()
  const { printer } = await GetSettingsService.execute()
  // const items = await ItemsService.getBySale(sale.id)

  const termalPrinter = Printer.getPrinter(printer)

  printerFormater.clear()
  printerFormater.tableCustom([
    { text: 'THE BEST ACAI', align: 'LEFT', width: 0.5, bold: true },
    {
      text: replaceSpecialChars(store.company_name),
      align: 'RIGHT',
      width: 0.5,
      bold: true,
    },
  ])
  printerFormater.drawLine()
  printerFormater.tableCustom([
    { text: 'PRODUTO', align: 'LEFT', cols: 30 },
    { text: 'QUANTIDADE', align: 'CENTER', cols: 10 },
    { text: 'VALOR', align: 'CENTER', cols: 10 },
  ])
  sale.items.forEach((item) => {
    if (item.category_id === 1) {
      printerFormater.tableCustom([
        { text: item.name, align: 'LEFT', cols: 30 },
        { text: '1', align: 'CENTER', cols: 10 },
        {
          text: (+item.quantity * +item.price_unit).toFixed(2).toString(),
          align: 'CENTER',
          cols: 10,
        },
      ])
    } else {
      printerFormater.tableCustom([
        { text: replaceSpecialChars(item.name), align: 'LEFT', cols: 30 },
        { text: item.quantity.toString(), align: 'CENTER', cols: 10 },
        {
          text: item.price_unit.toFixed(2).toString(),
          align: 'CENTER',
          cols: 10,
        },
      ])
    }
  })
  printerFormater.drawLine()
  printerFormater.tableCustom([
    { text: 'Total', align: 'LEFT', cols: 30 },
    { text: '', align: 'CENTER', cols: 10 },
    {
      text: sale.total.toFixed(2).toString(),
      align: 'CENTER',
      bold: true,
      cols: 10,
    },
  ])
  if (sale.nfce_url) {
    printerFormater.drawLine()
    printerFormater.table(['QRCode NOTA FISCAL'])
    printerFormater.alignCenter()
    printerFormater.printQR(sale.nfce_url, { correction: 'M' })
  }
  printerFormater.cut()

  Printer.printDirect({
    data: printerFormater.getBuffer(),
    options: termalPrinter.options,
    printer,
    type: 'RAW',
    success: function () {
      console.log('printed with success')
    },
    error: function (err) {
      console.log(err)
    },
  })
}
