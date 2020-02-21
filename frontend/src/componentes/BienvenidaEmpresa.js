import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

function BienvenidaEmpresa({ cuenta, dronChain }) {
    
    const [ nombre, setNombre ] = useState('');
    const [ cif, setCif ] = useState('');

    useEffect(
        () => {
            const obtenerDatosEmpresa = async () => {
                if (dronChain.isEmpresa(cuenta)) {
                    const result = await dronChain.getDatosEmpresa(cuenta);
                    setNombre(result.nombre);
                    setCif(result.cif);
                }
            }
            
            obtenerDatosEmpresa();
        }, []
    )

    return(
        <div className="row justify-content-center w-100">
            <div className="alert alert-light text-center border border-secondary" role="alert">
                <h4 className="alert-heading">¡MetaMask ha sido detectado!</h4>
                <p>Bienvenido de nuevo.</p>
                <p className="lead text-truncate">Cuenta:  <span className="font-weight-bold">{ cuenta }</span></p>
                <p>Nombre: <span className="font-weight-bold">{ nombre }</span></p>
                <p>CIF: <span className="font-weight-bold">{ cif }</span></p>
                <p className="mb-0">Si la cuenta es correcta pulse en Continuar.</p>
                <p>Si no lo es, seleccione la cuenta adecuada en MetaMask.</p>
                <Link to="/empresas" className="btn btn-secondary btn-lg text-decoration-none" role="button">Continuar</Link>
            </div>
        </div>       
    )
}

export default BienvenidaEmpresa;