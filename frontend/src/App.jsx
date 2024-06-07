import React, { useContext } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { AuthContext, AuthProvider } from './context/AuthContext';
import AdminDashboard from './components/AdminDashboard';
import UserDashboard from './components/UserDashboard';
import VotingPage from './components/VotingPage';
import ResultsPage from './components/ResultsPage';
import DirectoryPage from './components/DirectoryPage';
import EvaluationPage from './components/EvaluationPage';
import LoginPage from './pages/LoginPage';

function App() {
  const { account, userData } = useContext(AuthContext);
  
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        {account && userData?.jobTitle === 'Admin' ? (
          <>
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/vote" element={<VotingPage />} />
            <Route path="/results" element={<ResultsPage />} />
            <Route path="/directory" element={<DirectoryPage />} />
            <Route path="/evaluation" element={<EvaluationPage />} />
          </>
        ) : (
          <>
            <Route path="/" element={<UserDashboard />} />
            <Route path="/vote" element={<VotingPage />} />
            <Route path="/results" element={<ResultsPage />} />
            <Route path="/directory" element={<DirectoryPage />} />
            <Route path="/evaluation" element={<EvaluationPage />} />
          </>
        )}
      </Routes>
    </Router>
  );
}

export default function AppWrapper() {
  return (
    <AuthProvider>
      <App />
    </AuthProvider>
  );
}
