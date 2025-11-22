const express = require('express')
const router = express.Router()
const groupsController = require('../controllers/groups.controllers')
const verifyJWT = require('../middleware/verifyJWT')

router.use(verifyJWT)

router.post('/createGroup', groupsController.createGroup)
router.post('/joinGroup', groupsController.joinGroup)

// ////////////////
router.get('/:groupid', groupsController.getGroup)

module.exports = router
