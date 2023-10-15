const { Blockchain, Transaction } = require('./blockChain');
const EC = require('elliptic').ec;
const ec = new EC('secp256k1');

const key = ec.keyFromPrivate('de4d039a65d86908b06e4f80f44cde509b1b1f5a70ea476f3035941a62dd86a7');
const walletAddr = key.getPublic('hex');

const simpleCoin = new Blockchain();

const transaction0 = new Transaction(walletAddr, 'public key goes here', 1);
transaction0.signTransaction(key);
simpleCoin.addTransaction(transaction0);

console.log('\nStarting the miner...');
simpleCoin.minePendingTransactions(walletAddr);

console.log('\nBalance of wallet is', simpleCoin.getBalanceOfAddr(walletAddr));

simpleCoin.chain[1].transactions[0].amount = 1; // Try to change the amount of the transaction

console.log('\nIs chain valid?', simpleCoin.isChainValid() ? 'Yes' : 'No');