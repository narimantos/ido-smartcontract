const Web3 = require('web3');
const MyContract = require('../build/contracts/IDO.json');
var abi = require('ethereumjs-abi')

var Bob;
var Alice;

var web3 = new Web3("http://192.168.2.10:8545");

async function initWeb3Accounts() {
  var web3Accounts = await web3.eth.getAccounts().then(result => {
    Bob = result[0];
    Alice = result[1];
  });
}

var PKalice = "d0ed80569b141eee6b58f2df03880370094abfab72fd2f6a111517e00f72af58";
var PKBob = "a64598b5e2075a865bddac9d87c405143ad0fc03b839cdac2e74f2af488717fa";

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

    // var latestChannelId = await MyEscrowContract.methods.getLatestChannelId()
    // .call().then(result => {return result});

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
    var hashWeb3;
    var byte32 =  web3.utils.fromAscii(1);
    var hash;
    var singedMessage;
    async function signPayment(recipient, amount, groupid, nonce, contractAddress) {
      hash = "0x" + abi.soliditySHA3(
          ["string", "address", "address", "address","address","uint256","uint256","uint256","uint256"],
          ["__openChannelByThirdParty", contractAddress, Bob ,Bob,recipient,amount,1,10000000,nonce]
      ).toString("hex");

    hash = await MyEscrowContract.methods.getMessageHash(Alice,1,"validation",1).call()
    .then(result => {return result});
    signatureOfhash = await MyEscrowContract.methods.getEthSignedMessageHash(hash).call()
    .then(result => {return result});
 
    PKSignedHash = web3.eth.accounts.sign(signatureOfhash,PKBob);

    console.log(signatureOfhash.length + " length of signature");

    verify = await MyEscrowContract.methods.verify(
      Bob,Alice,1,"validation",1,PKSignedHash.signature).call()
    .then(result => {return result});
    console.log("is het waar of niet waar *deuntje*" + verify);

    /*newPUBKEY = await MyEscrowContract.methods.recoverSigner(hash,signatureOfhash).call()
    .then(result => console.log("newPUBKEY : "+ result));*/

    console.log("BOBKEY IS " + newPUBKEY);

      hashNUMBER1 = web3.utils.sha3("1");

      hashWeb3 = web3.utils.sha3("__openChannelByThirdParty", contractAddress, Bob ,Bob,recipient,amount,1,10000000,nonce);

      //hash = web3.eth.accounts.hashMessage(hash);

      console.log(hash + " hash");
      console.log(hashWeb3 + " hashWeb3");


      singedMessage = web3.eth.accounts.sign(hashNUMBER1, PKBob);
      console.log("SINGED 1 met ")
      console.log(singedMessage);
      // await MyEscrowContract.methods.getECRecover(singedMessage.messageHash, singedMessage.v, singedMessage.r, singedMessage.s)
      // .call().then(result => console.log(result));

      await MyEscrowContract.methods.keccakMessage()
      .call({from:Bob}).then(result => console.log("SINGED met SC: "+ result)).catch(error => console.log(error + " estimateGas"));

      //console.log(singedMessage.message + " hallo2");
  }


    await signPayment(Alice, 1, 1 , 1, MyEscrowContractJSON.networks[networkId].address)

    /*await MyEscrowContract.methods.getECRecover(singedMessage.messageHash, singedMessage.v, singedMessage.r, singedMessage.s)
    .call().then(result => console.log(result));*/

    var gasOfOpenChannel = await MyEscrowContract.methods.openChannelByThirdParty(
      Bob,
      Bob, // Ganache[0]
      Alice, // Ganache[1]
      byte32,  // groupId,
      1, //  Deposit value
      10000000, // expiration(in ms)
      1, //messageNonce
      singedMessage.v,
      singedMessage.r,
      singedMessage.s,
      //singedMessage.messageHash
      ).estimateGas({from:Bob}).then(result => {return result})
      .catch(error => console.log(error + " estimateGas"));

    await MyEscrowContract.methods.openChannelByThirdParty(
    Bob,
    Bob, // Ganache[0]
    Alice, // Ganache[1]
    byte32,  // groupId,
    1, //  Deposit value
    10000000, // expiration(in ms)
    1, //messageNonce
    singedMessage.v,
    singedMessage.r,
    singedMessage.s
    //singedMessage.messageHash
    ).send({from:Bob, gas: 6721975, gasPrice: gasOfOpenChannel}).then()
    .catch(error => console.log(error + " send"));

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
 //   singedMessage.messageHash,
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