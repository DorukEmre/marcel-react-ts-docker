import { axiosPrivate } from '../api/axios'
import { useEffect } from 'react'
import useRefreshToken from './useRefreshToken'
import useAuth from './useAuth'

// Hook to attach interceptors to axios instance. It works with the JWT tokens to refresh the token if the initial request is denied due to an expired token
// The hook will return an axiosPrivate instance and it will have the interceptors added to handle the JWT tokens that we need to request our data and possibly retry to get a new access token

// Error with axios update
// axios >= 1.0.0 will cause the response interceptor to reject an error when retrying. There are a few lines in the axios source code that, when trying to normalize values, ends up returning any unknown value via toString, which ends up spitting out an entire function being toStringed as the error passed into the response interceptor.

const useAxiosPrivate = () => {
  const refresh = useRefreshToken()
  const { auth } = useAuth()

  useEffect(() => {
    const requestIntercept = axiosPrivate.interceptors.request.use(
      (config) => {
        // If authorization header doesn't exist, it means it is a first attempt. (The accessToken can be the initial one or the one we got after a refresh)
        if (!config.headers['Authorization']) {
          // console.log('requestIntercept config.headers before', config.headers)
          config.headers['Authorization'] = `Bearer ${auth?.accessToken}`
          // console.log('requestIntercept config.headers after', config.headers)
        }
        return config
      },
      (error) => Promise.reject(error),
    )

    const responseIntercept = axiosPrivate.interceptors.response.use(
      (response) => response,
      async (error) => {
        const prevRequest = error?.config
        // console.log('requestIntercept error', error)
        // Check error status is '403/forbidden' (which means expired access token) && custom property 'sent' does not exist (so we only retry once and avoid an endless loop of 403)
        // console.log('requestIntercept prevRequest', prevRequest)
        if (error?.response?.status === 403 && !prevRequest?.sent) {
          prevRequest.sent = true
          // Refresh the access token
          const newAccessToken = await refresh()
          // Set the token in the header
          prevRequest.headers['Authorization'] = `Bearer ${newAccessToken}`
          // console.log(
          //   "prevRequest with new token in headers['Authorization']",
          //   prevRequest,
          // )
          // Making a request again with a refresh token
          return axiosPrivate(prevRequest)
        }
        return Promise.reject(error)
      },
    )

    // Interceptors need to be removed or they would get attached endlessly. (Put name of interceptor in eject())
    return () => {
      axiosPrivate.interceptors.request.eject(requestIntercept)
      axiosPrivate.interceptors.response.eject(responseIntercept)
    }
  }, [auth, refresh])

  return axiosPrivate
}

export default useAxiosPrivate
