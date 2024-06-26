import React from 'react';
import '../components-style/CandidateCard.css';

const CandidateCard = ({ imageSrc, name, description, onSelect }) => {
    return (
        <div className="card">
            <img src={imageSrc} alt={name} />
            <h2>{name}</h2>
            <p>{description}</p>
            <button onClick={onSelect}>เลือก</button>
        </div>
    );
};

export default CandidateCard;
