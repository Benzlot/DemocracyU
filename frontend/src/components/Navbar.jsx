import React, { useContext } from 'react';
import { Link } from 'react-router-dom'; // Assuming you're using react-router-dom
import { AuthContext } from '../context/AuthContext'; // Your authentication context
import '../Components style/Navbar.css'; // Import your CSS for styling
import '../Components style/UserDB.css'; // Import additional CSS if needed

const Navbar = () => {
  const { account } = useContext(AuthContext); // Assuming account contains user information if logged in

  return (
    <div>
      <div className="navbar">
        <div className="navbar-left">
          <div className="DemocracyU"><Link to="/" className="Title">DemocracyU</Link></div>
        </div>
        <div className="navbar-right">
          {account ? (
            <div className="username">Welcome, {account.name}</div>
          ) : (
            <Link to="/login" className="login">Login</Link>
          )}
        </div>
      </div>
      <div className="dashboard-navbar">
        <Link to="/directory" className="nav-link">ทำเนียบนักศึกษา</Link>
        <Link to="/results" className="nav-link">ผลการเลือกตั้ง</Link>
        <Link to="/evaluationStudent" className="nav-link">ประเมินผล</Link>
        <Link to="/evaluationPage" className="nav-link">ประเมินเว็ปไซต์</Link>
      </div>
    </div>
  );
};

export default Navbar;
