const resizeAndCloudinary = require('../middleware/resize')
// const nodemailer = require('../middleware/sendEmail')

const User = require('../models/User.model')
const Post = require('../models/Post.model')
const Report = require('../models/Report.model')

module.exports = {
  getMyProfile: async (req, res) => {
    // console.log('req.body', req.body)
    // console.log('req.user', req.user)
    try {
      const foundUser = await User.findOne({ email: req.user })

      res.status(200).json({
        profilePicUrl: foundUser.profilePicUrl,
        username: foundUser.username,
      })
    } catch (err) {
      console.log(err)
    }
  },

  updatePicture: async (req, res) => {
    // console.log('req.file', req.file)
    // console.log('req.body', req.body)
    // console.log('req.user', req.user)
    try {
      const result = await resizeAndCloudinary(req, 300, 'profile')

      // console.log('result', result)

      // .findOneAndUpdate({filter parameter}, {update}, {new:true returns the updated document} )
      let foundUser = await User.findOneAndUpdate(
        {
          email: req.user,
        },
        {
          profilePicUrl: result.secure_url,
          cloudinaryId: result.public_id,
        },
        {
          new: true,
        },
      )
      // console.log('Profile pic updated')
      res.status(200).json({ profilePicUrl: foundUser.profilePicUrl })
    } catch (err) {
      console.log(err)
    }
  },

  getPosts: async (req, res) => {
    // console.log('req.query', req.query)
    try {
      const count = await Post.countDocuments({ user: req.query.user })
      const page = Number(req.query.pagenum)
      const perPage = 10

      const posts = await Post.find({
        user: req.query.user,
        hiddenBy: { $ne: req.query.currentUserId },
      })
        .skip((page - 1) * perPage)
        .limit(perPage)
        .sort({ createdAt: 'desc' })
        .populate('user')
        .lean()
      // console.log('posts', posts)
      const info = {
        count,
        pages: Math.ceil(count / perPage),
        next: page < count / perPage ? page + 1 : null,
      }
      res.status(200).json({ info, posts })
    } catch (err) {
      console.log(err)
    }
  },

  getUserProfile: async (req, res) => {
    // console.log('req.body', req.body)
    // console.log('req.user', req.user)
    // console.log('req.params', req.params)
    try {
      const foundUser = await User.findById(req.params.userid)
      res.status(200).json({
        profilePicUrl: foundUser.profilePicUrl,
        username: foundUser.username,
      })
    } catch (err) {
      console.log(err)
    }
  },

  blockUser: async (req, res) => {
    // console.log('req.body', req.body)
    // console.log('req.user', req.user)
    try {
      const foundUser = await User.findOne({ email: req.user })
      const userToBlock = await User.findOne({ _id: req.body.blockedUser._id })

      if (foundUser.id != req.body.currentUserId) res.sendStatus(400)

      await User.findOneAndUpdate(
        { _id: foundUser.id },
        { $push: { blockedUsers: userToBlock.id } },
      )

      await Report.create({
        method: 'blockUser',
        reportedBy: foundUser.id,
        reportedPost: req.body.postId,
        reportedUser: userToBlock.id,
      })

      // await nodemailer.sendReportEmail('User reported')

      res.sendStatus(204)
    } catch (err) {
      console.log(err)
    }
  },
  deleteUser: async (req, res) => {
    // console.log('req.user', req.user)
    // console.log('req.params', req.params)
    try {
      const foundUser = await User.findOne({ email: req.user })
      const userToDelete = await User.findById(req.params.currentUserId)

      if (!foundUser || !userToDelete)
        return res.sendStatus(404)

      // check requester is the same as the target user
      if (foundUser.id !== userToDelete.id)
        return res.sendStatus(403)

      // delete user posts
      await Post.deleteMany({ user: userToDelete.id })

      // delete user
      const deletedUser = await User.findOneAndDelete({ _id: foundUser.id })
      return deletedUser ? res.sendStatus(200) : res.sendStatus(400)

    } catch (err) {
      console.log(err)
      res.sendStatus(400)
    }
  },
}
