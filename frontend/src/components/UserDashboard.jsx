import React from 'react';
import { Link } from 'react-router-dom';

import Navbar from './Navbar';

const UserDashboard = () => {
  return (
    <div>
      <Navbar />
      <ul className="dashboard-navbar">
        <li><Link to="/vote">Vote</Link></li>
        <li><Link to="/results">View Results</Link></li>
        <li><Link to="/directory">Student Directory</Link></li>
        <li><Link to="/evaluation">Evaluate</Link></li>
      </ul>
    </div>
  );
};

export default UserDashboard;
