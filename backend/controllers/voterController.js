// controllers/candidateController.js
const Election = require('../models/electionModel');
const Voter = require('../models/voterModel');
const { checkNotEmpty,checkIfEmpty } = require('../Service/commonService');
const mongoose = require('mongoose');

async function getVoter (req, res) {
  try {

    const { election_name } = req.body
    
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      dbName: 'DemocracyU',
    });
      
    let Elections = await Election.findOne({election_name : election_name});
    checkIfEmpty(Elections, "Election not found")

    let voters = await Voter.find()
    
    console.log("voters ==> ",voters)
    res.status(200).json(voters);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch voters' });
  } finally {
    mongoose.connection.close();
  }
};

async function addVoter (req, res) {
  try {

    let {election_name, student_list} = req.body

    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      dbName: 'DemocracyU',
    });
       
    let Elections = await Election.findOne({election_name : election_name});
    checkIfEmpty(Elections, "Election not found")

    let result = []

    const Voter = createVoter(Elections.voter_table);

    for (const student of student_list) {
      const voters = await Voter.findOne({mail: student.mail})
      if(checkNotEmpty(voters)){
        const newVoter = new Voter({ ...student,election_name: election_name ,status: '0' });
        await newVoter.save();
        result.push({ message:`Voter ${student.name} inserted`});
      }else{
        if(voters.election_name){
          result.push({ message:`Voter ${student.name} is on ${voters.election_name} skiped`})
        }else{
          result.push({ message:`Voter ${student.name} skiped`});
        }
      }
    }


    res.status(200).json({result : result});
  } catch (error) {
    console.log(error)
    res.status(500).json({ error: error.message ||'Failed to add voters' });
  } finally {
    mongoose.connection.close();
  }

}

async function deleteVoterbyID (req, res){
  try {
  
  let {election_name, student_id} = req.body

  await mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    dbName: 'DemocracyU',
  });
     
  let Elections = await Election.findOne({election_name : election_name});
  checkIfEmpty(Elections, "Election not found")

  const Voter = createVoter(Elections.voter_table);

  const result = await Voter.deleteOne({ student_id : student_id})

  res.status(200).json({result : result});
} catch (error) {
  console.log(error)
  res.status(500).json({ error: error.message ||'Failed to delete voters' });
} finally {
  mongoose.connection.close();
}
}



module.exports = {
  getVoter,
  addVoter,
  deleteVoterbyID
}
