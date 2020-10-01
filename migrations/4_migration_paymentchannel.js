var Channel = artifacts.require("MultiPartyEscrow");

module.exports = function(deployer, network, accounts) {
  deployer.deploy(Channel, '0x3E0efa145dD29C455C59ED558963d0211ce6a314');
};
