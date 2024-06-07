const { getAllVotes, castVote } = require('../models/votingModel');

exports.getVotes = async (req, res) => {
  try {
    const votes = await getAllVotes();
    res.json(votes);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve votes' });
  }
};

exports.vote = async (req, res) => {
  try {
    const { userId, candidateId } = req.body;
    await castVote(userId, candidateId);
    res.json({ message: 'Vote cast successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to cast vote' });
  }
};
