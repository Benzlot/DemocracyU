import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import '../components-style/Navbar.css';
import '../components-style/UserDB.css';

const Navbar = () => {
  const { account, userData, logout } = useContext(AuthContext);

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
              {userData && userData.photoUrl && (
                <img src={userData.photoUrl} alt="Profile" className="profile-pic" />
              )}
              <div className="username">{account.name}</div>
              <button onClick={logout} className="logout-button">Logout</button>
            </>
          ) : (
            <Link to="/login" className="login">Login</Link>
          )}
        </div>
      </div>
      {account && (
        <div className="dashboard-navbar">
          <Link to="/directory" className="nav-link">ทำเนียบนักศึกษา</Link>
          <Link to="/results" className="nav-link">ผลการเลือกตั้ง</Link>
          <Link to="/evaluationStudent" className="nav-link">ประเมินผล</Link>
          <Link to="/evaluationPage" className="nav-link">ประเมินเว็ปไซต์</Link>
        </div>
      )}
    </div>
  );
};

export default Navbar;
