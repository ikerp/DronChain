import React, { Fragment, useState, useEffect } from 'react';

function DatosUsuario(props) {
    const { dronChain, owner, cuenta, saldo } = props;

    const [ nombre, setNombre ] = useState('');
    const [ cif, setCif ] = useState('');

    useEffect(
        () => {
            const obtenerDatosEmpresa = async () => {
                const isEmpresa = await dronChain.isEmpresa(cuenta);
                if (isEmpresa) {
                    const result = await dronChain.getDatosEmpresa(cuenta);
                    setNombre(result.nombre);
                    setCif(result.cif);
                }
            }

            if (cuenta !== owner && cuenta !== undefined) {
                obtenerDatosEmpresa();
            } 
        }, [ cuenta ]
    )

    return(
        <div className="card bg-light border-secondary h-100">
            <div className="card-header bg-secondary text-white text-uppercase">
                <h4 className="mb-0"><strong>Usuario conectado</strong></h4>
            </div>
            <div className="card-body">             
                {
                    cuenta === owner
                    ?
                        <Fragment>
                            <h4 className="font-weight-bold">Propietario de la web</h4>
                            <p className="card-title text-truncate lead">{ cuenta }</p>
                            <h4 className="font-weight-bold mb-0">Saldo disponible (DRK):</h4>
                            <span className="saldo">{ saldo }</span>
                        </Fragment>
                    :
                        <Fragment>
                            <h4 className="font-weight-bold">Cuenta de Empresa</h4>
                            <p className="card-title text-truncate lead">{ cuenta }</p>
                            <p className="font-weight-bold mb-0">Nombre:</p>
                            <p className="card-title text-truncate lead">{ nombre }</p>
                            <p className="font-weight-bold mb-0">CIF:</p>
                            <p className="card-title text-truncate lead">{ cif }</p>
                            <h4 className="font-weight-bold mb-0">Saldo disponible (DRK):</h4>
                            <span className="saldo">{ saldo }</span>                            
                        </Fragment>                         
                }

            </div>
        </div>
    )
}

export default DatosUsuario;