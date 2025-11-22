import axios from 'axios'

const domain = window.location.hostname
let serverLoc
if (domain === 'www.marcelthecat.com') {
  serverLoc = 'https://www.marcelthecat.com'
}

const BASE_URL =
  process.env.NODE_ENV === 'production' ? serverLoc : 'http://localhost:9191'

export default axios.create({
  baseURL: BASE_URL,
})

export const axiosPrivate = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true,
})
