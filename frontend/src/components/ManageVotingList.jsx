import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import '../components-style/Navbar.css';
import '../components-style/UserDB.css';
import '../components-style/AdminDashboard.css';
import '../components-style/ManageVoting.css';
import '../components-style/ManageDataStudent.css';
import DigitalClock from '../components/DigitalClock';
import '../components-style/ManageVotingList.css';

const ManageVotingList = () => {
    const { account, userData, logout } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleNavigate = (path) => {
        navigate(path);
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
            <div className="voting-list-container">
                <div className="header">
                    <img src="https://cdn.builder.io/api/v1/image/assets/TEMP/2ce82bc26ade1c739d9d608ab8b11d9e964f32f41dc2f611f3636da9d9abc742?apiKey=1f6df3b559f94f9cadab107301ebb8cc" alt="icon" className="icon" />
                    <h1>รายชื่อการเลือกตั้งทั้งหมด</h1>
                </div>
                <table className="voting-table">
                    <thead>
                        <tr>
                            <th>ชื่อ</th>
                            <th>ประเภท</th>
                            <th>เริ่ม</th>
                            <th>สิ้นสุด</th>
                            <th>แก้ไขข้อมูล</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>การเลือกตั้งคณะวิศวกรรมศาสตร์และเทคโนโลยี</td>
                            <td>การเลือกตั้งระดับคณะ</td>
                            <td>25 ก.ย. 2566, 09:00</td>
                            <td>25 ก.ย. 2566, 17:00</td>
                            <td><Link to="/edit-voting/1" className="edit-button">แก้ไข</Link></td>
                        </tr>
                        <tr>
                            <td>การเลือกตั้งสาขา DIT</td>
                            <td>การเลือกตั้งระดับสาขา</td>
                            <td>26 ก.ย. 2566, 09:00</td>
                            <td>26 ก.ย. 2566, 17:00</td>
                            <td><Link to="/edit-voting/2" className="edit-button">แก้ไข</Link></td>
                        </tr>
                    </tbody>
                </table>
                <div className="add-voting-button">
                    <button className="btn btn-success" onClick={() => handleNavigate('/manage-voting')}>
                        <img src="https://cdn.builder.io/api/v1/image/assets/TEMP/2ce82bc26ade1c739d9d608ab8b11d9e964f32f41dc2f611f3636da9d9abc742?apiKey=1f6df3b559f94f9cadab107301ebb8cc" alt="icon" className="button-icon" /> เพิ่มการเลือกตั้ง
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ManageVotingList;
