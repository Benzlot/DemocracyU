// components/DirectoryPage.jsx
import React, { useState, useEffect, useContext } from 'react';
import { getCandidates } from '../services/candidateService';
import { getVotes } from '../services/votingService';
import ClipLoader from 'react-spinners/ClipLoader';
import { AuthContext } from '../context/AuthContext';
import '../components-style/DirectP.css';

const DirectoryPage = () => {
  const { userData } = useContext(AuthContext);
  const [topCandidates, setTopCandidates] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  async function fetchTopCandidates() {
    setIsLoading(true);
    try {
      const electionName = userData.electionName;
      console.log('Fetching candidates for election:', electionName);
      let rawCandidates = await getCandidates(electionName);
      console.log('Raw candidates:', rawCandidates);
      let rawVotes = await getVotes(electionName);
      console.log('Raw votes:', rawVotes);
      let candidatesWithVotes = mergeCounts(rawCandidates, rawVotes);
      console.log('Candidates with votes:', candidatesWithVotes);
      let topThree = getTopThreeCandidates(candidatesWithVotes);
      console.log('Top 3 candidates:', topThree);
      setTopCandidates(topThree);
    } catch (error) {
      console.error('Failed to fetch candidate data:', error);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    fetchTopCandidates();
  }, []);

  function mergeCounts(candidates, votes) {
    const countMap = votes.reduce((acc, item) => {
      acc[item._id] = item.count;
      return acc;
    }, {});

    return candidates.map(candidate => ({
      ...candidate,
      votes: countMap[candidate.id] || 0,
    }));
  }

  function getTopThreeCandidates(candidates) {
    return candidates
      .sort((a, b) => b.votes - a.votes)
      .slice(0, 3);
  }

  if (isLoading) {
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
    <div className="directory-page">
      <div className='DirectTitle'><h1>ทำเนียบนักศึกษา</h1></div>
      {topCandidates.length > 0 ? (
        <div className="candidates-container">
          {topCandidates.map((candidate, index) => (
            <div key={candidate.id} className="candidate-card">
              <img
                src={candidate.imageSrc || '/fallback.png'} // Use local fallback image
                alt={candidate.name}
                className="candidate-image"
              />
              <div className="candidate-info">
                <div className="candidate-rank">{index + 1}</div>
                <div className="candidate-name">{candidate.name}</div>
                <div className="candidate-votes">{candidate.votes} votes</div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p>No candidate data available.</p>
      )}
    </div>
  );
};

export default DirectoryPage;