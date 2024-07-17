import React, { useState, useEffect } from 'react';
import { castVote } from '../services/votingService';
import CandidateCard from './CandidateCard';
import '../components-style/VotingPage.css';
import { getCandidates } from '../services/candidateService';

const VotingPage = () => {
  const [votes, setVotes] = useState([]);
  const [selectedCandidate, setSelectedCandidate] = useState(null);

  useEffect(() => {
    async function fetchVotes() {
      try {
        const rawData = await getCandidates();
        if (Array.isArray(rawData)) {
          const data = mapCandidate(rawData);
          setVotes(data);
        } else {
          console.error("Expected an array but got:", rawData);
        }
      } catch (error) {
        console.error("Failed to fetch candidates:", error);
      }
    }
    fetchVotes();
  }, []);

  const mapCandidate = (rawData) => {
    return rawData.map((data) => ({
      id: data._id, // Assuming _id is unique and can be used as key
      imageSrc: data.imageSrc || 'https://via.placeholder.com/150', // Example placeholder URL
      candidateName: data.name || 'Candidate Name', // Example fallback text
      description: data.vision || 'Candidate Vision', // Example fallback text
    }));
  };

  const handleVote = async () => {
    if (selectedCandidate) {
      try {
        await castVote(selectedCandidate);
        alert('Vote cast successfully!');
      } catch (error) {
        console.error('Failed to cast vote:', error);
        alert('Failed to cast vote. Please try again.');
      }
    } else {
      alert('Please select a candidate before voting.');
    }
  };

  return (
    <div>
      <div className='VTitle'>
        <img
          loading="lazy"
          src="https://cdn.builder.io/api/v1/image/assets/TEMP/2ce82bc26ade1c739d9d608ab8b11d9e964f32f41dc2f611f3636da9d9abc742?apiKey=1f6df3b559f94f9cadab107301ebb8cc"
          className="VImg"
          alt=""
        />
        <div className='Votename'><h1>ลงคะแนนการเลือกตั้ง</h1></div>
      </div>

      <div className="container">
        {votes.map(vote => (
          <CandidateCard
            key={vote.id} // Ensure vote.id is unique
            imageSrc={vote.imageSrc}
            name={vote.candidateName}
            description={vote.description}
            onSelect={() => setSelectedCandidate(vote.id)}
          />
        ))}
      </div>
      <button onClick={handleVote} disabled={!selectedCandidate} className="submitButton">Submit Vote</button>
    </div>
  );
};

export default VotingPage;
