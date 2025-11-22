import { NavLink } from 'react-router-dom'

const HeaderButton = (props) => {
  let activeClassName = 'active'

  return (
    <li className="header-item after">
      <NavLink to={props.url} className="header-item--link">
        {({ isActive }) => {
          const imgsrc = isActive
            ? props.activeImageSrc
            : props.inactiveImageSrc

          const getClassName = isActive ? activeClassName : undefined
          return (
            <>
              <img src={imgsrc} alt={props.imgalt} className="nav-icon" />
              <p className={getClassName}>{props.name}</p>
              <span className={getClassName}></span>
            </>
          )
        }}
      </NavLink>
    </li>
  )
}

export default HeaderButton
