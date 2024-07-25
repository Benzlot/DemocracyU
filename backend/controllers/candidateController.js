// controllers/candidateController.js
const Candidate = require("../models/candidateModel");
const Election = require("../models/electionModel");
const { checkIfEmpty } = require("../Service/commonService");

async function getCandidates(req, res) {
  try {
    console.log("run getCandidates")
    const { election_name } = req.body;
    console.log("req.body",req.body)
 

    let election = await Election.findOne({election_name : election_name});
    checkIfEmpty(election, "Election not found")
    let candidates = await Candidate.find({election_name : election_name});
    
    console.log("candidates ==> ",candidates)
    res.status(200).json(candidates);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message || "Failed to fetch candidates" });
  } finally {
    
    console.log("end getCandidates")
  }
}

async function deleteCandidatebyID(req, res) {
  try {
    console.log("run deleteCandidatebyID")
    let { election_name, student_id } = req.body;
    console.log("req.body",req.body)


    let Elections = await Election.findOne({ election_name: election_name });
    checkIfEmpty(Elections, "Election not found");

    const result = await Candidate.deleteOne({ student_id: student_id });

    res.status(200).json({ result: result });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message || "Failed to delete voters" });
  } finally {

    console.log("end deleteCandidatebyID")
  }
}

async function addCandidate(req, res) {
  try {
    console.log("run addCandidate");

    let { election_name, candidate_list } = req.body;
    console.log("Received data:", { election_name, candidate_list });

    candidate_list =
      typeof candidate_list === "string"
        ? JSON.parse(candidate_list)
        : candidate_list;
    console.log("Parsed candidate_list:", candidate_list);

    let Elections = await Election.findOne({ election_name: election_name });
    if (!Elections) {
      console.log("Election not found:", election_name);
      return res.status(404).json({ message: "Election not found" });
    }
    console.log("Election found:", Elections);

    console.log("Getting max ID...");
    let maxIdResult = await Candidate.aggregate([
      {
        $group: {
          _id: null,
          maxId: { $max: "$id" },
        },
      },
    ]);
    let maxId = maxIdResult[0]?.maxId || 0;
    console.log("Max ID found:", maxId);

    // Handle file uploads
    const uploadedFiles = req.files;
    console.log("Files uploaded:", uploadedFiles);

    const fileMap = uploadedFiles.map(file => file.path); // Cloudinary URLs

    // Prepare an array of candidate documents to insert
    const candidatesToInsert = [];
    let skipCount = 0;

    for (let index = 0; index < candidate_list.length; index++) {
      const candidateData = candidate_list[index];
      console.log("Processing candidate:", candidateData);

      // Check if candidate already exists
      const existingCandidate = await Candidate.findOne({
        student_id: candidateData.student_id,
      });
      if (existingCandidate) {
        if (existingCandidate.election_name) {
          console.log(
            `Candidate ${candidateData.name} is already on ${existingCandidate.election_name}. Skipping.`
          );
          ++skipCount;
          continue; // Skip existing candidate in a different election
        } else {
          console.log(
            `Candidate ${candidateData.name} is already exist. Skipping.`
          );
          ++skipCount;
          continue; // Don't overwrite existing data
        }
      }

      const imagePath = fileMap[index - skipCount];

      // Prepare new candidate document with image (if uploaded)
      candidatesToInsert.push({
        id: ++maxId,
        ...candidateData,
        election_name: election_name,
        img: {
          path: imagePath,
          contentType: "image/png",
        },
      });
    }

    // Insert all candidates
    console.log("Inserting candidates...", candidatesToInsert);
    const result = await Candidate.insertMany(candidatesToInsert);
    console.log("Candidates inserted successfully");

    res.status(200).json({
      result: result.map((candidate) => ({
        message: `Candidate ${candidate.name} inserted with ID ${candidate.id}`,
      })),
    });
  } catch (error) {
    console.error("Error occurred:", error);
    res.status(500).json({ error: error.message || "Failed to add candidates" });
  } finally {
    console.log("end addCandidate");
  }
}

module.exports = {
  getCandidates,
  addCandidate,
  deleteCandidatebyID,
};
