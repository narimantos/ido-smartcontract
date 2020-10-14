var HDWalletProvider = require("@truffle/hdwallet-provider");
var mnemonic = "brother drink donor pause enjoy obscure model rough swear toss proud drop";

module.exports = {
  networks: {
    development: {
      host: "192.168.2.10",
      port: 8545,
      network_id: "*", // Match any network id
      gas: "6721975",
      gasPrice: "2000",
      allowUnlimitedContractSize: true
    },
    // rinkeby: {
    //   provider: function(){
    //     return new HDWalletProvider(mnemonic, "localhost:8545");
    //   },
    //   network_id:4,
    //   gas:4500000,
    //   gasPrice: 10000000000,
    // }
  },
  compilers: { 
    solc: {
      version: "0.4.24",
      settings: {
        optimizer: {
          enabled: false, // Default: false
          runs: 200      // Default: 200
        },
      }
    }
  }
};
