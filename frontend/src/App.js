import React, { Fragment, useState, useEffect } from 'react';
import { BrowserRouter, Route } from 'react-router-dom';
import getWeb3 from './getWeb3';

import Bienvenida from './componentes/Bienvenida';
import PanelPropietario from './componentes/PanelPropietario';
import PanelEmpresa from './componentes/PanelEmpresa';
import DatosUsuario from './componentes/DatosUsuario';

import DronChainContract from './dronChain';
import DronesERC721Contract from './dronesERC721';
import EmpresasContract from './empresas';

import { PROPIETARIO, EMPRESA, ANONIMO, SIN_METAMASK } from './utils/config';

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
          web3.currentProvider.publicConfigStore.on('update', async event => {
            // Actualizar el valor de la cuenta al proporcionado por "event.selectedAddress"
            if (event.selectedAddress === null) {
              setCuenta(undefined); // Metamask esta desactivado
              setTipoUsuario(SIN_METAMASK);
            } else {
              setCuenta(event.selectedAddress.toLowerCase()); // Metamask trabaja en minusculas
            }            
          });

          // Levantar listeners de eventos 
          // Gestionar el evento de dron registrado
          // event DronRegistrado(empresa, alturaVueloMinima, alturaVueloMaxima, pesticidas, coste)
          dronesERC721.DronRegistrado({
            fromBlock:0,
            toBlock:'latest'
          }, (error, event) => {
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
    () => {
      const comprobarUsuario = async account => {
        if (empresas.length !== 0 && owner !== undefined) {          
          if (cuenta === owner) {
            // Propietario de la web: acceso total
            console.log('--- PROPIETARIO ---')
            setTipoUsuario(PROPIETARIO);
          } else {        
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
        } 
      }

      // Mostrar mensaje de cambio de cuenta
      console.log('--- EL USUARIO CAMBIO DE CUENTA ---');
      if (cuenta === undefined) {
        setTipoUsuario(SIN_METAMASK);
      } else {
        comprobarUsuario(cuenta);        
      }      
    }, [ cuenta, empresas, owner ]
  );

  return (
    <Fragment>

      <nav className="navbar sticky-top navbar-expand-lg navbar-dark bg-primary">
        <a className="navbar-brand font-weight-bolder disabled" href="#" aria-disabled="true">DronChain</a>
      </nav>

      <BrowserRouter>
        <Route
          exact path='/'
          render={() => (
            <Bienvenida
              cuenta={cuenta}
              tipoUsuario={tipoUsuario}
              setTipoUsuario={setTipoUsuario}
              setCuenta={setCuenta}
            />
          )}
        />
        <Route
          exact path='/dronchain'
          render={() => (
            <PanelPropietario
              dronChain={dronChain}
              owner={owner}
              cuenta={cuenta}
              empresas={empresas}
              drones={drones}
            />
          )}
        />
        <Route
          exact path='/empresas'
          render={() => (
            <PanelEmpresa
              dronChain={dronChain}
              owner={owner}
              cuenta={cuenta}
              empresas={empresas}
              drones={drones}
            />
          )}
        />      
      </BrowserRouter>

      <footer className="fixed-bottom bg-primary py-2 text-muted text-left">
        <div className="container-fluid">
          <span>Autores: Óscar Ortiz e Iker Prego</span>
        </div>          
      </footer>  

    </Fragment>
  );
}

export default App;
