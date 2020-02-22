const DronChain = artifacts.require("DronChain");
const Droken = artifacts.require("Droken");
const DronesERC721 = artifacts.require("DronesERC721");
const ParcelasERC721 = artifacts.require("ParcelasERC721");
const Empresas = artifacts.require("Empresas");

const CANTIDAD = 5000;

module.exports = async function(deployer) {
  deployer.deploy(Droken, CANTIDAD)
  .then(async drokens => {
    let drones = await deployer.deploy(DronesERC721);
    let parcelas = await deployer.deploy(ParcelasERC721);
    let empresas = await deployer.deploy(Empresas);
  
    await deployer.deploy(
      DronChain,
      Droken.address,
      DronesERC721.address,
      ParcelasERC721.address,
      Empresas.address
    );
  
    await drokens.transferOwnership(DronChain.address);
    await drones.transferOwnership(DronChain.address);
    await parcelas.transferOwnership(DronChain.address);
    await empresas.transferOwnership(DronChain.address);

    await drokens.approve(DronChain.address, CANTIDAD);
  })
};
