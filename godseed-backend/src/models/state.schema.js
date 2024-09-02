import mongoose from 'mongoose'

const stateSchema = new mongoose.Schema({
  name: {
    type: String,
    default: 'STATE'
  },
  showStandby: {
    type: Boolean,
    default: true
  },
  showItIsWhatItIs: {
    type: Boolean,
    default: false
  },
  showAllAnimations: {
    type: Boolean,
    default: false
  },
  showCivilisationWasDestroyed: {
    type: Boolean,
    default: false
  },
  civilisationCounter: {
    type: Number,
    default: 42
  },

  developmentMode: {
    type: Boolean,
    default: false
  },

  created: {
    type: Boolean,
    default: false
  },
  showConfirm: {
    type: Boolean,
    default: false
  },
  createConfirmed: {
    type: Boolean,
    default: false
  }
})

const State = mongoose.model('State', stateSchema)
export default State