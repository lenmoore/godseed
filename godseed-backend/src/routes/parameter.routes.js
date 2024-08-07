import express from 'express'
import Parameter from '../models/parameter.schema.js'

const router = express.Router()

// Create a new parameter
router.post('/', async (req, res) => {
  try {
    const parameter = new Parameter(req.body)
    await parameter.save()
    res.status(201).send(parameter)
  } catch (error) {
    res.status(400).send(error)
  }
})

// Get all parameters
router.get('/', async (req, res) => {
  try {
    const parameters = await Parameter.find()
    res.status(200).send(parameters)
  } catch (error) {
    res.status(500).send(error)
  }
})

// Get a single parameter by ID
router.get('/:id', async (req, res) => {
  try {
    const parameter = await Parameter.findById(req.params.id)
    if (!parameter) {
      return res.status(404).send('Parameter not found')
    }
    res.status(200).send(parameter)
  } catch (error) {
    res.status(500).send(error)
  }
})

// Update a parameter by ID
router.put('/:id', async (req, res) => {
  try {
    const parameter = await Parameter.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })
    if (!parameter) {
      return res.status(404).send('Parameter not found')
    }
    res.status(200).send(parameter)
  } catch (error) {
    res.status(400).send(error)
  }
})

// Batch update parameters
router.put('/', async (req, res) => {
  try {
    const updates = req.body // Expecting an array of { _id, is_active } objects
    const updatePromises = updates.map(update =>
      Parameter.findByIdAndUpdate(update._id, { is_active: update.is_active }, { new: true, runValidators: true })
    )
    const updatedParameters = await Promise.all(updatePromises)
    res.status(200).send(updatedParameters)
  } catch (error) {
    res.status(400).send(error)
  }
})

// Delete a parameter by ID
router.delete('/:id', async (req, res) => {
  try {
    const parameter = await Parameter.findByIdAndDelete(req.params.id)
    if (!parameter) {
      return res.status(404).send('Parameter not found')
    }
    res.status(200).send('Parameter deleted')
  } catch (error) {
    res.status(500).send(error)
  }
})

export default router
