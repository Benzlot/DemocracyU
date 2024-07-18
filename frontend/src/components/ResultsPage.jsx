import React, { useState, useEffect } from 'react';
import { Doughnut } from 'react-chartjs-2';
import 'chart.js/auto';
import { useSpring, animated, useTransition } from 'react-spring';
import chroma from 'chroma-js';
import '../components-style/ResultsPage.css';

const ResultsPage = () => {
  const initialVotes = [
    { name: 'Pakin Chanpom', votes: 200 },
    { name: 'Worameth Tantithanawong', votes: 150 },
    { name: 'Akkharaset Khamson', votes: 50 },
    { name: 'ไม่ประสงค์ลงคะแนน', votes: 50 },
  ];

  const [candidateVotes, setCandidateVotes] = useState(initialVotes);

  // Sort candidates by votes
  const sortedCandidates = [...candidateVotes].sort((a, b) => b.votes - a.votes);

  const totalVotes = candidateVotes.reduce((total, candidate) => total + candidate.votes, 0);
  const nonVoters = 1000 - totalVotes; // Assume a total of 1000 eligible voters

  const data = {
    datasets: [
      {
        data: [totalVotes, nonVoters],
        backgroundColor: ['#A12B20', '#D8695A'],
        hoverBackgroundColor: ['#A12B20', '#D8695A'],
      },
    ],
  };

  data.labels = [
    `ผู้มาใช้สิทธิ์ ${totalVotes} คน`,
    `ผู้ที่ไม่ได้มาใช้สิทธิ์ ${nonVoters} คน`,
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

  useEffect(() => {
    const interval = setInterval(() => {
      window.location.reload();
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="Result">
      <img
        loading="lazy"
        srcSet="https://cdn.builder.io/api/v1/image/assets/TEMP/4123dc5fcfaad26a9e5a99ac9310e751550c6b04072cde979964dd3ea16ab3cc?apiKey=1f6df3b559f94f9cadab107301ebb8cc&width=100 100w, https://cdn.builder.io/api/v1/image/assets/TEMP/4123dc5fcfaad26a9e5a99ac9310e751550c6b04072cde979964dd3ea16ab3cc?apiKey=1f6df3b559f94f9cadab107301ebb8cc&width=200 200w, https://cdn.builder.io/api/v1/image/assets/TEMP/4123dc5fcfaad26a9e5a99ac9310e751550c6b04072cde979964dd3ea16ab3cc?apiKey=1f6df3b559f94f9cadab107301ebb8cc&width=400 400w, https://cdn.builder.io/api/v1/image/assets/TEMP/4123dc5fcfaad26a9e5a99ac9310e751550c6b04072cde979964dd3ea16ab3cc?apiKey=1f6df3b559f94f9cadab107301ebb8cc&width=800 800w, https://cdn.builder.io/api/v1/image/assets/TEMP/4123dc5fcfaad26a9e5a99ac9310e751550c6b04072cde979964dd3ea16ab3cc?apiKey=1f6df3b559f94f9cadab107301ebb8cc&width=1200 1200w, https://cdn.builder.io/api/v1/image/assets/TEMP/4123dc5fcfaad26a9e5a99ac9310e751550c6b04072cde979964dd3ea16ab3cc?apiKey=1f6df3b559f94f9cadab107301ebb8cc&width=1600 1600w, https://cdn.builder.io/api/v1/image/assets/TEMP/4123dc5fcfaad26a9e5a99ac9310e751550c6b04072cde979964dd3ea16ab3cc?apiKey=1f6df3b559f94f9cadab107301ebb8cc&width=2000 2000w, https://cdn.builder.io/api/v1/image/assets/TEMP/4123dc5fcfaad26a9e5a99ac9310e751550c6b04072cde979964dd3ea16ab3cc?apiKey=1f6df3b559f94f9cadab107301ebb8cc&"
        className="ReImg"
      />
      <div className='ResultName'><h1>ผลคะแนนการเลือกตั้งอย่างไม่เป็นทางการ</h1></div>
      <div className="election-results">
        <div className="chart-container">
          <Doughnut data={data} options={options} />
          <div className="chart-text">
            <p>ผู้มีสิทธิ์ {totalVotes + nonVoters} คน</p>
          </div>
          <div className="legend">
            <div><span style={{ backgroundColor: '#A12B20' }}></span>{`ผู้มาใช้สิทธิ์ ${totalVotes} คน`}</div>
            <div><span style={{ backgroundColor: '#D8695A' }}></span>{`ผู้ที่ไม่ได้มาใช้สิทธิ์ ${nonVoters} คน`}</div>
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
  );
};

export default ResultsPage;