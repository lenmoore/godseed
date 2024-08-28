import express from 'express'
import State from '../models/state.schema.js'
import Parameter from '../models/parameter.schema.js'

const router = express.Router()

// Route to create the state with created = true initially
router.post('/create', async (req, res) => {
  try {
    console.log('create route hit')
    console.log(req.body)

    // Fetch the current state
    let state = await State.findOne({})

    if (!state) {
      // If no state exists, create a new one
      state = new State()
    }

    if (!state.created) {
      // If `created = false`, set `createConfirmed = true`
      state.createConfirmed = true
    } else if (state.created && !state.showConfirm) {
      // If `created = true` and `showConfirm = false`, set `showConfirm = true`
      state.showConfirm = true
    } else if (state.showConfirm) {
      // If `showConfirm = true`, set `created = true` and `createConfirmed = true`
      state.created = true
      state.createConfirmed = true
      state.showConfirm = false // Optionally reset showConfirm if no longer needed
    }

    const { parameters } = req.body

    // Iterate over each parameter in the request body
    for (const param of parameters) {
      const { name, is_active } = param

      // Find each parameter by name and update its is_active status
      await Parameter.findOneAndUpdate(
        { name: new RegExp(`^${name}`) }, // Matches documents where 'name' starts with the value of 'name'
        { is_active: is_active },
        { new: true }
      )
    }

    // Save the state
    await state.save()
    res.status(201).send(state)
  } catch (error) {
    console.error('Error creating state:', error)
    res.status(400).send({ error: error.message })
  }
})


// Route to create the initial state
router.post('/create-initial-state', async (req, res) => {
  try {
    console.log('create initial state')
    if (await State.findOne({ created: true })) {
      return res.status(400).send({ error: 'Initial state already exists' })
    }
    const state = new State({ created: true })
    await state.save()
    res.status(201).send(state)
  } catch (error) {
    console.error('Error creating initial state:', error)
    res.status(400).send({ error: error.message })
  }
})

// Route to destroy the state (assuming you want to reset the state)
router.post('/destroy', async (req, res) => {
  try {
    console.log('destroy route hit')
    console.log(req.body)

    // Reset the state by setting created to false and createConfirmed to false
    const state = await State.findOneAndUpdate(
      { created: true },
      { created: false, createConfirmed: false },
      { new: true }
    )

    if (!state) {
      return res.status(404).send({ message: 'State not found' })
    }

    res.status(200).send({ message: 'State destroyed successfully' })
  } catch (error) {
    console.error('Error destroying state:', error)
    res.status(400).send({ error: error.message })
  }
})

// Route to get the status of the state
router.get('/status', async (req, res) => {
  try {
    console.log('status route hit')
    const state = await State.findOne({})

    if (!state) {
      return res.status(404).send({ message: 'State not found' })
    }

    const allParameters = await Parameter.find()
    res.status(200).send({ state, allParameters })
  } catch (error) {
    console.error('Error getting state status:', error)
    res.status(400).send({ error: error.message })
  }
})

export default router
