const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const User = require('../models/User.model')

exports.postSignup = async (req, res) => {
  const { username, password } = req.body
  const email = req.body.email.toLowerCase()

  if (!username || !email || !password)
    return res
      .status(400)
      .json({ message: 'Username, email and password are required.' })

  // check for duplicate usernames in the db
  const duplicateUsername = await User.findOne({
    username,
  }).exec()
  if (duplicateUsername) {
    return res.status(409).json({ message: 'Username already in use.' })
  }

  // check for duplicate emails in the db
  const duplicateEmail = await User.findOne({ email }).exec()
  if (duplicateEmail) {
    return res.status(409).json({ message: 'Email already in use.' })
  }

  try {
    //create and store the new user
    // Password is encrypted in user.model
    const result = await User.create({
      username,
      email,
      password,
    })
    // console.log('User created', result)

    res.status(201).json({ success: `New user ${username} created!`, username })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

// ////////////////

exports.postLogin = async (req, res) => {
  const { password } = req.body
  const email = req.body.email.toLowerCase()

  if (!email || !password)
    return res.status(400).json({ message: 'Email and password are required.' })

  const foundUser = await User.findOne({ email }).exec()

  if (!foundUser) return res.sendStatus(401) //Unauthorized

  // evaluate password
  const match = await bcrypt.compare(password, foundUser.password)
  // console.log('match', match)

  if (match) {
    // create JWTs
    const accessToken = jwt.sign(
      { email: foundUser.email },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: '10m' },
    )
    const refreshToken = jwt.sign(
      { email: foundUser.email },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: '5d' },
    )
    // Saving refreshToken with current user
    foundUser.refreshToken = refreshToken
    // const currentUser = { ...foundUser, refreshToken}
    const result = await foundUser.save()
    // console.log(result.username)

    // Creates Secure Cookie with refresh token (httpOnly -> not available to JS)
    res.cookie('jwt', refreshToken, {
      httpOnly: true,
      sameSite: 'None',
      secure: true,
      // secure: false, // for development localhost
      maxAge: 5 * 24 * 60 * 60 * 1000,
    })

    // Send access token to user
    // console.log('postLogin', { accessToken, userId: foundUser.id })
    res.json({ accessToken, userId: foundUser.id })
  } else {
    console.log('else res.sendStatus(401)')
    res.sendStatus(401)
  }
}

// //////////////////////

exports.handleRefreshToken = async (req, res) => {
  // console.log('req.cookies', req.cookies)
  const cookies = req.cookies
  if (!cookies?.jwt) {
    // console.log('No cookies')
    return res.sendStatus(401)
  }
  const refreshToken = cookies.jwt

  const foundUser = await User.findOne({ refreshToken }).exec()
  // console.log(
  //   'found User with the JWT as their refreshToken in the DB',
  //   foundUser,
  // )
  if (!foundUser) return res.sendStatus(403) //Forbidden

  // evaluate jwt
  jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, decoded) => {
    // console.log('decoded', decoded)
    if (err || foundUser.email !== decoded.email) {
      // console.log('foundUser.email', foundUser.email, 'decoded.email', decoded.email)
      return res.sendStatus(403)
    }

    // console.log('decoded in handleRefreshToken', decoded)
    const accessToken = jwt.sign(
      { email: decoded.email },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: '15m' },
    )
    // console.log('handleRefreshToken', { accessToken, userId: foundUser.id })
    res.json({ accessToken, userId: foundUser.id })
  })
}

// //////////////////

exports.logout = async (req, res) => {
  // On client, also delete the accessToken

  // console.log('req.cookies', req.cookies)
  const cookies = req.cookies
  if (!cookies?.jwt) {
    // console.log('No cookie found')
    return res.sendStatus(204)
  } //No content
  const refreshToken = cookies.jwt

  // Is refreshToken in db?
  const foundUser = await User.findOne({ refreshToken }).exec()
  if (!foundUser) {
    // console.log('Cookie found, but on user')
    res.clearCookie('jwt', {
      httpOnly: true,
      sameSite: 'None',
      secure: true,
      // secure: false, // for development localhost
    })
    return res.sendStatus(204)
  }

  // Delete refreshToken in db
  foundUser.refreshToken = ''
  const result = await foundUser.save()
  // console.log('User refresh token deleted:', result)

  res.clearCookie('jwt', {
    httpOnly: true,
    sameSite: 'None',
    secure: true,
    // secure: false, // for development localhost
  })
  // console.log('Cookie cleared')
  res.sendStatus(204)
}
