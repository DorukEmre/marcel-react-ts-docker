import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import ClickAwayListener from '@mui/material/ClickAwayListener'
import useLogout from '../hooks/useLogout'

const HeaderButtonExpandable = (props) => {
  const logout = useLogout()
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)

  const handleClick = () => {
    setOpen((prev) => !prev)
  }
  const handleClickAway = () => {
    setOpen(false)
  }

  let activeClassName = 'active'

  const imgsrc = props.isProfileActive
    ? props.activeImageSrc
    : props.inactiveImageSrc

  const getClassName = props.isProfileActive ? activeClassName : undefined

  const signOut = async (e) => {
    e.preventDefault()
    await logout()
    navigate('/')
  }

  return (
    <ClickAwayListener onClickAway={handleClickAway}>
      <li className="header-item after profile">
        <div
          aria-controls={open ? 'profile-menu' : undefined}
          aria-haspopup="true"
          aria-expanded={open ? 'true' : undefined}
          onClick={handleClick}
          className="header-item--div"
          tabIndex="0"
        >
          <>
            <img src={imgsrc} alt={props.imgalt} className="nav-icon" />
            <p className={getClassName}>{props.name}</p>
            <span className={getClassName}></span>
          </>
        </div>
        {open ? (
          <ul id="profile-menu">
            <li className="profile-menu--item">
              <Link
                onClick={handleClickAway}
                to={`${props.url}/me`}
                className="profile-menu--item--link"
              >
                My profile
              </Link>
            </li>
            <li className="profile-menu--item">
              <Link
                onClick={handleClickAway}
                to={`${props.url}/settings`}
                className="profile-menu--item--link"
              >
                Settings
              </Link>
            </li>
            <li className="profile-menu--item">
              <Link
                onClick={handleClickAway}
                to="/about"
                className="profile-menu--item--link"
              >
                About
              </Link>
            </li>
            <li className="profile-menu--item">
              <button
                onClick={(e) => {
                  handleClickAway()
                  signOut(e)
                }}
                className="profile-menu--item--link logout-link"
              >
                Logout
              </button>
            </li>
          </ul>
        ) : null}
      </li>
    </ClickAwayListener>
  )
}

export default HeaderButtonExpandable
