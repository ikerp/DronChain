const DronChain = artifacts.require("DronChain");

module.exports = async function(deployer) {
  await deployer.deploy(DronChain);
};