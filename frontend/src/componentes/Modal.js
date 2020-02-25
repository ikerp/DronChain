import React from 'react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimesCircle, faCheckCircle } from '@fortawesome/free-solid-svg-icons';

function Modal({ modalHeader, modalBody, modalIcon }) {
    return(
        <div className="modal fade" id="okModal" tabIndex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
            <div className="modal-dialog modal-dialog-centered" role="document">
                <div className="modal-content bg-light">
                    <div className="modal-header">
                        <FontAwesomeIcon
                            icon={ modalIcon === "error" ? faTimesCircle : faCheckCircle }
                            size="4x"
                            color={ modalIcon === "error" ? "red" : "green" }
                        />
                        <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div className="modal-body text-center">
                        <h1 className="modal-title" id="okModalLabel">{modalHeader}</h1>                        
                        <h4>{modalBody}</h4>
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-secondary" data-dismiss="modal">Aceptar</button>
                    </div>
                </div>
            </div>
        </div> 
    )
}

export default Modal;