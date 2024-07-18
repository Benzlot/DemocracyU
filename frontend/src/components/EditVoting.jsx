import React, { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import '../components-style/Navbar.css';
import '../components-style/UserDB.css';
import '../components-style/AdminDashboard.css';
import '../components-style/ManageVoting.css';
import '../components-style/ManageDataStudent.css';
import DigitalClock from '../components/DigitalClock';

const EditVoting = () => {
    const { account, userData, logout } = useContext(AuthContext);
    const [electionName, setElectionName] = useState('');
    const [electionType, setElectionType] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [error, setError] = useState('');

    const handleStartDateChange = (e) => {
        setStartDate(e.target.value);
        if (new Date(e.target.value) > new Date(endDate)) {
            setError('Start date cannot be later than end date.');
        } else {
            setError('');
        }
    };

    const handleEndDateChange = (e) => {
        setEndDate(e.target.value);
        if (new Date(startDate) > new Date(e.target.value)) {
            setError('End date cannot be earlier than start date.');
        } else {
            setError('');
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Handle form submission logic here
    };

    const handleEmergencyClose = () => {
        // Handle emergency close logic here
        // You can make an API call to close the voting immediately
        console.log("Emergency close triggered");
    };

    return (
        <div>
            <div className="navbar">
                <div className="navbar-left">
                    <div className="DemocracyU">
                        <Link to="/" className="Title">DemocracyU</Link>
                    </div>
                </div>
                <div className="navbar-right">
                    {account ? (
                        <>
                            <div className="username">{account.name}</div>
                            {userData && userData.photoUrl ? (
                                <img src={userData.photoUrl} alt={`${account.name}'s profile`} className="profile-pic" />
                            ) : (
                                <div>No Profile Picture</div>
                            )}
                            <button onClick={logout} className="logout-button">Logout</button>
                        </>
                    ) : (
                        <Link to="/login" className="login">Login</Link>
                    )}
                </div>
            </div>
            <div className="clock">
                <DigitalClock />
            </div>
            <div className="election-form-container">
                <div className='VTitle'>
                    <img
                        loading="lazy"
                        src="https://cdn.builder.io/api/v1/image/assets/TEMP/2ce82bc26ade1c739d9d608ab8b11d9e964f32f41dc2f611f3636da9d9abc742?apiKey=1f6df3b559f94f9cadab107301ebb8cc"
                        className="VImg"
                        alt=""
                    />
                    <div className='Votename'><h1>แก้ไขเลือกตั้ง</h1></div>
                </div>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="electionName">ตั้งชื่อการเลือกตั้ง:</label>
                        <input
                            type="text"
                            id="electionName"
                            value={electionName}
                            onChange={(e) => setElectionName(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="electionType">เลือกประเภทการเลือกตั้ง:</label>
                        <select
                            id="electionType"
                            value={electionType}
                            onChange={(e) => setElectionType(e.target.value)}
                            required
                        >
                            <option value="">เลือก</option>
                            <option value="คณะ">การเลือกตั้งแบบคณะ</option>
                            <option value="สาขา">การเลือกตั้งแบบสาขา</option>
                        </select>
                    </div>
                    <div className="form-group">
                        <label>กำหนดเวลาการเลือกตั้ง:</label>
                        <input
                            type="datetime-local"
                            value={startDate}
                            onChange={handleStartDateChange}
                            required
                        />
                        <span> ถึง </span>
                        <input
                            type="datetime-local"
                            value={endDate}
                            onChange={handleEndDateChange}
                            required
                        />
                    </div>
                    {error && <div className="error">{error}</div>}
                    <div className="form-group button">
                        <button type="submit" className="btn btn-success">ยืนยัน</button>
                        <button type="button" className="btn btn-danger" onClick={() => history.push('/manage-voting-list')}>ยกเลิก</button>
                    </div>
                    <div className="form-group button">
                        <button
                            variant="contained"
                            component="span"
                            style={{ margin: 20, backgroundColor: '#A03939' }}
                            startIcon={<img src="https://cdn-icons-png.flaticon.com/512/11039/11039795.png" alt="icon" style={{ width: 20, marginRight: 10 }} />}
                            type="button" className="btn btn-warning" onClick={handleEmergencyClose}>ปิดการเลือกตั้งฉุกเฉิน</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditVoting;
