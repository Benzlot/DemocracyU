// controllers/candidateController.js
const Election = require('../models/electionModel');
const createVoter = require('../models/voterModel');
const createCandidate = require('../models/candidateModel');
const createVoteResult = require('../models/votingModel')
const mongoose = require('mongoose');
const { checkNotEmptyThrowError ,checkIfEmpty } = require('../Service/commonService');
const { request } = require('express');


async function getElection (req, res) {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      dbName: 'DemocracyU',
    });
    console.log('MongoDB connected');
      
    let Elections = await Election.find();

    console.log("Election ==> ",Elections)
    res.status(200).json(Elections);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch Election' });
  } finally {
    mongoose.connection.close();
  }
};

async function getElectionbyName (req, res) {
  try {

    let {name} = req.body

    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      dbName: 'DemocracyU',
    });
    console.log('MongoDB connected');
      
    let Elections = await Election.findOne({election_name : name});
    checkIfEmpty(Elections, "Election not found")

    console.log("Election ==> ",Elections)
    res.status(200).json(Elections);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch Election' });
  } finally {
    mongoose.connection.close();
  }
};

async function addElection (req, res) {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      dbName: 'DemocracyU',
    });

    let {name,type,start,end} = req.body

    let election = await Election.findOne({election_name : name})
    console.log("Election :",election)
    checkNotEmptyThrowError(election, "Election name has been used")

    let election_codename = await hashAndGetFirst5Letters(name+type)

    let addedElection = new Election({  
      election_name: name,
      election_type: type,
      election_start: start,
      election_end: end,
      voter_table: election_codename + "voters",
      voteResult_table : election_codename +"voteresults",
      candidate_table: election_codename +"candidates",
    });

    await addedElection.save()

    const Voter = createVoter(election_codename+"voters");
    const Candidate = createCandidate(election_codename+"candidates");
    const VoteResult = createVoteResult(election_codename+"voteresults")

    await Voter.createCollection();
    await Candidate.createCollection();
    await VoteResult.createCollection();

    let Elections = await Election.find();

    res.status(200).json(Elections);
  } catch (error) {
    console.log(error)
    res.status(500).json({ error: 'Failed to fetch Election' });
  } finally {
    mongoose.connection.close();
  }

}

async function updateElection (req, res) {
  console.log(req.body);
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      dbName: 'DemocracyU',
    });

    let {name,type,start,end} = req.body

    let election = await Election.findOne({election_name : name})
    console.log(election)
    checkIfEmpty(election, "Election not found")

    let result = await election.updateOne(
      { election_name : name},
      { $set: { 
        election_type: type ,
        election_start: start,
        election_end: end,
      } }
    )
    
    res.status(200).json({result : result});
  } catch (error) {
    console.log(error)
    res.status(500).json({ error: 'Failed to fetch Election' });
  } finally {
    mongoose.connection.close();
  }

}

async function deleteElection (req, res) {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      dbName: 'DemocracyU',
    });

    let {name} = req.body

    let election = await Election.findOne({election_name : name})
    console.log(election)
    checkIfEmpty(election, "Election not found")

    const db = mongoose.connection.db;

    await db.dropCollection(election.voter_table)
    await db.dropCollection(election.voteResult_table)
    await db.dropCollection(election.candidate_table)

    let result = await election.deleteOne({ election_name : name})
    
    res.status(200).json({result : result});
  } catch (error) {
    console.log(error)
    res.status(500).json({ error: 'Failed to fetch Election' });
  } finally {
    mongoose.connection.close();
  }

}

async function hashAndGetFirst5Letters(text) {
  const encoder = new TextEncoder();
  const data = encoder.encode(text);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  return hashHex.slice(0, 5);
}


module.exports = {
  getElection,
  addElection,
  updateElection,
  deleteElection,
  getElectionbyName
}
