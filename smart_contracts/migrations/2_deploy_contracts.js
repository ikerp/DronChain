const DronChain = artifacts.require("DronChain");
const Droken = artifacts.require("Droken");
const DronesERC721 = artifacts.require("DronesERC721");
const ParcelasERC721 = artifacts.require("ParcelasERC721");
const Empresas = artifacts.require("Empresas");

module.exports = async function(deployer) {
  let drokens = await deployer.deploy(Droken, 5000);
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

  //await drokens.transferOwnership(DronChain.address);
  await drones.transferOwnership(DronChain.address);
  await parcelas.transferOwnership(DronChain.address);
  await empresas.transferOwnership(DronChain.address);
};
