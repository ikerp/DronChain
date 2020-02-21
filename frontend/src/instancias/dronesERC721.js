// Para poder crear una instancia de DronesERC721 hay que recuperar los artefactos
// de la salida de la compilacion de truffle
// Habra que ejecutar "truffle compile" y se generara la carpeta "build"
// En ella se necesitara el archivo "DronesERC721.json" que contiene el ABI y el 
// bytecode del smart contract
import DronesERC721Contract from '../contracts/DronesERC721.json';

import contract from '@truffle/contract';

// Exportar una funcion asincrona que recibira un parametro provider
// En este caso sera un MetamaskInpageProvider para poder trabajar con Metamask
export default async(provider, contractAddress) => {
    // Crear el contrato de truffle contract para el DronesERC721
    const dronesERC721 = contract(DronesERC721Contract);
    // Establecer el provider a utilizar por el contrato
    dronesERC721.setProvider(provider);

    // Crear la instancia y devolverla
    let instance = await dronesERC721.at(contractAddress);
    return instance;
};