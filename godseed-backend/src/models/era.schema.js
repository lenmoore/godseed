const mongoose = require('mongoose');

const eraSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
});

const Era = mongoose.model('Era', eraSchema);

module.exports = Era;
