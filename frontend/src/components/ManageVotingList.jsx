import React, { useContext, useEffect,useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import '../components-style/Navbar.css';
import '../components-style/UserDB.css';
import '../components-style/AdminDashboard.css';
import '../components-style/ManageVoting.css';
import '../components-style/ManageDataStudent.css';
import DigitalClock from '../components/DigitalClock';
import '../components-style/ManageVotingList.css';
import { getElection } from '../services/electionService';

const ManageVotingList = () => {
    const { account, userData, logout } = useContext(AuthContext);
    const navigate = useNavigate();
    const [election, setElection] = useState([]);
    
    async function fetchElection() {
        try {
          const rawData = await getElection();
          console.log(rawData)
          if (Array.isArray(rawData)) {
            const data = mapElection(rawData);
              setElection(data);
          } else {
            console.error("Expected an array but got:", rawData);
          }
        } catch (error) {
          console.error("Failed to fetch election:", error);
        }
      }

    useEffect(() => {
        fetchElection();
    }, []);
    
    const mapElection = (rawData) => {
        return rawData.map((data,index) => ({
          id: index+1, 
          name: data.election_name, 
          type: data.election_type,
          start: data.election_start,
          end: data.election_end,
        }));
      };
      
    const handleNavigate = (path) => {
        navigate(path);
    };

    const handleEdit = (voting) => {
        navigate(`/edit-voting/${voting.id}`
            , { state: { voting } }
        );
        // console.log(voting)
    };

    const votingData = [
        { id: 1, name: 'การเลือกตั้งคณะวิศวกรรมศาสตร์และเทคโนโลยี', type: 'การเลือกตั้งระดับคณะ', start: '25 ก.ย. 2566, 09:00', end: '25 ก.ย. 2566, 17:00' },
        { id: 2, name: 'การเลือกตั้งสาขา DIT', type: 'การเลือกตั้งระดับสาขา', start: '26 ก.ย. 2566, 09:00', end: '26 ก.ย. 2566, 17:00' }
    ];

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
                        {election.map((voting) => (
                            <tr key={voting.id}>
                                <td>{voting.name}</td>
                                <td>{voting.type}</td>
                                <td>{voting.start}</td>
                                <td>{voting.end}</td>
                                <td>
                                    <button
                                        className="edit-button"
                                        onClick={() => handleEdit(voting)}
                                    >
                                        แก้ไข
                                    </button>
                                </td>
                            </tr>
                        ))}
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
