const mongoose = require('mongoose');

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

module.exports = Parameter;
