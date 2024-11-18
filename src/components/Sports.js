import React, { useEffect, useState } from 'react';
import './Sports.css';
import logo from '../assets/Screenshot 2024-10-16 101238.png'; // Import the logo
import { useNavigate, Link } from 'react-router-dom'; // Import useNavigate and Link

// Profile images
import profileStatic from '../assets/Screenshot_2024-11-12_002001-removebg-preview.png';
import profileGif from '../assets/user_14251527-ezgif.com-gif-maker.gif';


const Sports = () => {
    const [sportsItems, setSportsItems] = useState([]);
    const navigate = useNavigate(); // Initialize useNavigate

    useEffect(() => {
        fetch('http://localhost:5000/api/products/3')  // Assuming category ID for Sports is 3
            .then(response => response.json())
            .then(data => setSportsItems(data))
            .catch(error => console.error('Error fetching sports data:', error));
    }, []);

    const handleItemClick = (item) => {
        navigate('/choice', { state: { product_id: item.id, image: item.image, name: item.name, price_per_day: item.price_per_day, quantity: item.quantity} });
    };

    return (
        <div className="sports-page">
            {/* Logo as a Button */}
            <Link to="/dashboard">
                <img src={logo} alt="Company Logo" className="logo" />
            </Link>

            <div className="profile-icon" onClick={() => navigate('/profile')}>
            <img src={profileStatic} alt="Profile icon" className="profile-static" />
            <img src={profileGif} alt="Profile animation" className="profile-hover" />
            </div>

            {/* Heading */}
            <h1 className="sports-heading">Sports Equipment</h1>

            {/* Sports List */}
            <div className="sports-container">
                {sportsItems.map(item => (
                    <div key={item.id} className="sports-item">
                        <button 
                            className="sports-button" 
                            onClick={() => handleItemClick(item)} 
                        >
                            <img src={item.image} alt={item.name} className="sports-image" />
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Sports;
