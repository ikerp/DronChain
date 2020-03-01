import React from 'react';
import { Redirect } from 'react-router-dom';

import DatosUsuario from './DatosUsuario';
import FormDrones from './FormDrones';
import ListadoDrones from './ListadoDrones';
import ListadoEmpresas from './ListadoEmpresas';

function PanelPropietario(props) {
    const {
      dronChain,
      droken,
      owner,
      cuenta,
      saldo,
      setSaldo,
      drones,
      empresas,
      parcelas,
      dronContratado,
      incrementoSaldo,
      setIncrementoSaldo
    } = props;

    return(
        cuenta !== owner
        ? 
            <Redirect to='/' />
        :        
            <div className="container-fluid">
                <div className="row mt-2">
                    <div className="col-12 col-md-4">
                        <DatosUsuario 
                            dronChain={dronChain}
                            droken={droken}
                            owner={owner}
                            cuenta={cuenta}
                            saldo={saldo}
                            setSaldo={setSaldo}
                            incrementoSaldo={incrementoSaldo}
                            setIncrementoSaldo={setIncrementoSaldo}                            
                        />
                    </div>
                    <div className="col-12 col-md-8">
                        <FormDrones
                            cuenta={cuenta}
                            dronChain={dronChain}
                        />
                    </div>
                </div>
                <div className="row mt-2">
                    <div className="col-12">
                        <div className="accordion" id="listados">
                            <div className="card bg-light border-secondary">
                                <div className="card-header bg-secondary text-white text-uppercase" id="drones">
                                    <h5 className="mb-0 clickable collapsed" data-toggle="collapse" data-target="#collapseDrones" aria-expanded="true" aria-controls="collapseDrones">
                                        <strong>Drones Existentes</strong>
                                    </h5>
                                </div>
                                <div id="collapseDrones" className="collapse" aria-labelledby="drones" data-parent="#listados">
                                    <div className="card-body">
                                        <ListadoDrones
                                            drones={drones}
                                            dronChain={dronChain}
                                            cuenta={cuenta}
                                            dronContratado={dronContratado}
                                        />
                                    </div>
                                </div>
                            </div>
                            <hr className="m-0"/>
                            <div className="card bg-light border-secondary">
                                <div className="card-header bg-secondary text-white text-uppercase" id="empresas">
                                    <h5 className="mb-0 clickable collapsed" data-toggle="collapse" data-target="#collapseEmpresas" aria-expanded="false" aria-controls="collapseEmpresas">
                                        <strong>Empresas Existentes</strong>
                                    </h5>
                                </div>
                                <div id="collapseEmpresas" className="collapse" aria-labelledby="empresas" data-parent="#listados">
                                    <div className="card-body">
                                        <ListadoEmpresas
                                            empresas={empresas}
                                            parcelas={parcelas}    
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div> 
            </div> 
    )
}

export default PanelPropietario;