const Web3 = require('web3');
const MyContract = require('../build/contracts/IDO.json');

var Bob = "0xe7E65D6F06362e9F188A9DbFeE9C128Fc4B19939";
var Alice = "0x6E1EfC6eB16A5EE76A88e28B03eb3D38828Fb98C";

var PKalice = "7221169b5f1647d05966383174f3381f38b310f5e2ad3be2fdf93f52ff0d18ee";

const initPChannel = async (val) => {

  var MyEscrowContract = require('../build/contracts/ContributionChannel.json');
  var web3 = new Web3("http://192.168.178.29:8545");

  const networkId = await web3.eth.net.getId();
  MyEscrowContract = new web3.eth.Contract(
    MyEscrowContract.abi,
    MyEscrowContract.networks[networkId].address 
    );
  var userAccount = await displayInformation(val);


  async function displayInformation(val) {

    await MyEscrowContract.methods.deposit(val).send({from:Alice}).then(
      deposit => console.log("deposited From IDOWALLET -> Alice her balance : " + val)
    ).catch((error) => console.log(error + "------------------"));
    
    var dataToSend  = "010101010110010110101010"
    var data2ToSend = "101010101010110101010101"

    var a = web3.eth.accounts.sign(dataToSend, PKalice)
    var b = web3.eth.accounts.sign(data2ToSend,PKalice)

    // console.log(a);
    // console.log(b);
    
   await MyEscrowContract.methods.setData( 
    dataToSend// a.s // + a.s
   ).send({from:Alice})


   await MyEscrowContract.methods.setData(
    data2ToSend //b.s // + b.s
   ).send({from:Bob})



    await MyEscrowContract.methods.getData(Alice).call().then(
      logdssssa => console.log(logdssssa)
    );
    await MyEscrowContract.methods.getData(Bob).call().then(
      logdssssa => console.log(logdssssa)
    );
 
   
       //  await MyEscrowContract.methods.openChannel(
       //     Alice, // Ganache[0]
       //     Alice, // Ganache[1]
       //     10,1,10000) // groupId, Deposit value, expiration(in ms)

    await MyEscrowContract.methods.openChannelByThirdParty(
      Alice,
      Alice, // Ganache[0]
      Bob, // Ganache[1]
      10,10,10000, // groupId, Deposit value, expiration(in ms)
      0,
      a.v,
      a.r,
      a.s)

    await MyEscrowContract.methods.balances(Alice).call().then(
      balances => console.log("BALANCE OF ALICE BEFORE === "+balances));

    await MyEscrowContract.methods.balances("0xbee673a048e9aaB284221115c86793efdE1318E4").call().then(
      balances => console.log("BALANCE STUCK IN CHANNEL === "+balances));

    for(var i = 0; i < 1; i++){
      await MyEscrowContract.methods.balances(Bob).call().then(
        balances => console.log("BALANCE OF Bob === "+balances));
      await MyEscrowContract.methods.balances(Alice).call().then(
          balances => console.log("BALANCE OF Alice === "+balances));
      await MyEscrowContract.methods.transfer(
        Alice,1).send({from:Alice})

    }

    // await MyEscrowContract.methods.balanceOwnerToken().call().then(
    //   result => console.log("== Balance of msg.sender " + result));

    // // await MyEscrowContract.methods.balanceOwnerToken(Alice).call().then(
    // //   result => console.log("== Balance of Alice " + result));

    await MyEscrowContract.methods.withdraw(10).send({from:Alice});

    await MyEscrowContract.methods.balances(Alice).call().then(
      balances => console.log("BALANCE OF ALICE AFTER === "+balances));

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

    //await MyEscrowContract.methods.mint().send({from:Alice});
    //await MyEscrowContract.methods.mint().send({from:Alice});
    //await MyEscrowContract.methods.mint().send({from:Alice});
    //await MyEscrowContract.methods.mint().send({from:Alice});
    await MyEscrowContract.methods.mint().send({from:Bob});

    var result = await MyEscrowContract.methods.getToken(Bob).call().then(
      console.log(result)
    );
}

//initPChannel(100);
contributePChannel(10);