import React from 'react';
import { Link } from 'react-router-dom';

const UserDashboard = () => {
  return (
    <div>
      <h1>User Dashboard</h1>
      <ul>
        <li><Link to="/vote">Vote</Link></li>
        <li><Link to="/results">View Results</Link></li>
        <li><Link to="/directory">Student Directory</Link></li>
        <li><Link to="/evaluation">Evaluate</Link></li>
      </ul>
    </div>
  );
};

export default UserDashboard;
