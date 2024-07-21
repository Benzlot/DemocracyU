import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import '../components-style/Navbar.css';
import '../components-style/UserDB.css';
import '../components-style/AdminDashboard.css';
import '../components-style/ManageVoting.css';
import '../components-style/ManageDataStudent.css';
import DigitalClock from './DigitalClock';
import { addElection } from '../services/electionService';
import Swal from 'sweetalert2';
import CircularProgress from '@mui/material/CircularProgress';

const ManageVoting = () => {
    const { account, userData, logout } = useContext(AuthContext);
    const [electionName, setElectionName] = useState('');
    const [electionType, setElectionType] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

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

    const handleConfirm = async () => {
        if (!electionName || !electionType || !startDate || !endDate) {
            Swal.fire({
                icon: 'error',
                title: 'ข้อมูลไม่ครบถ้วน',
                text: 'กรุณากรอกข้อมูลให้ครบทุกช่อง!',
                confirmButtonText: 'ตกลง'
            });
            return;
        }

        setLoading(true);
        try {
            await addElection(electionName, electionType, startDate, endDate);
            Swal.fire({
                icon: 'success',
                title: 'สำเร็จ',
                text: 'การเลือกตั้งได้ถูกเพิ่มเรียบร้อยแล้ว!',
                confirmButtonText: 'ตกลง'
            });
            navigate('/manage-voting-list');
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'เกิดข้อผิดพลาด',
                text: 'ไม่สามารถเพิ่มการเลือกตั้งได้',
                confirmButtonText: 'ตกลง'
            });
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        handleConfirm();
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
                    <div className='Votename'><h1>การเลือกตั้ง</h1></div>
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
                        <button type="submit" className="btn btn-success" disabled={loading}>
                            {loading ? <CircularProgress size={24} /> : 'ยืนยัน'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ManageVoting;
