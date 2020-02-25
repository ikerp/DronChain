import React, { Fragment, useState } from 'react';
import { withRouter } from 'react-router-dom';

import Swal from 'sweetalert2';

import { EMPRESA } from '../utils/config';

const CANTIDAD = 50;

function BienvenidaAnonimo(props) {

    const { cuenta, setTipoUsuario, dronChain, setSaldo, history } = props;

    const [ nombre, setNombre ] = useState('');
    const [ cif, setCif ] = useState(''); 

    const registrarEmpresa = async e => {
        e.preventDefault();

        let error = false;
        try {
            await dronChain.registrarEmpresa(nombre, cif, CANTIDAD, { from: cuenta });
        } catch (err) {
            error = true;
            console.error('ERROR: No se pudo crear la empresa.');
            Swal.fire({
                icon: 'error',
                title: '¡Error!',
                text: 'No se pudo crear la empresa',
                confirmButtonColor: '#8E8C84'
            })
        } finally {
            if (!error) {
                Swal.fire({
                    icon: 'success',
                    title: '¡Empresa creada!',
                    html: `<p>Se le han asignado ${CANTIDAD} DRK.</p><p>Gracias por utilizar nuestros servicios</p>`,                
                    confirmButtonColor: '#8E8C84'
                })

                try {
                    error = false;
                    setTipoUsuario(EMPRESA);
                    const saldo = await dronChain.getDrokens(cuenta, { from: cuenta });
                    setSaldo(Number(saldo));
                    history.push('/'); 
                } catch (error) {
                    error = true;
                    console.error('ERROR: No se pudo obtener el saldo de la cuenta.');
                }
            }
        }
    }

    return(
        <Fragment>

            <div className="d-flex justify-content-center">
                <div className="alert alert-light text-center border border-secondary pb-0" role="alert">
                    <h4 className="alert-heading">¡MetaMask ha detectado una cuenta!</h4>
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
                                <button
                                    type="submit"
                                    className="btn btn-secondary btn-block"
                                    data-toggle="modal"
                                    data-target="#okModal"
                                >
                                    Registrar Empresa
                                </button>
                            </div>
                        </div>                                 

                    </form>                                                     
                </div>
            </div>   

        </Fragment>    
    )
}

export default withRouter(BienvenidaAnonimo);