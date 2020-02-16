import React, { useState, useEffect } from 'react';

function ListadoDrones({drones}) {

    if (drones.length === 0) return null;

    return(
        <table className="table table-hover">
            <thead>
                <tr className="bg-secondary text-white">
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
                            {dron.pesticidas.map(pest => pest + ' ')}
                        </td>
                        <td>{dron.coste}</td>
                    </tr>                    
                )}
            </tbody>
        </table>
    )
}

export default ListadoDrones;