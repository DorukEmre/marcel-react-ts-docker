// Config contentSecurityPolicy

const cspDirectives = {
  directives: {
    defaultSrc: ["'self'"],
    scriptSrc: [
      "'self'",
      "'unsafe-inline'",
      "'unsafe-eval'",
      'https://maps.googleapis.com',
      'https://mapsresources-pa.googleapis.com',
    ],
    styleSrc: ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com'],
    imgSrc: [
      "'self'",
      'data:',
      'https://res.cloudinary.com',
      'https://maps.gstatic.com',
      'https://maps.googleapis.com',
      'https://mapsresources-pa.googleapis.com',
    ],
    connectSrc: [
      "'self'",
      'https://res.cloudinary.com',
      'https://maps.googleapis.com',
      'https://mapsresources-pa.googleapis.com',
    ],
    fontSrc: ["'self'", 'https://fonts.gstatic.com'],
    objectSrc: ["'none'"],
    mediaSrc: ["'self'"],
    frameSrc: ["'none'"],
  },
}

module.exports = cspDirectives
