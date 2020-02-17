import React, { useState, useEffect } from 'react';
import getWeb3 from './getWeb3';

import FormDrones from './componentes/FormDrones';
import ListadoDrones from './componentes/ListadoDrones';

import DronChainContract from './dronChain';
import DronesERC721Contract from './dronesERC721';
import EmpresasContract from './empresas';

const PROPIETARIO = 'propietario';
const EMPRESA = 'empresa';
const ANONIMO = 'anonimo';

function App() {
  // State (hooks) ------------------
  // web3
  const [ web3, setWeb3 ] = useState(undefined);
  // Instancia del SC DronChain
  const [ dronChain, setDronChain ] = useState([]);
  // Instancia del SC DronesERC721
  const [ dronesERC721, setDronesERC721 ] = useState([]);  
  // Instancia del SC Empresas
  const [ empresas, setEmpresas ] = useState([]);  
  // Cuenta con la que se esta trabajando
  const [ cuenta, setCuenta ] = useState(undefined);
  // Tipo de usuario validado
  const [ tipoUsuario, setTipoUsuario ] = useState(ANONIMO);
  // Drones existentes
  const [ drones, setDrones ] = useState([]);


  const [owner,setOwner] = useState(undefined);

  useEffect(
    () => {
      // Inicializar dapp
      const init = async () => {
        try {
          // Inicializar web3 
          const web3 = await getWeb3();
          setWeb3(web3);      
          
          // Inicializar la cuenta del usuario
          const cuenta = (await web3.eth.getAccounts())[0];
          setCuenta(cuenta.toLowerCase()); // Metamask trabaja en minusculas    

          // Inicializar la instancia del DronChain con el provider actual
          const dronChain = await DronChainContract(web3.currentProvider);
          setDronChain(dronChain);

          // Obtener la instancia de los contratos desplegados en DronChain
          const dronesERC721Address = await dronChain.getDronesContract();
          const dronesERC721 = await DronesERC721Contract(web3.currentProvider, dronesERC721Address);
          setDronesERC721(dronesERC721);
          const empresasAddress = await dronChain.getEmpresasContract();
          const empresas = await EmpresasContract(web3.currentProvider, empresasAddress);
          setEmpresas(empresas);

          const owner = await dronChain.owner();
          setOwner(owner.toLowerCase());          

          // Registrarse mediante Metamask al evento que se ejecuta al actualizarse la cuenta
          // "publicConfigStore" permite registrarse a diferentes eventos 
          web3.currentProvider.publicConfigStore.on('update', async function(event) {
            // Actualizar el valor de la cuenta al proporcionado por "event.selectedAddress"
            if (event.selectedAddress === null) {
              setCuenta(undefined); // Metamask esta desactivado
            } else {
              setCuenta(event.selectedAddress.toLowerCase()); // Metamask trabaja en minusculas
            }            
          });

          // Levantar listeners de eventos
          // Gestionar el evento de dron registrado
          // event DronRegistrado(empresa, alturaVueloMinima, alturaVueloMaxima, pesticidas, coste)
          dronesERC721.DronRegistrado({
            fromBlock:'latest',
            toBlock:'latest'
          }, function(error, event) {
              if (!error) {
                setDrones(drones => [
                  ...drones,
                  {
                    'id': event.returnValues.id,
                    'empresa': event.returnValues.empresa,
                    'alturaVueloMinima': event.returnValues.alturaVueloMinima,
                    'alturaVueloMaxima': event.returnValues.alturaVueloMaxima,
                    'pesticidas': event.returnValues.pesticidas,
                    'coste': event.returnValues.coste
                  }
                ]);
              } else {
                  console.error("DronRegistrado event: ", error);
              }                
          });
        } catch (error) {
          console.error('ERROR: No se pudieron cargar web3, la cuenta o el contrato.');
        }
      }  

      init();
      console.log('------INICIALIZANDO APLICACION------');
    }, []
  )  

  useEffect(
    () =>{
      const comprobarUsuario = async account => {
        const result = await empresas.isEmpresa(cuenta);
        if (result) {
          // Empresa registrada: acceso parcial
          console.log('--- EMPRESA REGISTRADA ---')
          setTipoUsuario(EMPRESA);
        } else {
          // Empresa sin registrar: formulario registro
          console.log('--- EMPRESA SIN REGISTRAR ---')
          setTipoUsuario(ANONIMO);
        }
      }
      // Mostrar mensaje de cambio de cuenta
      console.log('--- EL USUARIO CAMBIO DE CUENTA ---');
      if (empresas.length !== 0 && cuenta !== 'undefined') {
        console.log('cuenta:',cuenta)
        console.log('owner:',owner)
        if (cuenta === owner) {
          // Propietario de la web: acceso total
          console.log('--- PROPIETARIO ---')
          setTipoUsuario(PROPIETARIO);
        } else {        
          comprobarUsuario(cuenta);
        }
      }     
    }, [ cuenta, empresas ]
  );

  return (
    <div className="App container-fluid">
      { tipoUsuario === ANONIMO ? <h1>WELCOME TO DRONCHAIN</h1> : null }
      <div className="row mt-2">
        <div className="col-12 col-md-4">
          <div className="card bg-secondary">
              <div className="card-header text-white text-uppercase">
                  <h4 className="mb-0"><strong>Usuario conectado</strong></h4>
              </div>
              <div className="card-body bg-light">
                <h4 className="card-title text-center text-truncate">{ cuenta }</h4>
                {
                  cuenta === owner
                  ? <p className="font-weight-bold">Propietario de la web</p>
                  : <p className="font-weight-bold">Empresa registrada</p>
                }
                <p>DronChain address: { dronChain.address }</p>
                <p>DronChain owner: { owner }</p>
              </div>
          </div>
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
  );
}

export default App;
