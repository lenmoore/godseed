import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';  // Import CORS

import parameterRoutes from './src/routes/parameter.routes.js';
import eraRoutes from './src/routes/era.routes.js';
import sceneRoutes from './src/routes/scene.routes.js';
import variationRoutes from './src/routes/variation.routes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());  // Enable CORS for all origins
app.use(express.json());

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('MongoDB connected!'))
  .catch(err => console.error('MongoDB connection error:', err));

// Use routes with /api prefix
app.use('/api/parameters', parameterRoutes);
app.use('/api/eras', eraRoutes);
app.use('/api/scenes', sceneRoutes);
app.use('/api/variations', variationRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
