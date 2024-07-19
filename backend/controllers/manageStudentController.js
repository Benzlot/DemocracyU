// controllers/candidateController.js
const Candidate = require('../models/userModel');
const mongoose = require('mongoose');

async function getCandidates  (req, res) {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      dbName: 'DemocracyU',
    });
    console.log('MongoDB connected');
      
    let candidates = await User.find();

    console.log("users ==> ",users)
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch candidates' });
  } finally {
    mongoose.connection.close();
  }
};

async function addUsers (req, res) {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      dbName: 'DemocracyU',
    });

    let {id,name,student_id,faculty,branch,vision} = req.body

    let addedCandidate = new Candidate({  
      id: id?.toString(),
      name: name?.toString(),
      student_id: student_id?.toString(),
      faculty: faculty?.toString()
    });

    await addedCandidate.save()

    let candidates = await Candidate.find();

    res.status(200).json(candidates);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch candidates' });
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
