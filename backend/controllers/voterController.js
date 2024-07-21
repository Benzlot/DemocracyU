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

    let voters = await Voter.find({election_name : election_name})
    
    console.log("voters ==> ",voters)
    res.status(200).json(voters);
  } catch (error) {
    console.log(error)
    res.status(500).json({ error: error.message ||'Failed to fetch voters' });
  } finally {
    mongoose.connection.close();
  }
};

async function getVoterStatus (req,res){
  try{
      const { election_name } = req.body
        
      await mongoose.connect(process.env.MONGODB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        dbName: 'DemocracyU',
      });
        
      let Elections = await Election.findOne({election_name : election_name});
      checkIfEmpty(Elections, "Election not found")

      let voters = await Voteraggregate([
        {$match: { election_name: election_name } },
        {$group: {
            _id: "$status", // Group by status
            count: { $sum: 1 } // Count the number of documents for each status
          }},
        {$sort: { _id: 1 }}])
      console.log("voters ==> ",voters)
      res.status(200).json(voters);
  } catch (error) {
      console.log(error)
      res.status(500).json({ error: error.message ||'Failed to fetch voters' });
  } finally {
      mongoose.connection.close();
  }
}


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

  const result = await Voter.deleteOne({ student_id : student_id})

  res.status(200).json({result : result});
} catch (error) {
  console.log(error)
  res.status(500).json({ error: error.message ||'Failed to delete voters' });
} finally {
  mongoose.connection.close();
}
}

async function getVoterByMail (req, res){
  try {
  
    let {mail} = req.body

    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      dbName: 'DemocracyU',
    });
      
    // let Elections = await Election.findOne({election_name : election_name});
    const voter = await Voter.findOne({ mail : mail})
    checkIfEmpty(voter, "voter not found")


    res.status(200).json(voter);
  } catch (error) {
    console.log(error)
    res.status(500).json({ error: error.message ||'Failed to get voter' });
  } finally {
    mongoose.connection.close();
  }
}





module.exports = {
  getVoter,
  addVoter,
  deleteVoterbyID,
  getVoterByMail,
  getVoterStatus
}
