import { Outlet } from 'react-router-dom'
import { useState, useEffect } from 'react'
import useRefreshToken from '../hooks/useRefreshToken'
import useAuth from '../hooks/useAuth'

const PersistLogin = () => {
  const [isLoading, setIsLoading] = useState(true)
  const refresh = useRefreshToken()
  const { auth, persist } = useAuth()

  useEffect(() => {
    let isMounted = true

    const verifyRefreshToken = async () => {
      try {
        // Reach out to endpoint and take cookie with it
        await refresh()
      } catch (err) {
        // console.error(err)
      } finally {
        isMounted && setIsLoading(false)
      }
    }

    // Avoids unwanted call to verifyRefreshToken
    // Only runs on page reload when we have an empty auth state
    // 'persist' to prevent unwanted call to verifyRefreshToken
    !auth?.accessToken && persist ? verifyRefreshToken() : setIsLoading(false)

    return () => (isMounted = false)
  }, [])

  useEffect(() => {
    // console.log(`isLoading: ${isLoading}`)
    // console.log(`accessToken: ${JSON.stringify(auth?.accessToken)}`)
  }, [isLoading])
  return (
    <>{!persist ? <Outlet /> : isLoading ? <p>Loading...</p> : <Outlet />}</>
  )
}

export default PersistLogin
