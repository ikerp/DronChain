import React, { useState } from 'react';

import { PESTICIDAS } from '../utils/config';

function FormDrones({dronChain, cuenta}) {

    const [ alturaVueloMinima, setAlturaVueloMinima ] = useState('');
    const [ alturaVueloMaxima, setAlturaVueloMaxima ] = useState('');
    const [ pesticidas, setPesticidas ] = useState([]);
    const [ coste, setCoste ] = useState('');
    const [ errorAlturaMinima, setErrorAlturaMinima ] = useState(false);
    const [ errorAlturaMaxima, setErrorAlturaMaxima ] = useState(false);
    const [ errorPesticidas, setErrorPesticidas ] = useState(false);
    const [ errorCoste, setErrorCoste ] = useState(false);

    const validarFormulario = () => {
        let error = false;
        setErrorAlturaMinima(false);
        setErrorAlturaMaxima(false);
        setErrorPesticidas(false);
        setErrorCoste(false);

        if (
            alturaVueloMinima.match(/^\d+$/) === null ||
            alturaVueloMinima === "" ||
            alturaVueloMinima === 0 ||
            (alturaVueloMinima >= alturaVueloMaxima && alturaVueloMaxima !== "")
        ) {
          setErrorAlturaMinima(true);
          error = true;
        }
        if (
            alturaVueloMaxima.match(/^\d+$/) === null ||
            alturaVueloMaxima === "" ||
            alturaVueloMaxima === 0 ||
            (alturaVueloMaxima <= alturaVueloMinima && alturaVueloMinima !== "")
        ) {
          setErrorAlturaMaxima(true);
          error = true;
        }        
        if (pesticidas.length === 0) {
            setErrorPesticidas(true);
            error = true;
        }
        if (coste.match(/^\d+$/) === null || coste === "" || coste === 0) {
            setErrorCoste(true);
            error = true;
        } 
        return error;
    }

    const registrarDron = async e => {
        e.preventDefault();

        if (!validarFormulario()) {
            try {
                setErrorAlturaMinima(false);
                setErrorAlturaMaxima(false);
                setErrorPesticidas(false);
                setErrorCoste(false);
                setAlturaVueloMinima('');
                setAlturaVueloMaxima('');
                setPesticidas([]);
                setCoste('');
                await dronChain.registrarDron(alturaVueloMinima, alturaVueloMaxima, pesticidas, coste, { from: cuenta });                
            } catch (error) {
                console.error('ERROR: No se pudo crear el dron.');
            }
        }
    }

    const handleChange = e => {
        const pests = Array.from(
            e.target.selectedOptions,
            option => option.value
        );
        setPesticidas(pests);
    }

    return(
        <div className="card bg-light border-secondary h-100 mt-2 mt-sm-0">
            <div className="card-header bg-secondary text-white text-uppercase">
                <h4 className="mb-0"><strong>Crear Dron</strong></h4>
            </div>
            <div className="card-body text-left pb-0">
                <form onSubmit={registrarDron} noValidate>

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
                                className={`custom-select ${errorPesticidas ? 'is-invalid' : null}`}
                                multiple
                                size={Object.keys(PESTICIDAS).length + 1}
                                value={pesticidas}
                                onChange={handleChange}
                            >
                                <option disabled>-- Seleccione uno o varios pesticidas --</option>
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
                                Debe elegir al menos un pesticida.
                            </div>                                                                             
                        </div>
                    </div>

                    <div className="form-group row">
                        <label htmlFor="coste" className="col-sm-3 col-form-label">
                            Coste del servicio (DRK)
                        </label>
                        <div className="col-sm-9">
                            <input
                                type="number"
                                className={`form-control ${errorCoste ? 'is-invalid' : null}`}
                                id="coste"
                                placeholder="Coste en Drokens"
                                min="0"
                                value={coste}
                                onChange={ e => setCoste(e.target.value) }    
                            />
                            <div className="invalid-feedback font-weight-bold">
                                Debe ser un valor entero.
                            </div>                            
                        </div>
                    </div>                     
 
                    <div className="form-group row">
                        <div className="col-12 text-center">
                            <button type="submit" className="btn btn-secondary btn-block">Guardar</button>
                        </div>
                    </div>    

                </form>
            </div>
        </div>
    )
}

export default FormDrones;