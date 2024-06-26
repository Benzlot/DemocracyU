import React from 'react';
import Navbar from './Navbar';
import { Link } from 'react-router-dom'; // Assuming you're using react-router-dom

const UserDashboard = () => {
  return (
    <div>
      <Navbar />
      <div className='Vote'> <li><Link to="/vote">Vote</Link></li></div>
    </div>
  );
};

export default UserDashboard;
