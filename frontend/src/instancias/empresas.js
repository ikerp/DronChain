// Para poder crear una instancia de Empresas hay que recuperar los artefactos
// de la salida de la compilacion de truffle
// Habra que ejecutar "truffle compile" y se generara la carpeta "build"
// En ella se necesitara el archivo "Empresas.json" que contiene el ABI y el 
// bytecode del smart contract
import EmpresasContract from '../contracts/Empresas.json';

import contract from '@truffle/contract';

// Exportar una funcion asincrona que recibira un parametro provider
// En este caso sera un MetamaskInpageProvider para poder trabajar con Metamask
export default async(provider, contractAddress) => {
    // Crear el contrato de truffle contract para el Empresas
    const empresas = contract(EmpresasContract);
    // Establecer el provider a utilizar por el contrato
    empresas.setProvider(provider);

    // Crear la instancia y devolverla
    let instance = await empresas.at(contractAddress);
    return instance;
};