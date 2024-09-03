import express from 'express'
import mongoose from 'mongoose'
import dotenv from 'dotenv'
import cors from 'cors'

import parameterRoutes from './src/routes/parameter.routes.js'
import eraRoutes from './src/routes/era.routes.js'
import sceneRoutes from './src/routes/scene.routes.js'
import variationRoutes from './src/routes/variation.routes.js'
import uploadRoutes from './src/routes/upload.routes.js'
import arduinoRoutes from './src/routes/arduino.routes.js' // Import the upload routes

dotenv.config()

const app = express()
const PORT = process.env.PORT || 3000

app.use(cors())  // Enable CORS for all origins
app.use(express.json())
app.use('/uploads', express.static('uploads')) // To serve uploaded files statically

console.log(process.env.MONGODB_URI)
// MongoDB connection
mongoose.connect(process.env.MONGODB_URI, {})
    .then(() => console.log('MongoDB connected!'))
    .catch(err => console.error('MongoDB connection error:', err))

// Use routes with /api prefix
app.use('/api/parameters', parameterRoutes)
app.use('/api/eras', eraRoutes)
app.use('/api/scenes', sceneRoutes)
app.use('/api/variations', variationRoutes)
app.use('/api/upload', uploadRoutes)
app.use('/api/arduino', arduinoRoutes)


app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})
