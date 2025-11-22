import { useState, useEffect, useRef } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import useAxiosPrivate from '../hooks/useAxiosPrivate'
import useAuth from '../hooks/useAuth'
import useLogout from '../hooks/useLogout'
import Modal from '@mui/material/Modal'

const ProfileSettings = () => {
  const { auth } = useAuth()
  const currentUserId = auth.userId
  const userIsDemo = auth.userId === '63d3c10333c5e6dad3f910d9' ? true : false

  const axiosPrivate = useAxiosPrivate()
  const navigate = useNavigate()
  const location = useLocation()
  const logout = useLogout()

  const [openModal, setOpenModal] = useState(false)
  const handleOpenModal = () => setOpenModal(true)
  const handleCloseModal = () => setOpenModal(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    // Don't allow submit if demo user
    if (userIsDemo) return

    let isMounted = true
    const controller = new AbortController()

    try {
      const response = await axiosPrivate.delete(
        `api/profile/deleteUser/${currentUserId}`,
        {
          // To cancel request if we need to
          signal: controller.signal,
        },
      )
      // console.log('response', response)

      handleCloseModal()
      await logout()
      navigate('/goodbye', { state: { from: location }, replace: true })
    } catch (err) {
      console.log(err)
      if (!err?.response) {
        console.log('No Server Response')
      } else if (err.response?.status === 403) {
        navigate('/login', { state: { from: location }, replace: true })
      } else if (err.response?.status === 400) {
        console.log(err.response.data.message)
      } else {
        console.log('Request failed')
      }
      alert('Account deletion failed')
      handleCloseModal()
    }

    return () => {
      isMounted = false
      controller.abort()
    }
  }

  return (
    <main id="settings-page">
      {userIsDemo ? (
        <>
          <p className="alert">Features disabled for demo user</p>
          <p>Delete Marcel Account</p>
          <p>Change username</p>
          <p>Change email</p>
          <p>Change password</p>
        </>
      ) : (
        <>
          <div>
            <Modal
              open={openModal}
              onClose={handleCloseModal}
              aria-describedby="modal-modal-description"
            >
              <div className="confirmation-modal">
                <div>
                  <p id="modal-modal-description">
                    This will delete all existing pictures and groups in your
                    account.
                  </p>
                  <br />
                  <p>Deleting your account can NOT be reversed.</p>
                  <br />
                </div>
                <div className="delete-account-modal-buttons">
                  <button
                    className="delete-account-button--cancel"
                    onClick={handleCloseModal}
                  >
                    Cancel
                  </button>
                  <button
                    className="delete-account-button--delete"
                    onClick={handleSubmit}
                  >
                    Delete Marcel Account
                  </button>
                </div>
              </div>
            </Modal>
          </div>
          <div className="profile-page-container">
            <button
              className="delete-account-button--delete"
              onClick={handleOpenModal}
            >
              Delete Marcel Account
            </button>
            <br />
            <br />
            <br />
            <p style={{ color: 'red' }}>Not yet functional</p>
            <p>Change username</p>
            <p>Change email</p>
            <p>Change password</p>
          </div>
        </>
      )}
    </main>
  )
}

export default ProfileSettings
