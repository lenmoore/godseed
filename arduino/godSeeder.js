import SerialPortPkg from 'serialport'
import ReadlinePkg from '@serialport/parser-readline'

const { SerialPort } = SerialPortPkg

const { ReadlineParser } = ReadlinePkg

const portPath = '/dev/tty.usbmodem11101' // Use the correct port path
console.log(`Using port path: ${portPath}`)

try {
  const port = new SerialPort({ path: portPath, baudRate: 9600 })

  const parser = port.pipe(new ReadlineParser({ delimiter: '\n' }))

  parser.on('data', (data) => {
    const dataString = data.toString('utf8') // Convert the Buffer to a string
    console.log('Received:', dataString)

    // Now, you can handle dataString as needed
    try {
      const parsedData = JSON.parse(dataString.trim())

      if (parsedData === 'DESTROY') {
        console.log('Destroy button pressed, sending destroy request...')
        // Send the destroy request
      } else if (typeof parsedData === 'object') {
        console.log('Create button pressed, sending create requests...')
        // Handle the parsed data
      }
    } catch (error) {
      console.error('Error parsing JSON:', error.message)
    }
  })

  port.on('open', () => {
    console.log('Serial port open')
  })

  port.on('error', (err) => {
    console.error('Error: ', err.message)
  })

} catch (err) {
  console.error('Error initializing SerialPort:', err)
}
