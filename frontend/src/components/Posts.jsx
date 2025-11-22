import useAxiosPrivate from '../hooks/useAxiosPrivate'
import { useState } from 'react'
import Card from './Card'

const Posts = (props) => {
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
  // console.log(props.posts)
  const cards = props.posts.map((post, index) => {
    let componentProps = {
      post: post,
      setPosts: props.setPosts,
      imageXY: 800,
      handleToggleLike: props.handleToggleLike,
      handleToggleLocation: props.handleToggleLocation,
      currentUserId: props.currentUserId,
      userIsDemo: props.userIsDemo,
      getComments: getComments,
      allComments: allComments,
      setAllComments: setAllComments,
      ownProfile: props.ownProfile ? props.ownProfile : false,
    }
    if (index === props.posts.length - 2) {
      return <Card key={index} ref={props.lastPostRef} {...componentProps} />
    }
    return <Card key={index} {...componentProps} />
  })
  // console.log(cards)

  return <>{cards}</>
}

export default Posts
