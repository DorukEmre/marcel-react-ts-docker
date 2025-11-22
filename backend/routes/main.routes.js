const express = require('express')
const router = express.Router()
const groupsController = require('../controllers/groups.controllers')
const exploreController = require('../controllers/explore.controllers')
const postsController = require('../controllers/posts.controllers')
const verifyJWT = require('../middleware/verifyJWT')

router.use(verifyJWT)

// GET posts from all users
router.get('/feed/:pagenum', postsController.getFeed)
// GET page to manage groups
router.get('/groups', groupsController.getGroups)
// GET page to explore map of cats in the neighborhood
router.get('/explore', exploreController.getExplore)

module.exports = router
