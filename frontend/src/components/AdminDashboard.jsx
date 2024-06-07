import React from 'react';
import { Link } from 'react-router-dom';

const AdminDashboard = () => {
  return (
    <div>
      <h1>Admin Dashboard</h1>
      <ul>
        <li><Link to="/vote">Manage Voting</Link></li>
        <li><Link to="/results">View Results</Link></li>
        <li><Link to="/directory">Student Directory</Link></li>
        <li><Link to="/evaluation">Evaluate</Link></li>
      </ul>
    </div>
  );
};

export default AdminDashboard;
