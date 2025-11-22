import { useState, useEffect, useRef } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import useAxiosPrivate from '../hooks/useAxiosPrivate'
import useAuth from '../hooks/useAuth'
import BasicModal from '../components/BasicModal'
import EasyCropperModal from '../components/EasyCropperModal'
import dataUrlToBlob from '../utils/dataUrlToBlob'

import { SnapACatLogo } from '../assets/images'
import { deleteIcon, galleryIcon } from '../assets/icons'
import exifr from 'exifr'

const Spot = () => {
  const { auth } = useAuth()
  const userIsDemo = auth.userId === '63d3c10333c5e6dad3f910d9' ? true : false

  const axiosPrivate = useAxiosPrivate()
  const navigate = useNavigate()
  const location = useLocation()

  const [sendingFile, setSendingFile] = useState(false)
  const [errorModal, setErrorModal] = useState(false)

  const [openModal, setOpenModal] = useState(false)
  const handleOpenModal = () => setOpenModal(true)
  const handleCloseModal = () => setOpenModal(false)

  const [openDemoUserModal, setOpenDemoUserModal] = useState(false)
  const handleOpenDemoUserModal = () => setOpenDemoUserModal(true)
  const handleCloseDemoUserModal = () => setOpenDemoUserModal(false)

  const [selectedFile, setSelectedFile] = useState(null)
  const [croppedImage, setCroppedImage] = useState(null)
  const [catName, setCatName] = useState('')
  const [comment, setComment] = useState('')
  const [gps, setGps] = useState({})
  const [exifData, setExifData] = useState({})
  const [showLocation, setShowLocation] = useState(true)

  const checkIsImage = async (event) => {
    let file = event.target.files[0]

    return (
      file.type === 'image/jpg' ||
      file.type === 'image/jpeg' ||
      file.type === 'image/png'
    )
  }

  const getExif = async ({
    target: {
      files: [file],
    },
  }) => {
    if (file && file.name) {
      let output = await exifr.parse(file)
      setExifData(output)

      if (
        output &&
        Number.isFinite(Number(output.longitude)) &&
        Number.isFinite(Number(output.latitude))
      ) {
        setGps({ longitude: output.longitude, latitude: output.latitude })
      } else {
        setGps({ longitude: 'undefined', latitude: 'undefined' })
      }
    }
  }

  const onSelectFile = (event) => {
    if (event.target.files && event.target.files.length > 0) {
      const reader = new FileReader()
      reader.readAsDataURL(event.target.files[0])
      reader.addEventListener('load', () => {
        setSelectedFile(reader.result)
      })
    }
  }

  const handleAddPhoto = async (event) => {
    // Don't allow submit if demo user
    if (userIsDemo) return

    if (await checkIsImage(event)) {
      await getExif(event)
      onSelectFile(event)
      handleOpenModal()
    } else {
      setErrorModal(true)
    }
  }
  const handleCropSave = async () => {
    setSelectedFile(null)
    handleCloseModal()
  }

  const handleCropCancel = async () => {
    setSelectedFile(null)
    setCroppedImage(null)
    setGps({})
    setExifData({})
    handleCloseModal()
  }

  const handleCropDelete = async () => {
    setCroppedImage(null)
    setGps({})
    setExifData({})
    setShowLocation(true)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    // Don't allow submit if demo user
    if (userIsDemo) return

    setSendingFile(true)
    let isMounted = true
    const controller = new AbortController()

    const formData = new FormData()
    // formData.append(name, value)

    // console.log(croppedImage)
    const blob = dataUrlToBlob(croppedImage)
    // console.log(blob)
    formData.append('file', blob)

    formData.append('catName', catName)
    formData.append('comment', comment)
    formData.append('longitude', gps.longitude)
    formData.append('latitude', gps.latitude)
    let checkShowLocation =
      typeof gps.longitude === 'number' &&
        typeof gps.latitude === 'number' &&
        showLocation === true
        ? true
        : false
    formData.append('showLocation', checkShowLocation)
    formData.append('exifData', JSON.stringify(exifData))

    try {
      // axios.post(url[, data[, config]])
      const response = await axiosPrivate.post(
        'api/posts/createPost',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          signal: controller.signal,
        },
      )
      // console.log('response?.data', response?.data)

      isMounted &&
        setCatName('') &&
        setComment('') &&
        setCroppedImage(null) &&
        setGps({}) &&
        setExifData({})
      setSendingFile(false)
      navigate('/feed')
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
      navigate('/feed')
    }
  }

  return (
    <main id="spot-page">
      <section className="spot-container">
        <section className="form-panel">
          <h1>Snap a cat</h1>
          <form onSubmit={handleSubmit}>
            {!croppedImage ? (
              <>
                <div className="file-upload-container">
                  <div className="file-upload-container--button-wrapper">
                    <label
                      htmlFor="imageUpload"
                      className="file-upload-container--label"
                    >
                      {userIsDemo ? (
                        <>
                          <button
                            htmlFor="imageUpload"
                            id="custom-file-upload-button"
                            type="button"
                            onClick={handleOpenDemoUserModal}
                          >
                            <img
                              src={galleryIcon}
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
                          />
                        </>
                      ) : (
                        <button
                          htmlFor="imageUpload"
                          id="custom-file-upload-button"
                          type="button"
                        >
                          <img
                            src={galleryIcon}
                            className="custom-file-upload-button--image"
                          />
                          <input
                            type="file"
                            id="imageUpload"
                            className="custom-file-upload-button--input"
                            // accept="image/*"
                            tabIndex="-1"
                            required
                            onChange={(e) => handleAddPhoto(e)}
                          />
                        </button>
                      )}
                      Add a photo
                    </label>
                  </div>
                  <div className="file-upload-container--spot-logo-container">
                    <img src={SnapACatLogo} alt="cat logo" />
                  </div>
                  <div className="file-upload-container--right"></div>
                </div>
              </>
            ) : (
              <>
                <output id="crop-thumbnail-container" htmlFor="imageUpload">
                  <div className="crop-thumbnail--wrapper">
                    <img
                      src={croppedImage}
                      alt="Cropped image"
                      className="crop-thumbnail--image"
                    />
                    <div
                      className="crop-thumbnail--delete"
                      onClick={handleCropDelete}
                      tabIndex="0"
                    >
                      <img src={deleteIcon} alt="Delete cropped image" />
                    </div>
                  </div>
                </output>
                <div className="form-group">
                  <label htmlFor="comment">Add a comment</label>
                  <input
                    type="text"
                    id="comment"
                    // placeholder="Add a comment"
                    onChange={(e) => setComment(e.target.value)}
                    value={comment}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="show-location" className="location-switch">
                    {typeof gps.latitude !== 'number' ||
                      typeof gps.longitude !== 'number' ? (
                      <p>No location data available for this picture</p>
                    ) : (
                      <>
                        <p className="location-switch--text">
                          Location visible
                        </p>
                        <div className="location-switch-checkbox-wrapper">
                          <input
                            id="show-location"
                            type="checkbox"
                            className="location-switch--checkbox"
                            onChange={(e) => {
                              setShowLocation(e.target.checked)
                            }}
                            checked={showLocation}
                          />
                          <span className="location-switch--slider"></span>
                        </div>
                        {showLocation && (
                          <p style={{ color: 'red' }}>
                            App in development! Every user can see the location
                            of your pictures when active.
                          </p>
                        )}
                      </>
                    )}
                  </label>
                </div>
                <button>Submit</button>
              </>
            )}
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
              buttonText="Crop"
              setCroppedImage={setCroppedImage}
            />
          </form>
        </section>
      </section>
      {sendingFile && (
        <BasicModal
          openModal={sendingFile}
          className="sending-file-modal confirmation-modal"
          modalMsg="File uploading"
          displayButton={false}
          displayAnimation={true}
        ></BasicModal>
      )}
      {errorModal && (
        <BasicModal
          openModal={errorModal}
          handleCloseModal={() => setErrorModal(false)}
          className="wrong-file-modal confirmation-modal"
          modalMsg="Please check file is in jpg or png format"
          displayButton={true}
          buttonText="OK"
          buttonClass="close-modal"
          displayAnimation={false}
        ></BasicModal>
      )}
    </main>
  )
}

export default Spot
