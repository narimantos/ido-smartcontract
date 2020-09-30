const Web3 = require('web3');
const Provider = require('@truffle/hdwallet-provider');
const MyContract = require('../build/contracts/VisualWaifuToken.json');
const address = '0x4744782cb53279A3aF254E6Ae4431A99Fd90Ab7c';
const privateKey = '31b2704c8f5e10864d108f180b11671d46e260a9b33b3110817c64202a623334';



const init1 = async (val) => {
    var web3 = new Web3("ws://192.168.2.10:8545");

    const networkId = await web3.eth.net.getId();
    const myContract = new web3.eth.Contract(
      MyContract.abi,
      MyContract.networks[networkId].address
    );

    //const tx = await web3.eth.getAccounts();
    const tx = val;
    //var userAccount = await displayInformation(tx[0])
    var userAccount = await displayInformation(tx);
    // Check of metamask key is present in tx.

    async function displayInformation(val) {
        var name = await myContract.methods.name().call();
        var symbol = await myContract.methods.symbol().call();
        var balance = await myContract.methods.balanceOf(val).call();

        var a = {'name':name, 'symbol':symbol, 'balance':balance};
        return a
    }
    return userAccount;
  }

 async function initApi() {
    var express = require("express");
    var app = express();

    app.listen(3000, () => {
      console.log("Hello port user 3000");
    });

    app.use('/js', express.static('js'));
    app.use(express.static('public'));

    app.get("/test", (req, res, next) => {
      var account = req.query.account;
      var returns;

      var result = init1(account).then(val => {
        res.json(JSON.stringify(val));
        return val;
      });
      console.log( result);
    })

  }

  //init1();
  initApi();