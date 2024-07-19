import React, { useContext } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate, useLocation } from 'react-router-dom';
import { AuthContext, AuthProvider } from './context/AuthContext';
import AdminDashboard from './components/AdminDashboard';
import UserDashboard from './components/UserDashboard';
import VotingPage from './components/VotingPage';
import ResultsPage from './components/ResultsPage';
import DirectoryPage from './components/DirectoryPage';
import EvaluationPage from './components/EvaluationPage';
import EvaluationStudent from './components/EvaluationStudent';
import LoginPage from './pages/LoginPage';
import Navbar from './components/Navbar';
import DigitalClock from './components/DigitalClock';
import ManageDataStudent from './components/ManageDataStudent';
import ManageDataCandidate from './components/ManageDataCandidate';
import ManageVoting from './components/ManageVoting';
import ManageVotingList from './components/ManageVotingList';
import EditVoting from './components/EditVoting';
import ClipLoader from "react-spinners/ClipLoader"; // Import ClipLoader

function App() {
  const { account, userData, isAdmin, isLoading } = useContext(AuthContext);
  const location = useLocation();

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

  // Define paths where Navbar should not be shown
  const noNavbarPaths = ['/login', '/admin', '/manage-student', '/manage-candidate', '/manage-voting', '/manage-voting-list', '/edit-voting'];

  // Check if current path is in noNavbarPaths
  const showNavbar = account && !noNavbarPaths.some(path => location.pathname.startsWith(path));

  return (
    <>
      {/* Conditionally render Navbar */}
      {showNavbar && <Navbar />}

      {/* Conditionally render DigitalClock */}
      {showNavbar && <DigitalClock />}

      <Routes>
        {/* Render LoginPage if not logged in */}
        {!account ? (
          <Route path="/" element={<LoginPage />} />
        ) : account && isAdmin ? (
          <>
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/manage-student" element={<ManageDataStudent />} />
            <Route path="/manage-candidate" element={<ManageDataCandidate />} />
            <Route path="/manage-voting-list" element={<ManageVotingList />} />
            <Route path="/edit-voting/:id" element={<EditVoting />} />
            <Route path="/manage-voting" element={<ManageVoting />} />
            <Route path="*" element={<Navigate to="/admin" />} />
          </>
        ) : (
          <>
            <Route path="/" element={<UserDashboard />} />
            <Route path="/vote" element={<VotingPage />} />
            <Route path="/results" element={<ResultsPage />} />
            <Route path="/directory" element={<DirectoryPage />} />
            <Route path="/evaluationPage" element={<EvaluationPage />} />
            <Route path="/evaluationStudent" element={<EvaluationStudent />} />
            <Route path="*" element={<Navigate to="/" />} />
          </>
        )}
      </Routes>
    </>
  );
}

function AppWrapper() {
  return (
    <Router>
      <AuthProvider>
        <App />
      </AuthProvider>
    </Router>
  );
}

export default AppWrapper;
