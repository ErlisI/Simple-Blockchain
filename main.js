import sha256 from 'crypto-js';
const { SHA256 } = sha256;

class Block {
    // Initialize the block
    constructor(index, timestamp, data, prevHash = '') {
        this.index = index; // Where the block is on the chain
        this.timestamp = timestamp; // When the block was created
        this.data = data; // Details of the transaction (for a currency)
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
        while(this.hash.substring(0, diff) !== Array(diff + 1).join("0")) {
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
    }

    // Create the genesis block
    createGenesisBlock() {
        return new Block(0, "12/10/2023", "Genesis block", "0");
    }

    // Get the latest block in the chain
    getLatestBlock() {
        return this.chain[this.chain.length - 1];
    }

    // Add a new block to the chain
    addBlock(newBlock) {
        newBlock.timestamp = new Date();
        newBlock.index = this.getLatestBlock().index + 1;
        newBlock.prevHash = this.getLatestBlock().hash;
        newBlock.hash = newBlock.calculateHash();

        newBlock.mineBlock(this.diff); // Mining the block with difficulty of 10 (number of 0s in the hash)

        this.chain.push(newBlock);
    }

    // Check if the chain is valid
    isChainValid() {
        for(let i = 1; i < this.chain.length; i++) {
            const currBlock = this.chain[i];
            const prevBlock = this.chain[i - 1];

            // Check if the current block's hash is correct
            if(currBlock.hash !== currBlock.calculateHash())
                return false;

            // Check if the previous block's hash is correct
            if (currBlock.prevHash !== prevBlock.hash)
                return false;
        }
        return true;
    }
}

const simpleCoin = new Blockchain();

console.log("Mining block 1...");
simpleCoin.addBlock(new Block(1, "12/10/2023", { amount: 5 }));

console.log("Mining block 2...");
simpleCoin.addBlock(new Block(2, "12/10/2023", { amount: 10 }));

console.log("Mining block 3...");
simpleCoin.addBlock(new Block(3, "12/10/2023", { amount: 15 }));

console.log(JSON.stringify(simpleCoin, null, 4));