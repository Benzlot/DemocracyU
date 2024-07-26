// controllers/candidateController.js
const Election = require('../models/electionModel');
const Voter = require('../models/voterModel');
const { checkNotEmpty, checkIfEmpty } = require('../Service/commonService');

async function getVoter(req, res) {
  try {
    console.log("run getVoter");
    const { election_name } = req.body;
    console.log("req.body", req.body);

    let Elections = await Election.findOne({ election_name: election_name });
    checkIfEmpty(Elections, "Election not found");

    // Check if the user is an admin
    if (req.role === 'admin') {
      // Admins should have access to all voters
      let voters = await Voter.find({ election_name: election_name });
      console.log("voters ==> ", voters);
      res.status(200).json(voters);
    } else {
      // Regular users can only see their own voters
      let voters = await Voter.find({ election_name: election_name });
      console.log("voters ==> ", voters);
      res.status(200).json(voters);
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message || 'Failed to fetch voters' });
  } finally {
    console.log("end getVoter");
  }
}

async function getVoterStatus(req, res) {
  try {
    console.log("run getVoterStatus");
    const { election_name } = req.body;
    console.log("req.body", req.body);

    let Elections = await Election.findOne({ election_name: election_name });
    checkIfEmpty(Elections, "Election not found");

    let voters = await Voter.aggregate([
      { $match: { election_name: election_name } },
      { $group: { _id: "$status", count: { $sum: 1 } } },
      { $sort: { _id: 1 } }
    ]);

    console.log("voters ==> ", voters);
    res.status(200).json(transformCounts(voters));
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message || 'Failed to fetch voters' });
  } finally {
    console.log("end getVoterStatus");
  }
}

function transformCounts(data) {
  const result = {
    vote: 0,
    nonVote: 0
  };

  data.forEach(item => {
    if (item._id === '0') {
      result.nonVote = item.count;
    } else if (item._id === '1') {
      result.vote = item.count;
    }
  });

  return result;
}

async function addVoter(req, res) {
  try {
    console.log("run addVoter");
    let { election_name, student_list } = req.body;
    console.log("req.body", req.body);

    let Elections = await Election.findOne({ election_name: election_name });
    checkIfEmpty(Elections, "Election not found");

    let result = [];

    for (const student of student_list) {
      const voters = await Voter.findOne({ mail: student.mail });

      if (checkNotEmpty(voters)) {
        const newVoter = new Voter({ ...student, election_name: election_name, status: '0' });
        await newVoter.save();
        result.push({ message: `Voter ${student.name} inserted` });
      } else {
        if (voters.election_name) {
          result.push({ message: `Voter ${student.name} is on ${voters.election_name} skipped` });
        } else {
          result.push({ message: `Voter ${student.name} skipped` });
        }
      }
    }

    console.log("result", result);
    res.status(200).json({ result: result });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message || 'Failed to add voters' });
  } finally {
    console.log("end addVoter");
  }
}

async function deleteVoterbyID(req, res) {
  try {
    console.log("run deleteVoterbyID");
    let { election_name, student_id } = req.body;
    console.log("req.body", req.body);

    let Elections = await Election.findOne({ election_name: election_name });
    checkIfEmpty(Elections, "Election not found");

    const result = await Voter.deleteOne({ student_id: student_id });

    console.log("result", result);
    res.status(200).json({ result: result });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message || 'Failed to delete voters' });
  } finally {
    console.log("end deleteVoterbyID");
  }
}

async function getVoterByMail(req, res) {
  try {
    console.log("run getVoterByMail");
    let { mail } = req.body;
    console.log("req.body", req.body);

    // Check if the user is an admin
    if (req.role === 'admin') {
      // Admins should have access to all voter details
      const voter = await Voter.findOne({ mail: mail });
      console.log("Voter", voter);
      res.status(200).json(voter);
    } else {
      // Regular users or other roles
      const voter = await Voter.findOne({ mail: mail });
      if (!voter) {
        return res.status(404).json({ error: 'voter not found' });
        
      }
      res.status(200).json(voter);
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message || 'Failed to get voter' });
  } finally {
    console.log("end getVoterByMail");
  }
}


module.exports = {
  getVoter,
  addVoter,
  deleteVoterbyID,
  getVoterByMail,
  getVoterStatus
};
