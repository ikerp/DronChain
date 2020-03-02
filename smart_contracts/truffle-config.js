const path = require("path");

module.exports = {
  // Cambiar directorio por defecto para los contratos compilados
  contracts_build_directory: path.join(__dirname, '../frontend/src/contracts'),
  // Definir redes a utilizar
  networks: {
    // Red de desarrollo de GANACHE
    development: {      
      host: 'localhost',
      port: 7545,
      network_id: '*', // matchear cualquier red contra la que se lancen los scripts
      // gas: 15000000 // limite de gas por transaccion
    },
    // Red de desarrollo de Alastria
    testnetAlastria: {
      host: '192.168.56.101',
      port: 22001,
      network_id: '*', // matchear cualquier red contra la que se lancen los scripts
      gas: 0xfffff, // limite de gas por transaccion
      gasPrice: 0x0,
      from: '0x74d4c56d8dcbc10a567341bfac6da0a8f04dc41d'
    }
  },
  compilers: {
    solc: {
      // version: '0.5.0'
    }
  }
};