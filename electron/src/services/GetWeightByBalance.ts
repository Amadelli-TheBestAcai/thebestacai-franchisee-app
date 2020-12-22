import SerialPort from 'serialport'

export function getWeigthByBalance(): Promise<number> {
  return new Promise<number>(function (resolve, reject) {
    SerialPort.list().then((ports) => {
      if (ports.length === 0) {
        reject(new Error('No ports discovered'))
      }

      ports.forEach((portInfo) => {
        const { path } = portInfo
        const port = new SerialPort(
          path,
          {
            baudRate: 9600,
            dataBits: 7,
            stopBits: 1,
            parity: 'none',
            autoOpen: false,
          },
          console.log
        )

        if (port.isOpen) {
          port.close()
        }

        port.open()

        port.on('open', function () {
          port.on('data', function (data) {
            const result = data.toString().match(/\d+/)[0]
            const resultFormatedToNumber = +result.replace(
              /(\d)(?=(\d{3})+(?!\d))/g,
              '$1.'
            )
            port.close()
            resolve(resultFormatedToNumber)
          })

          port.write('SYST:ADDR?\n', function (err) {
            err && console.log('err: ' + err)
          })

          port.on('error', function (err) {
            console.log('Error: ', err.message)
          })
        })
      })
    })
  })
}
