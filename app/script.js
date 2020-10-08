const Web3 = require('web3');
const MyContract = require('../build/contracts/IDO.json');

var Bob = "0xa85108Ce1E9710679246ceb9F61b18B1326A1fBB";
var Alice = "0x7E0FE112FdD3B280DE41468bf8A51005943cfA00";

var PKalice = "4e9aa14e34f611d6500ec35c903b71308d469cb3a37b32423f1c5e957526a3f6"


const initPChannel = async (val) => {

  var MyEscrowContract = require('../build/contracts/ContributionChannel.json');
  var web3 = new Web3("http://192.168.2.10:8545");

  const networkId = await web3.eth.net.getId();
  MyEscrowContract = new web3.eth.Contract(
    MyEscrowContract.abi,
    MyEscrowContract.networks[networkId].address 
    );
  var userAccount = await displayInformation(val);


  async function displayInformation(val) {

    await MyEscrowContract.methods.deposit(val).send({from:Alice}).then(
      deposit => console.log("deposited amount in Alice her balance : " + val)
    ).catch((error) => console.log(error + "------------------"));

 
    var a = web3.eth.accounts.sign("010101010110010110101010", PKalice)
    var b = web3.eth.accounts.sign("101010101010110101010101", PKalice)


    
   await MyEscrowContract.methods.setData( 
    a.signature
   ).send({from:Alice})


   await MyEscrowContract.methods.setData(
   // web3.eth.accounts.sign("1010101101010101101010101", PKalice)
    b.signature
   ).send({from:Bob})



    await MyEscrowContract.methods.getData(Alice).call().then(
      logdssssa => console.log(logdssssa)
    );
    await MyEscrowContract.methods.getData(Bob).call().then(
      logdssssa => console.log(logdssssa)
    );
 
   
   await MyEscrowContract.methods.openChannel(
      Alice, // Ganache[0]
      Alice, // Ganache[1]
      10,1,10000) // groupId, Deposit value, expiration(in ms)

      await MyEscrowContract.methods.balances(Alice).call().then(
        balances => console.log("BALANCE OF ALICE BEFORE === "+balances));

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

}


initPChannel(100);


// function initApi() {
//   var express = require("express");
//   var app = express();

//   app.listen(3000, () => {
//     console.log("Hello port user 3000");
//   });

//   app.use('/js', express.static('js'));
//   app.use(express.static('public'));

//   app.get("/test", (req, res, next) => {
//     var account = req.query.account;
//     var returns;

//     var result = init1(account).then(val => {
//       res.json(JSON.stringify(val));
//       return val;
//     });
//     console.log(result);
//   })

// }


// const IDO = async (val) => {

//   //var web3 = new Web3(new Web3.providers.HttpProvider("https://rinkeby.infura.io/v3/62697e16b84d4d57a09cc7f4443a65bf"));
//   var MyEscrowContractabi = require('../build/contracts/IDO.json');
//   var MyIDO = require('../build/contracts/MultiPartyEscrow.json');

//   var web3 = new Web3("http://192.168.178.29:8545");

//   const networkId = await web3.eth.net.getId();
//   var MyEscrowContract = new web3.eth.Contract(
//     MyEscrowContractabi.abi,
//     "0x1979b6B87e9C5625a194A304989446EeAC10A9b0"
//     //MyEscrowContract.networks[networkId].address
//   );
//   const networkEscrowId = await web3.eth.net.getId();
//   MyIDO = new web3.eth.Contract(
//     MyIDO.abi,
//     MyIDO.networks[networkId].address
//   );

//   //var methods = await MyEscrowContract.methods
//   var userAccount = await displayInformation();
  
//   async function displayInformation() {
//     var val = 200;

//     var sender = await MyEscrowContract.methods.balanceOf("0x14B1fC6Bc8a831ED0d90b282a97F04b48Bb608B9")
//     .call();
//     var approveEscrow = await MyEscrowContract.methods.approve("0x3948b75cB2256761245CB992668B4507E2eC2214",val)
//     .send({from:"0x14B1fC6Bc8a831ED0d90b282a97F04b48Bb608B9"});
//     var approveEscrowCheck = await MyEscrowContract.methods.approveCheck("0x14B1fC6Bc8a831ED0d90b282a97F04b48Bb608B9",
//     "0x3948b75cB2256761245CB992668B4507E2eC2214",val).send({from:"0x14B1fC6Bc8a831ED0d90b282a97F04b48Bb608B9"}).then(allowance);
//     var allowance = await MyEscrowContract.methods.allowance("0x14B1fC6Bc8a831ED0d90b282a97F04b48Bb608B9",
//     "0x3948b75cB2256761245CB992668B4507E2eC2214").call();
//     var balances = await MyEscrowContract.methods.getBalancesFrom("0x14B1fC6Bc8a831ED0d90b282a97F04b48Bb608B9")
//     .call();
//     var check = await MyEscrowContract.methods.transferFrom("0x14B1fC6Bc8a831ED0d90b282a97F04b48Bb608B9"
//     ,"0x3948b75cB2256761245CB992668B4507E2eC2214",2000).send({from:"0x14B1fC6Bc8a831ED0d90b282a97F04b48Bb608B9"});

//     console.log(sender + " balance of sender");
//     console.log(approveEscrowCheck + " allowance and setting approve same function");
//     console.log(approveEscrow + " function of approve");
//     console.log(allowance + " checking allowance");
//     console.log(check);
//     console.log(balances + " after balance of sender");    
//   }
//   userAccount;
// }

//initApi();
//IDO();
//init1();





// const init1 = async (val) => {

//   //var web3 = new Web3(new Web3.providers.HttpProvider("https://rinkeby.infura.io/v3/62697e16b84d4d57a09cc7f4443a65bf"));

//   var web3 = new Web3("ws://192.168.178.29:8545");

//   const networkId = await web3.eth.net.getId();
//   const myContract = new web3.eth.Contract(
//     MyContract.abi,
//     MyContract.networks[networkId].address


//   );
//   var methods = await myContract.methods
//   console.log("All methods are:")
//   console.log(methods)
//   //const tx = await web3.eth.getAccounts();
//   const tx = val;
//   //var userAccount = await displayInformation(tx[0])
//   var userAccount = await displayInformation(tx);
//   // Check of metamask key is present in tx.


//   //  Function: swapExactETHForTokens(uint256 amountOutMin, address[] path, address to, uint256 deadline)

//   async function displayInformation(val) {

//     // var name = await myContract.methods.name().call();
//     var admin = await myContract.methods.admin().call();
//     var symbol = await myContract.methods.createToken("Tit", "TI", 100).call();
//     // var balance = await myContract.methods.balanceOf(val).call();
//     //  var totalSupply = await myContract.methods.totalSupply().call();
//     console.log(admin)
//     var a = {
//       'symbol': admin,
//     }; return a
//   }
//   return userAccount;
// }


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