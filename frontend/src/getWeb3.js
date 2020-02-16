import Web3 from 'web3';

// Para proteger la privacidad del usuario, MetaMask y otros
// no inyectan las cuentas de usuario por defecto. 
// Las dapp deben solicitar el acceso a las cuentas y el usuario
// debe aprobar o denegar el acceso.
const getWeb3 = () =>
  new Promise((resolve, reject) => {
    // Esperar a que la pagina haya cargado (load) y asi asegurar
    // que la extension esta disponible
    window.addEventListener('load', async () => {
      if (window.ethereum) { // Modern dapp browsers...
        const web3 = new Web3(window.ethereum);
        try {
          // Solicitar acceso a la cuenta si es necesario
          await window.ethereum.enable();
          // Acceso aprobado: resolver la promesa devolviendo web3
          resolve(web3);
        } catch (error) {
          // Acceso denegado a la cuenta al usuario
          console.error('Acceso denegado a la cuenta al usuario.');
          reject(error);
        }
      } else if (window.web3) { // Legacy dapp browsers...
        // Usar el proveedor Mist/MetaMask
        const web3 = window.web3;
        console.log('Proveedor web3 detectado.');
        resolve(web3);
      } else { // Fallback to localhost...
        try {
          /*const provider = new Web3.providers.HttpProvider(
            'http://127.0.0.1:7545'
          );*/
          const provider = new Web3.providers.WebsocketProvider(
            'ws://127.0.0.1:7545'
          );          
          const web3 = new Web3(provider);
          console.log('Utilizando Local web3 (ganache...).');
          resolve(web3);
        } catch (error) {
          // web3 no esta definido en el navegador
          console.error('No se ha detectado ningún proveedor web3.');
          reject();          
        }
      }
    });
  });

export default getWeb3;
