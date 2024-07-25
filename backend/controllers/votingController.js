const crypto = require("crypto");
const Candidate = require("../models/candidateModel");
const VoteResult = require("../models/votingModel");
const Voter = require("../models/voterModel");
const Election = require("../models/electionModel");
const {
  checkIfEmpty,
  checkIfStringIsZero,
  checkIsStart,
  checkIsEnd,
} = require("../Service/commonService");

async function getVoteResult(req, res) {
  try {
    console.log("run getVoteResult")
    const { election_name } = req.body;
    console.log("req.body",req.body)


    let Elections = await Election.findOne({ election_name: election_name });
    //check election exist
    checkIfEmpty(Elections, "Election not found");

    if (!checkIsStart(Elections)) {
      throw new Error("Election not start yet"); // edit error text
    }
      let voteResults = await VoteResult.aggregate([
        { $match: { election_name: election_name } },
        { $group: { _id: "$candidate_id", count: { $sum: 1 } } },
        { $sort: { count: -1 } },
      ]);

      console.log(voteResults);
      res.status(200).json(voteResults);
   
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ error: error.message || "Failed to cast vote result" });
  } finally {
   
    console.log("end getVoteResult")
  }
}

async function getRank(req, res) {
  try {
    console.log("run getRank")
    const { election_name } = req.body;
    console.log("req.body",req.body)

   

    let Elections = await Election.findOne({ election_name: election_name });
    //check election exist
    checkIfEmpty(Elections, "Election not found");
    if (!checkIsStart(Elections)) {
      throw new Error("Election not start yet"); // edit error text
    }
    if (checkIsEnd(Elections)) {
      let voteResults = await VoteResult.aggregate([
        { $match: { election_name: election_name } },
        { $group: { _id: "$candidate_id", count: { $sum: 1 } } },
        { $sort: { count: -1 } },
      ]);

      console.log(voteResults);
      res.status(200).json(voteResults);
    } else {
      throw new Error("Election not end yet"); // edit error text
    }
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ error: error.message || "Failed to cast vote rank" });
  } finally {
   
    console.log("end getRank")
  }
}

async function vote(req, res) {
  try {
    console.log("run vote")
    const { election_name, candidate_Id, name, mail } = req.body;
    console.log("req.body",req.body)
   

    let Elections = await Election.findOne({ election_name: election_name });
  
    checkIfEmpty(Elections, "Election not found");
 
    let candidates = await Candidate.findOne({
      id: candidate_Id,
      election_name: election_name,
    });
    checkIfEmpty(candidates, "Candidate not found");
    //check
    let voters = await Voter.findOne({
      mail: mail,
      election_name: election_name,
    });
    console.log(voters);
    checkIfStringIsZero(voters.status, "Voter has been voted");

    const blockchain = new Blockchain();
    await blockchain.initialize(VoteResult);

    const hashed_data = crypto
      .createHash("sha256")
      .update(name + mail)
      .digest("hex");

    await blockchain.addBlock(candidate_Id, election_name, hashed_data);

    //Add edit status user after vote <-- ปรับเป้นผู้ไม่สิทธิ์โหวตด้วย
    await Voter.updateOne({ mail: mail }, { $set: { status: "1" } });

    res.status(200).json({ message: "Vote cast successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message || "Failed to vote" });
  } finally {
   
    console.log("end vote")
  }
}

class Blockchain {
  constructor() {
    this.chain = [];
    this.difficulty = 2;
    this.model = "";
  }

  async initialize(model) {
    try {
      this.model = model;
      // Initialize blockchain operations
      await this.createGenesisBlock();
    } catch (error) {
      console.error(error);
      throw error; 
    }
  }

  async createGenesisBlock() {
    const genesisBlock = await this.model.findOne({ index: 0 });

    if (!genesisBlock) {
      const newBlock = this.createBlock(
        0,
        "Genesis Candidate ID",
        "Genesis Hashed Data",
        "0"
      );
      this.mineBlock(newBlock);
      await newBlock.save();
      this.chain.push(newBlock);
    } else {
      this.chain.push(genesisBlock);
    }
  }

  createBlock(index, candidate_id, election_name, hashed_data, previous_hash) {
    const nonce = "0";
    const hash = this.calculateHash(
      index,
      candidate_id,
      hashed_data,
      previous_hash,
      nonce
    );
    return new this.model({
      index,
      candidate_id,
      election_name,
      hashed_data,
      previous_hash,
      nonce,
      hash,
    });
  }

  calculateHash(index, candidate_id, hashed_data, previous_hash, nonce) {
    return crypto
      .createHash("sha256")
      .update(
        index.toString() +
          candidate_id.toString() +
          hashed_data +
          previous_hash +
          nonce
      )
      .digest("hex");
  }

  mineBlock(block) {
    while (
      block.hash.substring(0, this.difficulty) !==
      Array(this.difficulty + 1).join("0")
    ) {
      block.nonce = (BigInt(block.nonce) + 1n).toString();
      block.hash = this.calculateHash(
        block.index,
        block.candidate_id,
        block.hashed_data,
        block.previous_hash,
        block.nonce
      );
    }
  }

  async getLatestBlock() {
    return await this.model.findOne().sort({ index: -1 });
  }

  async addBlock(candidate_id, election_name, hashed_data) {
    const latestBlock = await this.getLatestBlock();
    const newIndex = latestBlock.index + 1;
    const newBlock = this.createBlock(
      newIndex,
      candidate_id,
      election_name,
      hashed_data,
      latestBlock.hash
    );
    this.mineBlock(newBlock);
    await newBlock.save();
    this.chain.push(newBlock);
  }

  async isChainValid() {
    for (let i = 1; i < this.chain.length; i++) {
      const currentBlock = this.chain[i];
      const previousBlock = this.chain[i - 1];

      if (
        currentBlock.hash !==
        this.calculateHash(
          currentBlock.index,
          currentBlock.candidate_id,
          currentBlock.hashed_data,
          currentBlock.previous_hash,
          currentBlock.nonce
        )
      ) {
        return false;
      }

      if (currentBlock.previous_hash !== previousBlock.hash) {
        return false;
      }
    }
    return true;
  }
}

module.exports = { vote, getVoteResult, getRank };
