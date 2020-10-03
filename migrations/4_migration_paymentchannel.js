var Channel = artifacts.require("MultiPartyEscrow");
var MyNotary = artifacts.require("IDO");


module.exports = function(deployer, network, accounts) {
  deployer.deploy(MyNotary, {from: accounts[0]}).then(function() {
  console.log("========================================  ========================================= "+ MyNotary.address)
   return deployer.deploy(Channel, ""+MyNotary.address);
  });
};
