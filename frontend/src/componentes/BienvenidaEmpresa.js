import React from 'react';
import { Link } from 'react-router-dom';

function BienvenidaEmpresa({cuenta}) {
    return(
        <div className="row justify-content-center w-100">
            <div className="alert alert-light text-center border border-secondary" role="alert">
                <h4 className="alert-heading">¡MetaMask ha sido detectado!</h4>
                <p>Bienvenido de nuevo.</p>
                <p className="lead text-truncate">Cuenta:  <span className="font-weight-bold">{ cuenta }</span></p>
                <p>Nombre: nombreEmpresa</p>
                <p>CIF: cifEmpresa</p>
                <p className="mb-0">Si la cuenta es correcta pulse en Continuar.</p>
                <p>Si no lo es, seleccione la cuenta adecuada en MetaMask.</p>
                <Link to="/empresas" className="btn btn-secondary btn-lg text-decoration-none" role="button">Continuar</Link>
            </div>
        </div>       
    )
}

export default BienvenidaEmpresa;