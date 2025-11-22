import { useState, useCallback } from 'react'
import Cropper from 'react-easy-crop'
import { undoIcon } from '../assets/icons'
import getCroppedImg from './cropImage'
import './EasyCropper.css'

const EasyCropper = (props) => {
  const [crop, setCrop] = useState({ x: 0, y: 0 })
  const [zoom, setZoom] = useState(1)
  const [rotation, setRotation] = useState(0)
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null)

  const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels)
  }, [])

  const handleCropImage = useCallback(async () => {
    try {
      const croppedImage = await getCroppedImg(
        props.image,
        croppedAreaPixels,
        rotation,
      )
      // console.log('donee', { croppedImage })
      props.setCroppedImage(croppedImage)
      return croppedImage
    } catch (e) {
      console.error(e)
    }
  }, [croppedAreaPixels, rotation])

  return (
    <div className="modal-container">
      <section className="cropper-container">
        {props.image && (
          <>
            <section className="cropper-container--cropper">
              <Cropper
                image={props.image}
                crop={crop}
                zoom={zoom}
                // rotation={rotation}
                aspect={1}
                onCropChange={setCrop}
                onZoomChange={setZoom}
                // onRotationChange={setRotation}
                onCropComplete={onCropComplete}
              />
            </section>
            <section className="cropper-container--controls">
              <div className="cropper-container--controls--slider">
                <p>Zoom</p>
                <input
                  type="range"
                  value={zoom}
                  min={1}
                  max={3}
                  step={0.01}
                  aria-labelledby="Zoom"
                  onChange={(e) => {
                    setZoom(e.target.value)
                  }}
                  className="cropper-range"
                />
              </div>
              {/* <div className="cropper-container--controls--slider">
                <p>Rotation</p>
                <input
                  type="range"
                  value={rotation}
                  min={-180}
                  max={180}
                  step={1}
                  aria-labelledby="Rotation"
                  onChange={(e) => setRotation(e.target.value)}
                  className="cropper-range"
                />
              </div> */}
            </section>
          </>
        )}
      </section>
      <section className="cropper-buttons-container">
        <button
          className="cropper-cancel-button"
          onClick={(e) => {
            props.handleCropCancel()
          }}
        >
          <img src={undoIcon} alt="Go back" height="24px" width="24px" />
        </button>
        <button
          className="cropper-save-button"
          onClick={async (e) => {
            // console.log('props.image', props.image)
            props.handleCropSave(e, await handleCropImage())
          }}
        >
          {props.buttonText}
        </button>
      </section>
    </div>
  )
}

export default EasyCropper
