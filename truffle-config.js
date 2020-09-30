var HDWalletProvider = require("@truffle/hdwallet-provider");
var mnemonic = "brother drink donor pause enjoy obscure model rough swear toss proud drop";

module.exports = {
  networks: {
    development: {
      host: "192.168.2.10",
      port: 8545,
      network_id: "*", // Match any network id
      gas: 5000000
    },
    rinkeby: {
      provider: function(){
        return new HDWalletProvider(mnemonic, "localhost:8545");
      },
      network_id:4,
      gas:4500000,
      gasPrice: 10000000000,
    }
  },
  compilers: { 
    solc: {
      version: "0.4.26",
      settings: {
        optimizer: {
          enabled: true, // Default: false
          runs: 200      // Default: 200
        },
      }
    }
  }
};
