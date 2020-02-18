import React, { Fragment, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

import { PROPIETARIO, EMPRESA, ANONIMO, SIN_METAMASK } from '../utils/config';

function Bienvenida(props) {

    const { cuenta, tipoUsuario, setTipoUsuario, setCuenta } = props;

    const bienvenidaTipoUsuario = () => {
        switch(tipoUsuario) { 
            case PROPIETARIO: { 
                return(
                    <div className="row justify-content-center">
                        <div className="alert alert-light text-center border border-secondary" role="alert">
                            <h4 className="alert-heading">¡MetaMask ha sido detectado!</h4>
                            <p>Bienvenido de nuevo.</p>
                            <p className="lead">Cuenta:  <span className="font-weight-bold">{ cuenta }</span></p>
                            <p>Es Ud. el <span className="font-weight-bold">propietario</span> de la aplicación.</p>
                            <p className="mb-0">Si la cuenta es correcta pulse en Continuar.</p>
                            <p>Si no lo es, seleccione la cuenta adecuada en MetaMask.</p>
                            <Link to="/dronchain" className="btn btn-secondary btn-lg text-decoration-none" role="button">Continuar</Link>
                        </div>
                    </div>
                )
            } 
            case EMPRESA: { 
                return(
                    <div className="row justify-content-center">
                        <div className="alert alert-light text-center border border-secondary" role="alert">
                            <h4 className="alert-heading">¡MetaMask ha sido detectado!</h4>
                            <p>Bienvenido de nuevo.</p>
                            <p className="lead">Cuenta:  <span className="font-weight-bold">{ cuenta }</span></p>
                            <p>Nombre: nombreEmpresa</p>
                            <p>CIF: cifEmpresa</p>
                            <p className="mb-0">Si la cuenta es correcta pulse en Continuar.</p>
                            <p>Si no lo es, seleccione la cuenta adecuada en MetaMask.</p>
                            <Link to="/empresas" className="btn btn-secondary btn-lg text-decoration-none" role="button">Continuar</Link>
                        </div>
                    </div>
                )
            } 
            case ANONIMO: { 
                return(
                    <div className="row justify-content-center">
                        <div className="alert alert-light text-center border border-secondary" role="alert">
                            <h4 className="alert-heading">¡MetaMask ha sido detectado!</h4>
                            <p>Para poder continuar deberá registrarse como empresa.</p>
                            <p>Una vez dado de alta podrá comenzar a gestionar sus parcelas y contratar los drones para que estas sean fumigadas.</p>
                            <Link href="/dronchain" className="btn btn-secondary btn-lg text-decoration-none" role="button">Registrar Empresa</Link>
                        </div>
                    </div>
                )
             }             
            default: { 
                return(
                    <div className="row justify-content-center">
                        <div className="alert alert-light border border-danger" role="alert">
                            <h4 className="p-2 m-0 text-danger">¡Por favor, inicie sesión en MetaMask para poder continuar!</h4>
                        </div>
                    </div>
                )
            }
        }
    }

    return(
        <Fragment>
            <div className="jumbotron jumbotron-fluid border-bottom">
                <div className="container">
                    <h1 className="display-4">¡Bienvenido a DronChain!</h1>
                    <p className="lead">
                        Sistema de fumigación con drones basado en la blockchain de Alastria.
                    </p>
                    <hr className="my-4" />
                    <p>
                        Para su correcto funcionamiento es necesario que tenga instalado&nbsp; 
                        <a href="https://metamask.io/" target="_blank" rel="noopener noreferrer">MetaMask</a>.
                    </p>                    
                </div>
            </div>
            { bienvenidaTipoUsuario() }
        </Fragment>
    )
}

export default Bienvenida;