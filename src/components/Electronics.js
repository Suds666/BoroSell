import React, { useEffect, useState } from 'react';
import './Electronics.css'; // Import the Electronics CSS
import logo from '../assets/Screenshot 2024-10-16 101238.png'; // Import the logo
import { useNavigate, Link } from 'react-router-dom'; // Import useNavigate and Link

// Profile images
import profileStatic from '../assets/Screenshot_2024-11-12_002001-removebg-preview.png';
import profileGif from '../assets/user_14251527-ezgif.com-gif-maker.gif';


const Electronics = () => {
    const [electronicsItems, setElectronicsItems] = useState([]);
    const navigate = useNavigate(); 

    useEffect(() => {
        fetch('http://localhost:5000/api/products/4') 
            .then(response => response.json())
            .then(data => setElectronicsItems(data))
            .catch(error => console.error('Error fetching electronics data:', error));
    }, []);

    const handleItemClick = (item) => {
        navigate('/choice', { state: { product_id: item.id, image: item.image, name: item.name, price_per_day: item.price_per_day, quantity: item.quantity} });
    };

    return (
        <div className="electronics-page">
            <Link to="/dashboard">
                <img src={logo} alt="Company Logo" className="logo" />
            </Link>
            <h1 className="electronics-heading">Electronics</h1>
            <div className="profile-icon" onClick={() => navigate('/profile')}>
            <img src={profileStatic} alt="Profile icon" className="profile-static" />
            <img src={profileGif} alt="Profile animation" className="profile-hover" />
            </div>
            <div className="electronics-container">
                {electronicsItems.map(item => (
                    <div key={item.id} className="electronics-item">
                        <button 
                            className="electronics-button" 
                            onClick={() => handleItemClick(item)} 
                        >
                            <img src={item.image} alt={item.name} className="electronics-image" />
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Electronics;
