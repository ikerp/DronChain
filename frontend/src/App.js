import React, { Fragment, useState, useEffect } from "react";
import { BrowserRouter, Route } from "react-router-dom";

import Bienvenida from "./componentes/Bienvenida";
import PanelPropietario from "./componentes/PanelPropietario";
import PanelEmpresa from "./componentes/PanelEmpresa";

import DronChainContract from "./instancias/dronChain";
import DronesERC721Contract from "./instancias/dronesERC721";
import ParcelasERC721Contract from "./instancias/parcelasERC721";
import EmpresasContract from "./instancias/empresas";
import DrokenContract from "./instancias/droken";

import getWeb3 from "./utils/getWeb3";
import { PROPIETARIO, EMPRESA, ANONIMO, SIN_METAMASK } from "./utils/config";
import { Toast } from "./utils/toast";

function App() {
  // State (hooks)
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
  const [ empresasSC, setEmpresasSC ] = useState([]);
  // Instancia del SC Droken
  const [ droken, setDroken ] = useState([]);

  // CUENTAS Y TIPOS DE USUARIO
  // Cuenta con la que se esta trabajando
  const [ cuenta, setCuenta ] = useState(undefined);
  // Propietario de la aplicacion
  const [ owner, setOwner ] = useState(undefined);
  // Tipo de usuario validado
  const [ tipoUsuario, setTipoUsuario ] = useState(SIN_METAMASK);

  // Drones existentes
  const [ drones, setDrones ] = useState([]);
  const [ dronContratado, setDronContratado] = useState(false);
  // Empresas existentes
  const [ empresas, setEmpresas ] = useState([]);
  // Parcelas existentes
  const [ parcelas, setParcelas ] = useState([]);
  // Cantidad de Drokens disponibles por usuario
  const [ saldo, setSaldo ] = useState(0);
  const [ incrementoSaldo, setIncrementoSaldo ] = useState(false);

  // componentDidMount()
  useEffect(() => {
    // Inicializar dapp
    const init = async () => {
      try {
        // Inicializar web3
        const web3 = await getWeb3();
        setWeb3(web3);

        // Inicializar la instancia del DronChain con el provider actual
        const dronChain = await DronChainContract(web3.currentProvider);
        setDronChain(dronChain);

        // Obtener la instancia de los contratos desplegados en DronChain
        const dronesERC721Address = await dronChain.getDronesContract();
        const dronesERC721 = await DronesERC721Contract(
          web3.currentProvider,
          dronesERC721Address
        );
        setDronesERC721(dronesERC721);
        const parcelasERC721Address = await dronChain.getParcelasContract();
        const parcelasERC721 = await ParcelasERC721Contract(
          web3.currentProvider,
          parcelasERC721Address
        );
        setParcelasERC721(parcelasERC721);
        const empresasAddress = await dronChain.getEmpresasContract();
        const empresasSC = await EmpresasContract(
          web3.currentProvider,
          empresasAddress
        );
        setEmpresasSC(empresasSC);
        const drokenAddress = await dronChain.getDrokenContract();
        const droken = await DrokenContract(
          web3.currentProvider,
          drokenAddress
        );
        setDroken(droken);

        // Inicializar la cuenta del usuario y obtener propietario web
        // Metamask trabaja en minusculas
        let cuenta = (await web3.eth.getAccounts())[0].toLowerCase();
        setCuenta(cuenta); 
        let owner = (await dronChain.owner()).toLowerCase();
        setOwner(owner);        

        // LISTENERS DE EVENTOS
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
        // Gestionar el evento de dron registrado
        // event DronRegistrado(id, empresa, alturaVueloMinima, alturaVueloMaxima, pesticidas, coste)
        dronesERC721.DronRegistrado({
          fromBlock:0,
          toBlock:'latest'
        }, (error, event) => {
          if (!error) {
            console.log('------- EVENTO DRON REGISTRADO -------');
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
            console.log('------- EVENTO PARCELA REGISTRADA -------');
            setParcelas(parcelas => [
              ...parcelas,
              {
                'id': event.returnValues.id,
                'empresa': event.returnValues.empresa.toLowerCase(),
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
        empresasSC.EmpresaRegistrada({
          fromBlock:0,
          toBlock:'latest'
        }, async (error, event) => {
          if (!error) {
            console.log('------- EVENTO EMPRESA REGISTRADA -------');
            const ultimoBloque = await web3.eth.getBlockNumber();           

            setEmpresas(empresas => [
              ...empresas,
              {
                'cuenta': event.returnValues._cuenta.toLowerCase(),
                'nombre': event.returnValues._nombre,
                'cif': event.returnValues._cif
              }
            ]);

            const cuentaActiva = (await web3.eth.getAccounts())[0].toLowerCase();
            setCuenta(cuentaActiva);
            if (cuentaActiva === owner && event.blockNumber === ultimoBloque) {
              Toast.fire({
                icon: 'info',
                title: '¡Se ha registrado una nueva empresa!'
              })                
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
            const cuentaActiva = (await web3.eth.getAccounts())[0].toLowerCase();
            setCuenta(cuentaActiva);            
            const saldo = await dronChain.getDrokens(cuentaActiva);
            setSaldo(Number(saldo));                
          } else {
            console.error("Transfer event: ", error);
          }                
        });     
        // Gestionar el evento de Dron contratado
        // emit DronContratado(dronId, parcelaId)
        dronChain.DronContratado({
          fromBlock:'latest',
          toBlock:'latest'
        }, async (error, event) => {
          if (!error) {
            console.log('------- EVENTO DRON CONTRATADO -------'); 
            setDronContratado(!dronContratado);
            const cuentaActiva = (await web3.eth.getAccounts())[0].toLowerCase();
            setCuenta(cuentaActiva);
            if (cuentaActiva === owner) {
              Toast.fire({
                icon: 'info',
                title: `¡Se ha contratado el Dron ${event.returnValues.dronId}!`
              })                
            }                            
          } else {
            console.error("DronContratado event: ", error);
          }                
        });
        // Gestionar el evento de Parcela fumigada
        // emit ParcelaFumigada(parcelaId, dronId)
        dronChain.ParcelaFumigada({
          fromBlock:'latest',
          toBlock:'latest'
        }, async (error, event) => {
          if (!error) {
            console.log('------- EVENTO PARCELA FUMIGADA -------');                           
          } else {
            console.error("ParcelaFumigada event: ", error);
          }                
        });
      } catch (error) {
        if (web3 === undefined) {
          console.error("ERROR: No se pudo cargar web3.");
        } else {
          if (cuenta === undefined)
            console.error("ERROR: No se pudo cargar la cuenta.");
          if (dronChain.length === 0)
            console.error("ERROR: No se pudo cargar el contrato dronChain.");
          if (dronesERC721.length === 0)
            console.error("ERROR: No se pudo cargar el contrato dronesERC721.");
          if (parcelasERC721.length === 0)
            console.error(
              "ERROR: No se pudo cargar el contrato parcelasERC721."
            );
          if (empresasSC.length === 0)
            console.error("ERROR: No se pudo cargar el contrato empresas.");
          if (droken.length === 0)
            console.error("ERROR: No se pudo cargar el contrato droken.");
        }
      }
    };

    init();
  }, []);

  useEffect(
    () => {
      const comprobarUsuario = async () => {
        if (Object.keys(empresasSC).length !== 0 && owner !== undefined) {
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
      };

      const obtenerSaldo = async () => {
        if (cuenta !== undefined && Object.keys(dronChain).length !== 0) {
          const saldo = await dronChain.getDrokens(cuenta);
          setSaldo(Number(saldo));
        }
      };

      if (cuenta === undefined) {
        setTipoUsuario(SIN_METAMASK);
      } else {
        comprobarUsuario();
        obtenerSaldo();
      }
    }, [cuenta, empresasSC, empresas, owner, dronChain, incrementoSaldo]
  );

  return (
    <Fragment>
      <nav className="navbar sticky-top navbar-expand-lg navbar-dark bg-primary">
        <a
          className="navbar-brand font-weight-bolder disabled"
          href="#"
          aria-disabled="true"
        >
          DronChain
        </a>
      </nav>

      <BrowserRouter>
        <Route
          exact
          path="/"
          render={() => (
            <Bienvenida
              cuenta={cuenta}
              tipoUsuario={tipoUsuario}
              setTipoUsuario={setTipoUsuario}
              dronChain={dronChain}
              setSaldo={setSaldo}
            />
          )}
        />
        
        <Route
          exact
          path="/dronchain"
          render={() => (
            <PanelPropietario
              dronChain={dronChain}
              droken={droken}
              owner={owner}
              cuenta={cuenta}
              saldo={saldo}
              setSaldo={setSaldo}
              drones={drones}
              empresas={empresas}
              parcelas={parcelas}
              dronContratado={dronContratado}
              incrementoSaldo={incrementoSaldo}
              setIncrementoSaldo={setIncrementoSaldo}
            />
          )}
        />
        <Route
          exact
          path="/empresas"
          render={() => (
            <PanelEmpresa
              dronChain={dronChain}
              droken={droken}
              owner={owner}
              cuenta={cuenta}
              saldo={saldo}
              setSaldo={setSaldo}
              parcelas={parcelas}
              drones={drones}
              incrementoSaldo={incrementoSaldo}
              setIncrementoSaldo={setIncrementoSaldo}              
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
