import React, { useEffect } from 'react';

import { PESTICIDAS } from '../utils/config';
import dronChain from '../instancias/dronChain';

function ListadoDrones({drones, dronChain}) {
   
    const contratosPendientes = async dronId => {
        let contratosPendientes = [];

        const eventosDronContratado = await dronChain.getPastEvents('DronContratado', {
            fromBlock:0,
            toBlock:'latest'            
        });
        
        /*
        eventosDronContratado.map(evento => {
            let contrato = `${evento.returnValues.dronId}:${evento.returnValues.parcelaId}`;
            contratosPendientes.push(contrato);
        });*/

        contratosPendientes = eventosDronContratado.filter(evento => 
            Number(evento.returnValues.dronId) === dronId
        ).map(ev => 
            ev.returnValues.parcelaId
        );

        const eventosParcelaFumigada = await dronChain.getPastEvents('ParcelaFumigada', {
            fromBlock:0,
            toBlock:'latest'            
        });     
        console.log('eventosParcelaFumigada:',eventosParcelaFumigada)
        /*eventosParcelaFumigada.map(evento => {
            let fumigacion = `${evento.returnValues.dronId}:${evento.returnValues.parcelaId}`;
            let index = contratosPendientes.indexOf(fumigacion);
            if (index !== -1) {
                contratosPendientes.splice(index, 1);
            }
        });   */
        eventosParcelaFumigada.filter(evento => 
            Number(evento.returnValues.dronId) === dronId
        ).map(ev => {
            let index = contratosPendientes.indexOf(ev.returnValues.parcelaId);
            if (index !== -1) {
                contratosPendientes.splice(index, 1);
            }
        });
        console.log('contratosPendientes:', contratosPendientes)
    }

    //useEffect(() => { contratosPendientes() }, []);
    contratosPendientes(1);

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