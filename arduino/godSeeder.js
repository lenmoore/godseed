import SerialPortPkg from 'serialport'
import ReadlinePkg from '@serialport/parser-readline'
import axios from 'axios'

const { SerialPort } = SerialPortPkg
const { ReadlineParser } = ReadlinePkg

const portPath = 'COM3' // Change to COM1 for your specific setup
console.log(`Using port path: ${portPath}`)
const apiBaseUrl = 'http://3.65.248.203/api/' // Use the correct API base URL

const paramsBatchUpdateUrl = apiBaseUrl + 'arduino/update-params'
const statusUpdateUrl = apiBaseUrl + 'arduino/status'

const statusObject = {
  showAllAnimations: false,
  showCivilisationWasDestroyed: false,
  created: false
}

try {
  const port = new SerialPort({ path: portPath, baudRate: 9600 })

  const parser = port.pipe(new ReadlineParser({ delimiter: '\n' }))
  console.log('hello world!')

  // Function to handle sending API requests based on parsed data
  const sendStateUpdate = async (parsedData) => {
    try {
      const parameters = Object.keys(parsedData).map(key => ({
        name: key,
        is_active: parsedData[key]
      }))

      const parametersWithoutNormal = parameters.filter(param => param.name !== 'normal')

      // Send the parameters update request
      try {
        await axios.post(paramsBatchUpdateUrl, { parameters: parametersWithoutNormal })
      } catch (error) {
        console.error('Error sending params:', error.message)
      }
    } catch (error) {
      console.error('Failed to send params:', error.message)
    }
  }

  parser.on('data', async (data) => {
    const dataString = data.toString('utf8').trim() // Convert the Buffer to a string and trim whitespace
    console.log('Received:', dataString)

    try {
      // Attempt to parse the data as JSON
      const parsedData = JSON.parse(dataString)

      console.log('parsing data')
      // If parsed successfully, send the state update to the server
      await sendStateUpdate(parsedData)

    } catch (error) {
      if (dataString === 'CREATE') {
        try {
          statusObject.created = true
          statusObject.showAllAnimations = true
          statusObject.showStandby = false
          await axios.put(statusUpdateUrl, statusObject)
          console.log('PUT: /arduino/status')
        } catch (error) {
          console.error('Error sending /arduino/create:', error.message)
        }
      } else if (dataString === 'DESTROY') {
        statusObject.created = false
        statusObject.showAllAnimations = false
        statusObject.showStandby = false
        statusObject.showCivilisationWasDestroyed = true
        console.log('DESTROY command received')
        try {
          await axios.put(statusUpdateUrl, statusObject)
          console.log('PUT: /arduino/status')
        } catch (error) {
          console.error('Error sending /arduino/destroy:', error.message)
        }
      } else {
        console.error('Error parsing JSON or handling known command:', error.message)
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
