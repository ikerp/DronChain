import React from 'react';
import { Link } from 'react-router-dom';

function BienvenidaPropietario({ cuenta }) {
    return(
        <div className="d-flex justify-content-center">
            <div className="alert alert-light text-center border border-secondary" role="alert">
                <h4 className="alert-heading">¡MetaMask ha detectado una cuenta!</h4>
                <p>Bienvenido de nuevo.</p>
                <p className="lead text-truncate">Cuenta:  <span className="font-weight-bold">{ cuenta }</span></p>
                <p>Es Ud. el <span className="font-weight-bold">propietario</span> de la aplicación.</p>
                <p className="mb-0">Si la cuenta es correcta pulse en Continuar.</p>
                <p>Si no lo es, seleccione la cuenta adecuada en MetaMask.</p>
                <Link to="/dronchain" className="btn btn-secondary btn-lg text-decoration-none" role="button">Continuar</Link>
            </div>
        </div>        
    )
}

export default BienvenidaPropietario;