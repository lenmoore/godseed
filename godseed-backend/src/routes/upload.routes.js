import express from 'express';
import multer from 'multer';
import path from 'path';

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // Files will be saved in the 'uploads/' directory
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname)); // Add a timestamp to avoid filename conflicts
  }
});

const upload = multer({ storage: storage });

// Route to handle image uploads
router.post('/image', upload.single('image'), (req, res) => {
  console.log('Image upload route hit');
  try {
    res.status(200).json({ imageUrl: `/uploads/${req.file.filename}` });
  } catch (error) {
    res.status(400).send({ message: 'Failed to upload image', error });
  }
});

// Route to handle video uploads
router.post('/video', upload.single('video'), (req, res) => {
  console.log('Video upload route hit');
  try {
    res.status(200).json({ videoUrl: `/uploads/${req.file.filename}` });
  } catch (error) {
    res.status(400).send({ message: 'Failed to upload video', error });
  }
});

export default router;
