const allowedOrigins = require('./allowedOrigins')

// Configuring CORS w/ Dynamic Origin
//  This function will be passed a string that is the origin (or undefined if the request has no origin), and a callback with the signature callback(error, origin).
const corsOptions = {
  origin: (origin, callback) => {
    //  console.log(`debugging CORS origin: ${origin}`)
    //  console.log(`allowedOrigins: ${allowedOrigins}`)
    if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
      // set origin to true to reflect the request origin, as defined by req.header('Origin')
      callback(null, true)
    } else {
      // set it to false to disable CORS.
      //  console.error('Not allowed by CORS:', origin)
      callback(new Error('Not allowed by CORS'))
    }
  },

  credentials: true,
  optionsSuccessStatus: 200,
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}

module.exports = corsOptions
