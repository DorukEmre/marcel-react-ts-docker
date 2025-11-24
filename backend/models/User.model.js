const bcrypt = require('bcrypt')
const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema({
  username: { type: String, unique: true, required: true },
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  signUpDate: { type: Date, default: Date.now },
  lastLoginDate: { type: Date, default: Date.now },
  refreshToken: String,
  profilePicUrl: { type: String },
  cloudinaryId: { type: String },
  blockedUsers: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  ],
})

// Password hash middleware

UserSchema.pre('save', async function save() {
  const user = this
  if (!user.isModified('password')) {
    return
  }
  const salt = await bcrypt.genSalt(10)
  user.password = await bcrypt.hash(user.password, salt)
})

module.exports = mongoose.model('User', UserSchema)
