import { ipcMain } from 'electron'
import SerialPort from 'serialport'
import { sendLog } from '../utils/ApiLog'

let port: SerialPort = null

SerialPort.list().then((ports) => {
  ports.forEach((portInfo) => {
    const { path } = portInfo
    port = new SerialPort(path, {
      baudRate: 9600,
      dataBits: 7,
      stopBits: 1,
      parity: 'none',
      autoOpen: true,
    })
  })
})

ipcMain.on('balance:get', async (event) => {
  try {
    if (!port) {
      throw new Error('No port dicoverd')
    }
    port.on('data', function (data) {
      if (!data) {
        event.reply('balance:get:response', { weight: 0 })
      }
      const result = data.toString().match(/\d+/)[0]
      const resultFormatedToNumber = +result.replace(
        /(\d)(?=(\d{3})+(?!\d))/g,
        '$1.'
      )
      event.reply('balance:get:response', { weight: resultFormatedToNumber })
    })

    port.write('SYST:ADDR?\n', function (err) {
      err && console.log('err: ' + err)
    })

    port.on('error', function (err) {
      throw new Error(err.message)
    })
  } catch (err) {
    event.reply('balance:get:response', { error: true })
    await sendLog({
      title: 'Erro ao obter peso da balança',
      payload: err.message,
    })
  }
})
