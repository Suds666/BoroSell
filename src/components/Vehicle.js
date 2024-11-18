import React, { useEffect, useState, useContext } from 'react';
import './Vehicle.css';
import logo from '../assets/Screenshot 2024-10-16 101238.png'; // Import the logo
import profileStatic from '../assets/Screenshot_2024-11-12_002001-removebg-preview.png'; // Profile images
import profileGif from '../assets/user_14251527-ezgif.com-gif-maker.gif';
import { useNavigate, Link } from 'react-router-dom'; // Import useNavigate and Link
import { UserContext } from '../UserContext'; // Import UserContext for logout functionality

const Vehicle = () => {
    const [vehicles, setVehicles] = useState([]);
    const [showMenu, setShowMenu] = useState(false); // State for showing the menu
    const { setUser } = useContext(UserContext); // To clear the user context on logout
    const navigate = useNavigate(); // Initialize useNavigate

    useEffect(() => {
        fetch('http://localhost:5000/api/products/2')  // Assuming category ID for Vehicles is 2
            .then(response => response.json())
            .then(data => setVehicles(data))
            .catch(error => console.error('Error fetching vehicle data:', error));
    }, []);

    const handleItemClick = (item) => {
        navigate('/choice', { state: { product_id: item.id, image: item.image, name: item.name, price_per_day: item.price_per_day, quantity: item.quantity} });
    };

    return (
        <div className="vehicle-page">
            {/* Profile Icon */}
            <Link to="/dashboard">
                <img src={logo} alt="Company Logo" className="logo" />
            </Link>
            <div className="profile-icon" onClick={() => navigate('/profile')}>
                <img src={profileStatic} alt="Profile icon" className="profile-static" />
                <img src={profileGif} alt="Profile animation" className="profile-hover" />
            </div>

            {/* Heading */}
            <h1 className="vehicle-heading">Vehicles</h1>

            {/* Vehicle List */}
            <div className="vehicle-container">
                {vehicles.map(vehicle => (
                    <div key={vehicle.id} className="vehicle-item">
                        <button 
                            className="vehicle-button" 
                            onClick={() => handleItemClick(vehicle)} 
                        >
                            <img src={vehicle.image} alt={vehicle.name} className="vehicle-image" />
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Vehicle;
