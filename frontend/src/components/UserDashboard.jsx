import React  ,{useEffect,useContext} from 'react';
import { AuthContext } from '../context/AuthContext';
import { Link } from 'react-router-dom'; // Assuming you're using react-router-dom

const UserDashboard = () => {
  const { account, userData, logout } = useContext(AuthContext);
  useEffect(() => {
    console.log("userData",userData);
  }, [userData]);
  return (
    <div className="dashboard-container">
      <img
        loading="lazy"
        src="https://cdn.builder.io/api/v1/image/assets/TEMP/163ec1926cd918c13a5fb6055a8069d3e3debbefcf978652c071fdb5564ad73e?apiKey=1f6df3b559f94f9cadab107301ebb8cc"
        className="News"
        alt="News Image"
      />
      <div className="vote-container">
        <Link to="/vote" className="vote-button">
          <img
            loading="lazy"
            src="https://cdn.builder.io/api/v1/image/assets/TEMP/2ce82bc26ade1c739d9d608ab8b11d9e964f32f41dc2f611f3636da9d9abc742?apiKey=1f6df3b559f94f9cadab107301ebb8cc"
            className="vote-image"
            alt="Unknown Image"
          />
          <span>ลงคะแนนการเลือกตั้ง</span>
        </Link>
      </div>
    </div>
  );
};

export default UserDashboard;
