import { useEffect, useState } from 'react'
import GoogleMapReact from 'google-map-react'
import LocationMarker from './LocationMarker'
import CatInfoBox from './CatInfoBox'

const Map = ({
  posts,
  setPosts,
  // center = { lat: 51.507543, lng: -0.084638 }, // London
  // center = { lat: 40.4380986, lng: -3.8443454 }, // Madrid
  center = { lat: 36.718258, lng: -4.6051592 }, // Malaga
  zoom = 8,
  currentUserId,
  userIsDemo,
  //  GMKey,
}) => {
  const [catInfo, setCatInfo] = useState(null)

  const URLKey =
    process.env.NODE_ENV === 'production'
      ? import.meta.env.VITE_GOOGLE_MAPS_KEY_PROD
      : import.meta.env.VITE_GOOGLE_MAPS_KEY_DEV

  // useEffect(() => {
  //   URLKey === null
  //     ? console.log('URLKey', 'null')
  //     : console.log('URLKey', URLKey.slice(-3))

  //   GMKey === null
  //     ? console.log('GMKey', 'null')
  //     : console.log('GMKey', GMKey.slice(-3))
  // }, [])

  const handleClose = () => {
    setCatInfo(null)
  }

  // console.log(posts)
  const markers = posts.map((cat, index) => {
    return (
      <LocationMarker
        key={index}
        lat={cat.latitude}
        lng={cat.longitude}
        imageUrl={cat.imageUrl}
        onClick={() => setCatInfo(cat)}
      />
    )
  })

  return (
    <div className="map">
      <GoogleMapReact
        bootstrapURLKeys={{ key: URLKey }}
        defaultCenter={center}
        defaultZoom={zoom}
        options={{ mapId: 'e3380fc948889a8' }}
      >
        {markers}
      </GoogleMapReact>
      {catInfo && (
        <CatInfoBox
          post={catInfo}
          setCatInfo={setCatInfo}
          setPosts={setPosts}
          handleClose={handleClose}
          currentUserId={currentUserId}
          userIsDemo={userIsDemo}
        />
      )}
    </div>
  )
}

export default Map
