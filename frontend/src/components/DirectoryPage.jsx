import React, { useState, useEffect } from 'react';
import '../components-style/DirectP.css'

const DirectoryPage = () => {
  const [candidates, setCandidates] = useState([]);

  useEffect(() => {
    async function fetchCandidates() {
      // Sample data
      const data = [
        {
          id: 1,
          imageSrc: 'https://via.placeholder.com/150',
          candidateName: 'Akkharaset Khamson',
          description: 'ประธานสาขา DIT64'
        },
        {
          id: 2,
          imageSrc: 'https://via.placeholder.com/150',
          candidateName: 'Pakin Chanpom',
          description: 'เลขานุกาสาขา DIT64'
        },
        {
          id: 3,
          imageSrc: 'https://via.placeholder.com/150',
          candidateName: 'Worameth Tantithanawong',
          description: 'รองประธานสาขา DIT64'
        }
      ];
      setCandidates(data);
    }
    fetchCandidates();
  }, []);

  return (
    <div>
      <div className='Directory'><h1>ทำเนียบนักศึกษา</h1></div>
    <div className="container">
      {candidates.map(candidate => (
        <div key={candidate.id} className="candidate-card">
          <img src={candidate.imageSrc} alt={candidate.candidateName} className="candidate-image" />
          <h2 className="candidate-name">{candidate.candidateName}</h2>
          <p className="candidate-description">{candidate.description}</p>
        </div>
      ))}
    </div>
    </div>
  );
};

export default DirectoryPage;
