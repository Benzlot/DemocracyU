import React, { useContext } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
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
import DigitalClock from './components/DigitalClock'
function App() {
  const { account, userData } = useContext(AuthContext);
  return (
    <Router>
      <Navbar />
      <DigitalClock />
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
            <Route path="/evaluationPage" element={<EvaluationPage />} />
            <Route path="/evaluationStudent" element={<EvaluationStudent />} />
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
