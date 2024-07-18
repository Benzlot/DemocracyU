// controllers/votingController.js
// const { blockSchema } = require('../models/votingModel');
const crypto = require('crypto');
const mongoose = require('mongoose');

async function getVotes (req, res) {
  try {
    const votes = await getAllVotes();
    res.status(200).json(votes);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve votes' });
  }
};

async function vote (req, res) {
  try {
    const { candidate_Id, username, email } = req.body;

    // await mongoose.connect(process.env.MONGODB_URI, {
    //   useNewUrlParser: true,
    //   useUnifiedTopology: true,
    //   dbName: 'DemocracyU',
    // });
    
    const blockchain = new Blockchain();
    await blockchain.initialize();

    const hashed_data = crypto.createHash('sha256').update(username+email).digest('hex');

    await blockchain.addBlock(candidate_Id, hashed_data)
    
    res.status(200).json({ message: 'Vote cast successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to cast vote' });
  }finally{
    mongoose.connection.close();
  }
};

const blockSchema = new mongoose.Schema({
  index: Number,
  candidate_id: String,
  hashed_data: String,
  previous_hash: String,
  nonce: String,
  hash: String
}, { timestamps: true }); // Adding timestamps for createdAt and updatedAt

const BlockchainModel = mongoose.model('voteresult', blockSchema); 

class Blockchain {
  constructor() {
      this.chain = [];
      this.difficulty = 2;
  }

  async initialize() {
    try {
        await mongoose.connect(process.env.MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            dbName: 'DemocracyU',
        });
        console.log('MongoDB Connected');

        // Initialize blockchain operations
        await this.createGenesisBlock();
        // Other initialization tasks can be added here
    } catch (error) {
        console.error('MongoDB Connection Error:', error);
        // Handle error appropriately
        throw error; // Rethrow the error or handle it as needed
    }
}

  async createGenesisBlock() {
      const genesisBlock = await BlockchainModel.findOne({ index: 0 });

      if (!genesisBlock) {
          const newBlock = this.createBlock(0, "Genesis Candidate ID", "Genesis Hashed Data", "0");
          this.mineBlock(newBlock);
          await newBlock.save();
          this.chain.push(newBlock);
      } else {
          this.chain.push(genesisBlock);
      }
  }

  createBlock(index, candidate_id, hashed_data, previous_hash) {
      const nonce = '0';
      const hash = this.calculateHash(index, candidate_id, hashed_data, previous_hash, nonce);
      return new BlockchainModel({ index, candidate_id, hashed_data, previous_hash, nonce, hash });
  }

  calculateHash(index, candidate_id, hashed_data, previous_hash, nonce) {
      return crypto.createHash('sha256').update(index.toString() + candidate_id + hashed_data + previous_hash + nonce).digest('hex');
  }

  mineBlock(block) {
      while (block.hash.substring(0, this.difficulty) !== Array(this.difficulty + 1).join("0")) {
          block.nonce = (BigInt(block.nonce) + 1n).toString();
          block.hash = this.calculateHash(block.index, block.candidate_id, block.hashed_data, block.previous_hash, block.nonce);
      }
  }

  async getLatestBlock() {
      return await BlockchainModel.findOne().sort({ index: -1 });
  }

  async addBlock(candidate_id, hashed_data) {
      const latestBlock = await this.getLatestBlock();
      const newIndex = latestBlock.index + 1;
      const newBlock = this.createBlock(newIndex, candidate_id, hashed_data, latestBlock.hash);
      this.mineBlock(newBlock);
      await newBlock.save();
      this.chain.push(newBlock);
  }

  async isChainValid() {
      for (let i = 1; i < this.chain.length; i++) {
          const currentBlock = this.chain[i];
          const previousBlock = this.chain[i - 1];

          if (currentBlock.hash !== this.calculateHash(currentBlock.index, currentBlock.candidate_id, currentBlock.hashed_data, currentBlock.previous_hash, currentBlock.nonce)) {
              return false;
          }

          if (currentBlock.previous_hash !== previousBlock.hash) {
              return false;
          }
      }
      return true;
  }
}


module.exports = {vote};
