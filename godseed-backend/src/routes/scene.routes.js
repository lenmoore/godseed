
import express from 'express';
import Scene from '../models/scene.model.js'

const router = express.Router();
// Create a new scene
router.post('/', async (req, res) => {
  try {
    const scene = new Scene(req.body);
    await scene.save();
    res.status(201).send(scene);
  } catch (error) {
    res.status(400).send(error);
  }
});

// Get all scenes
router.get('/', async (req, res) => {
  try {
    const scenes = await Scene.find().populate('era').populate('variations');
    res.status(200).send(scenes);
  } catch (error) {
    res.status(500).send(error);
  }
});

// Get a single scene by ID
router.get('/:id', async (req, res) => {
  try {
    const scene = await Scene.findById(req.params.id).populate('era').populate('variations');
    if (!scene) {
      return res.status(404).send('Scene not found');
    }
    res.status(200).send(scene);
  } catch (error) {
    res.status(500).send(error);
  }
});

// Update a scene by ID
router.put('/:id', async (req, res) => {
  try {
    const scene = await Scene.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!scene) {
      return res.status(404).send('Scene not found');
    }
    res.status(200).send(scene);
  } catch (error) {
    res.status(400).send(error);
  }
});

// Delete a scene by ID
router.delete('/:id', async (req, res) => {
  try {
    const scene = await Scene.findByIdAndDelete(req.params.id);
    if (!scene) {
      return res.status(404).send('Scene not found');
    }
    res.status(200).send('Scene deleted');
  } catch (error) {
    res.status(500).send(error);
  }
});

export default router;
