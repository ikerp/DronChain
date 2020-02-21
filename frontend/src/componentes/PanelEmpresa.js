import React from 'react';
import { Redirect } from 'react-router-dom';

import DatosUsuario from './DatosUsuario';
import FormParcelas from './FormParcelas';
import ListadoParcelas from './ListadoParcelas';

function PanelEmpresa(props) {
    const { dronChain, owner, cuenta, saldo, parcelas } = props;

    const obtenerParcelas = () => {
        // TODO: filtrar parcelas de la empresa------------------------
    }

    return(
        cuenta === undefined || !dronChain.isEmpresa(cuenta)
        ? 
            <Redirect to='/' />
        :        
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
                            dronChain={dronChain}
                            cuenta={cuenta}  
                        />
                    </div>
                </div>
                <div className="row mt-2">
                    <div className="col-12">
                        <ListadoParcelas parcelas={parcelas} />
                    </div>
                </div> 
            </div> 
    )
}

export default PanelEmpresa;