import mongoose from 'mongoose'

const variationSchema = new mongoose.Schema({
  scene: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Scene',
    required: true
  },
  parameter: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Parameter',
    required: true
  },
  // The list of video rows for the variation
  video_rows: [{
    name: {
      type: String,
      required: true // Ensures that every video row has a name
    },
    original_video: {
      type: String // The video URL from the "normal" variation that is being replaced
    },
    replacement_video: {
      type: String // The video URL that replaces the original video in this variation
    }
  }]
})

const Variation = mongoose.model('Variation', variationSchema)

export default Variation
