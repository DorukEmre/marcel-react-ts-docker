import { pinIcon } from '../assets/icons'

const LocationMarker = ({ lat, lng, imageUrl, onClick }) => {
  return (
    <div className="marker-container" onClick={onClick}>
      <img src={pinIcon} className="marker-container--icon" alt="" />
      <img
        src={`${imageUrl.slice(0, 49)}/w_64,h_64,c_scale${imageUrl.slice(49)}`}
        className="marker-container--cat"
        alt=""
      />
    </div>
  )
}

export default LocationMarker
