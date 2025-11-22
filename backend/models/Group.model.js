const mongoose = require('mongoose')

const GroupSchema = new mongoose.Schema({
  groupName: { type: String, required: true },
  description: { type: String, default: '' },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  createdAt: { type: Date, default: Date.now },
  members: [
    {
      // user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      // },
      // joinedDate: { type: Date, default: Date.now },
    },
  ],
  membersToApprove: [
    {
      // user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      // },
      // joinedDate: { type: Date, default: Date.now },
    },
  ],
})

module.exports = mongoose.model('Group', GroupSchema)
