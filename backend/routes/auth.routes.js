const express = require('express')
const router = express.Router()
const authController = require('../controllers/auth.controllers')

router.post('/signup', authController.postSignup)
router.post('/login', authController.postLogin)
router.get('/refresh', authController.handleRefreshToken)
router.get('/logout', authController.logout)

module.exports = router
