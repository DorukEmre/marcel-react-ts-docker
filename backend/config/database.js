const mongoose = require('mongoose')

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.DB_STRING)

    console.log(`MongoDB Connected - ${conn.connection.host}`)
  } catch (err) {
    console.error(err)
    process.exit(1)
  }
}

const healthDB = async () => {
  const mapState = (s) => {
    switch (s) {
      case 0:
        return 'disconnected'
      case 1:
        return 'connected'
      case 2:
        return 'connecting'
      case 3:
        return 'disconnecting'
      default:
        return 'unknown'
    }
  }

  try {
    const state = mongoose.connection.readyState
    return { readyState: state, status: mapState(state) }

  } catch (err) {
    return { error: err.message }
  }
}

module.exports = { connectDB, healthDB }
