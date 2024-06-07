import React, { useState, useEffect } from 'react';
import { getVotes } from '../services/votingService';

const ResultsPage = () => {
  const [results, setResults] = useState([]);

  useEffect(() => {
    async function fetchResults() {
      const data = await getVotes();
      setResults(data);
    }
    fetchResults();
  }, []);

  return (
    <div>
      <h1>Results Page</h1>
      <ul>
        {results.map(result => (
          <li key={result.id}>
            {result.candidateName}: {result.voteCount} votes
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ResultsPage;
