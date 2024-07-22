import React, { useState, useEffect, useContext } from 'react';
import { castVote } from '../services/votingService';
import CandidateCard from './CandidateCard';
import '../components-style/VotingPage.css';
import { getCandidates } from '../services/candidateService';
import { getVoterByMail } from '../services/voterService';
import '../components-style/Navbar.css';
import '../components-style/UserDB.css';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import Swal from 'sweetalert2';
import DigitalClock from './DigitalClock';
import ClipLoader from 'react-spinners/ClipLoader';


const VotingPage = () => {
  const { account, userData, logout } = useContext(AuthContext);
  const [votes, setVotes] = useState([]);
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [electionName, setElectionName] = useState('');
  const [status, setStatus] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate()


  async function fetchVoterData() {
    setIsLoading(true)
    try {
      // console.log(account)
      let rawVoter = await getVoterByMail(account.username);
      //handel error here
      setIsLoading(true)
      setElectionName(rawVoter.election_name)
      setStatus(rawVoter.status)

    } catch (error) {
      console.error("Failed to fetch voter data:", error);
    } finally {
      setIsLoading(false)
    }
  }

  async function fetchCandidate() {
    setIsLoading(true)
    try {
      let rawCandidate = await getCandidates(electionName);
      let mappedCandidate = mapCandidate(rawCandidate);
      setVotes(mappedCandidate)
    } catch (error) {
      console.error("Failed to fetch candidate:", error);
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchVoterData();
  }, []);

  useEffect(() => {
    console.log(electionName, status)
    if (status === "0") {
      fetchCandidate();
    } else if (status === "1") {
      navigate('/results', { state: { electionName } })
    }
  }, [electionName, status]);

  const mapCandidate = (rawData) => {
    return rawData
      .filter((data) => data.id !== 0) // Filter out items where id is 0
      .map((data) => ({
        id: data.id, // Assuming id is unique and can be used as key
        imageSrc: `/uploads/${data.img.path}` || 'https://i.imghippo.com/files/YeJ7o1721571932.png', // Example placeholder URL
        candidateName: data.name || 'Candidate Name', // Example fallback text
        description: data.vision || 'Candidate Vision', // Example fallback text
      }));
  };


  const handleVote = async (id) => {
    // if (selectedCandidate) {
    try {
      await castVote(electionName, id, account.name, account.username);
      alert('Vote cast successfully!');
    } catch (error) {
      console.error('Failed to cast vote:', error);
      // alert('Failed to cast vote. Please try again.');
    }
    // } else {
    //   alert('Please select a candidate before voting.');
    // }
  };

  const handleOnSelect = async (id) => {
    setSelectedCandidate(id)
    const { value: email } = await Swal.fire({
      title: `กรุณากรอกอีเมลสถาบันเพื่อยืนยันการเลือกเบอร์ ${id}`,
      input: "email",
      inputLabel: `Your email address`,
      inputPlaceholder: account.username
    });
    if (email === account.username) {
      Swal.fire(`Entered email: ${email}`);
      await handleVote(id)
      setStatus(1)
    } else {
      Swal.fire(`Email not match`);
    }
  }

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
        <div className='Votename'><h1>ลงคะแนนการเลือกตั้ง</h1></div>
      </div>

      <div className="container">
        {votes.map(vote => (
          <CandidateCard
            key={vote.id} // Ensure vote.id is unique
            imageSrc={vote.imageSrc}
            name={vote.candidateName}
            description={vote.description}
            onSelect={() => handleOnSelect(vote.id)}
          />
        ))}
      </div>

      <button onClick={() => handleVote(0)} disabled={!selectedCandidate} className="submitButton">ไม่ประสงค์ลงคะแนน</button>
    </div>
  );
};

export default VotingPage;
