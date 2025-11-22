const mongoose = require('mongoose')

// const ImageSchema = new mongoose.Schema({
//   url: { type: String, require: true },
//   cloudinaryId: { type: String, require: true },
//   GPS: { type: String, default: 'no GPS data' },
// })

const PostSchema = new mongoose.Schema({
  catName: { type: String },
  imageUrl: { type: String, require: true },
  cloudinaryId: { type: String, require: true },
  longitude: { type: String },
  latitude: { type: String },
  showLocation: { type: Boolean },
  exifJSON: { type: String },
  caption: { type: String },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  createdAt: { type: Date, default: Date.now },
  greatCat: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  ],
  hiddenBy: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  ],
  reports: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      date: Date,
    },
  ],
  hidden: { type: Boolean, default: false },
})

module.exports = mongoose.model('Post', PostSchema)
