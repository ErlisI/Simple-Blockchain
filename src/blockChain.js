const SHA256 = require('crypto-js/sha256');
const EC = require('elliptic').ec;
const ec = new EC('secp256k1');

class Transaction {
    // Initialize the transaction
    constructor(fromAddr, toAddr, amount) {
        this.fromAddr = fromAddr; // Address of the sender
        this.toAddr = toAddr; // Address of the receiver
        this.amount = amount; // Amount of currency being sent
    }

    // Calculate the hash of the transaction
    calculateHash() {
        return SHA256(this.fromAddr + this.toAddr + this.amount).toString();
    }

    // Sign the transaction
    signTransaction(signingKey) {
        if (signingKey.getPublic('hex') !== this.fromAddr)
            throw new Error('You cannot sign transactions for other wallets!');
        const hashTx = this.calculateHash();
        const sig = signingKey.sign(hashTx, 'base64');
        this.signature = sig.toDER('hex');
    }

    // Check if the transaction is valid
    isValid() {
        if (this.fromAddr === null)
            return true;
        if (!this.signature || this.signature.length === 0)
            throw new Error('No signature in this transaction!');
        const publicKey = ec.keyFromPublic(this.fromAddr, 'hex');
        return publicKey.verify(this.calculateHash(), this.signature);
    }
}

class Block {
    // Initialize the block
    constructor(timestamp, transactions, prevHash = '') {
        this.timestamp = timestamp; // When the block was created
        this.transactions = transactions; // Details of the transaction (for a currency)
        this.prevHash = prevHash; // String that contains the hash of the block before this one
        this.hash = this.calculateHash(); // Hash of the block
        this.nonce = 0; // Random number used in mining
    }

    // Calculate the hash of the block
    calculateHash() {
        return SHA256(this.index + this.prevHash + this.timestamp + JSON.stringify(this.data) + this.nonce).toString();
    }

    // Mine the block
    mineBlock(diff) {
        while (this.hash.substring(0, diff) !== Array(diff + 1).join("0")) {
            this.nonce++;
            this.hash = this.calculateHash();
        }
        console.log("Block mined: " + this.hash);
    }

    // Check if the transactions in the block are valid
    hasValidTransactions() {
        for (const t of this.transactions) {
            if (!t.isValid())
                return false;
        }
        return true;
    }
}

class Blockchain {
    // Initialize the blockchain
    constructor() {
        this.chain = [this.createGenesisBlock()]; // First block in the chain is the genesis block
        this.diff = 1; // Difficulty of mining the block
        this.pendingTransactions = []; // Transactions that are waiting to be mined
        this.miningReward = 10; // Reward for mining a block
    }

    // Create the genesis block
    createGenesisBlock() {
        return new Block("01/01/2024", "Genesis block", "0");
    }

    // Get the latest block in the chain
    getLatestBlock() {
        return this.chain[this.chain.length - 1];
    }

    // Mine the pending transactions
    minePendingTransactions(miningRewardAddr) {
        const rewardTransaction = new Transaction(null, miningRewardAddr, this.miningReward);
        this.pendingTransactions.push(rewardTransaction);

        let block = new Block(Date.now(), this.pendingTransactions);
        block.mineBlock(this.diff);

        console.log("Block mined successfully!");
        this.chain.push(block);

        this.pendingTransactions = [
            new Transaction(null, miningRewardAddr, this.miningReward)
        ];
    }

    // Add a new transaction to the pending transactions
    addTransaction(transaction) {
        if (!transaction.fromAddr || !transaction.toAddr)
            throw new Error('Transaction must include from and to address!');

        if (!transaction.isValid())
            throw new Error('Cannot add invalid transaction to chain!');

        this.pendingTransactions.push(transaction);
    }

    // Get the balance of an address
    getBalanceOfAddr(addr) {
        let balance = 0;

        for (const block of this.chain) {
            for (const t of block.transactions) {
                if (t.fromAddr === addr)
                    balance -= t.amount;
                if (t.toAddr === addr)
                    balance += t.amount;
            }
        }
        return balance;
    }

    // Check if the chain is valid
    isChainValid() {
        for (let i = 1; i < this.chain.length; i++) {
            const currBlock = this.chain[i];
            const prevBlock = this.chain[i - 1];

            // Check if the transactions in the block are valid
            if (!currBlock.hasValidTransactions())
                return false;

            // Check if the current block's hash is correct
            if (currBlock.hash !== currBlock.calculateHash())
                return false;

            // Check if the previous block's hash is correct
            if (currBlock.prevHash !== prevBlock.hash)
                return false;
        }
        return true;
    }
}

module.exports.Blockchain = Blockchain;
module.exports.Transaction = Transaction;