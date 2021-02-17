import SettingsService from '../services/SettingsService'
import { sendLog } from '../utils/ApiLog'
import Printer from 'printer'
import { printer as ThermalPrinter, types as TermalTypes } from 'node-thermal-printer'

const printer = new ThermalPrinter({
  type: TermalTypes.EPSON,
  interface: 'tcp://xxx.xxx.xxx.xxx',
  characterSet: 'SLOVENIA',
  removeSpecialCharacters: false,
  lineCharacter: '=',
  options: {
    timeout: 5000
  }
})

printer.clear()
printer.tableCustom([
  { text: 'THE BEST ACAI', align: 'LEFT', width: 0.5, bold: true },
  { text: 'AEROPORTO I', align: 'RIGHT', width: 0.5, bold: true }
])
printer.drawLine()
printer.table(['PRODUTO', 'QUANTIDADE', 'VALOR'])
printer.table(['CocaCola-300ml', '2', '7.50'])
printer.table(['Self-Service', '0.450', '12.50'])
printer.drawLine()
printer.table(['TOTAL', ' ', '20.00'])
printer.drawLine()
printer.table(['REFERENCIA FISCAL', 'FX12YU1T21FJA12'])
printer.alignCenter()
printer.printQR('https://br.linkedin.com/public-profile/in/wirlley-delfino-09a326190?challengeId=AQF7tw3l2wIgCQAAAXerDkBzbRgyriDMD5hNJ8gLOwIkfiUKtnU01Z1ZlidCjuAi1gTgnG74wgiLLXGi0Sw8oaXUFAXG4OkCwA&submissionId=62ac1728-da3d-6416-958b-0feabf4b9264', { correction: 'M' })
printer.cut()

const termalPrinter = Printer.getPrinter('EPSON TM-T20X Receipt')

Printer.printDirect({
  data: printer.getBuffer(),
  options: termalPrinter.options,
  printer: 'EPSON TM-T20X Receipt',
  type: 'RAW',
  success: function() {
    console.log('printed: ' + '123')
  },
  error: function(err) { console.log(err) }
})
