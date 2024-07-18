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
import ManageVoting from './components/MangeVoting';
import ManageVotingList from './components/ManageVotingList';
import EditVoting from './components/EditVoting';

function App() {
  const { account, userData } = useContext(AuthContext);
  const location = useLocation();

  if (account === undefined) {
    // Render loading state or placeholder while initializing context
    return <div>Loading...</div>;
  }

  const noNavbarPaths = ['/login', '/', '/manage-student', '/manage-candidate', '/manage-voting']; // Add paths where you don't want to show the Navbar

  const showNavbar = account && !noNavbarPaths.includes(location.pathname);

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
        ) : account && userData?.jobTitle === 'Admin' ? (
          <>
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/manage-student" element={<ManageDataStudent />} />
            <Route path="/results" element={<ResultsPage />} />
            <Route path="/directory" element={<DirectoryPage />} />
            <Route path="/evaluation" element={<EvaluationPage />} />
            <Route path="*" element={<Navigate to="/admin" />} />
          </>
        ) : (
          <>
            <Route path="/" element={<AdminDashboard />} />   //UserDashboard
            <Route path="/manage-student" element={<ManageDataStudent />} />
            <Route path="/manage-candidate" element={<ManageDataCandidate />} />
            <Route path="/manage-voting" element={<EditVoting />} />
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
