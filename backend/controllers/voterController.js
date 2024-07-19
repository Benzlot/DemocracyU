// controllers/candidateController.js
const Election = require('../models/electionModel');
const createVoter = require('../models/voterModel');
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
    console.log('MongoDB connected');
      
    let Elections = await Election.findOne({election_name : election_name});
    checkIfEmpty(Elections, "Election not found")

    const Voter = createVoter(Elections.voter_table);

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

    const Voter = createVoter(Elections.voter_table);

    for (const student of student_list) {
      const voters = await Voter.findOne({mail: student.mail})
      if(checkNotEmpty(voters)){
        const newVoter = new Voter({ ...student, status: '0' });
        await newVoter.save();
        console.log(`Voter ${student.name} inserted`);
      }else{
        console.log(`Voter ${student.name} skiped`);
      }
    }

    // let voters = Voter.find()

    res.status(200).json("Success");
  } catch (error) {
    console.log(error)
    res.status(500).json({ error: error.message ||'Failed to fetch voters' });
  } finally {
    mongoose.connection.close();
  }

}



module.exports = {
  getVoter,
  addVoter
}
