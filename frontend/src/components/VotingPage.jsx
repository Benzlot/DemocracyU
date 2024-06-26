import React, { useState, useEffect } from 'react';
import { getVotes, castVote } from '../services/votingService';

const VotingPage = () => {
  const [votes, setVotes] = useState([]);
  const [selectedCandidate, setSelectedCandidate] = useState(null);

  useEffect(() => {
    async function fetchVotes() {
      const data = await getVotes();
      setVotes(data);
    }
    fetchVotes();
  }, []);

  const handleVote = async () => {
    if (selectedCandidate) {
      await castVote(selectedCandidate);
      alert('Vote cast successfully!');
    }
  };

  return (
    <div>
      <h1>Voting Page</h1>
      <ul>
        {votes.map(vote => (
          <li key={vote.id}>
            {vote.candidateName}
            <button onClick={() => setSelectedCandidate(vote.id)}>Vote</button>
          </li>
        ))}
      </ul>
      <button onClick={handleVote} disabled={!selectedCandidate}>Submit Vote</button>
    </div>
  );
};

export default VotingPage;
