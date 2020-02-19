import React from 'react';

import { PESTICIDAS } from '../utils/config';

function ListadoDrones({drones}) {

    if (drones.length === 0) return null;

    return(
        <table className="table table-hover table-sm">
            <thead>
                <tr className="bg-secondary text-white text-uppercase">
                    <th colSpan="5"><h4 className="m-2"><strong>Drones existentes</strong></h4></th>
                </tr>
                <tr className="bg-light">
                    <th scope="col">#</th>
                    <th scope="col">Altura Vuelo Mínima</th>
                    <th scope="col">Altura Vuelo Máxima</th>
                    <th scope="col">Pesticidas</th>
                    <th scope="col">Coste</th>
                </tr>
            </thead>
            <tbody>
                {drones.map(dron => 
                    <tr key={dron.id}>
                        <td>{dron.id}</td>
                        <td>{dron.alturaVueloMinima}</td>
                        <td>{dron.alturaVueloMaxima}</td>
                        <td>
                            | {dron.pesticidas.map(pest => PESTICIDAS[pest] + ' | ')}
                        </td>
                        <td>{dron.coste}</td>
                    </tr>                    
                )}
            </tbody>
        </table>
    )
}

export default ListadoDrones;