import mongoose from 'mongoose'
import { schemaOptions } from './options.js'

const sceneSchema = new mongoose.Schema({
  era: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Era',
    required: true
  },
  name: {
    type: String,
    required: true
  },
  desc: {
    type: String
  },
  variations: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Variation'
  }],
  uploaded_videos: [{
    type: String
    // validate: {
    //   validator: function(v) {
    //     return /https?:\/\/.+\.(mp4|webm|ogg)$/.test(v); // Example regex for video URL validation
    //   },
    //   message: props => `${props.value} is not a valid video URL!`
    // },
  }],
  coordX: {
    type: Number,
    required: true
  },
  coordY: {
    type: Number,
    required: true
  },
  zIndex: {
    type: Number,
    required: true
  },
  displayHeight: {
    type: Number,
    required: false
  },
  displayWidth: {
    type: Number,
    required: false
  },
  gravity: {
    type: Boolean,
    default: true
  },
  image_URL: {
    type: String
    // validate: {
    //   validator: function(v) {
    //     return /https?:\/\/.+\.(png|jpg|jpeg|gif)$/.test(v); // Example regex for image URL validation
    //   },
    //   message: props => `${props.value} is not a valid image URL!`
    // },
  }
}, schemaOptions)

const Scene = mongoose.model('Scene', sceneSchema)

export default Scene
