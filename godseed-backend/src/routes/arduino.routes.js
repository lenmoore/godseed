import express from 'express'
import State from '../models/state.schema.js'
import Parameter from '../models/parameter.schema.js'

const router = express.Router()

router.post('/update-params', async (req, res) => {
  try {

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

    res.status(200).send({ message: 'Parameters updated' })
  } catch (error) {
    console.error('Error creating state:', error)
    res.status(400).send({ error: error.message })
  }
})

// Route to get the status of the state
router.get('/status', async (req, res) => {
  try {
    const state = await State.findOne({ name: 'STATE' })

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

// Route to get the status of the state
router.post('/status', async (req, res) => {
  try {

    // create new state
    const state = new State({
      name: 'STATE',
      showStandby: true,
      showItIsWhatItIs: false,
      showAllAnimations: false,
      showCivilisationWasDestroyed: false,
      civilisationCounter: 0,
      developmentMode: false,
      created: false,
      showConfirm: false,
      createConfirmed: false
    })

    // save the state
    await state.save()
    res.status(201).send(state)
  } catch (error) {
    console.error('Error getting state status:', error)
    res.status(400).send({ error: error.message })
  }
})

// Route to get the status of the state
router.put('/status', async (req, res) => {
  try {
    const state = await State.findOneAndUpdate(
      { name: 'STATE' },
      req.body,
      { new: true }  // This option returns the updated document
    )

    console.log(state)
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
