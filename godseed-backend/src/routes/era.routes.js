
import express from 'express';
import Era from '../models/era.schema.js'

const router = express.Router();
// Create a new era
router.post('/', async (req, res) => {
  try {
    const era = new Era(req.body);
    await era.save();
    res.status(201).send(era);
  } catch (error) {
    res.status(400).send(error);
  }
});

// Get all eras
router.get('/', async (req, res) => {
  try {
    const eras = await Era.find();
    res.status(200).json(eras);
  } catch (error) {
    res.status(500).send(error);
  }
});

// Get a single era by ID
router.get('/:id', async (req, res) => {
  try {
    const era = await Era.findById(req.params.id);
    if (!era) {
      return res.status(404).send('Era not found');
    }
    res.status(200).send(era);
  } catch (error) {
    res.status(500).send(error);
  }
});

// Update an era by ID
router.put('/:id', async (req, res) => {
  try {
    const era = await Era.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!era) {
      return res.status(404).send('Era not found');
    }
    res.status(200).send(era);
  } catch (error) {
    res.status(400).send(error);
  }
});

// Delete an era by ID
router.delete('/:id', async (req, res) => {
  try {
    const era = await Era.findByIdAndDelete(req.params.id);
    if (!era) {
      return res.status(404).send('Era not found');
    }
    res.status(200).send('Era deleted');
  } catch (error) {
    res.status(500).send(error);
  }
});

export default router;
