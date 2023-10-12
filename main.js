import sha256 from 'crypto-js';
const { SHA256 } = sha256;

class Block {
    // Initialize the block
    constructor(index, timestamp, data, prevHash = '') {
        this.index = index; // Where the block is on the chain
        this.timestamp = timestamp; // When the block was created
        this.data = data; // Details of the transaction (for a currency)
        this.prevHash = prevHash; // String that contains the hash of the block before this one
        this.hash = this.calculateHas(); // Hash of the block
    }

    // Calculate the hash of the block
    calculateHas() {
        return SHA256(this.index + this.prevHash + this.timestamp + JSON.stringify(this.data)).toString();
    }
}

class Blockchain {
    // Initialize the blockchain
    constructor() {
        this.chain = [this.createGenesisBlock()]; // First block in the chain is the genesis block
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
        newBlock.hash = newBlock.calculateHas();
        this.chain.push(newBlock);
    }

    // Check if the chain is valid
    isChainValid() {
        for(let i = 1; i < this.chain.length; i++) {
            const currBlock = this.chain[i];
            const prevBlock = this.chain[i - 1];

            // Check if the current block's hash is correct
            if(currBlock.hash !== currBlock.calculateHas())
                return false;

            // Check if the previous block's hash is correct
            if (currBlock.prevHash !== prevBlock.hash)
                return false;
        }
        return true;
    }
}

const simpleCoin = new Blockchain();
simpleCoin.addBlock(new Block(1, "12/10/2023", { amount: 5 }));
simpleCoin.addBlock(new Block(2, "12/10/2023", { amount: 10 }));
simpleCoin.addBlock(new Block(3, "12/10/2023", { amount: 15 }));

console.log(JSON.stringify(simpleCoin, null, 4));