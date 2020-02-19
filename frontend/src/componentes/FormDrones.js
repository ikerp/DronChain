import React, { useState } from 'react';

import { PESTICIDAS } from '../utils/config';

function FormDrones({dronChain, owner}) {

    const [ alturaVueloMinima, setAlturaVueloMinima ] = useState(0);
    const [ alturaVueloMaxima, setAlturaVueloMaxima ] = useState(0);
    const [ pesticidas, setPesticidas ] = useState(PESTICIDAS);
    const [ coste, setCoste ] = useState(0);

    const registrarDron = e => {
        e.preventDefault();
        // TODO: COMPROBAR CAMPOS FORMULARIO------------
        dronChain.registrarDron(alturaVueloMinima, alturaVueloMaxima, pesticidas, coste, { from: owner });
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
                <h4 className="mb-0"><strong>Introduzca los datos del Dron</strong></h4>
            </div>
            <div className="card-body text-left">
                <form onSubmit={registrarDron}>

                    <div className="form-group row">
                        <label htmlFor="alturaVueloMinima" className="col-sm-3 col-form-label">
                            Altura de vuelo mínima
                        </label>
                        <div className="col-sm-9">
                            <input
                                type="number"
                                className="form-control"
                                id="alturaVueloMinima"
                                placeholder="Altura de vuelo mínima (número entero)"
                                min="1" max="50"
                                onChange={ e => setAlturaVueloMinima(e.target.value) }    
                            />
                        </div>
                    </div>

                    <div className="form-group row">
                        <label htmlFor="alturaVueloMaxima" className="col-sm-3 col-form-label">
                            Altura de vuelo máxima
                        </label>
                        <div className="col-sm-9">
                            <input
                                type="number"
                                className="form-control"
                                id="alturaVueloMaxima"
                                placeholder="Altura de vuelo máxima (número entero)"
                                min="1" max="50"
                                onChange={ e => setAlturaVueloMaxima(e.target.value) }    
                            />
                        </div>
                    </div>      

                    <div className="form-group row">
                        <label htmlFor="pesticidas" className="col-sm-3 col-form-label">
                            Pesticidas disponibles
                        </label>    
                        <div className="col-sm-9">
                            <select
                                className="custom-select"
                                multiple
                                size="6"
                                value={pesticidas}
                                onChange={handleChange}
                            >
                                <option disabled>-- Seleccione uno o varios pesticidas --</option>
                                { Object.keys(pesticidas).map((key, index) => 
                                    <option
                                        key={ key }
                                        value={ key }
                                    >
                                        { pesticidas[key] }
                                    </option>
                                )}
                            </select>                                                  
                        </div>
                    </div>

                    <div className="form-group row">
                        <label htmlFor="coste" className="col-sm-3 col-form-label">
                            Coste del servicio (DRK)
                        </label>
                        <div className="col-sm-9">
                            <input
                                type="number"
                                className="form-control"
                                id="coste"
                                placeholder="Coste en Drokens"
                                min="0"
                                onChange={ e => setCoste(e.target.value) }    
                            />
                        </div>
                    </div>                     
 
                    <div className="form-group row">
                        <div className="col-12 text-center">
                            <button type="submit" className="btn btn-secondary">Guardar</button>
                        </div>
                    </div>    

                </form>
            </div>
        </div>
    )
}

export default FormDrones;