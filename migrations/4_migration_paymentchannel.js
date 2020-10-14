var Channel = artifacts.require("ContributionChannel");
var MyNotary = artifacts.require("IDO");


module.exports = function(deployer, network, accounts) {
  deployer.deploy(MyNotary, {from: accounts[0]}).then(function() {
  console.log("======================================== IDO ========================================= "+ MyNotary.address)
 
  console.log(accounts);
   return deployer.deploy(Channel, MyNotary.address);
  });
};
console.log("========================================  ========================================= "+ Channel.address)