import React, { useEffect, useContext, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import { getElectionbyName } from '../services/electionService'; // Ensure this function is available
import { getElection } from '../services/electionService';
import ClipLoader from 'react-spinners/ClipLoader';
import { getVoterByMail } from '../services/voterService';
import Swal from 'sweetalert2';

const UserDashboard = () => {
  const { account, userData } = useContext(AuthContext);
  const [electionName, setElectionName] = useState(userData.electionName);
  const [isButtonVisible, setIsButtonVisible] = useState(true); // State for button visibility
  const [isLoading, setIsLoading] = useState(false);

  async function checkStatusMail(mail) {
    try {
      let rawData = await getVoterByMail(mail);
      if (!rawData) {
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'คุณไม่มีสิทธิ์เข้าถึงการเลือกตั้งนี้',
          confirmButtonText: 'OK',
        }).then((result) => {
          if (result.isConfirmed) {
            // Clear login data
            // For cookies, you can use a library like js-cookie
            // Cookies.remove('your-cookie-name');

            // For localStorage
            localStorage.clear();

            // Navigate to login page
            window.location.reload();
          }
        });
      }
    } catch (error) {
      console.error(error);
    }
  }

  async function handleDateChange() {
    setIsLoading(true);
    try {
      const elections = await getElectionbyName(electionName); // Fetch election data
      const now = new Date();
      const electionStart = new Date(elections.election_start);
      const electionEnd = new Date(elections.election_end);
      if (now < electionStart || now > electionEnd) {
        setIsButtonVisible(false); // Hide button if not within the date range
      } else {
        setIsButtonVisible(true); // Show button if within the date range
      }
    } catch (error) {
      console.error('Failed to handle date change:', error);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    if (account?.username) {
      checkStatusMail(account.username);
    }
    handleDateChange();
  }, [account?.name, userData]); // Added account?.name to dependencies

  if (isLoading) {
    // Render spinner while loading
    return (
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
        }}
      >
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
