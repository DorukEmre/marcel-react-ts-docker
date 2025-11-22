import Box from '@mui/material/Box'
import Modal from '@mui/material/Modal'
import EasyCropper from '../utils/EasyCropper'

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  p: 4,
}

export default function EasyCropperModal(props) {
  return (
    <div>
      <Modal open={props.openModal} onClose={props.handleCropCancel}>
        <Box sx={style} className={props.className}>
          <EasyCropper
            image={props.image}
            handleCropSave={props.handleCropSave}
            setCroppedImage={props.setCroppedImage}
            handleCropCancel={props.handleCropCancel}
            buttonText={props.buttonText}
          />
        </Box>
      </Modal>
    </div>
  )
}
