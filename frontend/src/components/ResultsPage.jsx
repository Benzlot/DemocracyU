import React, { useState, useEffect } from 'react';
import { Doughnut } from 'react-chartjs-2';
import 'chart.js/auto';
import { useSpring, animated, useTransition } from 'react-spring';
import { Link , useLocation } from 'react-router-dom';
import chroma from 'chroma-js';
import '../components-style/ResultsPage.css';
import { getCandidates } from '../services/candidateService';
import { getVotes } from '../services/votingService';
import { getStatus } from '../services/voterService';

const ResultsPage = () => {
  const [totalVotes, setTotalVotes] = useState('');
  const [nonVotes, setNonVotes] = useState('') // Assume a total of 1000 eligible voters
  const location = useLocation();
  // const electionName = location.electionName || '';
  
  const initialVotes = [
    { name: 'Pakin Chanpom', votes: 200 },
    { name: 'Worameth Tantithanawong', votes: 150 },
    { name: 'Akkharaset Khamson', votes: 50 },
    { name: 'ไม่ประสงค์ลงคะแนน', votes: 50 },
  ];

  
  const [candidateVotes, setCandidateVotes] = useState("");
  
  const sortedCandidates = [...candidateVotes].sort((a, b) => b.votes - a.votes);
  
  async function fetchCandidate() {
    const {electionName} = location.state || '';
    console.log(electionName)
    let rawCandidate = await getCandidates(electionName);
    let mappedCandidate = mapCandidate(rawCandidate);
    console.log("mappedCandidate",mappedCandidate)
    let rawVoting = await getVotes(electionName);
    console.log("rawVoting",rawVoting)
    let candidateVoteMapped = mergeCounts(mappedCandidate,rawVoting)
    console.log("candidateVoteMapped",candidateVoteMapped)
    setCandidateVotes(candidateVoteMapped)
    let {vote,nonVote} = await getStatus(electionName);
    setNonVotes(nonVote)
    setTotalVotes(vote)
  }

  const mapCandidate = (rawData) => {
    return rawData.map((data) => ({
        id: data.id, // Assuming id is unique and can be used as key
        imageSrc: `/uploads/${data.img.path}` || 'https://i.imghippo.com/files/YeJ7o1721571932.png', // Example placeholder URL
        name: data.name || 'Candidate Name',
      }));
  };

  function mergeCounts(candidate, voting) {
    const countMap = voting.reduce((acc, item) => {
      acc[item._id] = item.count;
      return acc;
    }, {});
  
    return candidate.map(item => ({
      ...item,
      votes: countMap[item.id] || 0 // Add count or default to 0 if no match
    }));
  }

  
  useEffect(() => {
    fetchCandidate();

     // Set interval to fetch every minute
     const intervalId = setInterval(fetchCandidate, 3000);

     // Cleanup interval on component unmount
     return () => clearInterval(intervalId);
  }, []);


  const data = {
    datasets: [
      {
        data: [totalVotes, nonVotes],
        backgroundColor: ['#A12B20', '#D8695A'],
        hoverBackgroundColor: ['#A12B20', '#D8695A'],
      },
    ],
  };

  data.labels = [
    `ผู้มาใช้สิทธิ์ ${totalVotes} คน`,
    `ผู้ที่ไม่ได้มาใช้สิทธิ์ ${nonVotes} คน`,
  ];

  const options = {
    cutout: '70%',
    plugins: {
      legend: {
        display: false,
      },
    },
  };

  // Generate gradient colors from dark red to gray
  const colors = chroma.scale(['#A12B20', '#D3D3D3']).colors(candidateVotes.length);

  const transitions = useTransition(
    sortedCandidates.map((candidate, index) => ({ ...candidate, index })),
    {
      key: item => item.name,
      from: { transform: 'translate3d(0,-40px,0)', opacity: 0 },
      enter: { transform: 'translate3d(0,0px,0)', opacity: 1 },
      leave: { transform: 'translate3d(0,40px,0)', opacity: 0 },
      config: { duration: 500 },
    }
  );

 
  return (
    <div className="Result">
      <div className='Notoff'>
        <div className='ReImg'>
      <img
        loading="lazy"
        srcSet="https://cdn.builder.io/api/v1/image/assets/TEMP/4123dc5fcfaad26a9e5a99ac9310e751550c6b04072cde979964dd3ea16ab3cc?apiKey=1f6df3b559f94f9cadab107301ebb8cc&width=100 100w, https://cdn.builder.io/api/v1/image/assets/TEMP/4123dc5fcfaad26a9e5a99ac9310e751550c6b04072cde979964dd3ea16ab3cc?apiKey=1f6df3b559f94f9cadab107301ebb8cc&width=200 200w, https://cdn.builder.io/api/v1/image/assets/TEMP/4123dc5fcfaad26a9e5a99ac9310e751550c6b04072cde979964dd3ea16ab3cc?apiKey=1f6df3b559f94f9cadab107301ebb8cc&width=400 400w, https://cdn.builder.io/api/v1/image/assets/TEMP/4123dc5fcfaad26a9e5a99ac9310e751550c6b04072cde979964dd3ea16ab3cc?apiKey=1f6df3b559f94f9cadab107301ebb8cc&width=800 800w, https://cdn.builder.io/api/v1/image/assets/TEMP/4123dc5fcfaad26a9e5a99ac9310e751550c6b04072cde979964dd3ea16ab3cc?apiKey=1f6df3b559f94f9cadab107301ebb8cc&width=1200 1200w, https://cdn.builder.io/api/v1/image/assets/TEMP/4123dc5fcfaad26a9e5a99ac9310e751550c6b04072cde979964dd3ea16ab3cc?apiKey=1f6df3b559f94f9cadab107301ebb8cc&width=1600 1600w, https://cdn.builder.io/api/v1/image/assets/TEMP/4123dc5fcfaad26a9e5a99ac9310e751550c6b04072cde979964dd3ea16ab3cc?apiKey=1f6df3b559f94f9cadab107301ebb8cc&width=2000 2000w, https://cdn.builder.io/api/v1/image/assets/TEMP/4123dc5fcfaad26a9e5a99ac9310e751550c6b04072cde979964dd3ea16ab3cc?apiKey=1f6df3b559f94f9cadab107301ebb8cc&"
      />
      </div>
      <div><h1>ผลคะแนนการเลือกตั้งอย่างไม่เป็นทางการ</h1></div>
      </div>
      <div className='eRe'>
      <div className="election-results">
        <div className="chart-container">
          <Doughnut data={data} options={options} />
          <div className="chart-text">
            <p>ผู้มีสิทธิ์ {totalVotes + nonVotes} คน</p>
          </div>
          <div className="legend">
            <div><span style={{ backgroundColor: '#A12B20' }}></span>{`ผู้มาใช้สิทธิ์ ${totalVotes} คน`}</div>
            <div><span style={{ backgroundColor: '#D8695A' }}></span>{`ผู้ที่ไม่ได้มาใช้สิทธิ์ ${nonVotes} คน`}</div>
          </div>
        </div>
        <div className="candidates-container">
          {transitions((style, item) => {
            const color = colors[item.index];
            return (
              <animated.div key={item.name} className="candidate" style={{ ...style, backgroundColor: color }}>
                <div className="candidate-rank">{item.index + 1}.</div>
                <div className="candidate-info">
                  <div className="candidate-name">{item.name}</div>
                  <div className="candidate-votes">{item.votes} คะแนน</div>
                </div>
              </animated.div>
            );
          })}
        </div>
      </div>
    </div>
    </div>
  );
};

export default ResultsPage;