import React, { useState, useEffect } from 'react';
import { Redirect, withRouter } from 'react-router-dom';

import DatosUsuario from './DatosUsuario';
import FormParcelas from './FormParcelas';
import ListadoParcelas from './ListadoParcelas';

function PanelEmpresa(props) {
    const { dronChain, droken, owner, cuenta, saldo, setSaldo, parcelas, drones, history } = props;

    const [ parcelasEmpresa, setParcelasEmpresa ] = useState([]);
       
    useEffect(
        () => {
            console.log('PANEL EMPRESAAAAAAAAAAAAAAAA')

            const obtenerParcelasEmpresa = () => {
                const result = parcelas.filter(parcela => parcela.empresa.toLowerCase() === cuenta);
                setParcelasEmpresa(result);
            }     
            /*
            const obtenerSaldoEmpresa = async () => {
                const saldo = await dronChain.getDrokens(cuenta);
                setSaldo(Number(saldo));
            }*/

            const checkEmpresa = async () => {
                let isEmpresa = false;
                try {
                    isEmpresa = await dronChain.isEmpresa(cuenta);
                    if (!isEmpresa)
                        history.push('/'); 
                } catch (err) {
                    console.error('ERROR: No se pudo comprobar la empresa.');   
                }
            }

            if (cuenta !== undefined) {
                obtenerParcelasEmpresa();
                checkEmpresa();
            }

            //obtenerSaldoEmpresa();
        //}, [ cuenta, parcelas, dronChain ]
        }, [ cuenta, parcelas ]
    )

    return(
        //(cuenta === owner || cuenta === undefined)
        //?
        //    <Redirect to='/' />
        //:        
            <div className="container-fluid">
                <div className="row mt-2">
                    <div className="col-12 col-md-4">
                        <DatosUsuario 
                            dronChain={dronChain}
                            owner={owner}
                            cuenta={cuenta}
                            saldo={saldo}
                        />
                    </div>
                    <div className="col-12 col-md-8">
                        <FormParcelas
                            cuenta={cuenta}
                            dronChain={dronChain}
                        />
                    </div>
                </div>
                <div className="row mt-2">
                    <div className="col-12">
                        <ListadoParcelas
                            dronChain={dronChain}
                            droken={droken}
                            cuenta={cuenta}
                            parcelasEmpresa={parcelasEmpresa} 
                            drones={drones}
                        />
                    </div>
                </div> 
        </div>
    )
}

export default withRouter(PanelEmpresa);