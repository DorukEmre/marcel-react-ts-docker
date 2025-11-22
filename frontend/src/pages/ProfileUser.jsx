import { useState, useEffect, useRef, useCallback } from 'react'
import { Link, useNavigate, useLocation, useParams } from 'react-router-dom'
import useAxiosPrivate from '../hooks/useAxiosPrivate'
import useAuth from '../hooks/useAuth'
import { profileInactive } from '../assets/nav_icons'
import Posts from '../components/Posts'

const ProfileUser = () => {
  const { auth } = useAuth()
  const currentUserId = auth.userId
  const userIsDemo = auth.userId === '63d3c10333c5e6dad3f910d9' ? true : false

  const params = useParams()
  const userid = params.userid

  const axiosPrivate = useAxiosPrivate()
  const navigate = useNavigate()
  const location = useLocation()

  if (userid === currentUserId) {
    navigate('/profile/me', { state: { from: location }, replace: true })
  }

  const [profilePicUrl, setProfilePicUrl] = useState(null)
  const [username, setUsername] = useState(null)
  const [posts, setPosts] = useState([])

  const [isLoading, setIsLoading] = useState(false)
  const [isError, setIsError] = useState(false)
  const [error, setError] = useState({})
  const [hasNextPage, setHasNextPage] = useState(false)
  const [pageNum, setPageNum] = useState(1)

  useEffect(() => {
    let isMounted = true
    const controller = new AbortController()

    const getUserProfile = async () => {
      try {
        const response = await axiosPrivate.get(
          `/api/profile/getUserProfile/${userid}`,
          {
            signal: controller.signal,
          },
        )
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
            user: userid,
            pagenum: pageNum,
            currentUserId: currentUserId,
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

  return (
    <main id="profile-page">
      <div className="profile-page-container">
        <section className="profile-pic-header-container">
          <h1>{userIsDemo ? 'Anonymised for demo' : username}</h1>

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
            </div>
          </div>
        </section>
        <section className="user-pictures">
          <h2>Pictures</h2>

          <ul className="cards-container">
            {posts ? (
              <Posts
                posts={posts}
                setPosts={setPosts}
                currentUserId={currentUserId}
                userIsDemo={userIsDemo}
                handleToggleLike={handleToggleLike}
                lastPostRef={lastPostRef}
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

export default ProfileUser
