import SerialPortPkg from 'serialport'

const { SerialPort } = SerialPortPkg

// List all available serial ports
SerialPort.list()
  .then(ports => {
    ports.forEach(port => {
      console.log(`Port: ${port.path}`)
    })
  })
  .catch(err => console.error('Error listing ports:', err))
