import React, { useState } from 'react';

import { PESTICIDAS } from '../utils/config';

function FormParcelas({cuenta, dronChain}) {

    const [ alturaVueloMinima, setAlturaVueloMinima ] = useState('');
    const [ alturaVueloMaxima, setAlturaVueloMaxima ] = useState('');
    const [ pesticida, setPesticida ] = useState('');
    const [ errorAlturaMinima, setErrorAlturaMinima ] = useState(false);
    const [ errorAlturaMaxima, setErrorAlturaMaxima ] = useState(false);
    const [ errorPesticida, setErrorPesticida ] = useState(false);

    const validarFormulario = () => {

        let error = false;
        setErrorAlturaMinima(false);
        setErrorAlturaMaxima(false);
        setErrorPesticida(false);

        if (
            alturaVueloMinima.match(/^\d+$/) === null ||
            alturaVueloMinima === "" ||
            alturaVueloMinima === 0 ||
            (Number(alturaVueloMinima) >= Number(alturaVueloMaxima) && alturaVueloMaxima !== "")
        ) {
          setErrorAlturaMinima(true);
          error = true;
        }
        if (
            alturaVueloMaxima.match(/^\d+$/) === null ||
            alturaVueloMaxima === "" ||
            alturaVueloMaxima === 0 ||
            (Number(alturaVueloMaxima) <= Number(alturaVueloMinima) && alturaVueloMinima !== "")
        ) {
          setErrorAlturaMaxima(true);
          error = true;
        }        
        if (pesticida.match(/^\d+$/) === null) {
            setErrorPesticida(true);
            error = true;
        } 
        return error;
    }

    const registrarParcela = async e => {
        e.preventDefault();

        if (!validarFormulario()) {
            try {
                await dronChain.registrarParcela(alturaVueloMinima, alturaVueloMaxima, pesticida, { from: cuenta });
                setErrorAlturaMinima(false);
                setErrorAlturaMaxima(false);
                setErrorPesticida(false);
                setAlturaVueloMinima('');
                setAlturaVueloMaxima('');
                setPesticida('');
            } catch (error) {
                console.error('ERROR: No se pudo crear la parcela.');
                console.error(error)
            }        
        }
    }

    return(
        <div className="card bg-light border-secondary h-100 mt-2 mt-sm-0">
            <div className="card-header bg-secondary text-white text-uppercase">
                <h4 className="mb-0"><strong>Crear Parcela</strong></h4>
            </div>
            <div className="card-body text-left pb-0">
                <form onSubmit={registrarParcela} noValidate>

                    <div className="form-group row">
                        <label htmlFor="alturaVueloMinima" className="col-sm-3 col-form-label">
                            Altura de vuelo mínima
                        </label>
                        <div className="col-sm-9">
                            <input
                                type="number"
                                className={`form-control ${errorAlturaMinima ? 'is-invalid' : null}`}
                                id="alturaVueloMinima"
                                placeholder="Altura de vuelo mínima (número entero)"
                                min="1" max="50"
                                value={alturaVueloMinima}
                                onChange={ e => setAlturaVueloMinima(e.target.value) }    
                            />
                            <div className="invalid-feedback font-weight-bold">
                                Debe ser un número entero menor que la altura máxima.
                            </div>
                        </div>
                    </div>

                    <div className="form-group row">
                        <label htmlFor="alturaVueloMaxima" className="col-sm-3 col-form-label">
                            Altura de vuelo máxima
                        </label>
                        <div className="col-sm-9">
                            <input
                                type="number"
                                className={`form-control ${errorAlturaMaxima ? 'is-invalid' : null}`}
                                id="alturaVueloMaxima"
                                placeholder="Altura de vuelo máxima (número entero)"
                                min="1" max="50"
                                value={alturaVueloMaxima}
                                onChange={ e => setAlturaVueloMaxima(e.target.value) }    
                            />
                            <div className="invalid-feedback font-weight-bold">
                                Debe ser un número entero mayor que la altura mínima.
                            </div>                            
                        </div>
                    </div>      

                    <div className="form-group row">
                        <label htmlFor="pesticidas" className="col-sm-3 col-form-label">
                            Pesticidas disponibles
                        </label>    
                        <div className="col-sm-9">
                            <select
                                className={`custom-select ${errorPesticida ? 'is-invalid' : null}`}
                                size={Object.keys(PESTICIDAS).length + 1}
                                value={pesticida}
                                onChange={ e => setPesticida(e.target.value) }
                            >
                                <option value='' disabled>-- Seleccione un pesticida --</option>
                                { Object.keys(PESTICIDAS).map((key, index) => 
                                    <option
                                        key={ key }
                                        value={ key }
                                    >
                                        { PESTICIDAS[key] }
                                    </option>
                                )}
                            </select> 
                            <div className="invalid-feedback font-weight-bold">
                                Debe elegir un pesticida.
                            </div>                                                                             
                        </div>
                    </div>                   
 
                    <div className="form-group row">
                        <div className="col-12 text-center">
                            <button type="submit" className="btn btn-secondary btn-block">Registrar Parcela</button>
                        </div>
                    </div>    

                </form>
            </div>
        </div>
    )
}

export default FormParcelas;