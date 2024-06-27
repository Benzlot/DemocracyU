import React, { useState, useEffect } from 'react';

const DigitalClock = () => {
    const [currentTime, setCurrentTime] = useState(new Date());

    useEffect(() => {
        const timerId = setInterval(() => {
            setCurrentTime(new Date());
        }, 1000);

        return () => clearInterval(timerId);
    }, []);

    return (
        <h1 style={{ textAlign: 'right', marginRight: '20px' , fontSize:'2vw' }}>
            {currentTime.toLocaleTimeString()}
        </h1>
    );
};

export default DigitalClock;
