import GetSettingsService from '../services/Setting/GetSettingsService'
import GetCurrentStoreService from '../services/Store/GetCurrentStoreService'
import { replaceSpecialChars } from '../../../shared/utils/replaceSpecialChars'

import Printer from 'printer'
import {
  printer as ThermalPrinter,
  types as TermalTypes,
} from 'node-thermal-printer'

let printerFormater: ThermalPrinter = null

type HandlersDto = {
  id: number
  type: number
  reason: string
  amount: string
  verified: boolean
  order_id?: number
  created_at: string
  deleted_at?: string
}
export const printHandler = async (handler: HandlersDto): Promise<void> => {
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
    { text: 'TIPO', align: 'LEFT', cols: 30 },
    { text: '', align: 'CENTER', cols: 10 },
    {
      text: handler.type === 0 ? 'ENTRADA' : 'SAIDA',
      align: 'CENTER',
      bold: true,
      cols: 10,
    },
  ])
  printerFormater.tableCustom([
    { text: 'VALOR', align: 'LEFT', cols: 30 },
    { text: '', align: 'CENTER', cols: 10 },
    {
      text: handler.amount.replace('.', ','),
      align: 'CENTER',
      bold: true,
      cols: 10,
    },
  ])
  printerFormater.tableCustom([
    { text: 'DATA', align: 'LEFT', cols: 30 },
    { text: '', align: 'CENTER', cols: 10 },
    {
      text: handler.created_at,
      align: 'CENTER',
      bold: true,
      cols: 10,
    },
  ])
  printerFormater.tableCustom([
    { text: 'RAZAO', align: 'LEFT', cols: 15 },
    { text: '', align: 'CENTER', cols: 5 },
    {
      text: handler.reason,
      align: 'CENTER',
      bold: true,
      cols: 10,
    },
  ])

  printerFormater.drawLine()
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
