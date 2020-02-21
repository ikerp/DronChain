import React, { Fragment, useState, useEffect } from 'react';
import { BrowserRouter, Route } from 'react-router-dom';
import getWeb3 from './getWeb3';

import Bienvenida from './componentes/Bienvenida';
import PanelPropietario from './componentes/PanelPropietario';
import PanelEmpresa from './componentes/PanelEmpresa';

import DronChainContract from './instancias/dronChain';
import DronesERC721Contract from './instancias/dronesERC721';
import ParcelasERC721Contract from './instancias/parcelasERC721';
import EmpresasContract from './instancias/empresas';
import DrokenContract from './instancias/droken';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { PROPIETARIO, EMPRESA, ANONIMO, SIN_METAMASK } from './utils/config';

function App() {
  // State (hooks) ------------------
  // web3
  const [ web3, setWeb3 ] = useState(undefined);

  // INSTANCIAS CONTRATOS
  // Instancia del SC DronChain
  const [ dronChain, setDronChain ] = useState([]);
  // Instancia del SC DronesERC721
  const [ dronesERC721, setDronesERC721 ] = useState([]);  
  // Instancia del SC ParcelasERC721
  const [ parcelasERC721, setParcelasERC721 ] = useState([]);    
  // Instancia del SC Empresas
  const [ empresas, setEmpresas ] = useState([]);  
  // Instancia del SC Droken
  const [ droken, setDroken ] = useState([]);

  // CUENTAS Y TIPOS DE USUARIO
  // Cuenta con la que se esta trabajando
  const [ cuenta, setCuenta ] = useState(undefined);
  // Tipo de usuario validado
  const [ tipoUsuario, setTipoUsuario ] = useState(ANONIMO);
  // Propietario de la aplicacion
  const [owner,setOwner] = useState(undefined);

  // Drones existentes
  const [ drones, setDrones ] = useState([]);
  // Parcelas existentes
  const [ parcelas, setParcelas ] = useState([]);
  // Cantidad de Drokens disponibles por usuario
  const [ saldo, setSaldo ] = useState(0);

  const [ toastEmpresaCreada, setToastEmpresaCreada ] = useState(null);

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
          const parcelasERC721Address = await dronChain.getParcelasContract();
          const parcelasERC721 = await ParcelasERC721Contract(web3.currentProvider, parcelasERC721Address);
          setParcelasERC721(parcelasERC721);          
          const empresasAddress = await dronChain.getEmpresasContract();
          const empresas = await EmpresasContract(web3.currentProvider, empresasAddress);
          setEmpresas(empresas);
          const drokenAddress = await dronChain.getDrokenContract();
          const droken = await DrokenContract(web3.currentProvider, drokenAddress);
          setEmpresas(droken);          

          const owner = await dronChain.owner();
          setOwner(owner.toLowerCase()); 
          
          const saldo = await dronChain.getDrokens(cuenta);
          setSaldo(Number(saldo));

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
          // event DronRegistrado(id, empresa, alturaVueloMinima, alturaVueloMaxima, pesticidas, coste)
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
          // Gestionar el evento de parcela registrada
          // event ParcelaRegistrada(id, empresa, alturaVueloMinima, alturaVueloMaxima, pesticidas, coste)
          parcelasERC721.ParcelaRegistrada({
            fromBlock:0,
            toBlock:'latest'
          }, (error, event) => {
              if (!error) {
                setParcelas(parcelas => [
                  ...parcelas,
                  {
                    'id': event.returnValues.id,
                    'empresa': event.returnValues.empresa,
                    'alturaVueloMinima': event.returnValues.alturaVueloMinima,
                    'alturaVueloMaxima': event.returnValues.alturaVueloMaxima,
                    'pesticida': event.returnValues.pesticida
                  }
                ]);
              } else {
                  console.error("ParcelaRegistrada event: ", error);
              }                
          });          
          // Gestionar el evento de empresa registrada
          // event EmpresaRegistrada(_cuenta, _nombre, _cif)
          empresas.EmpresaRegistrada({
            fromBlock:'latest',
            toBlock:'latest'
          }, (error, event) => {
              if (!error) {
                console.log('------- EVENTO EMPRESA REGISTRADA -------');
                if (cuenta === owner) {
                  toast.info(' Se ha creado una nueva empresa!', {
                    containerId: 'toastEmpresaCreada',
                    position: 'top-right',
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true
                  });
                }
              } else {
                  console.error("EmpresaRegistrada event: ", error);
              }                
          });
          // Gestionar el evento de transferencia de Drokens realizada
          // emit Transfer(sender, recipient, amount)
          droken.Transfer({
            fromBlock:'latest',
            toBlock:'latest'
          }, async (error, event) => {
              if (!error) {
                console.log('------- EVENTO TRANSFERENCIA REALIZADA -------');
                const saldo = await dronChain.getDrokens(cuenta);
                setSaldo(Number(saldo));                
              } else {
                  console.error("Transfer event: ", error);
              }                
          });
        } catch (error) {
          console.error('ERROR: No se pudieron cargar web3, la cuenta o el contrato.');
        }
      }  

      init();
    }, []
  )  

  useEffect(
    () => {
      const comprobarUsuario = async () => {
        if (Object.keys(empresas).length !== 0 && owner !== undefined) {          
          if (cuenta === owner) {
            // Propietario de la web: acceso a drones
            setTipoUsuario(PROPIETARIO);
          } else {        
            const result = await dronChain.isEmpresa(cuenta);
            if (result) {
              // Empresa registrada: acceso a empresas/parcelas
              setTipoUsuario(EMPRESA);
            } else {
              // Empresa sin registrar: formulario registro
              setTipoUsuario(ANONIMO);
            }   
          }
        } 
      }

      // Mostrar mensaje de cambio de cuenta
      if (cuenta === undefined) {
        setTipoUsuario(SIN_METAMASK);
      } else {
        comprobarUsuario();        
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
              dronChain={dronChain}
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
              saldo={saldo}
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
              saldo={saldo}
              parcelas={parcelas}
            />
          )}
        />      
      </BrowserRouter>

      <footer className="fixed-bottom bg-primary py-2 text-muted text-left">
        <div className="container-fluid">
          <span>Autores: Óscar Ortiz e Iker Prego</span>
        </div>          
      </footer> 

      <ToastContainer
        enableMultiContainer 
        containerId={'toastEmpresaCreada'}
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnVisibilityChange
        draggable
        pauseOnHover
      />

      <ToastContainer
        enableMultiContainer 
        containerId={'toastDronContratado'}
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnVisibilityChange
        draggable
        pauseOnHover
      />      

    </Fragment>
  );
}

export default App;
