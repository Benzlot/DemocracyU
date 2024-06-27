import React, { useState, useEffect } from 'react';
import { getVotes, castVote } from '../services/votingService';
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
