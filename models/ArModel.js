const mongoose = require('mongoose');

const ArModelSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a name'],
    trim: true,
    maxlength: [50, 'Name cannot be more than 50 characters']
  },
  description: {
    type: String,
    required: [true, 'Please add a description']
  },
  modelFile: {
    type: String,
    required: [true, 'Please upload a 3D model file']
  },
  fileType: {
    type: String,
    enum: ['glb', 'gltf', 'obj', 'usdz'],
    required: [true, 'Please specify the file type']
  },
  previewImage: {
    type: String
  },
  textures: [{
    name: {
      type: String,
      required: true
    },
    textureFile: {
      type: String,
      required: true
    }
  }],
  scale: {
    x: { type: Number, default: 1.0 },
    y: { type: Number, default: 1.0 },
    z: { type: Number, default: 1.0 }
  },
  rotation: {
    x: { type: Number, default: 0 },
    y: { type: Number, default: 0 },
    z: { type: Number, default: 0 }
  },
  module: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Module',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('ArModel', ArModelSchema); 