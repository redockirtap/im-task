import React from 'react';
import ReactDom from 'react-dom';
import Button from "./Button"

const Modal = () => {
    return ReactDom.createPortal(
        <>
          <div style={OVERLAY_STYLES} />
          <div style={MODAL_STYLES}>
            <button onClick={onClose}>Close Modal</button>
            {children}
          </div>
        </>,
        document.getElementById('portal')
      )
}


export default Modal