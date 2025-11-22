import { useState, useEffect, useRef, useCallback } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import useAxiosPrivate from '../hooks/useAxiosPrivate'
import useAuth from '../hooks/useAuth'
import { profileInactive } from '../assets/nav_icons'
import { addPhoto } from '../assets/icons'
import EasyCropperModal from '../components/EasyCropperModal'
import BasicModal from '../components/BasicModal'
import Posts from '../components/Posts'
import dataUrlToBlob from '../utils/dataUrlToBlob'


const ProfileMe = () => {
  const { auth } = useAuth()
  const currentUserId = auth.userId
  const userIsDemo = auth.userId === '63d3c10333c5e6dad3f910d9' ? true : false

  const axiosPrivate = useAxiosPrivate()
  const navigate = useNavigate()
  const location = useLocation()

  const [sendingFile, setSendingFile] = useState(false)
  const [selectedFile, setSelectedFile] = useState(null)

  const [openModal, setOpenModal] = useState(false)
  const handleOpenModal = () => setOpenModal(true)
  const handleCloseModal = () => setOpenModal(false)

  const [openDemoUserModal, setOpenDemoUserModal] = useState(false)
  const handleOpenDemoUserModal = () => setOpenDemoUserModal(true)
  const handleCloseDemoUserModal = () => setOpenDemoUserModal(false)

  const [croppedImage, setCroppedImage] = useState(null)
  const [profilePicUrl, setProfilePicUrl] = useState(null)
  const [username, setUsername] = useState(null)
  const [posts, setPosts] = useState([])

  const [isLoading, setIsLoading] = useState(false)
  const [isError, setIsError] = useState(false)
  const [error, setError] = useState({})
  const [hasNextPage, setHasNextPage] = useState(false)
  const [pageNum, setPageNum] = useState(1)

  const onSelectFile = (event) => {
    // Don't allow submit if demo user
    if (userIsDemo) return
    // console.log('event.target.files', event.target.files)
    if (event.target.files && event.target.files.length > 0) {
      const reader = new FileReader()
      reader.readAsDataURL(event.target.files[0])
      reader.addEventListener('load', () => {
        setSelectedFile(reader.result)
      })
    }
  }

  const handleCropCancel = async () => {
    setSelectedFile(null)
    setCroppedImage(null)
    handleCloseModal()
  }

  const handleCropSave = async (e, croppedImage) => {
    e.preventDefault()
    // Don't allow submit if demo user
    if (userIsDemo) return

    let isMounted = true
    const controller = new AbortController()
    setSendingFile(true)

    // console.log(croppedImage)
    const blob = dataUrlToBlob(croppedImage)
    // console.log(blob)
    formData.append('file', blob)

    try {
      // axios.post(url[, data[, config]])
      const response = await axiosPrivate.put(
        'api/profile/updatePicture',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          signal: controller.signal,
        },
      )
      // console.log('response?.data', response?.data)

      isMounted && setSelectedFile(null)
      isMounted && setCroppedImage(null)
      isMounted && setProfilePicUrl(response.data.profilePicUrl)
      setSendingFile(false)
      handleCloseModal()
    } catch (err) {
      console.error('Login again err', err)
      if (!err?.response) {
        console.log('No Server Response')
      } else if (err.response?.status === 403) {
        navigate('/login', { state: { from: location }, replace: true })
      } else {
        console.log('Request failed')
      }
    }

    return () => {
      isMounted = false
      controller.abort()
    }
  }

  useEffect(() => {
    let isMounted = true
    const controller = new AbortController()

    const getUserProfile = async () => {
      try {
        const response = await axiosPrivate.get('/api/profile/getMyProfile', {
          signal: controller.signal,
        })
        const { username, profilePicUrl } = response.data
        // console.log('response.data', response.data)
        isMounted && setProfilePicUrl(profilePicUrl)
        isMounted && setUsername(username)
      } catch (err) {
        console.error('Login again err', err)
        if (!err?.response) {
          console.log('No Server Response')
        } else if (err.response?.status === 403) {
          navigate('/login', { state: { from: location }, replace: true })
        } else {
          console.log('Request failed')
        }
      }
    }
    getUserProfile()

    return () => {
      isMounted = false
      controller.abort()
    }
  }, [])

  useEffect(() => {
    setIsLoading(true)
    setIsError(false)
    setError({})
    let isMounted = true
    const controller = new AbortController()

    const getPosts = async () => {
      try {
        const response = await axiosPrivate.get(`/api/profile/getPosts/`, {
          params: {
            user: currentUserId,
            pagenum: pageNum,
          },
          signal: controller.signal,
        })
        isMounted && setPosts((prev) => [...prev, ...response.data.posts])
        isMounted && setHasNextPage(Boolean(response.data.info.next))
        isMounted && setIsLoading(false)
      } catch (err) {
        console.error('Login again err', err)
        setIsLoading(false)
        setIsError(true)
        setError({ message: err.message })
        if (!err?.response) {
          console.log('No Server Response')
        } else if (err.response?.status === 403) {
          navigate('/login', { state: { from: location }, replace: true })
        } else {
          console.log('Request failed')
        }
      }
    }
    getPosts()

    return () => {
      isMounted = false
      controller.abort()
    }
  }, [pageNum])

  const intObserver = useRef()
  const lastPostRef = useCallback(
    (post) => {
      if (isLoading) return

      if (intObserver.current) intObserver.current.disconnect()

      intObserver.current = new IntersectionObserver((posts) => {
        if (posts[0].isIntersecting && hasNextPage) {
          // console.log('Near last post')
          setPageNum((prev) => prev + 1)
        }
      })

      if (post) intObserver.current.observe(post)
    },
    [isLoading, hasNextPage],
  )

  if (isError) return <p className="center">Error: {error.message}</p>

  const handleToggleLike = async (e, postId) => {
    e.preventDefault()
    let isMounted = true
    const controller = new AbortController()

    try {
      const response = await axiosPrivate.put(
        `api/posts/likePost/${postId}`,
        JSON.stringify({ currentUserId }),
        {
          signal: controller.signal,
        },
      )
      // console.log('response?.data', response?.data)
      const { updatedPost } = response.data

      isMounted &&
        setPosts((oldPosts) =>
          oldPosts.map((post) =>
            post._id === updatedPost._id
              ? { ...post, greatCat: updatedPost.greatCat }
              : post,
          ),
        )
    } catch (err) {
      console.error('Login again err', err)
      if (!err?.response) {
        console.log('No Server Response')
      } else if (err.response?.status === 403) {
        navigate('/login', { state: { from: location }, replace: true })
      } else {
        console.log('Request failed')
      }
    }

    return () => {
      isMounted = false
      controller.abort()
    }
  }

  const handleToggleLocation = async (e, postId) => {
    e.preventDefault()
    let isMounted = true
    const controller = new AbortController()

    try {
      const response = await axiosPrivate.put(
        `api/posts/toggleLocation/${postId}`,
        JSON.stringify({ currentUserId }),
        {
          signal: controller.signal,
        },
      )
      // console.log('response?.data', response?.data)
      const { updatedPost } = response.data

      isMounted &&
        setPosts((oldPosts) =>
          oldPosts.map((post) =>
            post._id === updatedPost._id
              ? { ...post, showLocation: updatedPost.showLocation }
              : post,
          ),
        )
    } catch (err) {
      console.error('Login again err', err)
      if (!err?.response) {
        console.log('No Server Response')
      } else if (err.response?.status === 403) {
        navigate('/login', { state: { from: location }, replace: true })
      } else {
        console.log('Request failed')
      }
    }

    return () => {
      isMounted = false
      controller.abort()
    }
  }

  return (
    <main id="profile-page">
      <div className="profile-page-container">
        <section className="profile-pic-header-container">
          <h1>{username}</h1>
          <div className="add-profile-pic-container">
            <div className="profile-pic-image-container">
              <div className="profile-pic-image-container--image">
                <img
                  src={
                    profilePicUrl
                      ? profilePicUrl.slice(0, 49) +
                      '/w_300,h_300,c_scale' +
                      profilePicUrl.slice(49)
                      : profileInactive
                  }
                  alt="profile-pic"
                  height="150"
                />
              </div>
              <div className="file-upload-container--button-wrapper">
                <label htmlFor="imageUpload">
                  {userIsDemo ? (
                    <>
                      <button
                        htmlFor="imageUpload"
                        id="custom-file-upload-button"
                        type="button"
                        onClick={handleOpenDemoUserModal}
                      >
                        <img
                          src={addPhoto}
                          className="custom-file-upload-button--image"
                        />
                      </button>
                      <BasicModal
                        openModal={openDemoUserModal}
                        handleCloseModal={handleCloseDemoUserModal}
                        className="confirmation-modal"
                        modalMsg="Feature disabled for demo user"
                        displayButton={true}
                        buttonClass="close-modal"
                        buttonText="OK"
                      ></BasicModal>
                    </>
                  ) : (
                    <button
                      htmlFor="imageUpload"
                      id="custom-file-upload-button"
                      type="button"
                    >
                      <img
                        src={addPhoto}
                        className="custom-file-upload-button--image"
                      />
                      <input
                        type="file"
                        id="imageUpload"
                        className="custom-file-upload-button--input"
                        accept="image/*"
                        tabIndex="-1"
                        required
                        onChange={(e) => {
                          //
                          onSelectFile(e)
                          handleOpenModal()
                        }}
                      />
                    </button>
                  )}
                </label>
              </div>
            </div>
            {!profilePicUrl ? <p>Add a profile picture</p> : null}
          </div>
          <EasyCropperModal
            image={selectedFile}
            openModal={openModal}
            handleCloseModal={handleCloseModal}
            handleCropSave={handleCropSave}
            handleCropCancel={handleCropCancel}
            className="crop-modal"
            modalMsg="some text"
            displayButton={true}
            buttonClass="close-modal"
            buttonText="Save"
            setCroppedImage={setCroppedImage}
          />
          {sendingFile && (
            <BasicModal
              openModal={sendingFile}
              handleCloseModal={() => sendingFile(false)}
              className="sending-file-modal confirmation-modal"
              modalMsg="File uploading"
              displayButton={false}
              displayAnimation={true}
            ></BasicModal>
          )}
        </section>
        {/* Set Pictures and Grups as tabs */}
        {/* Check <Link to="?tab=one" preventScrollReset={true} />
         */}
        {/* https://reactrouter.com/en/main/components/link */}
        <section className="user-pictures">
          <h2>Pictures</h2>
          <ul className="cards-container">
            {posts ? (
              <Posts
                posts={posts}
                setPosts={setPosts}
                currentUserId={currentUserId}
                handleToggleLike={handleToggleLike}
                lastPostRef={lastPostRef}
                ownProfile={true}
                handleToggleLocation={handleToggleLocation}
              />
            ) : (
              <p>Can't connect to server</p>
            )}
          </ul>
        </section>
        <section className="user-groups"></section>
      </div>
    </main>
  )
}

export default ProfileMe
