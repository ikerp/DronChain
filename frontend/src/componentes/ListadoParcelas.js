import React from 'react';

import { PESTICIDAS } from '../utils/config';

function ListadoParcelas({parcelas}) {

    if (parcelas.length === 0) return null;

    return(
        <table className="table table-hover table-sm">
            <thead>
                <tr className="bg-secondary text-white text-uppercase">
                    <th colSpan="5"><h4 className="m-2"><strong>Parcelas existentes</strong></h4></th>
                </tr>
                <tr className="bg-light">
                    <th scope="col">#</th>
                    <th scope="col">Altura Vuelo Mínima</th>
                    <th scope="col">Altura Vuelo Máxima</th>
                    <th scope="col">Pesticida</th>
                </tr>
            </thead>
            <tbody>
                {parcelas.map(parcela => 
                    <tr key={parcela.id}>
                        <td>{parcela.id}</td>
                        <td>{parcela.alturaVueloMinima}</td>
                        <td>{parcela.alturaVueloMaxima}</td>
                        <td>{parcela.pesticida}</td>
                    </tr>                    
                )}
            </tbody>
        </table>
    )
}

export default ListadoParcelas;