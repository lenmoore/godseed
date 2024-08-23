import SerialPortPkg from 'serialport'
import ReadlinePkg from '@serialport/parser-readline'
import axios from 'axios'

const { SerialPort } = SerialPortPkg

const { ReadlineParser } = ReadlinePkg

const portPath = '/dev/tty.usbmodem11101' // Use the correct port path
console.log(`Using port path: ${portPath}`)
const apiBaseUrl = 'http://3.65.248.203/api' // Use the correct API base URL
try {
  const port = new SerialPort({ path: portPath, baudRate: 9600 })

  const parser = port.pipe(new ReadlineParser({ delimiter: '\n' }))

  parser.on('data', async (data) => {
    const dataString = data.toString('utf8').trim() // Convert the Buffer to a string and trim whitespace
    console.log('Received:', dataString)

    try {
      // First, try parsing as JSON
      const parsedData = JSON.parse(dataString)

      console.log('Create button pressed, sending create requests...')
      // Handle the parsed JSON data here
      const parameters = Object.keys(parsedData).map(key => ({
        name: key,
        is_active: parsedData[key]
      }))

      const parametersWithoutNormal = parameters.filter(param => param.name !== 'normal')

      console.log('should be sending this: ')
      console.log(parametersWithoutNormal)
      // Send API requests
      await axios.post(`${apiBaseUrl}/arduino/create-initial-state`)
      await axios.post(`${apiBaseUrl}/arduino/create`, { parameters: parametersWithoutNormal })

      // console.log('Requests sent successfully.')

    } catch (error) {
      if (dataString === 'DESTROY') {
        console.log('Destroy button pressed, sending destroy request...')
        await axios.post(`${apiBaseUrl}/arduino/destroy`)
      } else {
        console.error('Error parsing JSON:', error.message)
      }
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
