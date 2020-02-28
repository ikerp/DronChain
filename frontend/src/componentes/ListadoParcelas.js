import React, { useState, useEffect } from 'react';

import Spinner from './Spinner';

import Swal from 'sweetalert2';

import { PESTICIDAS } from '../utils/config';
//import parcelaPendienteFumigar from '../utils/parcelaPendienteFumigar';

function ListadoParcelas(props) {

    const { dronChain, droken, cuenta, parcelasEmpresa, drones } = props;

    const [ dron, setDron ] = useState({
        parcelaId: 0,
        dronId: 0
    });

    const [ fumigacionPendiente, setFumigacionPendiente ] = useState({});
    const [ cargando, setCargando ] = useState(true);
    const [ recargar, setRecargar ] = useState(true);

    const contratarDron = async (parcelaId, dronId) => {
        let error = false;

        if (dronId !== '') {
            /*const pendiente = await parcelaPendienteFumigar(dronChain, parcelaId);
            if (pendiente) {
                Swal.fire({
                    icon: 'error',
                    title: '¡Contrato desestimado!',
                    text: 'La parcela está pendiente de ser fumigada',                
                    confirmButtonColor: '#8E8C84'
                }); 
            } else {*/
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
                    setRecargar(!recargar);
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
            //}   
            setDron('');            
        }
    }

    const dronesDisponibles = parcela => {
        return drones.filter(dron => 
            (Number(dron.alturaVueloMinima) >= Number(parcela.alturaVueloMinima))
            && (Number(dron.alturaVueloMaxima) <= Number(parcela.alturaVueloMaxima))
            && dron.pesticidas.includes(parcela.pesticida)
        )
    }

    const obtenerParcelasPendienteFumigar = () => {
        if (parcelasEmpresa.length === 0) {
            setFumigacionPendiente({});
            setCargando(false);
        } else {
            setCargando(true);
            let contratosPorParcela = {};
            parcelasEmpresa.forEach(parcela => {           
                contratosPorParcela[parcela.id] = [];            
            });

            dronChain.getPastEvents('DronContratado', {
                fromBlock:0,
                toBlock:'latest'            
            })
            .then(eventos => {
                eventos.forEach(evento => {
                    // Verificar que la parcela es de la empresa
                    if (Object.keys(contratosPorParcela).includes(evento.returnValues.parcelaId))
                        contratosPorParcela[evento.returnValues.parcelaId].push(evento.returnValues.dronId);
                });
            
                dronChain.getPastEvents('ParcelaFumigada', {
                    fromBlock:0,
                    toBlock:'latest'            
                })
                .then(eventos => {
                    eventos.forEach(evento => {
                        // Verificar que la parcela es de la empresa
                        if (Object.keys(contratosPorParcela).includes(evento.returnValues.parcelaId)) {
                            let index = contratosPorParcela[evento.returnValues.parcelaId].indexOf(evento.returnValues.dronId);
                            if (index !== -1) {
                                contratosPorParcela[evento.returnValues.parcelaId].splice(index, 1);
                            } 
                        }                       
                    });
                    setFumigacionPendiente(contratosPorParcela);
                    setCargando(false);
                })
            })
        }
    };    

    useEffect(
        ()=> {
            //if (recargar) {
                obtenerParcelasPendienteFumigar();
                //setRecargar(false);
            //}
        }, [ parcelasEmpresa, recargar ]
    );

    if (parcelasEmpresa.length === 0) return null;

    return(
        cargando
        ?
        <Spinner />
        :
        (        
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
                                        (fumigacionPendiente[parcela.id] === undefined || fumigacionPendiente[parcela.id].length !== 0)
                                        ?
                                            <p className="mb-0 text-danger font-weight-bold">Parcela pendiente de fumigar</p>
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
    )
}

export default ListadoParcelas;