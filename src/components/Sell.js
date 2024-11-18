import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid'; // Import UUID for unique order IDs
import './Sell.css'; // Import your CSS for Sell component
import './Choice.css'; // Import CSS for styling consistency
import logo from '../assets/Screenshot 2024-10-16 101238.png'; // Adjust the path if necessary


// Profile images
import profileStatic from '../assets/Screenshot_2024-11-12_002001-removebg-preview.png';
import profileGif from '../assets/user_14251527-ezgif.com-gif-maker.gif';


const Sell = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { product_id, image, name } = location.state || {};
    console.log("Image URL:", image);

    // State for quantity to sell
    const [quantity, setQuantity] = useState(1);

    // Handle quantity change
    const handleQuantityChange = (e) => {
        setQuantity(e.target.value);
    };

    // Function to handle the form submission
    const handleSell = (e) => {
        e.preventDefault();
        const orderId = uuidv4(); // Generate a unique order ID

        navigate('/bill', {
            state: {
                orderId, // Include the generated order ID
                productId: product_id,
                productName: name,
                quantity: quantity,
                isSell: true, // Indicate that it's a sell transaction
            },
        });
    };

    return (
        <div className="sell-page">
            <Link to="/dashboard">
                <img src={logo} alt="Company Logo" className="logo" />
            </Link>
            <div className="sell-content">
                <div className="productsell-image-container">
                    <img src={image} alt={name} className="productsell-image" />
                </div>

                <div className="profile-icon" onClick={() => navigate('/profile')}>
                <img src={profileStatic} alt="Profile icon" className="profile-static" />
                <img src={profileGif} alt="Profile animation" className="profile-hover" />
                </div>

                <form className="quantitysell-form" onSubmit={handleSell}>
                    <h1 className="productsell-name">{name}</h1>
                    <label htmlFor="quantity" className="quantitysell-label">Quantity to Sell:</label>
                    <input
                        type="number"
                        id="quantity"
                        value={quantity}
                        onChange={handleQuantityChange}
                        min="1"
                        className="quantitysell-input"
                    />
                    <button type="submit" className="sell-page-button">Sell</button>
                </form>
            </div>
        </div>
    );
};

export default Sell;

	
