import React, { useEffect, useContext, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Link } from 'react-router-dom'; // Assuming you're using react-router-dom
import { getElection } from '../services/electionService';
import ClipLoader from 'react-spinners/ClipLoader';


const UserDashboard = () => {
  const { account, userData, logout } = useContext(AuthContext);
  const [isButtonVisible, setIsButtonVisible] = useState(true); // State for button visibility
  const [isLoading, setIsLoading] = useState(false);

  async function handleDateChange() {
    setIsLoading(true);
    try {
      const rawData = await getElection(); // Await the result of getElection
      const elections = rawData.map((data) => ({
        start: new Date(data.election_start),
        end: new Date(data.election_end),
      }));

      if (elections.length > 0) {
        const firstElection = elections[0];
        const now = new Date();

        if (now < firstElection.start || now > firstElection.end) {
          setIsButtonVisible(false); // Hide button if not within the date range
        } else {
          setIsButtonVisible(true); // Show button if within the date range
        }
      }
    } catch (error) {
      console.error("Failed to handle date change:", error);
    } finally {
      setIsLoading(false);
    }
  }


  useEffect(() => {
    handleDateChange();
  }, [userData]);

  if (isLoading) {
    // Render spinner while loading
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
    <div className="dashboard-container">
      <img
        loading="lazy"
        src="https://cdn.builder.io/api/v1/image/assets/TEMP/163ec1926cd918c13a5fb6055a8069d3e3debbefcf978652c071fdb5564ad73e?apiKey=1f6df3b559f94f9cadab107301ebb8cc"
        className="News"
        alt="News Image"
      />
      {isButtonVisible && (
        <div className="vote-container">
          <Link to="/vote" className="vote-button">
            <img
              loading="lazy"
              src="https://cdn.builder.io/api/v1/image/assets/TEMP/2ce82bc26ade1c739d9d608ab8b11d9e964f32f41dc2f611f3636da9d9abc742?apiKey=1f6df3b559f94f9cadab107301ebb8cc"
              className="vote-image"
              alt="Unknown Image"
            />
            <span>ลงคะแนนการเลือกตั้ง</span>
          </Link>
        </div>
      )}
    </div>
  );
};

export default UserDashboard;
