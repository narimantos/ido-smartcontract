const Web3 = require('web3');
const MyContract = require('../build/contracts/IDO.json');
const Rinkeby = false;

var Bill = "0x418A0e6F1440fB13cc93a5B25930e945BA0E493b";
var Alice = "0x29a59fFB71cE64A386d48EcdC3f5e9adbDb83580"; 

var multiPartyEscrowJSON;
var escrowContract;

var web3;
var networkId;

//Start webserver
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

async function init(){
  //MultiPartyEscrow abi
  multiPartyEscrowJSON = require('../build/contracts/MultiPartyEscrow.json');
  
  //Check const Rinkeby. If true choose first string else string after :.
  web3 = new Web3(Rinkeby?"https://rinkeby.infura.io/v3/62697e16b84d4d57a09cc7f4443a65bf":"http://192.168.178.29:8545");
  //var web3 = new Web3(new Web3.providers.HttpProvider("https://rinkeby.infura.io/v3/62697e16b84d4d57a09cc7f4443a65bf"));  

  //get network id of web3
  networkId = await web3.eth.net.getId() != undefined ? web3.eth.net.getId() : "5777";
}

//Define the escrow contract
function initEscrowContract(){
  escrowContract = new web3.eth.Contract(
    multiPartyEscrowJSON.abi,
    multiPartyEscrowJSON.networks["5777"].address
  );
}

//Deposits funds to payment channel
async function deposit(val) {
  var result = await escrowContract.methods.deposit(val).send({from:Bill}).then(
    result => console.log("deposited amount to bill Balance : " + val)
    ).catch((error) => console.log(error + " in deposit function from script.js"));
  return result;
}

//Check balance of name at address at the moment of.
async function consoleBalance(name, address, moment){
  await escrowContract.methods.balances(address).call().then(
    balances => console.log(`CHANNEL BALANCE OF ${name} ${moment} === ${balances}`));        
}

//OpenChannel
async function initOpenChannel(val){
  var openChannel = await escrowContract.methods.openChannel(
    Bill, // Ganache[0] First address in Ganache
    Alice, // Ganache[1] Second address in Ganache
    10,val,10000) // groupId, Deposit value, expiration(in ms)
}

//Function of paymentchannel
async function activatePaymentChannel(val) {

  initEscrowContract();

  var userAccount = await deposit(val);
  var openChannel = await initOpenChannel(val);

  consoleBalance("ALICE", Alice, "BEFORE");

  //Extra verificatie hier zetten.
  for(var i = 0; i < 5; i++){
    consoleBalance("BILL", Bill, "");
    consoleBalance("ALICE", Alice, "");
    await escrowContract.methods.transfer(Alice,1).send({from:Bill})      
  }
  
  await escrowContract.methods.balanceOwnerToken().call()
    .then(result => console.log("== Balance of msg.sender " + result));

  await escrowContract.methods.balanceOwnerToken(Alice).call()
    .then(result => console.log("== Balance of Alice " + result));

  await escrowContract.methods.withdraw(5).send({from:Alice});
  consoleBalance("ALICE", Alice, "AFTER");

  return userAccount;
}

const IDO = async (val) => {
  var MyEscrowContractabi = require('../build/contracts/IDO.json');
  var MyIDO = require('../build/contracts/MultiPartyEscrow.json');

  var web3 = new Web3("http://192.168.178.29:8545");

  const networkId = await web3.eth.net.getId();
  var MyEscrowContract = new web3.eth.Contract(
    MyEscrowContractabi.abi,
    MyEscrowContract.networks[networkId].address
  );
  const networkEscrowId = await web3.eth.net.getId();
  MyIDO = new web3.eth.Contract(
    MyIDO.abi,
    MyIDO.networks[networkId].address
  );

  var userAccount = await displayInformation();
  
  async function displayInformation() {
    var val = 200;

    var sender = await MyEscrowContract.methods.balanceOf("0x14B1fC6Bc8a831ED0d90b282a97F04b48Bb608B9")
    .call();
    var approveEscrow = await MyEscrowContract.methods.approve("0x3948b75cB2256761245CB992668B4507E2eC2214",val)
    .send({from:"0x14B1fC6Bc8a831ED0d90b282a97F04b48Bb608B9"});
    var approveEscrowCheck = await MyEscrowContract.methods.approveCheck("0x14B1fC6Bc8a831ED0d90b282a97F04b48Bb608B9",
    "0x3948b75cB2256761245CB992668B4507E2eC2214",val).send({from:"0x14B1fC6Bc8a831ED0d90b282a97F04b48Bb608B9"}).then(allowance);
    var allowance = await MyEscrowContract.methods.allowance("0x14B1fC6Bc8a831ED0d90b282a97F04b48Bb608B9",
    "0x3948b75cB2256761245CB992668B4507E2eC2214").call();
    var balances = await MyEscrowContract.methods.getBalancesFrom("0x14B1fC6Bc8a831ED0d90b282a97F04b48Bb608B9")
    .call();
    var check = await MyEscrowContract.methods.transferFrom("0x14B1fC6Bc8a831ED0d90b282a97F04b48Bb608B9"
    ,"0x3948b75cB2256761245CB992668B4507E2eC2214",200).send({from:"0x14B1fC6Bc8a831ED0d90b282a97F04b48Bb608B9"});

    console.log(sender + " balance of sender");
    console.log(approveEscrowCheck + " allowance and setting approve same function");
    console.log(approveEscrow + " function of approve");
    console.log(allowance + " checking allowance");
    console.log(check);
    console.log(balances + " after balance of sender");    
  }
  userAccount;
}

init();
activatePaymentChannel(5);

const init1 = async (val) => {

  //var web3 = new Web3(new Web3.providers.HttpProvider("https://rinkeby.infura.io/v3/62697e16b84d4d57a09cc7f4443a65bf"));

  var web3 = new Web3("ws://192.168.178.29:8545");

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