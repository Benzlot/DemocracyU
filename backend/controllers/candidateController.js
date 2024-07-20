// controllers/candidateController.js
const Candidate = require('../models/candidateModel');
const Election = require('../models/electionModel');
const { checkNotEmpty ,checkIfEmpty } = require('../Service/commonService');
const mongoose = require('mongoose');

async function getCandidates  (req, res) {
  try {

    const { election_name } = req.body

    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      dbName: 'DemocracyU',
    });
    console.log('MongoDB connected');

    let Election = await Election.findOne({election_name : election_name});
    checkIfEmpty(Election, "Election not found")
      
    let candidates = await Candidate.find();

    console.log("candidates ==> ",candidates)
    res.status(200).json(candidates);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch candidates' });
  } finally {
    mongoose.connection.close();
  }
};

async function deleteCandidatebyID (req, res){
  try {
  
  let {election_name, student_id} = req.body

  await mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    dbName: 'DemocracyU',
  });
     
  let Elections = await Election.findOne({election_name : election_name});
  checkIfEmpty(Elections, "Election not found")

  const result = await Candidate.deleteOne({ student_id : student_id})

  res.status(200).json({result : result});
} catch (error) {
  console.log(error)
  res.status(500).json({ error: error.message ||'Failed to delete voters' });
} finally {
  mongoose.connection.close();
}
}

async function addCandidate (req, res) {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      dbName: 'DemocracyU',
    });

    const { election_name, candidate_list } = req.body

    let Elections = await Election.findOne({election_name : election_name});
    checkIfEmpty(Elections, "Election not found")

    let result = []

    for (let index = 0; index < candidate_list.length; index++) {
      const Candidates = candidate_list[index];
      const candidate = await Candidate.findOne({student_id: Candidates.student_id})
      if(checkNotEmpty(candidate)){
        const newCandidate = new Candidate({
            id: index.toString(),
            ...Candidates,
            election_name : election_name
        });
        await newCandidate.save();
        result.push({ message:`Candidate ${Candidates.name} (index ${index}) inserted`});
      }else{
        if(candidate.election_name){
          result.push({ message :`Candidate ${Candidates.name} (index ${index}) is on ${candidate.election_name} skip`});
        }else{
          result.push({ message :`Candidate ${Candidates.name} (index ${index}) skip`});
        }
      }
  }

    res.status(200).json({result: result});
  } catch (error) {
    console.log(error)
    res.status(500).json({ error: error.message || 'Failed to fetch candidates' });
  } finally {
    mongoose.connection.close();
  }
}

module.exports = {
  getCandidates,
  addCandidate,
  deleteCandidatebyID
}

// for add candidate
// let addedCandidate = new Candidate({  
//   id: "07",
//   name: "Mhaa",
//   student_id: "007",
//   faculty: "Mhaa",
//   branch: "kingmai",
//   vision: "thong gew",
// });

// await addedCandidate.save()
