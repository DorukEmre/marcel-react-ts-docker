const mongoose = require('mongoose')

const ReportSchema = new mongoose.Schema({
  method: String,
  reportedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },

  createdAt: { type: Date, default: Date.now },

  reportedUser: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },

  reportedPost: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Post',
  },

  reportedComment: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Comment',
  },
})

module.exports = mongoose.model('Report', ReportSchema)
