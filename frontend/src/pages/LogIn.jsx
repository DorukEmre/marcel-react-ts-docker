import { catMediumLogo } from '../assets/images'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useRef, useState, useEffect } from 'react'
import axios from '../api/axios'
import useAuth from '../hooks/useAuth'

const LOGIN_URL = '/api/login'

const LogIn = () => {
  const { setAuth, persist, setPersist } = useAuth()

  // To take the user back to where they came from after log in
  const navigate = useNavigate()
  const location = useLocation()
  const from = location.state?.from?.pathname || '/'

  const emailRef = useRef()
  const errRef = useRef()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errMsg, setErrMsg] = useState('')

  useEffect(() => {
    emailRef.current.focus()
  }, [])

  useEffect(() => {
    setErrMsg('')
  }, [email, password])

  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      const response = await axios.post(
        LOGIN_URL,
        JSON.stringify({ email, password }),
        {
          headers: { 'Content-Type': 'application/json' },
          withCredentials: true,
        },
      )
      // console.log('response.data', response.data)
      const { accessToken, userId } = response?.data

      setAuth({ email, accessToken, userId })

      setEmail('')
      setPassword('')

      // Take user back where they came from
      navigate(from, { replace: true })
      // navigate('/feed')
    } catch (err) {
      if (!err?.response) {
        setErrMsg('No Server Response')
      } else if (err.response?.status === 400) {
        setErrMsg('Missing Email or Password')
      } else if (err.response?.status === 401) {
        setErrMsg('Unauthorized')
      } else {
        setErrMsg('Login Failed')
      }
      errRef.current.focus()
    }
  }

  const togglePersist = () => {
    setPersist((prev) => !prev)
  }

  useEffect(() => {
    localStorage.setItem('persist', persist)
  }, [persist])

  return (
    <main id="login-page">
      <div className="login-container">
        <section className="login-logo-container">
          <Link to="/">
            <img src={catMediumLogo} alt="cat logo" />
          </Link>
        </section>
        <section className="form-panel">
          <h1>
            Log in to <span className="Marcel">Marcel</span>
          </h1>
          <p
            ref={errRef}
            className={errMsg ? 'errmsg' : 'offscreen'}
            aria-live="assertive"
          >
            {errMsg}
          </p>
          <div className="alert">
            <small>
              <p>To log in as a demo user:</p>
              <p>Email: demo@demo.com</p>
              <p>Password: Demodemo1</p>
            </small>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                ref={emailRef}
                onChange={(e) => setEmail(e.target.value)}
                required
                value={email}
                autoComplete="username"
              />
            </div>
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                onChange={(e) => setPassword(e.target.value)}
                value={password}
                required
                autoComplete="current-password"
              />
            </div>
            <button>Log In</button>
            <div className="persistCheck">
              <label htmlFor="persist">
                <input
                  type="checkbox"
                  id="persist"
                  onChange={togglePersist}
                  checked={persist}
                />
                Remember me
              </label>
            </div>
          </form>
          <p>
            New to Marcel?{' '}
            <Link to="/signup" className="">
              Sign up
            </Link>
          </p>
        </section>
      </div>
    </main>
  )
}

export default LogIn
