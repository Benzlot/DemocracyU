import React from 'react';
import '../components-style/CandidateRank.css';

const CandidateRank = ({ imageSrc, name, description, onSelect }) => {
    return (
        <div className='candidate'>
        <div className="card">
            <img src={imageSrc} alt={name} />
            <h2>{name}</h2>
            <p>{description}</p>
        </div>
        </div>
    );
};

export default CandidateRank;
