import React, { useState } from 'react';
import { withRouter } from 'react-router-dom';

import { EMPRESA } from '../utils/config';

function BienvenidaAnonimo(props) {

    const { cuenta, setTipoUsuario, dronChain, history } = props;

    const [ nombre, setNombre ] = useState('');
    const [ cif, setCif ] = useState('');

    const registrarEmpresa = async e => {
        e.preventDefault();

        try {            
            await dronChain.registrarEmpresa(nombre, cif, { from: cuenta });
            setTipoUsuario(EMPRESA);
            history.push('/empresas'); 
        } catch (error) {
            console.error('ERROR: No se pudo crear la empresa.');
        }       
    }

    return(
        <div className="row justify-content-center w-100">
            <div className="alert alert-light text-center border border-secondary pb-0" role="alert">
                <h4 className="alert-heading">¡MetaMask ha sido detectado!</h4>
                <p className="lead text-truncate">Cuenta:  <span className="font-weight-bold">{ cuenta }</span></p>
                <p className="mb-0">Para poder continuar deberá registrarse como empresa.</p>
                <p>Una vez dado de alta podrá comenzar a gestionar sus parcelas y<br/> contratar los drones para que estas sean fumigadas.</p>
                <p>Si la cuenta no es correcta, seleccione la cuenta adecuada en MetaMask.</p>
                
                <form onSubmit={registrarEmpresa}>

                    <div className="form-group row">
                        <label htmlFor="nombre" className="col-sm-2 col-form-label text-left">
                            Nombre
                        </label>
                        <div className="col-sm-10">
                            <input
                                type="text"
                                className="form-control"
                                id="nombre"
                                placeholder="Nombre de su empresa"
                                value={nombre}
                                onChange={ e => setNombre(e.target.value) }    
                            />
                        </div>
                    </div>        

                    <div className="form-group row">
                        <label htmlFor="cif" className="col-sm-2 col-form-label text-left">
                            CIF
                        </label>
                        <div className="col-sm-10">
                            <input
                                type="text"
                                className="form-control"
                                id="cif"
                                placeholder="CIF de su empresa"
                                value={cif}
                                onChange={ e => setCif(e.target.value) }    
                            />
                        </div>
                    </div> 

                    <div className="form-group row">
                        <div className="col-12 text-center">
                            <button type="submit" className="btn btn-secondary btn-block">Registrar Empresa</button>
                        </div>
                    </div>                                 

                </form>                                                     
            </div>
        </div>     
    )
}

export default withRouter(BienvenidaAnonimo);