import React, { Fragment, useState, useEffect } from 'react';

import Spinner from './Spinner';

import { PESTICIDAS } from '../utils/config';

function ListadoEmpresas({empresas, parcelas}) {

    const [ parcelasEmpresas, setParcelasEmpresas ] = useState([]);
    const [ cargando, setCargando ] = useState(true);

    const obtenerParcelasEmpresas = () => {
        setCargando(true);
        let parcelasPorEmpresa = {};
        empresas.forEach(empresa =>    
            parcelasPorEmpresa[empresa.cuenta] = []            
        );

        parcelas.map(parcela =>
            parcelasPorEmpresa[parcela.empresa].push(parcela)
        );

        setParcelasEmpresas(parcelasPorEmpresa);
        setCargando(false);
    }

    useEffect(
        () => {
            obtenerParcelasEmpresas();
        }, [ empresas, parcelas ]
    )

    if (empresas.length === 0) return null;

    return(
        cargando
        ?
        <Spinner />
        :
        (
        <Fragment>
        {empresas.map(empresa => 
            <div key={empresa.cuenta} className="table-responsive-md">
                <table className="table table-hover table-sm mb-0">
                    <thead>
                        <tr className="bg-secondary text-white">
                            <th scope="col">Cuenta</th>
                            <th scope="col">Nombre</th>
                            <th scope="col">CIF</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td className="text-truncate">{empresa.cuenta}</td>
                            <td>{empresa.nombre}</td>
                            <td>{empresa.cif}</td>
                        </tr>   
                    </tbody>
                </table>                                 
                {
                    (parcelasEmpresas[empresa.cuenta] !== undefined && parcelasEmpresas[empresa.cuenta].length !== 0)
                    ?
                        <table className="table table-hover table-sm mt-0">
                            <thead>                                      
                                <tr className="tableParcelas">
                                    <th colSpan="4"><strong>Listado Parcelas</strong></th>
                                </tr>
                                <tr>
                                    <th scope="col">#</th>
                                    <th scope="col">Altura Vuelo Mínima</th>
                                    <th scope="col">Altura Vuelo Máxima</th>
                                    <th scope="col">Pesticida</th>
                                </tr> 
                            </thead>
                            <tbody>                                           
                                {parcelasEmpresas[empresa.cuenta].map(parcela => 
                                    <tr key={parcela.id}>
                                        <td>{parcela.id}</td>
                                        <td>{parcela.alturaVueloMinima}</td>
                                        <td>{parcela.alturaVueloMaxima}</td>
                                        <td>{PESTICIDAS[parcela.pesticida]}</td>
                                    </tr>                
                                )}
                            </tbody>
                        </table>                                         
                    :
                        null
                }                           
            </div>
        )}
        </Fragment>
        )
    )
}

export default ListadoEmpresas;