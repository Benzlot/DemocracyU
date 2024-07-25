import React, { useState, useEffect, useContext } from 'react';
import { castVote } from '../services/votingService';
import CandidateCard from './CandidateCard';
import '../components-style/VotingPage.css';
import { getCandidates } from '../services/candidateService';
import { getElectionbyName } from '../services/electionService'; // Ensure this function is available
import '../components-style/Navbar.css';
import '../components-style/UserDB.css';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import Swal from 'sweetalert2';
import DigitalClock from './DigitalClock';
import ClipLoader from 'react-spinners/ClipLoader';

const VotingPage = () => {
  const { account, userData, logout } = useContext(AuthContext);
  const [votes, setVotes] = useState([]); // Store Candidates
  const [electionName, setElectionName] = useState(userData.electionName);
  const [status, setStatus] = useState(userData.status);
  const [isLoading, setIsLoading] = useState(false);
  const [isButtonVisible, setIsButtonVisible] = useState(true);
  const navigate = useNavigate();

  async function fetchCandidate() {
    setIsLoading(true);
    try {
      let rawCandidate = await getCandidates(electionName);
      let mappedCandidate = mapCandidate(rawCandidate);
      setVotes(mappedCandidate);
    } catch (error) {
      console.error("Failed to fetch candidate:", error);
    } finally {
      setIsLoading(false);
    }
  }

  async function checkElectionStatus() {
    try {
      const elections = await getElectionbyName(electionName); // Fetch election data
      console.log("Election data:", elections);
      const now = new Date();
      const electionStart = new Date(elections.election_start);
      const electionEnd = new Date(elections.election_end);
      console.log("Current time:", now);
      console.log("Election start time:", electionStart);
      console.log("Election end time:", electionEnd);

      if (now > electionEnd) {
        setIsButtonVisible(false);
        Swal.fire({
          title: 'Voting has ended',
          text: 'You will be redirected to the results page.',
          icon: 'info',
          confirmButtonText: 'OK',
        }).then(() => {
          navigate('/results');
        });
      } else if (now < electionStart) {
        setIsButtonVisible(true);
      }
    } catch (error) {
      console.error("Failed to check election status:", error);
    }
  }

  useEffect(() => {
    console.log("status", status)
    userData.status = status;
    checkElectionStatus();
    if (status == "0") { 
      fetchCandidate();
    } else if (status == "1") {
      navigate('/results');
    }
  }, [status]);

  const mapCandidate = (rawData) => {
    return rawData
      .filter((data) => data.id !== 0) // Filter out items where id is 0
      .map((data) => ({
        id: data.id, // Assuming id is unique and can be used as key
        imageSrc: data.img.path || 'https://i.imghippo.com/files/YeJ7o1721571932.png', // Example placeholder URL
        candidateName: data.name || 'Candidate Name', // Example fallback text
        description: data.vision || 'Candidate Vision', // Example fallback text
      }));
  };

  const handleVote = async (id) => {
    if (!isButtonVisible) {
      Swal.fire({
        title: 'Voting has ended',
        text: 'You will be redirected to the results page.',
        icon: 'info',
        confirmButtonText: 'OK',
      }).then(() => {
        navigate('/results');
      });
      return;
    }

    try {
      await castVote(electionName, id, account.name, account.username);
      Swal.fire('Vote cast successfully!').then(() => {
        setStatus(1); // Update status to indicate that the vote has been cast
      });
    } catch (error) {
      console.error('Failed to cast vote:', error);
      Swal.fire('Failed to cast vote. Please try again.');
    }
  };

  const handleOnSelect = async (vote) => {
    if (!isButtonVisible) {
      Swal.fire({
        title: 'Voting has ended',
        text: 'You will be redirected to the results page.',
        icon: 'info',
        confirmButtonText: 'OK',
      }).then(() => {
        navigate('/results');
      });
      return;
    }

    const { value: email } = await Swal.fire({
      title: vote.id === 0 ? "กรุณากรอกอีเมลสถาบันเพื่อยืนยันการเลือกไม่ประสงลงคะแนน" : `กรุณากรอกอีเมลสถาบันเพื่อยืนยันการเลือกคุณ ${vote.candidateName}`,
      input: "email",
      inputLabel: `Your email address`,
      inputPlaceholder: account.username
    });
    if (email === account.username) {
      Swal.fire(`Entered email: ${email}`);
      await handleVote(vote.id);
    } else {
      Swal.fire(`Email not match`);
    }
  };

  if (isLoading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh'
      }}>
        <ClipLoader color="#ff0000" size={100} speedMultiplier={2} />
      </div>
    );
  }

  return (
    <div>
      <div>
        <div className="navbar">
          <div className="navbar-left">
            <div className="DemocracyU">
              <Link to="/" className="Title">DemocracyU</Link>
            </div>
          </div>
          <div className="navbar-right">
            {account ? (
              <>
                <div className="username">{account.name}</div>
                {userData && userData.photoUrl ? (
                  <img src={userData.photoUrl} alt={`${account.name}'s profile`} className="profile-pic" />
                ) : (
                  <div>No Profile Picture</div>
                )}
                <button onClick={logout} className="logout-button">Logout</button>
              </>
            ) : (
              <Link to="/login" className="login">Login</Link>
            )}
          </div>
        </div>
      </div>
      <DigitalClock />
      <div className='VTitle'>
        <img
          loading="lazy"
          src="https://cdn.builder.io/api/v1/image/assets/TEMP/2ce82bc26ade1c739d9d608ab8b11d9e964f32f41dc2f611f3636da9d9abc742?apiKey=1f6df3b559f94f9cadab107301ebb8cc"
          className="VImg"
          alt=""
        />
        <div className='Votename'><h1>ลงคะแนนการเลือกตั้ง {electionName} </h1></div>
      </div>

      <div className="container">
        {votes.map(vote => (
          <CandidateCard
            key={vote.id} // Ensure vote.id is unique
            imageSrc={vote.imageSrc}
            name={vote.candidateName}
            description={vote.description}
            onSelect={() => handleOnSelect(vote)}
          />
        ))}
      </div>

      {isButtonVisible && (
        <button onClick={() => handleOnSelect({ id: 0 })} className="submitButton">ไม่ประสงค์ลงคะแนน</button>
      )}
    </div>
  );
};

export default VotingPage;
