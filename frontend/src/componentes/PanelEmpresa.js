import React from 'react';
import { Redirect } from 'react-router-dom';

import DatosUsuario from './DatosUsuario';
import FormDrones from './FormDrones';
import ListadoDrones from './ListadoDrones';

function PanelEmpresa(props) {
    const { dronChain, owner, cuenta, empresas, drones } = props;

    return(
        cuenta === undefined
        ? 
            <Redirect to='/' />
        : 
            <div className="App container-fluid">
                <div className="row mt-2">
                    <div className="col-12 col-md-4">
                        <DatosUsuario 
                            dronChain={dronChain}
                            owner={owner}
                            cuenta={cuenta}
                            empresas={empresas}
                        />
                    </div>
                    <div className="col-12 col-md-8">
                        <FormDrones
                            dronChain={dronChain}
                            owner={owner}  
                        />
                    </div>
                </div>
                <div className="row m-4">
                    <ListadoDrones drones={drones} />
                </div>   
            </div> 
    )
}

export default PanelEmpresa;