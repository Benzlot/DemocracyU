const crypto = require('crypto-js');

class Block {
    constructor(index, timestamp, data, previousHash = '') {
        this.index = index;
        this.timestamp = timestamp;
        this.data = data;
        this.previousHash = previousHash;
        this.nonce = 0;
        this.hash = this.calculateHash();
    }

    calculateHash() {
        return crypto.SHA256(this.index + this.timestamp + this.data + this.previousHash + this.nonce).toString();
    }

    mineBlock(difficulty) {
        while (this.hash.substring(0, difficulty) !== Array(difficulty + 1).join('0')) {
            this.nonce++;
            this.hash = this.calculateHash();
        }
        console.log(`Block mined: ${this.hash}`);
    }
}

class Blockchain {
    constructor() {
        this.chain = [this.createGenesisBlock()];
        this.difficulty = 2; 
    }

    createGenesisBlock() {
        return new Block(0, '01/01/2020', 'Genesis Block', '0');
    }

    getLatestBlock() {
        return this.chain[this.chain.length - 1];
    }

    addBlock(newBlock) {
        if (this.isChainValid()) {
            newBlock.previousHash = this.getLatestBlock().hash;
            newBlock.mineBlock(this.difficulty);
            this.chain.push(newBlock);
        } else {
            console.log('The blockchain is not valid. Block not added.');
        }
    }

    isChainValid() {
        for (let i = 1; i < this.chain.length; i++) {
            const currentBlock = this.chain[i];
            const previousBlock = this.chain[i - 1];

            if (currentBlock.hash !== currentBlock.calculateHash()) {
                console.log(`Block ${i} hash is invalid.`);
                return false;
            }

            if (currentBlock.previousHash !== previousBlock.hash) {
                console.log(`Block ${i} previous hash is invalid.`);
                return false;
            }
        }
        return true;
    }
}

// Example usage
const myBlockchain = new Blockchain();
console.log('Mining block 1...');
myBlockchain.addBlock(new Block(1, new Date().toISOString(), { amount: 4 }));

console.log('Mining block 2...');
myBlockchain.addBlock(new Block(2, new Date().toISOString(), { amount: 10 }));

console.log(JSON.stringify(myBlockchain, null, 4));
console.log(`Is blockchain valid? ${myBlockchain.isChainValid()}`);


//table = blockchain
//row = block
