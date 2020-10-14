const Web3 = require('web3');
const MyContract = require('../build/contracts/IDO.json');
var abi = require('ethereumjs-abi')

var Bob;
var Alice;

var web3 = new Web3("http://192.168.178.29:8545");

async function initWeb3Accounts() {
  var web3Accounts = await web3.eth.getAccounts().then(result => {
    Bob = result[0];
    Alice = result[1];
  });
}

var PKalice = "44e6fe3a3af300d8f8b30fa03625a97bae507bdcb63fc6a75d0c47d7ef70487c";

const initPChannel = async (val) => {

  await initWeb3Accounts();

  var MyEscrowContractJSON = require('../build/contracts/ContributionChannel.json');

  const networkId = await web3.eth.net.getId();
  MyEscrowContract = new web3.eth.Contract(
    MyEscrowContractJSON.abi,
    MyEscrowContractJSON.networks[networkId].address 
  );
  var userAccount = await displayInformation(val);

  async function displayInformation(val) {
    
    await MyEscrowContract.methods.deposit(val).send({from:Bob}).then(
      deposit => console.log("deposited IDO from Bob to MPE: " + val)
    ).catch((error) => console.log(error + "------------------"));

    var latestChannelId = await MyEscrowContract.methods.getLatestChannelId()
    .call().then(result => {return result});

    var Nonce = 1 ; 
  
    /*
      "__openChannelByThirdParty",
      this,
      msg.sender,
      signer,
      recipient,
      groupId,
      value,
      expiration,
      messageNonce
    */
    var hash;
    var singedMessage
    function signPayment(recipient, amount, groupid, nonce, contractAddress) {
      hash = "0x" + abi.soliditySHA3(
          ["string", "address", "address", "address","address","uint256","uint256","uint256","uint256"],
          ["__openChannelByThirdParty", contractAddress, Bob ,recipient,recipient,amount,1,10000000,nonce]
      ).toString("hex");
  
      singedMessage = web3.eth.accounts.sign(hash, PKalice);
  }

  signPayment(Alice, 1, 1 , 1, MyEscrowContractJSON.networks[networkId].address)

    await MyEscrowContract.methods.getECRecover(singedMessage.messageHash, singedMessage.v, singedMessage.r, singedMessage.s)
    .call().then(result => console.log(result));

   var byte32 =  web3.utils.fromAscii(1);

    var gasOfOpenChannel = await MyEscrowContract.methods.openChannelByThirdParty(
      Bob,
      Alice, // Ganache[0]
      Alice, // Ganache[1]
      byte32,  // groupId,
      1, //  Deposit value
      10000000, // expiration(in ms)
      1, //messageNonce
      singedMessage.v,
      singedMessage.r,
      singedMessage.s,
      singedMessage.messageHash).estimateGas({from:Bob}).then(result => {return result})
      .catch(error => console.log(error));

    await MyEscrowContract.methods.openChannelByThirdParty(
    Bob,
    Alice, // Ganache[0]
    Alice, // Ganache[1]
    byte32,  // groupId,
    1, //  Deposit value
    10000000, // expiration(in ms)
    1, //messageNonce
    singedMessage.v,
    singedMessage.r,
    singedMessage.s,
    singedMessage.messageHash).send({from:Bob, gas: 6721975, gasPrice: gasOfOpenChannel}).then()
    .catch(error => console.log(error));

    await MyEscrowContract.methods.balances(Alice).call().then(
      balances => console.log("BALANCE OF ALICE BEFORE Withdraw === "+balances));

    //Later veranderen
    await MyEscrowContract.methods.channels(0).call().then(
        balances => console.log("CHANNEL VALUE BEFORE Claim? === "+balances.value));
    
   await MyEscrowContract.methods.channelClaim(
    0,
    1, // Actual ammount
    1, // planned ammount
    singedMessage.v,
    singedMessage.r,
    singedMessage.s,
    false,
    singedMessage.messageHash,
    Alice // Receiver
    ).send({from: Bob}) // is sendback)

    // AFTER CLAIM CHECK ALICE BALANCE. 
    await MyEscrowContract.methods.balances(Alice).call().then(
      balances => console.log("BALANCE OF ALICE After Claim === "+balances));

    await MyEscrowContract.methods.channels(0).call().then(
      balances => console.log("CHANNEL VALUE OF 0 After Claim? === "+balances.value));
   
  }
  return userAccount;
}

const contributePChannel = async (val) => {

    var MyEscrowContract = require('../build/contracts/DataUnion.json');
    var web3 = new Web3("http://192.168.178.29:8545");

    const networkId = await web3.eth.net.getId();
    MyEscrowContract = new web3.eth.Contract(
      MyEscrowContract.abi,
      MyEscrowContract.networks[networkId].address 
    );

    //await MyEscrowContract.methods.mint().send({from:Bob});
    var gasNeeded = await MyEscrowContract.methods.mint().estimateGas({from:Bob}).then (
      result => {return result}
    );

    await MyEscrowContract.methods.mint().send({from:Bob, gas: 6721975, gasPrice: gasNeeded});

    var result = await MyEscrowContract.methods.getToken(Bob).call().then( result =>
      console.log(result)
    );
}

initPChannel(10);
//contributePChannel(10);