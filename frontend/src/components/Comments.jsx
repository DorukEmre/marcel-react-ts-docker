import { useState } from 'react'
import BasicModal from '../components/BasicModal'
import useAxiosPrivate from '../hooks/useAxiosPrivate'
import { sendCommentIcon } from '../assets/icons'
import { profileInactive } from '../assets/nav_icons'

const Comments = (props) => {
  const axiosPrivate = useAxiosPrivate()
  const [newComment, setNewComment] = useState('')

  const [openDemoUserModal, setOpenDemoUserModal] = useState(false)
  const handleOpenDemoUserModal = (e) => {
    e.preventDefault()
    setOpenDemoUserModal(true)
  }
  const handleCloseDemoUserModal = () => setOpenDemoUserModal(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    // Don't allow submit if demo user
    if (props.userIsDemo) return

    let isMounted = true
    const controller = new AbortController()

    // console.log(newComment)

    try {
      const response = await axiosPrivate.post(
        `api/posts/createComment/${props.postId}`,
        JSON.stringify({ newComment }),
        {
          signal: controller.signal,
        },
      )
      // console.log('response?.data', response?.data)

      isMounted &&
        props.setAllComments((oldComments) =>
          oldComments.map((obj) =>
            obj.postId === props.postId
              ? { ...obj, comments: response.data }
              : obj,
          ),
        )

      isMounted && setNewComment('')
    } catch (err) {
      console.log(err)
    }

    return () => {
      isMounted = false
      controller.abort()
    }
  }

  return (
    <section className="comments-container">
      <ul className="comments-list">
        {props.comments &&
          props.comments.map((comment) => (
            <li className="comments-line" key={comment._id}>
              <div className="comments--header-text">
                <div className="comments--username-wrapper">
                  <img
                    src={
                      typeof comment.user.profilePicUrl !== 'undefined'
                        ? `${comment.user.profilePicUrl.slice(
                            0,
                            49,
                          )}/w_72,h_72,c_scale${comment.user.profilePicUrl.slice(
                            49,
                          )}`
                        : profileInactive
                    }
                    alt="user profile picture"
                    className="comments--username--avatar"
                  />
                  <div>
                    <p className="comments--username--name">
                      {comment.user.username}
                      <span className="comments--username--date"></span>
                    </p>
                    <p className="comments--comment">{comment.comment}</p>
                  </div>
                </div>
              </div>
            </li>
          ))}
      </ul>
      <form
        className="create-comment"
        onSubmit={(e) =>
          props.userIsDemo ? handleOpenDemoUserModal(e) : handleSubmit(e)
        }
      >
        <label htmlFor="comment--input" className="create-comment--label">
          <input
            type="text"
            rows="2"
            className="create-comment--input"
            id="comment--input"
            placeholder="Add a comment"
            onChange={(e) => setNewComment(e.target.value)}
            value={newComment}
            required
          />
        </label>

        <button className="send-button icon-button">
          <img className="" src={sendCommentIcon} height="24px" width="24px" />
        </button>

        <BasicModal
          openModal={openDemoUserModal}
          handleCloseModal={handleCloseDemoUserModal}
          className="confirmation-modal"
          modalMsg="Feature disabled for demo user"
          displayButton={true}
          buttonClass="close-modal"
          buttonText="OK"
        />
      </form>
    </section>
  )
}

export default Comments
