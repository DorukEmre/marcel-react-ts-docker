import useAxiosPrivate from '../hooks/useAxiosPrivate'
import { useState } from 'react'
import Card from './Card'

const CatInfoBox = ({
  post,
  setCatInfo,
  setPosts,
  handleClose,
  currentUserId,
  userIsDemo,
}) => {
  const axiosPrivate = useAxiosPrivate()
  const [allComments, setAllComments] = useState([])

  const getComments = async (postId) => {
    let isMounted = true
    const controller = new AbortController()

    try {
      const response = await axiosPrivate.get(
        `api/posts/getComments/${postId}`,
        {
          signal: controller.signal,
        },
      )
      // console.log('comments', response.data)

      if (allComments.find((obj) => obj.postId === postId)) {
        isMounted &&
          setAllComments((oldComments) =>
            oldComments.map((obj) =>
              obj.postId === postId ? { ...obj, comments: response.data } : obj,
            ),
          )
      } else {
        isMounted &&
          setAllComments([...allComments, { postId, comments: response.data }])
      }
    } catch (err) {
      console.error('getComments err', err)
      // navigate('/login', { state: { from: location }, replace: true })
    }

    return () => {
      isMounted = false
      controller.abort()
    }
  }

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
        setCatInfo((oldPost) => ({
          ...oldPost,
          greatCat: updatedPost.greatCat,
        }))

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

  // console.log(post)
  return (
    <div className="cat-info">
      <Card
        key={post._id}
        post={post}
        imageXY="400"
        handleToggleLike={handleToggleLike}
        currentUserId={currentUserId}
        userIsDemo={userIsDemo}
        getComments={getComments}
        allComments={allComments}
        setAllComments={setAllComments}
        handleClose={handleClose}
        setPosts={setPosts}
      />
    </div>
  )
}

export default CatInfoBox
