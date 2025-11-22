import { Link, useMatch } from 'react-router-dom'
import { useEffect, useState } from 'react'
import useAuth from '../hooks/useAuth'
import HeaderButton from './HeaderButton'
import HeaderButtonExpandable from './HeaderButtonExpandable'
import {
  feedActive,
  feedInactive,
  exploreActive,
  exploreInactive,
  groupsActive,
  groupsInactive,
  spotActive,
  spotInactive,
  profileActive,
  profileInactive,
} from '../assets/nav_icons'

const Header = () => {
  const { auth } = useAuth()
  const isUserLoggedIn = auth?.accessToken

  const [isProfileActive, setIsProfileActive] = useState(false)
  const isProfileRoute = useMatch('/profile/*')

  useEffect(() => {
    isProfileRoute ? setIsProfileActive(true) : setIsProfileActive(false)
  }, [isProfileRoute])

  const categories = [
    {
      name: 'Feed',
      activeImage: feedActive,
      inactiveImage: feedInactive,
      isExpandable: false,
    },
    {
      name: 'Explore',
      activeImage: exploreActive,
      inactiveImage: exploreInactive,
      isExpandable: false,
    },
    {
      name: 'Spot',
      activeImage: spotActive,
      inactiveImage: spotInactive,
      isExpandable: false,
    },
    {
      name: 'Groups',
      activeImage: groupsActive,
      inactiveImage: groupsInactive,
      isExpandable: false,
    },
    {
      name: 'Profile',
      activeImage: profileActive,
      inactiveImage: profileInactive,
      isExpandable: true,
    },
  ]

  return (
    <header>
      <nav className={`header-navbar ${!isUserLoggedIn ? 'slim' : ''}`}>
        {isUserLoggedIn ? (
          <ul className="header-list">
            {categories.map((categ) =>
              !categ.isExpandable ? (
                <HeaderButton
                  key={categ.name}
                  url={categ.name.toLowerCase()}
                  activeImageSrc={categ.activeImage}
                  inactiveImageSrc={categ.inactiveImage}
                  imgalt={`${categ.name} icon`}
                  name={categ.name}
                />
              ) : (
                <HeaderButtonExpandable
                  key={categ.name}
                  url={categ.name.toLowerCase()}
                  activeImageSrc={categ.activeImage}
                  inactiveImageSrc={categ.inactiveImage}
                  imgalt={`${categ.name} icon`}
                  name={categ.name}
                  isProfileActive={isProfileActive}
                />
              ),
            )}
          </ul>
        ) : (
          <ul className="header-list new-session">
            <li className="header-item demo">
              <Link to="/login" className="header-item--link">
                Log in as demo user
              </Link>
            </li>
            <li className="header-item login">
              <Link to="/login" className="header-item--link">
                Log in
              </Link>
            </li>
            <li className="header-item signup">
              <Link to="/signup" className="header-item--link">
                Sign up
              </Link>
            </li>
          </ul>
        )}
      </nav>
    </header>
  )
}

export default Header
