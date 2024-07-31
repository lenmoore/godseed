const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();

const parameterRoutes = require('./src/routes/parameter.routes');
const eraRoutes = require('./src/routes/era.routes');
const sceneRoutes = require('./src/routes/scene.routes');
const variationRoutes = require('./src/routes/variation.routes');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('MongoDB connected!'))
  .catch(err => console.error('MongoDB connection error:', err));

// Use routes
app.use('/parameters', parameterRoutes);
app.use('/eras', eraRoutes);
app.use('/scenes', sceneRoutes);
app.use('/variations', variationRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
