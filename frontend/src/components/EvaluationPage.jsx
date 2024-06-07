import React, { useState } from 'react';
import { submitEvaluation } from '../services/votingService';

const EvaluationPage = () => {
  const [feedback, setFeedback] = useState('');

  const handleSubmit = async () => {
    await submitEvaluation(feedback);
    alert('Evaluation submitted successfully!');
  };

  return (
    <div>
      <h1>Evaluation Page</h1>
      <textarea
        value={feedback}
        onChange={e => setFeedback(e.target.value)}
      />
      <button onClick={handleSubmit}>Submit Evaluation</button>
    </div>
  );
};

export default EvaluationPage;
