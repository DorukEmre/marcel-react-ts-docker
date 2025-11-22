import React, { useState, useEffect, useRef, useCallback } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import useAxiosPrivate from '../hooks/useAxiosPrivate'
import { useInfiniteQuery } from 'react-query'
import Posts from '../components/Posts'
import useAuth from '../hooks/useAuth'

const Feed = () => {
  const { auth } = useAuth()
  const currentUserId = auth.userId
  const axiosPrivate = useAxiosPrivate()
  const navigate = useNavigate()
  const location = useLocation()

  const getPostsPage = async ({ pageParam = 1 }) => {
    const response = await axiosPrivate.get(`/api/feed/${pageParam}`)
    // console.log(response.data)

    return response.data
  }

  const {
    data,
    error,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    status,
  } = useInfiniteQuery({
    queryKey: ['posts'],
    queryFn: getPostsPage,
    getNextPageParam: (lastPage, allPages) => {
      // console.log('lastPage', lastPage)
      return lastPage.info.next
    },
  })

  // console.log('status', status)

  const intObserver = useRef()
  const lastPostRef = useCallback(
    (post) => {
      if (isFetchingNextPage) return

      if (intObserver.current) intObserver.current.disconnect()

      intObserver.current = new IntersectionObserver((posts) => {
        if (posts[0].isIntersecting && hasNextPage) {
          console.log('We are near the last post!')
          fetchNextPage()
        }
      })

      if (post) intObserver.current.observe(post)
    },
    [isFetchingNextPage, fetchNextPage, hasNextPage],
  )

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
    <main id="feed-page">
      <div className="">
        <ul className="cards-container">
          {status === 'loading' ? (
            <p>Loading...</p>
          ) : status === 'error' ? (
            <p>Error: {error.message}</p>
          ) : (
            <>
              {data.pages.map((group, i) => {
                return (
                  <React.Fragment key={i}>
                    <Posts
                      posts={group.posts}
                      currentUserId={currentUserId}
                      handleToggleLike={handleToggleLike}
                      lastPostRef={lastPostRef}
                    />
                  </React.Fragment>
                )
              })}
            </>
          )}
        </ul>
      </div>
    </main>
  )
}

export default Feed
