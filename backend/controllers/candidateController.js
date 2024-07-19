// controllers/candidateController.js
const createCandidate = require('../models/candidateModel');
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

    let [Elections] = await Election.find({election_name : election_name});

    let Candidate = createCandidate(Elections.candidate_table);
      
    let candidates = await Candidate.find();

    console.log("candidates ==> ",candidates)
    res.status(200).json(candidates);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch candidates' });
  } finally {
    mongoose.connection.close();
  }
};

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


    let Candidate = createCandidate(Elections.candidate_table);

    for (let index = 0; index < candidate_list.length; index++) {
      const Candidates = candidate_list[index];
      const candidate = await Candidate.findOne({student_id: candidate_list[index].student_id})
      if(checkNotEmpty(candidate)){
        const newCandidate = new Candidate({
            id: index.toString(),
            ...Candidates,
        });
        await newCandidate.save();
        console.log(`Candidate ${Candidates.name} (index ${index}) inserted`);
      }else{
        console.log(`Candidate ${Candidates.name} (index ${index}) skip`);
      }
  }


    res.status(200).json({message: 'addCandidate Success'});
  } catch (error) {
    console.log(error)
    res.status(500).json({ error: error.message || 'Failed to fetch candidates' });
  } finally {
    mongoose.connection.close();
  }

}

module.exports = {
  getCandidates,
  addCandidate
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
