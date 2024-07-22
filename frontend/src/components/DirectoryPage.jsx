// components/DirectoryPage.jsx
import React, { useState, useEffect, useContext } from 'react';
import { getCandidates } from '../services/candidateService';
import { getVotes } from '../services/votingService';
import ClipLoader from 'react-spinners/ClipLoader';
import { AuthContext } from '../context/AuthContext';
import CandidateRank from './CandidateRank';
import '../components-style/DirectP.css';

const DirectoryPage = () => {
  const { userData } = useContext(AuthContext);
  const [highestCandidate, setHighestCandidate] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  async function fetchCandidateWithHighestVotes() {
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
      let highest = getHighestVoteCandidate(candidatesWithVotes);
      console.log('Highest vote candidate:', highest);
      setHighestCandidate(highest);
    } catch (error) {
      console.error('Failed to fetch candidate data:', error);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    fetchCandidateWithHighestVotes();
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

  function getHighestVoteCandidate(candidates) {
    return candidates.reduce((max, candidate) => (candidate.votes > max.votes ? candidate : max), candidates[0]);
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
      {highestCandidate ? (
        <CandidateRank
          key={highestCandidate.id}
          imageSrc={highestCandidate.imageSrc}
          name={highestCandidate.name}
          description={highestCandidate.vision}
        />
      ) : (
        <p>No candidate data available.</p>
      )}
    </div>
  );
};

export default DirectoryPage;
