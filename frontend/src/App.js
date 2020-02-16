import React, { useState, useEffect } from 'react';
import getWeb3 from './getWeb3';

import FormDrones from './componentes/FormDrones';
import ListadoDrones from './componentes/ListadoDrones';

import DronChainContract from './dronChain';
import DronesERC721Contract from './dronesERC721';

function App() {
  // State (hooks) ------------------
  // web3
  const [ web3, setWeb3 ] = useState(undefined);
  // Instancia del SC DronChain
  const [ dronChain, setDronChain ] = useState([]);
  // Instancia del SC DronesERC721
  const [ dronesERC721, setDronesERC721 ] = useState([]);  
  // Cuenta con la que se esta trabajando
  const [ cuenta, setCuenta ] = useState(undefined);
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
          
          // Obtener la cuenta
          const cuenta = (await web3.eth.getAccounts())[0];       

          // Inicializar la instancia del DronChain con el provider actual
          const dronChain = await DronChainContract(web3.currentProvider);
          setDronChain(dronChain);

          // Obtener la instancia de los contratos desplegados en DronChain
          const dronesERC721Address = await dronChain.getDronesContract();
          const dronesERC721 = await DronesERC721Contract(web3.currentProvider, dronesERC721Address);
          setDronesERC721(dronesERC721);
          

          const owner = await dronChain.owner();
          setOwner(owner);          
          
/*
          // Registrarse mediante Metamask al evento que se ejecuta al actualizarse la cuenta
          // "publicConfigStore" permite registrarse a diferentes eventos 
          web3.currentProvider.publicConfigStore.on('update', async function(event) {
            // Actualizar el valor de la cuenta al proporcionado por "event.selectedAddress"
            setCuenta(cuenta.toLowerCase()); // Metamask trabaja en minusculas
            
            setCuenta({
              cuenta: event.selectedAddress.toLowerCase() // Metamask trabaja en minusculas
            }, () => {
                // Cargar la aplicacion cuando account tenga el valor establecido
                // Esto es asi debido a que setState es asincrono
                load();
            });
          });
*/
          // Guardar la cuenta en el estado
          setCuenta(cuenta.toLowerCase()); // Metamask trabaja en minusculas
          /*setCuenta({
            cuenta: cuenta.toLowerCase() // Metamask trabaja en minusculas
          }, () => {
              // Cargar la aplicacion cuando account tenga el valor establecido
              // Esto es asi debido a que setState es asincrono
              load();
          });       */   


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

      //if (typeof web3 === 'undefined') {
        init();
        console.log('------INICIALIZANDO APLICACION------');
      //}
    }, []
  )  

  useEffect(
    () =>{
      // Verificar tipo de usuario
    }, [ cuenta ]
  );

  return (
    <div className="App container-fluid">
      <div className="row mt-2">
        <div className="col-12 col-md-4">
          <div className="card bg-secondary">
              <div className="card-header text-white text-uppercase">
                  <h4 className="mb-0"><strong>Usuario conectado</strong></h4>
              </div>
              <div className="card-body bg-light">
                <h4 className="card-title text-center text-truncate">{ cuenta }</h4>
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
