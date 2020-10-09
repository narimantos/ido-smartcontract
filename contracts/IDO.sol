// SPDX-License-Identifier: MIT
pragma solidity >=0.4.24;

import "openzeppelin-solidity/contracts/token/ERC20/ERC20.sol";

// ----------------------------------------------------------------------------
// Sample token contract
//
// Symbol        : VSWT
// Name          : Visual Waifu Token
// Total supply  : 100000
// Decimals      : 0
// Owner Account : 0x8e889576714c3EE6b01878286adeE897Be5036cc
//
// Enjoy.
//
// (c) by Juan Cruz Martinez 2020. MIT Licence.
// ----------------------------------------------------------------------------
// ----------------------------------------------------------------------------
// Lib: Safe Math
// ----------------------------------------------------------------------------
contract SafeMath2 {
    function safeAdd(uint a, uint b) public pure returns (uint c) {
        return c = a + b;
        //require(c >= a);
    }
    function safeSub(uint a, uint b) public pure returns (uint c) {
        require(b <= a, "NOT ENOUGH!!!");
        return c = a - b;
    }
    function safeMul(uint a, uint b) public pure returns (uint c) {
        require(a == 0 || c / a == b);
        return c = a * b;
    }
    function safeDiv(uint a, uint b) public pure returns (uint c) {
        require(b > 0);
        return c = a / b;
    }
}
/**
ERC Token Standard #20 Interface
https://github.com/ethereum/EIPs/blob/master/EIPS/eip-20-token-standard.md
*/
contract ERC20Interface {
    function totalSupply() public constant returns (uint);
    function balanceOf(address tokenOwner) public constant returns (uint balance);
    function allowance(address tokenOwner, address spender) public constant returns (uint remaining);
    function transfer(address to, uint tokens) public returns (bool success);
    function approve(address spender, uint tokens) public returns (bool success);
    function transferFrom(address from, address to, uint tokens) public returns (bool success);
    event Transfer(address indexed from, address indexed to, uint tokens);
    event Approval(address indexed tokenOwner, address indexed spender, uint tokens);
}
/**
Contract function to receive approval and execute function in one call
Borrowed from MiniMeToken
*/
contract ApproveAndCallFallBack {
    function receiveApproval(address from, uint256 tokens, address token, bytes data) public;
}


/**
ERC20 Token, with the addition of symbol, name and decimals and assisted token transfers
*/
contract IDO is ERC20, SafeMath2 {
    string public symbol;
    string public  name;
    uint8 public decimals;
    uint public _totalSupply;
    uint public networkid;
    mapping(address => uint) balances;
    mapping(address => mapping(address => uint)) allowed;
    mapping(address => string) public datas;
    // ------------------------------------------------------------------------
    // Constructor
    // ------------------------------------------------------------------------
    constructor() public {
        symbol = "IDOTK";
        name = "Initial Data offering";
        networkid = 0 ;
        decimals = 0;
        _totalSupply = 10000;
        balances[0xe7E65D6F06362e9F188A9DbFeE9C128Fc4B19939] = _totalSupply;
        emit Transfer(address(0), 0xe7E65D6F06362e9F188A9DbFeE9C128Fc4B19939, _totalSupply);
    }

    // ------------------------------------------------------------------------
    // get data
    // ------------------------------------------------------------------------  
    function getData(address sender) public constant returns (string) {
        return datas[sender];
    }

    // ------------------------------------------------------------------------
    // set data
    // ------------------------------------------------------------------------  
    function setData( address adr , string givenData) public {
        //require(msg.value == 1);
        //datas[msg.sender] = givenData;
        datas[adr] = givenData;
    }

    // ------------------------------------------------------------------------
    // Total supply
    // ------------------------------------------------------------------------
    function totalSupply() public constant returns (uint) {
        return _totalSupply  - balances[address(0)];
    }
    // ------------------------------------------------------------------------
    // Get the token balance for account tokenOwner
    // ------------------------------------------------------------------------
    function balanceOf(address tokenOwner) public constant returns (uint balance) {
        return balances[tokenOwner];
    }
    // ------------------------------------------------------------------------
    // Transfer the balance from token owner's account to to account
    // - Owner's account must have sufficient balance to transfer
    // - 0 value transfers are allowed
    // balances[address van payment-channel] => 20
    //
    // ------------------------------------------------------------------------
    function transfer(address to, uint tokens) public returns (bool success) {
        balances[msg.sender] = safeSub(balances[msg.sender], tokens);
        balances[to] = safeAdd(balances[to], tokens);
        emit Transfer(msg.sender, to, tokens);
        return true;
    }
    // ------------------------------------------------------------------------
    // Token owner can approve for spender to transferFrom(...) tokens
    // from the token owner's account
    //
    // https://github.com/ethereum/EIPs/blob/master/EIPS/eip-20-token-standard.md
    // recommends that there are no checks for the approval double-spend attack
    // as this should be implemented in user interfaces 
    // ------------------------------------------------------------------------
    function approve(address spender, uint256 tokens) public returns (bool success) {
        allowed[msg.sender][spender] = tokens;
        emit Approval(msg.sender, spender, tokens);
        return true;
    }
    function approve2(address from, address spender, uint tokens) public returns (bool success) {
        allowed[from][spender] = tokens;
        emit Approval(from, spender, tokens);
        return true;
    }
    // ------------------------------------------------------------------------
    // Transfer tokens from the from account to the to account
    // 
    // The calling account must already have sufficient tokens approve(...)-d
    // for spending from the from account and
    // - From account must have sufficient balance to transfer
    // - Spender must have sufficient allowance to transfer
    // - 0 value transfers are allowed
    // ------------------------------------------------------------------------
    function transferFrom(address from, address to, uint tokens) public returns (bool success) {
        balances[from] = safeSub(balances[from], tokens);
        //allowed[from][msg.sender] = safeSub(allowed[from][msg.sender], tokens);
        //allowed[from][to] = safeSub(allowed[from][to], tokens);
        balances[to] = safeAdd(balances[to], tokens);
        emit Transfer(from, to, tokens);
        return true;
    }

    function getBalancesFrom(address from) public view returns (uint balance){
        return balances[from];
    }

    // ------------------------------------------------------------------------
    // Returns the amount of tokens approved by the owner that can be
    // transferred to the spender's account
    // ------------------------------------------------------------------------
    function allowance(address from, address spender) public view returns (uint remaining) {
        remaining  = allowed[from][spender];
        return remaining;
    }
    // ------------------------------------------------------------------------
    // Token owner can approve for spender to transferFrom(...) tokens
    // from the token owner's account. The spender contract function
    // receiveApproval(...) is then executed
    // ------------------------------------------------------------------------
    function approveAndCall(address spender, uint tokens, bytes data) public returns (bool success) {
        allowed[msg.sender][spender] = tokens;
        emit Approval(msg.sender, spender, tokens);
        ApproveAndCallFallBack(spender).receiveApproval(msg.sender, tokens, this, data);
        return true;
    }
    // ------------------------------------------------------------------------
    // Don't accept ETH
    // ------------------------------------------------------------------------
    function () public payable {
        revert();
    }
}