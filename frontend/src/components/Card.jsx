import React, { useState } from 'react'
import Collapsible from 'react-collapsible'
import { Link } from 'react-router-dom'
import {
  closeIcon,
  commentIcon,
  likeFalseIcon,
  likeTrueIcon,
  menuIcon,
  locationOffIcon,
  locationOnIcon,
} from '../assets/icons'
import { profileInactive } from '../assets/nav_icons'
import Comments from '../components/Comments'
import MenuPopper from './MenuPopper'

const Card = React.forwardRef(({ post, ...props }, ref) => {
  const [anchorPopper, setAnchorPopper] = useState(null)
  const [openMenuPopper, setOpenMenuPopper] = useState(false)

  const handleOpenMenu = (event) => {
    setAnchorPopper(event.currentTarget)
    setOpenMenuPopper((prev) => !prev)
  }

  let hasValidGps =
    Number.isFinite(Number(post.longitude)) &&
    Number.isFinite(Number(post.latitude))

  return (
    <li className="card" ref={typeof ref !== 'undefined' ? ref : null}>
      {props.ownProfile ? (
        <>
          <button
            aria-describedby="menu"
            type="button"
            className={`toggle-location-button ${
              post.showLocation ? 'location-on' : 'location-off'
            } ${!hasValidGps ? 'no-gps' : null}`}
            onClick={
              hasValidGps
                ? (e) => props.handleToggleLocation(e, post._id)
                : null
            }
          >
            <img
              src={post.showLocation ? locationOnIcon : locationOffIcon}
              alt=""
              height="24px"
              width="24px"
            />
          </button>
          <p className="toggle-location-tooltip">
            {(() => {
              if (!hasValidGps) {
                return 'No GPS data available'
              } else if (post.showLocation) {
                return 'Deactivate to hide location on map'
              } else {
                return 'Activate to show location on map'
              }
            })()}
          </p>
        </>
      ) : (
        <section className="card--header-container">
          <div className="card--header-text">
            <Link
              to={`../../profile/${post.user._id}`}
              className="card--username-wrapper"
            >
              <img
                src={
                  typeof post.user.profilePicUrl !== 'undefined'
                    ? `${post.user.profilePicUrl.slice(
                        0,
                        49,
                      )}/w_72,h_72,c_scale${post.user.profilePicUrl.slice(49)}`
                    : profileInactive
                }
                alt="user profile picture"
                className="card--username--avatar"
              />
              {props.userIsDemo ? (
                <span className="card--username--name">
                  Anonymised for demo
                </span>
              ) : (
                <span className="card--username--name">
                  {post.user.username}
                </span>
              )}
            </Link>
          </div>
          {post.user._id === props.currentUserId ? null : (
            <button
              aria-describedby="menu"
              type="button"
              onClick={handleOpenMenu}
              className="card--popup-menu-button icon-button"
              tabIndex="0"
            >
              <img src={menuIcon} alt="" height="24px" width="24px" />
            </button>
          )}
          <MenuPopper
            anchorPopper={anchorPopper}
            openMenuPopper={openMenuPopper}
            setOpenMenuPopper={setOpenMenuPopper}
            post={post}
            setPosts={props.setPosts}
            handleClose={props.handleClose ? props.handleClose : false}
            currentUserId={props.currentUserId}
            userIsDemo={props.userIsDemo}
            id="menu"
            className="card--popup-menu"
          />

          {typeof props.handleClose !== 'undefined' ? (
            <button
              className="card--close-button close-button icon-button"
              onClick={props.handleClose}
            >
              <img src={closeIcon} alt="" height="24px" width="24px" />
            </button>
          ) : null}
        </section>
      )}

      <section className="card--image-container">
        <img
          className=""
          src={`${post.imageUrl.slice(0, 49)}/w_${props.imageXY},h_${
            props.imageXY
          },c_scale${post.imageUrl.slice(49)}`}
          alt="cat picture"
          loading="lazy"
        />
      </section>

      <section className="card--like-container">
        <form
          className="like-button icon-button"
          onClick={(e) => props.handleToggleLike(e, post._id)}
        >
          <button className="like-button icon-button">
            {post.greatCat.find((x) => x == props.currentUserId) !=
            undefined ? (
              <img className="" src={likeTrueIcon} height="24px" width="24px" />
            ) : (
              <img
                className=""
                src={likeFalseIcon}
                height="24px"
                width="24px"
              />
            )}
          </button>
        </form>
        <span className="like-number">{post.greatCat.length}</span>
      </section>

      <section className="card--comments-container">
        <Collapsible
          trigger={
            <>
              <p className="caption">{post.caption}</p>
              <button className="open-comments icon-button" data-id={post._id}>
                <img src={commentIcon} alt="" height="24px" width="24px" />
              </button>
            </>
          }
          triggerWhenOpen={
            <>
              <p className="caption">{post.caption}</p>
              <button className="close-button icon-button" data-id={post._id}>
                <img src={closeIcon} alt="" height="24px" width="24px" />
              </button>
            </>
          }
          onOpening={() => {
            props.getComments(post._id)
          }}
        >
          <Comments
            postId={post._id}
            comments={
              props.allComments &&
              props.allComments.find((obj) => obj.postId === post._id)
                ? props.allComments.find((obj) => obj.postId === post._id)
                    .comments
                : []
            }
            setAllComments={props.setAllComments}
            userIsDemo={props.userIsDemo}
          />
        </Collapsible>
      </section>
    </li>
  )
})

export default Card
