// components/CandidateRank.jsx
import React from 'react';
import PropTypes from 'prop-types';
import '../components-style/CandidateRank.css';

const CandidateRank = ({ imageSrc, name, description }) => {
  return (
    <div className="candidate-rank-card">
      <img src={imageSrc} alt={name} className="candidate-rank-image" />
      <div className="candidate-rank-info">
        <h2>{name}</h2>
        <p>{description}</p>
      </div>
    </div>
  );
};

CandidateRank.propTypes = {
  imageSrc: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
};

export default CandidateRank;
