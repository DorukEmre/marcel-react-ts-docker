const express = require('express')
const app = express()
const session = require('express-session')
const MongoStore = require('connect-mongo')
const logger = require('morgan')
const path = require('path')
const cors = require('cors')
const helmet = require('helmet')
const cookieParser = require('cookie-parser')

const { connectDB, healthDB } = require('./config/database')
const corsOptions = require('./config/corsOptions')
const cspDirectives = require('./config/cspConfig')

const authRoutes = require('./routes/auth.routes')
const mainRoutes = require('./routes/main.routes')
const postsRoutes = require('./routes/posts.routes')
const groupsRoutes = require('./routes/groups.routes')
const profileRoutes = require('./routes/profile.routes')


// Use .env file
require('dotenv').config()

// Body parsing
// extended option: false to parse the URL-encoded data with the query string library; true allows to parse nested JSON like objects and arrays (qs library)
app.use(express.urlencoded({ extended: true }))

// Helmet middleware for setting security headers
app.use(helmet({ contentSecurityPolicy: cspDirectives }))

// Redirect HTTP to HTTPS
// if (process.env.NODE_ENV === 'production') {
//   app.use((req, res, next) => {
//     if (req.headers['x-forwarded-proto'] !== 'https') {
//       return res.redirect(301, 'https://' + req.headers.host + req.url)
//     }
//     next()
//   })
// }

// Cross Origin Resource Sharing
app.use(cors(corsOptions))

app.use(express.json())

// Logging
app.use(logger('dev'))

// Cookies
app.use(cookieParser())

// Setup sessions - stored in MongoDB
app.use(
  session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ mongoUrl: process.env.DB_STRING }),
  }),
)

// Set up routes
app.use('/api/', authRoutes)
app.use('/api/', mainRoutes)
// (Every route thereafter will use verifyJWT) - added directly to routes files instead
// app.use(verifyJWT)
app.use('/api/posts', postsRoutes)
app.use('/api/groups', groupsRoutes)
app.use('/api/profile', profileRoutes)

// Health Check Endpoint
app.get('/', async (req, res) => {
  try {
    const dbStatus = await healthDB()

    res.json({
      status: 'ok',
      database: dbStatus,
    })
  } catch (err) {
    res.status(500).json({ status: 'error', error: err.message })
  }
})

// Server Running
// If connection to database is successful, listen for requests
connectDB().then(() => {

  const port = process.env.PORT || 8000

  app.listen(port, () => {
    console.log(`Server is running on port ${port} -`)
  })
})
