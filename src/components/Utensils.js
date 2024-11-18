import React, { useEffect, useState } from 'react';
import './Utensils.css'; // Import the Utensils CSS
import logo from '../assets/Screenshot 2024-10-16 101238.png'; // Import the logo
import { useNavigate, Link } from 'react-router-dom'; // Import useNavigate and Link
// Profile images
import profileStatic from '../assets/Screenshot_2024-11-12_002001-removebg-preview.png';
import profileGif from '../assets/user_14251527-ezgif.com-gif-maker.gif';



const Utensils = () => {
    const [utensilsItems, setUtensilsItems] = useState([]);
    const navigate = useNavigate(); // Initialize useNavigate

    useEffect(() => {
        fetch('http://localhost:5000/api/products/5')  // Assuming category ID for Utensils is 5
            .then(response => response.json())
            .then(data => setUtensilsItems(data))
            .catch(error => console.error('Error fetching utensils data:', error));
    }, []);

    const handleItemClick = (item) => {
        navigate('/choice', { state: { product_id: item.id, image: item.image, name: item.name, price_per_day: item.price_per_day, quantity: item.quantity} });
    };

    return (
        <div className="utensils-page">
            {/* Logo as a Button */}
            <Link to="/dashboard">
                <img src={logo} alt="Company Logo" className="logo" />
            </Link>

            <div className="profile-icon" onClick={() => navigate('/profile')}>
            <img src={profileStatic} alt="Profile icon" className="profile-static" />
            <img src={profileGif} alt="Profile animation" className="profile-hover" />
            </div>

            {/* Heading */}
            <h1 className="utensils-heading">Kitchen Utensils</h1>

            {/* Utensils List */}
            <div className="utensils-container">
                {utensilsItems.map(item => (
                    <div key={item.id} className="utensils-item">
                        <button 
                            className="utensils-button" 
                            onClick={() => handleItemClick(item)} 
                        >
                            <img src={item.image} alt={item.name} className="utensils-image" />
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Utensils;
