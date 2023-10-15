import sha256 from 'crypto-js';
const { SHA256 } = sha256;

class Transaction {
    // Initialize the transaction
    constructor(fromAddr, toAddr, amount) {
        this.fromAddr = fromAddr; // Address of the sender
        this.toAddr = toAddr; // Address of the receiver
        this.amount = amount; // Amount of currency being sent
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
}

class Blockchain {
    // Initialize the blockchain
    constructor() {
        this.chain = [this.createGenesisBlock()]; // First block in the chain is the genesis block
        this.diff = 10; // Difficulty of mining the block
        this.pendingTransactions = []; // Transactions that are waiting to be mined
        this.miningReward = 1; // Reward for mining a block
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
        let block = new Block(Date.now(), this.pendingTransactions);
        block.mineBlock(this.diff);

        console.log("Block mined successfully!");
        this.chain.push(block);

        this.pendingTransactions = [
            new Transaction(null, miningRewardAddr, this.miningReward)
        ];
    }

    // Add a new transaction to the pending transactions
    createTransaction(transaction) {
        this.pendingTransactions.push(transaction);
    }

    // Get the balance of an address
    getBalanceOfAddr(addr) {
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

const simpleCoin = new Blockchain();

simpleCoin.createTransaction(new Transaction('addr1', 'addr2', 50));
simpleCoin.createTransaction(new Transaction('addr2', 'addr1', 100));
simpleCoin.createTransaction(new Transaction('addr2', 'addr3', 150));

console.log('\nStarting the miner...');
simpleCoin.minePendingTransactions('simepleCoinAddreress');

console.log('\nBalance of simpleCoin is', simpleCoin.getBalanceOfAddr('simepleCoinAddreress'));

console.log('\nStarting the miner again...');
simpleCoin.minePendingTransactions('simepleCoinAddreress');

console.log('\nBalance of simpleCoin is', simpleCoin.getBalanceOfAddr('simepleCoinAddreress'));