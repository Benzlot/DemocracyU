// controllers/candidateController.js
const Election = require('../models/electionModel');
const Voter = require('../models/voterModel');
const Candidate = require('../models/candidateModel');
const mongoose = require('mongoose');
const { checkNotEmptyThrowError ,checkIfEmpty } = require('../Service/commonService');


async function getElection (req, res) {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      dbName: 'DemocracyU',
    });
      
    let Elections = await Election.find();

    console.log("Election ==> ",Elections)
    res.status(200).json(Elections);
  } catch (error) {
    res.status(500).json({ error: error.message ||'Failed to fetch Election' });
  } finally {
    mongoose.connection.close();
  }
};

async function getElectionbyName (req, res) {
  try {

    let {election_name} = req.body

    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      dbName: 'DemocracyU',
    });
      
    let Elections = await Election.findOne({election_name : election_name});
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

    let {election_name,election_type,start_date,end_date} = req.body

    let election = await Election.findOne({election_name : election_name})
    checkNotEmptyThrowError(election, "Election name has been used")

    let addedElection = new Election({  
      election_name: election_name,
      election_type: election_type,
      election_start: start_date,
      election_end: end_date,
    });

    await addedElection.save()

    scheduleElectionEndCheck(addedElection)

    let addedCandidate = new Candidate({
      id: 0,
      name: "ไม่ประสงลงคะแนน",
      student_id: "00",
      faculty: "00",
      major: "00",
      vision: "00",
      election_name :election_name,
    })

    await addedCandidate.save()


    let Elections = await Election.find();

    res.status(200).json(Elections);
  } catch (error) {
    console.log(error)
    res.status(500).json({error: error.message|| 'Failed to fetch Election' });
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

    let {election_name,election_type,start_date,end_date} = req.body

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
    
    res.status(200).json({result : result});
  } catch (error) {
    console.log(error)
    res.status(500).json({ error:error.message|| 'Failed to fetch Election' });
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

    let {election_name} = req.body

    let election = await Election.findOne({election_name : election_name})
    checkIfEmpty(election, "Election not found")

    let electionResult = await Election.deleteOne({ election_name : election_name})
    let voterResult = await Voter.deleteMany({ election_name : election_name})
    let candidateResult = await Candidate.deleteMany({ election_name : election_name})
    //add delete on voter and candidate
    
    res.status(200).json({result : {electionResult,voterResult,candidateResult}});
  } catch (error) {
    console.log(error)
    res.status(500).json({ error: error.message||'Failed to fetch Election' });
  } finally {
    mongoose.connection.close();
  }

}


const scheduleElectionEndCheck = (election) => {
  const endDate = new Date(election.election_end);
  const now = new Date();

  // Calculate the time difference in milliseconds
  const timeDiff = endDate.getTime() - now.getTime();

  if (timeDiff > 0) {
    setTimeout(() => {
      triggerElectionEndFunction(election);
    }, timeDiff);
  }
};

const triggerElectionEndFunction = (election) => {
  console.log(`Election ${election.election_name} has ended. Triggering end function.`);
  // Add your desired functionality here
  // Example: update election status, notify users, etc.
};




module.exports = {
  getElection,
  addElection,
  updateElection,
  deleteElection,
  getElectionbyName
}
