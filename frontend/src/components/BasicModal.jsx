import Modal from '@mui/material/Modal'

export default function BasicModal(props) {
  return (
    <div>
      <Modal
        open={props.openModal}
        onClose={props.handleCloseModal}
        aria-describedby="modal-modal-description"
      >
        <div className={props.className}>
          <p id="modal-modal-description">{props.modalMsg}</p>
          {props.displayButton && (
            <>
              <button
                className={props.buttonClass}
                onClick={props.handleCloseModal}
              >
                {props.buttonText}
              </button>
            </>
          )}

          {props.displayAnimation && <div className="dot-elastic"></div>}
        </div>
      </Modal>
    </div>
  )
}
