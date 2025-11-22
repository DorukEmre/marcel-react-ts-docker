import { useLocation, Navigate, Outlet } from 'react-router-dom'
import useAuth from '../hooks/useAuth'

const RequireAuth = () => {
  const { auth } = useAuth()
  const location = useLocation()
  // Navigate 'state' and 'replace' allows user to go back to their previous page with browser go back button
  // console.log('auth in RequireAuth', auth)

  return auth?.accessToken ? (
    <>
      <Outlet />
    </>
  ) : (
    <>
      <Navigate to="/login" state={{ from: location }} replace />
    </>
  )
}

export default RequireAuth
