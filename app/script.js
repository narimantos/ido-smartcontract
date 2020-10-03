const Web3 = require('web3');
const MyContract = require('../build/contracts/ERC20Token.json');


const init1 = async (val) => {

  //var web3 = new Web3(new Web3.providers.HttpProvider("https://rinkeby.infura.io/v3/62697e16b84d4d57a09cc7f4443a65bf"));

  var web3 = new Web3("ws://192.168.2.10:8545");

  const networkId = await web3.eth.net.getId();
  const myContract = new web3.eth.Contract(
    MyContract.abi,
    MyContract.networks[networkId].address


  );
  var methods = await myContract.methods
  console.log("All methods are:")
  console.log(methods)
  //const tx = await web3.eth.getAccounts();
  const tx = val;
  //var userAccount = await displayInformation(tx[0])
  var userAccount = await displayInformation(tx);
  // Check of metamask key is present in tx.


  //  Function: swapExactETHForTokens(uint256 amountOutMin, address[] path, address to, uint256 deadline)

  async function displayInformation(val) {

    // var name = await myContract.methods.name().call();
    var admin = await myContract.methods.admin().call();
    var symbol = await myContract.methods.createToken("Tit", "TI", 100).call();
    // var balance = await myContract.methods.balanceOf(val).call();
    //  var totalSupply = await myContract.methods.totalSupply().call();
    console.log(admin)
    var a = {
      'symbol': admin,
    }; return a
  }
  return userAccount;
}

const initPChannel = async (val) => {

  //var web3 = new Web3(new Web3.providers.HttpProvider("https://rinkeby.infura.io/v3/62697e16b84d4d57a09cc7f4443a65bf"));
  var MyEscrowContract = require('../build/contracts/MultiPartyEscrow.json');

  var web3 = new Web3("http://192.168.2.10:8545");

  const networkId = await web3.eth.net.getId();
    MyEscrowContract = new web3.eth.Contract(
    MyEscrowContract.abi,
    MyEscrowContract.networks[networkId].address


  );
  var methods = await MyEscrowContract.methods
  console.log("All methods are:")
  console.log(methods)
  //const tx = await web3.eth.getAccounts();
  const tx = val;
  //var userAccount = await displayInformation(tx[0])
  var userAccount = await displayInformation(tx);
  // Check of metamask key is present in tx.

  async function displayInformation(val) {
  //  var deposit = await MyEscrowContract.methods.deposit(10).call().then(
  //    deposit => console.log(deposit),console.log("TOKEN FUNCTION RETURNS : ")
  //  );
    var deposit = await MyEscrowContract.methods.deposit(10).call().then(
      deposit => console.log("Deposit === "+deposit) 
    )
 
    var channels = await MyEscrowContract.methods.depositAndOpenChannel(
      "0x4744782cb53279A3aF254E6Ae4431A99Fd90Ab7c",
      "0x40CF76aEd65c48B6DDBaf4408Dd7D7E31D81F95B",
      "0x40CF76aEd65c48B6DDBaf4408Dd7D7E31D81F95B",
      10,
      1601689008

    ).call().then(
      channels => console.log("Deposit and Open Channel  === "+channels) 
    )
    var balances = await MyEscrowContract.methods.balances("0x1d8e17b1b4C472F780569EB679fBA9Df19438690").call().then(
      balances => console.log("BALANCE === "+balances) 
    )
  
  }
 
  return userAccount;
}


//   async function displayInformation(val) {
//       var name = await myContract.methods.name().call();
//       var symbol = await myContract.methods.symbol().call();
//       var balance = await myContract.methods.balanceOf(val).call();
//       var totalSupply = await myContract.methods.totalSupply().call();
//       var a = {
//         'name':name,
//         'symbol':symbol,
//         'balance':balance,
//         'totalSupply': totalSupply
//        };return a
//   }
//   return userAccount;
// }

function initApi() {
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
    console.log(result);
  })

}
initPChannel();
//init1();
//initApi();