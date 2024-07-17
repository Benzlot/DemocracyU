import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import '../components-style/Navbar.css';
import '../components-style/UserDB.css';

const NavbarAdmin = () => {
    const { account, userData, logout } = useContext(AuthContext);

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
            {account && (
                <div className="dashboard-navbar">
                    <Link to="/manage-student" className="nav-link">จัดการข้อมูลนักศึกษา</Link>
                    <Link to="/manage-candidate" className="nav-link">จัดการข้อมูลผู้ลงสมัคร</Link>
                    <Link to="/manage-voting" className="nav-link">จัดการการเลือกตั้ง</Link>
                    <Link to="/manage-evaluation" className="nav-link">แบบประเมินผู้ดำรงตำแหน่ง</Link>
                </div>
            )}
        </div>
    );
};

export default NavbarAdmin;
