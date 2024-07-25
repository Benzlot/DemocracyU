// controllers/candidateController.js
const Election = require('../models/electionModel');
const Voter = require('../models/voterModel');
const Candidate = require('../models/candidateModel');
const mongoose = require('mongoose');
const { checkNotEmptyThrowError ,checkIfEmpty } = require('../Service/commonService');


async function getElection (req, res) {
  try {
    console.log("run getElection")
    await mongoose.connect(process.env.MONGODB_URI, {
      dbName: 'DemocracyU',
    });
      
    let Elections = await Election.find();

    console.log("Election ==> ",Elections)
    res.status(200).json(Elections);
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: error.message ||'Failed to fetch Election' });
  } finally {
    mongoose.connection.close();
    console.log("end getElection")
  }
};

async function getElectionbyName (req, res) {
  try {
    console.log("run getElectionbyName")
    let {election_name} = req.body
    console.log("req.body",req.body)
    await mongoose.connect(process.env.MONGODB_URI, {
      dbName: 'DemocracyU',
    });
      
    let Elections = await Election.findOne({election_name : election_name});
    checkIfEmpty(Elections, "Election not found")

    console.log("Election ==> ",Elections)
    res.status(200).json(Elections);
  } catch (error) {
    console.error("error",error)
    res.status(500).json({ error: 'Failed to fetch Election' });
  } finally {
    mongoose.connection.close();
    console.log("end getElectionbyName")
  }
};

async function addElection (req, res) {
  try {
    console.log("run addElection")
    await mongoose.connect(process.env.MONGODB_URI, {
    
      dbName: 'DemocracyU',
    });

    let {election_name,election_type,start_date,end_date} = req.body
    console.log("req.body",req.body)
    let election = await Election.findOne({election_name : election_name})
    checkNotEmptyThrowError(election, "Election name has been used")

    let addedElection = new Election({  
      election_name: election_name,
      election_type: election_type,
      election_start: start_date,
      election_end: end_date,
    });
    
    let addedCandidate = new Candidate({
      id: 0,
      name: "ไม่ประสงค์ลงคะแนน",
      student_id: "00",
      faculty: "00",
      major: "00",
      vision: "00",
      election_name :election_name,
    })
    

    await addedElection.save()
    await addedCandidate.save()


    let Elections = await Election.find();

    res.status(200).json(Elections);
  } catch (error) {
    console.log(error)
    res.status(500).json({error: error.message|| 'Failed to fetch Election' });
  } finally {
    mongoose.connection.close();
    console.log("end addElection")
  }

}

async function updateElection (req, res) {
  try {
    console.log("run updateElection")
    await mongoose.connect(process.env.MONGODB_URI, {
      dbName: 'DemocracyU',
    });

    let {election_name,election_type,start_date,end_date} = req.body
    console.log("req.body",req.body);
    let election = await Election.findOne({election_name : election_name})
    checkIfEmpty(election, "Election not found")

    let result = await Election.updateOne(
      { election_name : election_name},
      { $set: { 
        election_type: election_type ,
        election_start: start_date,
        election_end: end_date,
      } }
    )
    console.log("result",result);
    res.status(200).json({result : result});
  } catch (error) {
    console.log(error)
    res.status(500).json({ error:error.message|| 'Failed to fetch Election' });
  } finally {
    mongoose.connection.close();
    console.log("end updateElection")
  }

}

async function deleteElection (req, res) {
  try {
    console.log("run deleteElection")
    await mongoose.connect(process.env.MONGODB_URI, {
      dbName: 'DemocracyU',
    });

    let {election_name} = req.body
    console.log("req.body",req.body);

    let election = await Election.findOne({election_name : election_name})
    checkIfEmpty(election, "Election not found")

    let electionResult = await Election.deleteOne({ election_name : election_name})
    let voterResult = await Voter.deleteMany({ election_name : election_name})
    let candidateResult = await Candidate.deleteMany({ election_name : election_name})
    //add delete on voter and candidate
    console.log("result", {electionResult,voterResult,candidateResult})
    res.status(200).json({result : {electionResult,voterResult,candidateResult}});
  } catch (error) {
    console.log(error)
    res.status(500).json({ error: error.message||'Failed to fetch Election' });
  } finally {
    mongoose.connection.close();
    console.log("end deleteElection")
    
  }

}




module.exports = {
  getElection,
  addElection,
  updateElection,
  deleteElection,
  getElectionbyName
}
