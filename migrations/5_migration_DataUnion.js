var Channel = artifacts.require("DataUnion");

module.exports = function(deployer, network, accounts) {
   return deployer.deploy(Channel);
};