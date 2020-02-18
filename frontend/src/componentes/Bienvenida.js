import React, { Fragment, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const PROPIETARIO = 'propietario';
const EMPRESA = 'empresa';
const ANONIMO = 'anonimo';

function Bienvenida(props) {

    const { cuenta, tipoUsuario, setTipoUsuario, setCuenta } = props;

    const bienvenidaTipoUsuario = () => {
        switch(tipoUsuario) { 
            case PROPIETARIO: { 
                return(
                    <div className="row justify-content-center">
                        <div className="alert alert-light text-center border" role="alert">
                            <h4 className="alert-heading">¡MetaMask ha sido detectado!</h4>
                            <p>Bienvenido de nuevo, <span className="font-weight-bold">{ cuenta }</span></p>
                            <p>Si la cuenta es correcta pulse en Continuar. Si no lo es, seleccione la cuenta adecuada.</p>
                            <Link to="/dronchain" className="btn btn-secondary btn-lg text-decoration-none" role="button">Continuar</Link>
                        </div>
                    </div>
                )
               break; 
            } 
            case EMPRESA: { 
                return(
                    <div className="row justify-content-center">
                        <div className="alert alert-light text-center border" role="alert">
                            <h4 className="alert-heading">¡MetaMask ha sido detectado!</h4>
                            <p>Bienvenido de nuevo, <span className="font-weight-bold">{ cuenta }</span></p>
                            <p>Si la cuenta es correcta pulse en Continuar. Si no lo es, seleccione la cuenta adecuada.</p>
                            <Link to="/empresas" className="btn btn-secondary btn-lg text-decoration-none" role="button">Continuar</Link>
                        </div>
                    </div>
                )
               break; 
            } 
            case ANONIMO: { 
                return(
                    <div className="row justify-content-center">
                        <div className="alert alert-light text-center border" role="alert">
                            <h4 className="alert-heading">¡MetaMask ha sido detectado!</h4>
                            <p>Para poder continuar deberá registrarse como empresa.</p>
                            <p>Una vez dado de alta podrá comenzar a gestionar sus parcelas y contratar los drones para que estas sean fumigadas.</p>
                            <Link href="/dronchain" className="btn btn-secondary btn-lg text-decoration-none" role="button">Registrar Empresa</Link>
                        </div>
                    </div>
                )
                break; 
             }             
            default: { 
                return(
                    <div className="row justify-content-center">
                        <div className="alert alert-light border" role="alert">
                            <h4>¡Por favor, inicie sesión en MetaMask para poder continuar!</h4>
                        </div>
                    </div>
                )
               break; 
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