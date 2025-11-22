import { useState, useEffect } from 'react'
import { Link, useNavigate, useLocation, Outlet } from 'react-router-dom'
import useAxiosPrivate from '../hooks/useAxiosPrivate'
import useLogout from '../hooks/useLogout'

const Profile = () => {
  return (
    <>
      <Outlet />
    </>
  )
}

export default Profile
