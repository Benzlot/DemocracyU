import React, { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import '../components-style/Navbar.css';
import '../components-style/UserDB.css';
import { getVoterByMail } from '../services/voterService';

const Navbar = () => {
  const { account, userData, logout } = useContext(AuthContext);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  async function fetchVoterData() {
    setIsLoading(true)
    try {

      let rawVoter = await getVoterByMail(account.username);
      //handel error here
      setIsLoading(true)
      setElectionName(rawVoter.election_name)
      setStatus(rawVoter.status)

    } catch (error) {
      //alert ---
      console.error("Failed to fetch voter data:", error);
    } finally {
      setIsLoading(false)
    }
  }
  
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  return (
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
                <img 
                  src={userData.photoUrl} 
                  alt={`${account.name}'s profile`} 
                  className="profile-pic" 
                  onClick={toggleDropdown}
                />
              ) : (
                <div>No Profile Picture</div>
              )}
              <div className={`dropdown-menu ${isDropdownOpen ? 'open' : ''}`}>
                <button onClick={logout} className="logout-button">Logout</button>
              </div>
            </>
          ) : (
            <Link to="/login" className="login">Login</Link>
          )}
        </div>
        <div className="hamburger" onClick={toggleMenu}>
          <div className="bar"></div>
          <div className="bar"></div>
          <div className="bar"></div>
        </div>
      </div>
      {account && (
        <div className={`dashboard-navbar ${isMenuOpen ? 'open' : ''}`}>
          <Link to="/directory" className="nav-link" onClick={toggleMenu}>ทำเนียบนักศึกษา</Link>
          <Link to="/results" className="nav-link" >ผลการเลือกตั้ง</Link>
          <Link to="/evaluationPage" className="nav-link" onClick={toggleMenu}>ประเมินเว็ปไซต์</Link>
        </div>
      )}
    </div>
  );
};

export default Navbar;
