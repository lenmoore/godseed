import mongoose from 'mongoose';

const eraSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  eraImage: {
    type: String,
    required: false,
  },
});

const Era = mongoose.model('Era', eraSchema);

export default Era;