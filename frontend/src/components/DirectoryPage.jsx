import React, { useState, useEffect } from 'react';
import '../components-style/DirectP.css'
import { getCandidates } from '../services/candidateService';

const DirectoryPage = () => {
  const [candidates, setCandidates] = useState([]);

  useEffect(() => {
    async function fetchCandidates() {
      const rawData = await getCandidates()
      // ข้อมูลตัวอย่าง
      const data = mapCandidate(rawData)
      setCandidates(data);
    }
    fetchCandidates();
  }, []);

  const mapCandidate = (rawData) =>{
    const mappedData = rawData.map((data)=>{
      let map = {
        id: parseInt(data.id, 10),//cast String to int 
        imageSrc: 'https://via.placeholder.com/150',
        candidateName: data.name,
        description: data.vision
      }

      return map
    })

    return mappedData
  }

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
