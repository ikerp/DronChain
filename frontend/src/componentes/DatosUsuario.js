import React, { Fragment, useState, useEffect } from 'react';

const INCREMENTO_PROPIETARIO = 1000;
const INCREMENTO_EMPRESA = 50;

function DatosUsuario(props) {
    const {
      dronChain,
      droken,
      owner,
      cuenta,
      saldo,
      setSaldo,
      incrementoSaldo,
      setIncrementoSaldo
    } = props;

    const [ nombre, setNombre ] = useState('');
    const [ cif, setCif ] = useState('');

    const incrementarSaldoPropietario = async () => {
        let nuevoSaldo;
        let error = false;
        try {
            await dronChain.mintDrokens(Number(INCREMENTO_PROPIETARIO), { from: cuenta });
        } catch (er) {
            error = true;
            console.error('No se pudo incrementar el saldo');
        }
        if (!error) {
            try {
                await droken.increaseAllowance(dronChain.address, INCREMENTO_PROPIETARIO, { from: cuenta });
            } catch (er) {
                error = true;
                console.error('No se pudo aprobar la nueva cantidad al propietario');
            }
        }
        if (!error) {
            try {
                nuevoSaldo = await dronChain.getDrokens(cuenta);
            } catch (error) {
                error = true;
                console.error('No se pudo recuperar el saldo');
            } 
        }        
        if (!error) {
            setSaldo(Number(nuevoSaldo));
            setIncrementoSaldo(!incrementoSaldo);
        }
    }

    const incrementarSaldoEmpresa = async () => {
        let error = false;
        try {
            await dronChain.agregarDrokens(Number(INCREMENTO_EMPRESA), { from: cuenta });
        } catch (er) {
            error = true;
            console.error('No se pudo incrementar el saldo')
        }    
        if (!error) {
            try {
                let nuevoSaldo = await dronChain.getDrokens(cuenta);
                setSaldo(Number(nuevoSaldo));
            } catch (error) {
                error = true;
                console.error('No se pudo recuperar el saldo');
            } 
        }             
    }

    useEffect(
        () => {
            const obtenerDatosUsuario = async () => {
                const isEmpresa = await dronChain.isEmpresa(cuenta);
                if (isEmpresa) {
                    const result = await dronChain.getDatosEmpresa(cuenta);
                    setNombre(result.nombre);
                    setCif(result.cif);
                }
                const nuevoSaldo = await dronChain.getDrokens(cuenta);
                setSaldo(Number(nuevoSaldo));                  
            }

            if (cuenta !== undefined) {
                obtenerDatosUsuario();
            } 
        }, [ cuenta ]
    )

    return(
        <div className="card bg-light border-secondary h-100">
            <div className="card-header bg-secondary text-white text-uppercase">
                <h5 className="mb-0"><strong>Usuario conectado</strong></h5>
            </div>
            <div className="card-body d-flex flex-column">             
                {
                    cuenta === owner
                    ?
                        <Fragment>
                            <h4 className="font-weight-bold">Propietario de la web</h4>
                            <p className="card-title text-truncate lead">{ cuenta }</p>
                            <h4 className="font-weight-bold mb-0">Saldo disponible (DRK):</h4>
                            <div className="container">
                                <div className="row align-items-center justify-content-between">
                                    <span className="saldo">{ saldo }</span>
                                    <button 
                                        className="btn btn-lg btn-danger"
                                        onClick={() => incrementarSaldoPropietario()}
                                    >
                                        Añadir { INCREMENTO_PROPIETARIO } DRK                            
                                    </button>   
                                </div>                           
                            </div>
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
                            <div className="container">
                                <div className="row align-items-center justify-content-between">
                                    <span className="saldo">{ saldo }</span>
                                    <button 
                                        className="btn btn-lg btn-danger"
                                        onClick={() => incrementarSaldoEmpresa()}
                                    >
                                        Añadir { INCREMENTO_EMPRESA } DRK                            
                                    </button>   
                                </div>                           
                            </div>                                                     
                        </Fragment>                         
                }
            </div>
        </div>
    )
}

export default DatosUsuario;