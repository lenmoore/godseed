import mongoose from 'mongoose';
const variationSchema = new mongoose.Schema({
  scene: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Scene',
    required: true,
  },
  parameter: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Parameter',
    required: true,
  },
  videos_list: [{
    type: String,
  }],
});

const Variation = mongoose.model('Variation', variationSchema);

export default  Variation;
