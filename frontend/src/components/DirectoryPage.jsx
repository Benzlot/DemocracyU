import React, { useState, useEffect } from 'react';
import '../components-style/DirectP.css'
import { getCandidates } from '../services/candidateService';
import CandidateRank from './CandidateRank';

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
    <div className='text-align'>
      <div className='Directory'><h1>ทำเนียบนักศึกษา</h1></div>
    <CandidateRank/>
    
    </div>
  );
};

export default DirectoryPage;
