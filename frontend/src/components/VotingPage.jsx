import React, { useState, useEffect } from 'react';
import { getVotes, castVote } from '../services/votingService';
import Navbar from './Navbar';
import DigitalClock from './DigitalClock';
import CandidateCard from './CandidateCard';
import '../components-style/VotingPage.css';

const VotingPage = () => {
  const [votes, setVotes] = useState([]);
  const [selectedCandidate, setSelectedCandidate] = useState(null);

  useEffect(() => {
    async function fetchVotes() {
      // ข้อมูลตัวอย่าง
      const data = [
        {
          id: 1,
          imageSrc: 'https://via.placeholder.com/150',
          candidateName: 'Akkharaset Khamson',
          description: 'ทุกคนจะจ่ายค่าข้าวถูกลง'
        },
        {
          id: 2,
          imageSrc: 'https://via.placeholder.com/150',
          candidateName: 'Pakin Chanpom',
          description: 'ทุกที่จะปลอดยาเสพติด'
        },
        {
          id: 3,
          imageSrc: 'https://via.placeholder.com/150',
          candidateName: 'Worameth Tantithanawong',
          description: 'เรียนฟรีทุกคน'
        }
      ];
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
      <Navbar />
      <DigitalClock />
      <div className="container">
        {votes.map(vote => (
          <CandidateCard
            key={vote.id}
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
