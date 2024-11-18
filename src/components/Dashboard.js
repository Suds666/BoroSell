import React, { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../UserContext';
import logo from '../assets/Screenshot 2024-10-16 101238.png';
import './Dashboard.css';
import backgroundImage from '../assets/zhen-yao-YFtWbyck9So-unsplash.jpg';
import soloStatic from '../assets/Screenshot_2024-10-17_124447-removebg-preview.png';
import soloGif from '../assets/solo-traveller_17270725-ezgif.com-gif-maker.gif';
import sustainableStatic from '../assets/Screenshot_2024-10-17_130409-removebg-preview.png';
import sustainableGif from '../assets/sustainable-travel_16162022-ezgif.com-gif-maker.gif';
import footballStatic from '../assets/Screenshot_2024-10-17_125458-removebg-preview.png';
import footballGif from '../assets/football-player_16768651-ezgif.com-gif-maker.gif';
import computerStatic from '../assets/Screenshot_2024-10-17_123724-removebg-preview.png';
import computerGif from '../assets/computer_14183436-ezgif.com-gif-maker.gif';
import choppingStatic from '../assets/Screenshot_2024-10-17_131519-removebg-preview.png';
import choppingGif from '../assets/chopping-board_15713150-ezgif.com-gif-maker.gif';
// Profile images
import profileStatic from '../assets/Screenshot_2024-11-12_002001-removebg-preview.png';
import profileGif from '../assets/user_14251527-ezgif.com-gif-maker.gif';
// Logout button
import logoutButton from '../assets/log-out_10024508.png';

function Dashboard() {
  const { user } = useContext(UserContext);
  const [showCategory, setShowCategory] = useState(false);
  const navigate = useNavigate();
  console.log(user)

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowCategory(true);
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  const userName = user ? user.split('@')[0] : 'Guest';

  const handleLogout = () => {
    // Clear user context or perform any necessary cleanup here
    // Redirect to login page and refresh
    navigate('/login');
    window.location.reload(); // Refresh the page after navigation
  };

  return (
    <div className="dashboard-page">
      <div className="dashboard" style={{ backgroundImage: `url(${backgroundImage})` }}>
        <div className="profile-icon" onClick={() => navigate('/profile')}>
          <img src={profileStatic} alt="Profile icon" className="profile-static" />
          <img src={profileGif} alt="Profile animation" className="profile-hover" />
        </div>
        
        {/* Logout Button */}
        <div className="logout-button" onClick={handleLogout}>
          <img src={logoutButton} alt="Logout" className="logout-img" />
        </div>

        <div className="welcome-message-dashboard">
          <h1>Welcome to BoroSell, {userName}!</h1>
        </div>

        {showCategory && (
          <div className="choose-category">
            <h2>Choose a category</h2>
          </div>
        )}

        <div className="icons-row">
          <div className="gif-wrapper" onClick={() => navigate('/travel')}>
            <img src={soloStatic} alt="Solo traveler icon" className="gif-image" />
            <img src={soloGif} alt="Solo traveler animation" className="gif-image hover-gif" />
          </div>
          <div className="gif-wrapper" onClick={() => navigate('/vehicle')}>
            <img src={sustainableStatic} alt="Sustainable travel icon" className="gif-image" />
            <img src={sustainableGif} alt="Sustainable travel animation" className="gif-image hover-gif" />
          </div>
          <div className="gif-wrapper" onClick={() => navigate('/sports')}>
            <img src={footballStatic} alt="Football player icon" className="gif-image" />
            <img src={footballGif} alt="Football player animation" className="gif-image hover-gif" />
          </div>
          <div className="gif-wrapper" onClick={() => navigate('/electronics')}>
            <img src={computerStatic} alt="Computer icon" className="gif-image" />
            <img src={computerGif} alt="Computer animation" className="gif-image hover-gif" />
          </div>
          <div className="gif-wrapper" onClick={() => navigate('/utensils')}>
            <img src={choppingStatic} alt="Chopping board icon" className="gif-image" />
            <img src={choppingGif} alt="Chopping board animation" className="gif-image hover-gif" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
