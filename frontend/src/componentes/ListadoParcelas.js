import React, { useState, useEffect } from 'react';

import Swal from 'sweetalert2';

import { PESTICIDAS } from '../utils/config';
import contratosPendientes from '../utils/contratosPendientes';

function ListadoParcelas(props) {

    const { dronChain, droken, cuenta, parcelasEmpresa, drones } = props;

    const [ dron, setDron ] = useState({
        parcelaId: 0,
        dronId: 0
    });
    const [ pendientes, setPendientes ] = useState([]);

    const contratarDron = async (parcelaId, dronId) => {
        let error = false;

        if (dronId !== '') {
            const dron = await dronChain.getDron(dronId);
            try {
                await droken.increaseAllowance(dronChain.address, Number(dron.coste), { from: cuenta });
            } catch (err) {
                error = true;
                console.error('No se ha concedido el gasto para contratar el Dron')
            }
            if (!error) {
                error = false;
                try {
                    await dronChain.contratarDron(Number(dronId), Number(parcelaId), { from: cuenta });
                } catch (err) {
                    error = true;
                    await droken.decreaseAllowance(dronChain.address, Number(dron.coste), { from: cuenta });
                    console.error('No se ha podido contratar el Dron')
                }                
            }
            if (!error) {
                Swal.fire({
                    icon: 'success',
                    title: `¡Dron ${dronId} contratado por ${dron.coste} DRK!`,
                    text: 'Gracias por utilizar nuestros servicios',                
                    confirmButtonColor: '#8E8C84'
                });
            } else {
                Swal.fire({
                    icon: 'error',
                    title: '¡Proceso detenido!',
                    text: 'El dron no ha podido ser contratado',                
                    confirmButtonColor: '#8E8C84'
                });                
            }          
        }
        setDron('');
    }

    const dronesDisponibles = parcela => {
        return drones.filter(dron => 
            (Number(dron.alturaVueloMinima) >= Number(parcela.alturaVueloMinima))
            && (Number(dron.alturaVueloMaxima) <= Number(parcela.alturaVueloMaxima))
            && dron.pesticidas.includes(parcela.pesticida)
        )
    }

    const parcelasPendientesFumigar = () => {
        drones.map(dron => {
            contratosPendientes(dronChain, dron.id)
            .then(contratos => {
                console.log('contratos',contratos)
                setPendientes([
                    ...pendientes,
                    {
                        dronId: dron.id,
                        parcelasId: contratos
                    }
                ])
            });
        });
    }

    const parcelaContratada = parcela => {
        dronesDisponibles(parcela).map(dron => {
            contratosPendientes(dronChain, dron.id)
            .then(contratos => {
                if (contratos.includes(parcela.id)) {
                    console.log('DENTRO TRUE',parcela.id)
                    return true;  
                }
            });
        });
        console.log('FUERA TRUE',parcela.id)
        return false;      
    }

    if (parcelasEmpresa.length === 0) return null;

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
                    <th scope="col">Drones Permitidos</th>
                </tr>
            </thead>
            <tbody>
                {parcelasEmpresa.map(parcela => 
                    <tr key={parcela.id}>
                        <td>{parcela.id}</td>
                        <td>{parcela.alturaVueloMinima}</td>
                        <td>{parcela.alturaVueloMaxima}</td>
                        <td>{PESTICIDAS[parcela.pesticida]}</td>
                        <td>
                            {
                                dronesDisponibles(parcela).length === 0
                                ?
                                    <p className="mb-0 text-danger font-weight-bold">No existen drones adecuados</p>
                                :     
                                    (
                                        parcelaContratada(parcela)
                                        ?
                                            <p className="mb-0 text-danger font-weight-bold">A la espera de ser fumigada</p>
                                        :
                                            (
                                                <div className="form-row">
                                                    <div className="col-auto">
                                                        <select
                                                            id={ parcela.id }
                                                            className="form-control form-control-sm"
                                                            value={dron.parcelaId === parcela.id ? dron.dronId : ''}
                                                            onChange={ e => setDron({parcelaId: parcela.id, dronId: e.target.value}) }
                                                        >
                                                            <option value="">-- Seleccione un dron --</option>
                                                            {   
                                                                dronesDisponibles(parcela).map(dron => {                                                            
                                                                    return (
                                                                        <option
                                                                            key={ dron.id }
                                                                            value={ dron.id }
                                                                        >
                                                                            { `Dron ${dron.id} -- Coste: ${dron.coste} DRK` }
                                                                        </option>
                                                                    )
                                                                })
                                                            }
                                                        </select> 
                                                    </div>
                                                    <div className="col-auto">
                                                        <button
                                                            className="btn btn-secondary btn-sm"
                                                            onClick={ () => contratarDron(parcela.id, document.getElementById(parcela.id).value) }
                                                        >
                                                            Contratar
                                                        </button>                                         
                                                    </div>                                                                       
                                                </div>
                                            )
                                    )                       
                            }
                        </td>
                    </tr>                    
                )}
            </tbody>
        </table>
    )
}

export default ListadoParcelas;