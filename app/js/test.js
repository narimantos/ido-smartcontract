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
	startApp();
	getMetamask();

});

function startApp() {
	web3js = new Web3(web3.currentProvider);
	smart_contract = new web3js.eth.Contract(visualWaifuTokenABI[0].abi, SMART_CONTRACT_ADDRESS);
}

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
	userAccount = promise.then( (val) => getWaifuToken(val));
}

//TODO CHANGE NAME
 function getWaifuToken(val) {
	var myJson;
	document.getElementById('account_owner').innerHTML = "Account owner " + val;
	var account = async () => {
		const response = await fetch("http://localhost:3000/test?account=" + val);
		myJson = response.json().then(function(val){
			//console.log(JSON.parse(val))
			myJson = JSON.parse(val);
			console.log(myJson);
			document.getElementById('contract_name').innerHTML = myJson.name ;
			document.getElementById('contract_amount').innerHTML = myJson.balance ;
		});
		return myJson;
	}
	 account();
}