
import express from 'express';
import Variation from '../models/variation.model.js'

const router = express.Router();
// Create a new variation
router.post('/', async (req, res) => {
  try {
    const variation = new Variation(req.body);
    await variation.save();
    res.status(201).send(variation);
  } catch (error) {
    res.status(400).send(error);
  }
});

// Get all variations
router.get('/', async (req, res) => {
  try {
    const variations = await Variation.find().populate('scene').populate('parameter');
    res.status(200).send(variations);
  } catch (error) {
    res.status(500).send(error);
  }
});

// Get a single variation by ID
router.get('/:id', async (req, res) => {
  try {
    const variation = await Variation.findById(req.params.id).populate('scene').populate('parameter');
    if (!variation) {
      return res.status(404).send('Variation not found');
    }
    res.status(200).send(variation);
  } catch (error) {
    res.status(500).send(error);
  }
});

// Update a variation by ID
router.put('/:id', async (req, res) => {
  try {
    const variation = await Variation.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!variation) {
      return res.status(404).send('Variation not found');
    }
    res.status(200).send(variation);
  } catch (error) {
    res.status(400).send(error);
  }
});

// Delete a variation by ID
router.delete('/:id', async (req, res) => {
  try {
    const variation = await Variation.findByIdAndDelete(req.params.id);
    if (!variation) {
      return res.status(404).send('Variation not found');
    }
    res.status(200).send('Variation deleted');
  } catch (error) {
    res.status(500).send(error);
  }
});

export default router;
