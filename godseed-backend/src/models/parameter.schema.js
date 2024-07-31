import mongoose from 'mongoose';

const parameterSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  is_active: {
    type: Boolean,
    default: true,
  },
});

const Parameter = mongoose.model('Parameter', parameterSchema);
export default Parameter;
