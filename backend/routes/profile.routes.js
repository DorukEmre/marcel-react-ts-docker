const express = require('express')
const router = express.Router()
const upload = require('../middleware/multer')
const profileController = require('../controllers/profile.controllers')
const verifyJWT = require('../middleware/verifyJWT')

router.use(verifyJWT)

router.get('/getMyProfile', profileController.getMyProfile)
router.get('/getUserProfile/:userid', profileController.getUserProfile)

router.put(
  '/updatePicture',
  upload.single('file'),
  profileController.updatePicture,
)
// Get a user's posts on their profile page
router.get('/getPosts', profileController.getPosts)

router.put('/blockUser', profileController.blockUser)

router.delete('/deleteUser/:currentUserId', profileController.deleteUser)

module.exports = router
