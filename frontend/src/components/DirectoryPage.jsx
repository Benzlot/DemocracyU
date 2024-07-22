import React, { useState, useEffect } from 'react';
import '../components-style/DirectP.css'
import { getCandidates } from '../services/candidateService';
import CandidateRank from './CandidateRank';
import ClipLoader from 'react-spinners/ClipLoader';

const DirectoryPage = () => {
  const [candidates, setCandidates] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchCandidates();
  }, []);

  async function fetchCandidates() {
    //try catch here
    setIsLoading(true)
    const rawData = await getCandidates()
    // ข้อมูลตัวอย่าง
    const data = mapCandidate(rawData)
    setCandidates(data);
    setIsLoading(false)
  }

  const mapCandidate = (rawData) => {
    const mappedData = rawData.map((data) => {
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

  if (isLoading) {
    // Render spinner while loading
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh'
      }}>
        <ClipLoader
          color="#ff0000"
          cssOverride={{}}
          size={100}
          speedMultiplier={2}
        />
      </div>
    );
  }

  return (
    <div className='text-align'>
      <div className='Directory'><h1>ทำเนียบนักศึกษา</h1></div>
      <CandidateRank />

    </div>
  );
};

export default DirectoryPage;
