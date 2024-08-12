import express from 'express'
import Variation from '../models/variation.model.js'
import Scene from '../models/scene.model.js'
import Era from '../models/era.schema.js'

const router = express.Router()

// Create a new variation
router.post('/', async (req, res) => {
  try {
    const variation = new Variation(req.body)
    await variation.save()

    await Scene.updateOne({ _id: req.body.scene }, {
      $push: { variations: variation._id }
    })

    res.status(201).send(variation)
  } catch (error) {
    res.status(400).send(error)
  }
})

// Get all variations
router.get('/', async (req, res) => {
  try {
    const variations = await Variation.find().populate('scene').populate('parameter')
    res.status(200).send(variations)
  } catch (error) {
    res.status(500).send(error)
  }
})

// Get all variations by scene ID
router.get('/by-scene/:sceneId', async (req, res) => {
  try {

    console.log('hello')
    const { sceneId } = req.params
    console.log(sceneId)
    const variations = await Variation.find({ scene: sceneId }).populate('scene').populate('parameter')
    if (!variations.length) {
      return res.status(404).send('No variations found for this scene')
    }
    res.status(200).send(variations)
  } catch (error) {
    res.status(500).send(error)
  }
})
// Get all variations by era name
router.get('/by-era/:eraName', async (req, res) => {
  try {
    const { eraName } = req.params
    console.log('Fetching variations for era:', eraName)

    const eraId = await Era.findOne({ name: eraName }).select('_id')
    console.log(eraId)
    // Find the scenes associated with the given era name
    const scenes = await Scene.find({ era: eraId }).select('_id')
    const sceneIds = scenes.map(scene => scene._id)

    // Find variations that belong to these scenes
    const variations = await Variation.find({ scene: { $in: sceneIds } })
      .populate('scene')
      .populate('parameter')

    if (!variations.length) {
      return res.status(404).send('No variations found for this era')
    }

    res.status(200).send(variations)
  } catch (error) {
    console.error('Failed to fetch variations:', error)
    res.status(500).send(error)
  }
})

// Get a single variation by ID
router.get('/:id', async (req, res) => {
  try {
    const variation = await Variation.findById(req.params.id).populate('scene').populate('parameter')
    if (!variation) {
      return res.status(404).send('Variation not found')
    }
    res.status(200).send(variation)
  } catch (error) {
    res.status(500).send(error)
  }
})

// Update a variation by ID
router.put('/:id', async (req, res) => {
  try {
    const variation = await Variation.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })
    if (!variation) {
      return res.status(404).send('Variation not found')
    }
    res.status(200).send(variation)
  } catch (error) {
    res.status(400).send(error)
  }
})

// Delete a variation by ID
router.delete('/:id', async (req, res) => {
  try {
    const variation = await Variation.findByIdAndDelete(req.params.id)
    if (!variation) {
      return res.status(404).send('Variation not found')
    }
    res.status(200).send('Variation deleted')
  } catch (error) {
    res.status(500).send(error)
  }
})

export default router
