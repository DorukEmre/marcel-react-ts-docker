const resizeAndCloudinary = require('../middleware/resize')
// const nodemailer = require('../middleware/sendEmail')

const Post = require('../models/Post.model')
const Comment = require('../models/Comment.model')
const User = require('../models/User.model')
const Report = require('../models/Report.model')

module.exports = {
  getFeed: async (req, res) => {
    try {
      const count = await Post.estimatedDocumentCount()
      const page = Number(req.params.pagenum)
      const perPage = 10

      const foundUser = await User.findOne({ email: req.user })

      const posts = await Post.find({
        user: { $nin: foundUser.blockedUsers },
        hiddenBy: { $ne: foundUser.id },
      })
        .skip((page - 1) * perPage)
        .limit(perPage)
        .sort({ createdAt: 'desc' })
        .populate('user')
        .lean()

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

  getPost: async (req, res) => {
    if (!req?.params?.postid)
      return res.status(400).json({ message: 'Post ID required.' })

    const post = await Post.findById(req.params.postid).populate('user').lean()

    if (!post) {
      return res
        .status(204)
        .json({ message: `No post matches ID ${req.params.postid}.` })
    }

    // const comments = await Comment.find({ postId: req.params.postid })
    //   .sort({ createdAt: 'asc' })
    //   .populate('user')
    //   .lean()

    res.json(post)
    // res.render('post.ejs', { post, comments, user: req.user, active })
  },

  createPost: async (req, res) => {
    try {
      // console.log('req.user', req.user)
      // console.log('req.file', req.file)
      // console.log('req.body', req.body)
      // console.log('req.body.exifJSON', JSON.parse(req.body.exif))

      const result = await resizeAndCloudinary(req, 800, 'posts')

      const foundUser = await User.findOne({ email: req.user })

      await Post.create({
        catName: req.body.catName,
        latitude: req.body.latitude,
        longitude: req.body.longitude,
        showLocation: req.body.showLocation,
        exifJSON: req.body.exifData,
        imageUrl: result.secure_url,
        cloudinaryId: result.public_id,
        caption: req.body.comment,
        user: foundUser.id,
      })
      console.log('New post added')
      res.sendStatus(201)
    } catch (err) {
      console.log(err)
    }
  },

  likePost: async (req, res) => {
    try {
      // console.log(req.user)
      const postid = req.params.postid
      const userId = req.body.currentUserId
      const likedPost = await Post.findById(postid).lean()
      // console.log(likedPost)

      if (likedPost.greatCat.find((x) => x == userId) == undefined) {
        await Post.findOneAndUpdate(
          { _id: postid },
          { $push: { greatCat: userId } },
        )
        console.log('Likes +1')
      } else {
        await Post.findOneAndUpdate(
          { _id: postid },
          { $pull: { greatCat: userId } },
        )
        console.log('Likes -1')
      }
      const updatedPost = await Post.findById(postid).lean()

      res.status(200).json({ updatedPost })
    } catch (err) {
      console.log(err)
    }
  },

  toggleLocation: async (req, res) => {
    try {
      const postid = req.params.postid
      const userId = req.body.currentUserId
      const postToUpdate = await Post.findById(postid).lean()

      // Check if user making request is owner of post (just in case)
      if (postToUpdate.user == userId) {
        await Post.findOneAndUpdate(
          { _id: postid },
          // set showLocation to true if it is false, and to false if it is any other value.
          [{ $set: { showLocation: { $eq: [false, '$showLocation'] } } }],
        )
        console.log('showLocation toggled')
      }

      const updatedPost = await Post.findById(postid).lean()

      res.status(200).json({ updatedPost })
    } catch (err) {
      console.log(err)
    }
  },

  getComments: async (req, res) => {
    try {
      // console.log('req.params', req.params.postid)
      // const post = await Post.findById(req.params.postid).populate('user').lean()

      const comments = await Comment.find({ postId: req.params.postid })
        .sort({ createdAt: 'asc' })
        .populate('user')
        .lean()

      // const data = { post, comments }
      // console.log('data_getComments', comments)

      res.status(200).json(comments)
    } catch (err) {
      console.log(err)
    }
  },

  createComment: async (req, res) => {
    try {
      // console.log(req.body)
      // console.log(req.user)

      const foundUser = await User.findOne({ email: req.user })
      // console.log('foundUser', foundUser)
      await Comment.create({
        comment: req.body.newComment,
        user: foundUser.id,
        postId: req.params.postid,
      })
      const comments = await Comment.find({ postId: req.params.postid })
        .sort({ createdAt: 'asc' })
        .populate('user')
        .lean()

      res.status(201).json(comments)
    } catch (err) {
      console.log(err)
    }
  },

  hidePost: async (req, res) => {
    try {
      // console.log(req.user)
      const postid = req.params.postid
      const userId = req.body.currentUserId

      const hiddenPost = await Post.findOneAndUpdate(
        { _id: postid },
        { $push: { hiddenBy: userId } },
        { new: true },
      )
      // console.log(`---HIDDEN ${postid} to ${userId}`)
      // console.log('hiddenPost', hiddenPost)

      await Report.create({
        method: 'hidePost',
        reportedBy: userId,
        reportedPost: postid,
        reportedUser: hiddenPost.user,
      })

      // await nodemailer.sendReportEmail('Post reported')

      res.sendStatus(204)
    } catch (err) {
      console.log(err)
    }
  },
}
