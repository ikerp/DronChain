const DronesERC721 = artifacts.require("DronesERC721");

module.exports = function(deployer) {
  deployer.deploy(DronesERC721);
};