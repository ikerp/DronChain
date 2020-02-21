// Para poder crear una instancia de ParcelasERC721 hay que recuperar los artefactos
// de la salida de la compilacion de truffle
// Habra que ejecutar "truffle compile" y se generara la carpeta "build"
// En ella se necesitara el archivo "ParcelasERC721.json" que contiene el ABI y el 
// bytecode del smart contract
import ParcelasERC721Contract from '../contracts/ParcelasERC721.json';

import contract from '@truffle/contract';

// Exportar una funcion asincrona que recibira un parametro provider
// En este caso sera un MetamaskInpageProvider para poder trabajar con Metamask
export default async(provider, contractAddress) => {
    // Crear el contrato de truffle contract para el ParcelasERC721
    const parcelasERC721 = contract(ParcelasERC721Contract);
    // Establecer el provider a utilizar por el contrato
    parcelasERC721.setProvider(provider);

    // Crear la instancia y devolverla
    let instance = await parcelasERC721.at(contractAddress);
    return instance;
};