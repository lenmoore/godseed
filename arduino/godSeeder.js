import SerialPortPkg from 'serialport'
import ReadlinePkg from '@serialport/parser-readline'
import axios from 'axios'

// first add
// node checkPorts.js
// node godSeeder.js
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

      // Handle the parsed JSON data here
      const parameters = Object.keys(parsedData).map(key => ({
        name: key,
        is_active: parsedData[key]
      }))

      const parametersWithoutNormal = parameters.filter(param => param.name !== 'normal')

      console.log('Should be sending this:')
      console.log(parametersWithoutNormal)

      if (dataString === 'ITISWHATITIS') {
        console.log('it is what it is')
      }

      if (dataString === 'CREATE') {
        console.log('create')
      }

      if (dataString === 'DESTROY') {
        console.log('destroy')
      }
      
      // Send API requests
      try {
        await axios.post(`${apiBaseUrl}/arduino/create-initial-state`)
        console.log('Sent: /arduino/create-initial-state')
      } catch (error) {
        console.error('Error sending /arduino/create-initial-state:', error.message, '. It is probably because there already is an active state.')
      }

      try {
        await axios.post(`${apiBaseUrl}/arduino/create`, { parameters: parametersWithoutNormal })
        console.log('Sent: /arduino/create')
      } catch (error) {
        console.error('Error sending /arduino/create:', error.message, '. It is probably because there already is an active state.')
      }

    } catch (error) {
      if (dataString === 'DESTROY') {
        console.log('Destroy button pressed, sending destroy request...')
        try {
          await axios.post(`${apiBaseUrl}/arduino/destroy`)
          console.log('Sent: /arduino/destroy')
        } catch (error) {
          console.error('Error sending /arduino/destroy:', error.message, '. It is probably because there are no more active states to remove.')
        }
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
