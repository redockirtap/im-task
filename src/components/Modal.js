import React from 'react';
import ReactDom from 'react-dom';
import Button from "./Button"
import { AiOutlineCloseCircle } from 'react-icons/ai';

const Modal = ( { open, onClose } ) => {
  if (!open) return null;
  return ReactDom.createPortal(
    <>
        <div className="modal-overlay"></div>
        <div className="modal-container">
            <Button onClick={onClose} text={<AiOutlineCloseCircle/>} />
            <div className="modal-info">
                Modal
            </div>
        </div>
    </>,
    document.getElementById("portal")
  )
}

export default Modal