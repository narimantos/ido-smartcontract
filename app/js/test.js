var web3;
var SMART_CONTRACT_ADDRESS = "0x3E0efa145dD29C455C59ED558963d0211ce6a314";
var VISUAL_WAIFU_TOKEN;
var smart_contract;
var web3js;
var userAccount;

window.addEventListener('load', () => {
 // Wait for loading completion to avoid race conditions with web3 injection timing.
  if (window.ethereum) {
    web3 = new Web3(window.ethereum);
    try {
		// Request account access if needed
		const hi = async function () {
			window.ethereum.enable();
		};
		/*const accounts = async function () {
			ethereum.send('eth_requestAccounts');
		};*/
		console.log("MetaMask injection");
    } catch (error) {
      console.error(error);
    }
  }
  // Legacy dapp browsers...
  else if (window.web3) {
    // Use Mist/MetaMask's provider.
    const web3 = window.web3;
    console.log('Injected web3 detected.');
    return web3;
  }
  // Fallback to localhost; use dev console port by default...
  else {
    const provider = new Web3.providers.HttpProvider('http://127.0.0.1:8545');
    const web3 = new Web3(provider);
    console.log('No web3 instance injected, using Local web3.');
    return web3;
  }

	//initializeWeb3();
	startApp();
	//displayInformation
	getMetamask();

});

function startApp() {
	web3js = new Web3(web3.currentProvider);
	smart_contract = new web3js.eth.Contract(visualWaifuTokenABI[0].abi, SMART_CONTRACT_ADDRESS);
}

//https://cryptozombies.io/en/lesson/6/chapter/2
// function initializeWeb3() {
// 	//rinkeby test service.
// 	//web3 = new Web3(new Web3.providers.WebsocketProvider("wss://rinkeby.infura.io/ws/v3/84e023c064b1458eaedc358be5c8677a"));
// 	window.web3 = new Web3(window.ethereum);
// }

function getMetamask() {
	//Later uses this is to refresh
	/*var accountInterval = setInterval(function() {
	  // Check if account has changed
	  var tempAccount = web3.eth.getAccounts();
	  if (tempAccount !== userAccount) {
		userAccount = tempAccount;
	  }
	}, 10000);*/
	//return accountInterval;

	var promise = web3.eth.getAccounts();
	userAccount = promise.then( (val) => displayInformation(val));
}

//TODO CHANGE NAME
 function getWaifuToken(val) {
	var myJson;

	var account = async () => {
		const response = await fetch("http://localhost:3000/test?account=" + val);
		myJson = await response.json().then(function(val){
			console.log(val);
		});
		console.log("REPSONE IS ======="+ response) ;console.log(response);
		return myJson;
	}
	 account();
}

function displayInformation(val) {
	document.getElementById('account_owner').innerHTML = "Account owner " + val;

	var response = getWaifuToken(val);

//	document.getElementById('contract_name').innerHTML = response.name;
//	document.getElementById('contract_amount').innerHTML = (`(${response.symbol}) ${response.amount}`);

	/*promise = smart_contract.methods.name().call();
	promise.then( (val) => Waifu_token_text = val + " ");

	promise = smart_contract.methods.symbol().call();
	promise.then( (val1) => document.getElementById('contract_name').innerHTML = Waifu_token_text + val1);

	promise = smart_contract.methods.balanceOf(val[0]).call();
	promise.then( (val1) => document.getElementById('contract_amount').innerHTML = Waifu_token_text + val1);*/

}
