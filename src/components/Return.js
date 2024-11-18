import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Return.css';
import logo from '../assets/Screenshot 2024-10-16 101238.png'; // Adjust the path if necessary


// Profile images
import profileStatic from '../assets/Screenshot_2024-11-12_002001-removebg-preview.png';
import profileGif from '../assets/user_14251527-ezgif.com-gif-maker.gif';


const Return = () => {
    const [orderId, setOrderId] = useState('');
    const [productData, setProductData] = useState(null);
    const [returnQuantity, setReturnQuantity] = useState(0);
    const [maxQuantity, setMaxQuantity] = useState(0);
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();

    const handleOrderIdChange = (e) => {
        setOrderId(e.target.value);
    };

    const fetchOrderDetails = async () => {
        try {
            const response = await fetch(`http://localhost:5000/api/validate-order/${orderId}`);
            const data = await response.json();

            if (response.ok) {
                setProductData(data);
                setMaxQuantity(data.quantity); // Set the max quantity that can be returned
            } else {
                setErrorMessage(data.error);
            }
        } catch (error) {
            setErrorMessage('Error fetching order details. Please try again.');
        }
    };

    const handleReturn = () => {
        navigate('/bill', {
            state: {
                orderId,
                productId: productData.product_id,
                productName: productData.product_name,
                quantity: returnQuantity,
                isSell: false // Indicating it's a return transaction
            }
        });
    };

    return (
        <div className="return-page">
            <header className="return-header">
                <h1>Return</h1>
            </header>
            <Link to="/dashboard">
                <img src={logo} alt="Company Logo" className="logo" />
            </Link>
            <div className="profile-icon" onClick={() => navigate('/profile')}>
            <img src={profileStatic} alt="Profile icon" className="profile-static" />
            <img src={profileGif} alt="Profile animation" className="profile-hover" />
            </div>

            <div className="return-form">
                <label htmlFor="orderId">Enter Order ID:</label>
                <input
                    type="text"
                    id="orderId"
                    value={orderId}
                    onChange={handleOrderIdChange}
                />
                <button onClick={fetchOrderDetails}>Check Order</button>
                {errorMessage && <p className="error-message">{errorMessage}</p>}

                {productData && (
                    <>
                        <div className="product-info">
                            <img src={productData.image} alt={productData.product_name} />
                            <p>Product Name: {productData.product_name}</p>
                        </div>
                        <div className="quantity-section">
                            <label htmlFor="quantity">Enter Quantity to Return (max: {maxQuantity}):</label>
                            <input
                                type="number"
                                id="quantity"
                                value={returnQuantity}
                                onChange={(e) => setReturnQuantity(Math.min(e.target.value, maxQuantity))}
                                max={maxQuantity}
                                min="1"
                            />
                        </div>
                        <button className="return-button" onClick={handleReturn}>Return</button>
                    </>
                )}
            </div>
        </div>
    );
};

export default Return;
