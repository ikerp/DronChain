// Para poder crear una instancia de DronChain hay que recuperar los artefactos
// de la salida de la compilacion de truffle
// Habra que ejecutar "truffle compile" y se generara la carpeta "build"
// En ella se necesitara el archivo "DronChain.json" que contiene el ABI y el 
// bytecode del smart contract
import DronChainContract from '../contracts/DronChain.json';

import contract from '@truffle/contract';

// Exportar una funcion asincrona que recibira un parametro provider
// En este caso sera un MetamaskInpageProvider para poder trabajar con Metamask
export default async(provider) => {
    // Crear el contrato de truffle contract para el DronChain
    const dronChain = contract(DronChainContract);
    // Establecer el provider a utilizar por el contrato
    dronChain.setProvider(provider);

    // Crear la instancia y devolverla
    let instance = await dronChain.deployed();
    return instance;
};