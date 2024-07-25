import React, { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import '../components-style/Navbar.css';
import '../components-style/UserDB.css';

const NavbarAdmin = () => {
  const { account, userData, logout } = useContext(AuthContext);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

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
            <Link to="/admin" className="Title">
              DemocracyU
            </Link>
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
                <button onClick={logout} className="logout-button">
                  Logout
                </button>
              </div>
            </>
          ) : (
            <Link to="/login" className="login">
              Login
            </Link>
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
          <Link to="/manage-voting-list" className="nav-link2">
            จัดการการเลือกตั้ง
          </Link>
          <Link to="/manage-student" className="nav-link2">
            จัดการข้อมูลนักศึกษา
          </Link>
          <Link to="/manage-candidate" className="nav-link2">
            จัดการข้อมูลผู้ลงสมัคร
          </Link>
          <a
            href="https://docs.google.com/forms/d/10xfy6m5XSpQlbt1pl3Bwi30ag_GByH570sgOBpmKAdo/edit"
            className="nav-link2"
            target="_blank"
            rel="noopener noreferrer"
          >
            แบบประเมินเว็ปไซต์
          </a>
        </div>
      )}
    </div>
  );
};

export default NavbarAdmin;
