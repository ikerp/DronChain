import React, { Fragment, useState, useEffect } from 'react';

const PROPIETARIO = 'propietario';
const EMPRESA = 'empresa';

function DatosUsuario(props) {
    const { dronChain, owner, cuenta, empresas } = props;
    return(
        <div className="card bg-light border-secondary h-100">
            <div className="card-header bg-secondary text-white text-uppercase">
                <h4 className="mb-0"><strong>Usuario conectado</strong></h4>
            </div>
            <div className="card-body">             
                {
                    cuenta === owner
                    ? <h4 className="font-weight-bold">Propietario de la web</h4>
                    : <h4 className="font-weight-bold">Empresa registrada</h4>
                }
                <p className="card-title text-truncate lead">{ cuenta }</p>
                <p>DronChain address: { dronChain.address }</p>
                <p>DronChain owner: { owner }</p>
            </div>
        </div>
    )
}

export default DatosUsuario;