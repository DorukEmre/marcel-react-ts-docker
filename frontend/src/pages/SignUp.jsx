import { catMediumLogo } from '../assets/images'
import { Link } from 'react-router-dom'
import { useRef, useState, useEffect } from 'react'
import axios from '../api/axios'

const USERNAME_REGEX = /^[A-z0-9-_]{3,23}$/
const EMAIL_REGEX =
  /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
// const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,24}$/
const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9]).{8,24}$/
const SIGNUP_URL = '/api/signup'

const SignUp = () => {
  // Set focus on email input when component loads
  const emailRef = useRef()
  // Set focus on error so it can be announced to screen readers for accesibility
  const errRef = useRef()

  const [username, setUsername] = useState('')
  // Does name validate or not
  const [validUsername, setValidUsername] = useState(false)
  // Do we have focus on input field
  const [usernameFocus, setUsernameFocus] = useState(false)

  const [email, setEmail] = useState('')
  const [validEmail, setValidEmail] = useState(false)
  const [emailFocus, setEmailFocus] = useState(false)

  const [password, setPassword] = useState('')
  const [validPassword, setValidPassword] = useState(false)
  const [passwordFocus, setPasswordFocus] = useState(false)

  const [matchPassword, setMatchPassword] = useState('')
  const [validMatch, setValidMatch] = useState(false)
  const [matchFocus, setMatchFocus] = useState(false)

  const [errMsg, setErrMsg] = useState('')
  // Did form succesfully submit
  const [success, setSuccess] = useState(false)

  // Set focus on username input when component loads
  useEffect(() => {
    emailRef.current.focus()
  }, [])

  // Check validity any time state of user changes by testing against username regex
  useEffect(() => {
    setValidUsername(USERNAME_REGEX.test(username))
  }, [username])

  useEffect(() => {
    setValidEmail(EMAIL_REGEX.test(email))
  }, [email])

  // Test valid password against password regex and compare password to match password
  useEffect(() => {
    setValidPassword(PASSWORD_REGEX.test(password))
    setValidMatch(password === matchPassword)
  }, [password, matchPassword])

  // Clear error message any time user makes a change
  useEffect(() => {
    setErrMsg('')
  }, [username, email, password, matchPassword])

  const handleSubmit = async (e) => {
    e.preventDefault()
    // if button enabled with JS hack
    const v1 = USERNAME_REGEX.test(username)
    const v2 = EMAIL_REGEX.test(email)
    const v3 = PASSWORD_REGEX.test(password)
    if (!v1 || !v2 || !v3) {
      setErrMsg('Invalid Entry')
      return
    }
    try {
      const response = await axios.post(
        SIGNUP_URL,
        JSON.stringify({ username, email, password }),
        {
          headers: { 'Content-Type': 'application/json' },
          withCredentials: true,
        },
      )
      // console.log(response?.data)
      // console.log(response?.accessToken)
      // console.log(response)
      setSuccess(true)
      //clear state and controlled inputs
      //need value attrib on inputs for this
      setUsername('')
      setEmail('')
      setPassword('')
      setMatchPassword('')
    } catch (err) {
      // console.log('err.', err.response)
      if (!err?.response) {
        setErrMsg('No Server Response')
      } else if (err.response?.status === 409) {
        setErrMsg(err.response.data.message)
      } else {
        setErrMsg('Registration Failed')
      }
      errRef.current.focus()
    }
  }

  return (
    <main id="signup-page">
      <div className="signup-container">
        <section className="signup-logo-container">
          <Link to="/">
            <img src={catMediumLogo} alt="cat logo" />
          </Link>
        </section>
        {success ? (
          <section>
            <h1>Welcome to Marcel!</h1>
            <p>Account created</p>
            <br />
            <p>
              <Link to="/login" className="global-button">
                Please log in
              </Link>
            </p>
          </section>
        ) : (
          <section className="form-panel">
            <h1>
              Sign up to <span className="Marcel">Marcel</span>
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
                <p>Website under construction</p>
                <p>Things might change. Things might break.</p>
              </small>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  id="email"
                  onChange={(e) => setEmail(e.target.value)}
                  value={email}
                  ref={emailRef}
                  aria-describedby="emailalert"
                  aria-invalid={validEmail ? 'false' : 'true'}
                  onFocus={() => setEmailFocus(true)}
                  onBlur={() => setEmailFocus(false)}
                  required
                  autoComplete="username"
                />
                <p
                  id="emailalert"
                  className={
                    !emailFocus && email && !validEmail
                      ? 'instructions'
                      : 'offscreen'
                  }
                >
                  Please check you have entered your email correctly.
                </p>
              </div>

              <div className="form-group">
                <label htmlFor="display-name">Display name</label>
                <input
                  type="text"
                  id="display-name"
                  name="display-name"
                  autoComplete="off"
                  onChange={(e) => setUsername(e.target.value)}
                  value={username}
                  required
                  aria-invalid={validUsername ? 'false' : 'true'}
                  aria-describedby="userhelp useralert"
                  onFocus={() => setUsernameFocus(true)}
                  onBlur={() => setUsernameFocus(false)}
                />
                <p
                  id="useralert"
                  className={
                    (!usernameFocus && username && !validUsername) ||
                    (usernameFocus && username.length > 3 && !validUsername)
                      ? 'instructions'
                      : 'offscreen'
                  }
                >
                  Please check you have entered a valid user name.
                </p>
                <p
                  id="useralert"
                  className={
                    (!usernameFocus && username && !validUsername) ||
                    (usernameFocus && username.length > 3 && !validUsername)
                      ? 'instructions'
                      : 'offscreen'
                  }
                >
                  4 to 24 characters; letters, numbers, underscores, and hyphens
                  allowed
                </p>
              </div>

              <div className="form-group">
                <label htmlFor="password">Password</label>
                <input
                  type="password"
                  id="password"
                  onChange={(e) => setPassword(e.target.value)}
                  value={password}
                  required
                  aria-invalid={validPassword ? 'false' : 'true'}
                  aria-describedby="passwordHelp passwordnote"
                  onFocus={() => setPasswordFocus(true)}
                  onBlur={() => setPasswordFocus(false)}
                  autoComplete="new-password"
                />
                <p
                  id="passwordnote"
                  className={
                    !passwordFocus && password && !validPassword
                      ? 'instructions'
                      : 'offscreen'
                  }
                >
                  Please check your password is valid
                </p>
                <p
                  id="passwordnote"
                  className={
                    !passwordFocus && password && !validPassword
                      ? 'instructions'
                      : 'offscreen'
                  }
                >
                  Must contain: 8 to 24 characters; uppercase and lowercase
                  letters; number
                </p>
              </div>

              <div className="form-group">
                <label htmlFor="confirmPassword">Confirm password</label>
                <input
                  type="password"
                  id="confirmPassword"
                  onChange={(e) => setMatchPassword(e.target.value)}
                  value={matchPassword}
                  required
                  aria-invalid={validMatch ? 'false' : 'true'}
                  aria-describedby="confirmnote"
                  onFocus={() => setMatchFocus(true)}
                  onBlur={() => setMatchFocus(false)}
                  autoComplete="new-password"
                />
                <p
                  id="confirmnote"
                  className={
                    (matchFocus && !validMatch) ||
                    (matchPassword && !validMatch)
                      ? 'instructions'
                      : 'offscreen'
                  }
                >
                  Passwords do not match.
                </p>
              </div>
              <button
                disabled={
                  !validUsername || !validEmail || !validPassword || !validMatch
                    ? true
                    : false
                }
                className={
                  !validUsername || !validEmail || !validPassword || !validMatch
                    ? 'disabled'
                    : ''
                }
              >
                Sign Up
              </button>
            </form>
            <p>
              Already have an account?{' '}
              <Link to="/login" className="">
                Log in
              </Link>
            </p>
            <p className="alert" style={{ paddingBottom: '0' }}>
              You can also log in as a demo user
            </p>
          </section>
        )}
      </div>
    </main>
  )
}

export default SignUp
