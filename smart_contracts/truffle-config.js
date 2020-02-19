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
      gas: 15000000 // limite de gas por transaccion
    }
  },
  compilers: {
    solc: {
      // version: '0.5.0'
    }
  }
};