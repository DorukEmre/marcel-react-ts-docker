const jwt = require('jsonwebtoken')

const verifyJWT = (req, res, next) => {
  const authHeader = req.headers.authorization || req.headers.Authorization

  if (!authHeader?.startsWith('Bearer ')) return res.sendStatus(401)

  const token = authHeader.split(' ')[1]
  // console.log('token in verifyJWT', token)

  try {
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
    req.user = decoded.email
    return next()

  } catch (err) {
    return res.sendStatus(403)
  }
}

module.exports = verifyJWT
