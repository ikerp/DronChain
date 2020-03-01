import React, { Fragment } from 'react';

import BienvenidaPropietario from './BienvenidaPropietario';
import BienvenidaEmpresa from './BienvenidaEmpresa';
import BienvenidaAnonimo from './BienvenidaAnonimo';

import { PROPIETARIO, EMPRESA, ANONIMO } from '../utils/config';

function Bienvenida(props) {

    const { cuenta, tipoUsuario, setTipoUsuario, dronChain, setSaldo } = props;

    const bienvenidaTipoUsuario = () => {
        switch(tipoUsuario) { 
            case PROPIETARIO: { 
                return <BienvenidaPropietario cuenta={cuenta} /> 
            } 
            case EMPRESA: { 
                return(
                    <BienvenidaEmpresa
                        cuenta={cuenta}
                        dronChain={dronChain}
                        setSaldo={setSaldo}
                    />
                ) 
            } 
            case ANONIMO: { 
                return( 
                    <BienvenidaAnonimo
                        cuenta={cuenta}
                        setTipoUsuario={setTipoUsuario}
                        dronChain={dronChain}
                        setSaldo={setSaldo}
                    />
                )
            }             
            default: { 
                return(
                    <div className="d-flex justify-content-center">
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