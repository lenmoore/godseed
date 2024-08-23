import mongoose from 'mongoose'

const stateSchema = new mongoose.Schema({
  created: {
    type: Boolean,
    default: false
  }
})

const State = mongoose.model('State', stateSchema)
export default State