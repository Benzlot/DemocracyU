import React, { useContext } from 'react';
import { Link } from 'react-router-dom'; // Assuming you're using react-router-dom
import { AuthContext } from '../context/AuthContext'; // Your authentication context
import '../Components style/Navbar.css'; // Import your CSS for styling

const Navbar = () => {
  const { account } = useContext(AuthContext); // Assuming account contains user information if logged in

  return (
    <div className="navbar">
      <div className="navbar-left">
        <div className="DemocracyU">DemocracyU</div>
      </div>
      <div className="navbar-right">
        <ul>
          {account ? (
            <li className="username">Welcome, {account.name}</li>
          ) : (
            <li><Link to="/login">Login</Link></li>
          )}
        </ul>
      </div>
    </div>
  );
};

export default Navbar;
