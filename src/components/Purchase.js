import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import './Purchase.css'; // Import the Purchase CSS
import logo from '../assets/Screenshot 2024-10-16 101238.png'; // Import the logo
import groceryStatic from '../assets/Screenshot_2024-10-24_123708-removebg-preview.png'; // Static image
import groceryGif from '../assets/grocery_15547234-ezgif.com-gif-maker.gif'; // Gif image
import { v4 as uuidv4 } from 'uuid'; // Import UUID for unique order IDs

// Profile images
import profileStatic from '../assets/Screenshot_2024-11-12_002001-removebg-preview.png';
import profileGif from '../assets/user_14251527-ezgif.com-gif-maker.gif';

const Purchase = () => {
    const location = useLocation(); // Get the location object
    const navigate = useNavigate(); // Initialize useNavigate
    const { product_id, image, name, price_per_day, quantity: initialQuantity } = location.state || {}; // Destructure product details

    const [startDate, setStartDate] = useState(null); // Start date state
    const [endDate, setEndDate] = useState(null); // End date state
    const [totalPrice, setTotalPrice] = useState(0); // Total price state
    const [quantity, setQuantity] = useState(initialQuantity !== undefined ? initialQuantity : 1); // Quantity state
    const [errorMessage, setErrorMessage] = useState('');
    const [dateError, setDateError] = useState(''); // Error for same start and end date

    // Calculate the total price whenever startDate, endDate, or quantity changes
    useEffect(() => {
        if (startDate && endDate && startDate < endDate) {
            const diffInTime = endDate.getTime() - startDate.getTime();
            const diffInDays = Math.ceil(diffInTime / (1000 * 3600 * 24));
            if (diffInDays > 0 && quantity > 0) {
                const calculatedPrice = diffInDays * price_per_day * quantity;
                setTotalPrice(calculatedPrice);
            } else {
                setTotalPrice(0);
            }
        } else {
            setTotalPrice(0);
        }
    }, [startDate, endDate, price_per_day, quantity]);

    const handleQuantityChange = (e) => {
        const enteredQuantity = Number(e.target.value);
        if (enteredQuantity > initialQuantity) {
            setErrorMessage(`The quantity entered exceeds the available stock of ${initialQuantity}.`);
        } else {
            setErrorMessage('');
            setQuantity(enteredQuantity);
        }
    };

    // Function to handle start date change
    const handleStartDateChange = (date) => {
        setStartDate(date);
        if (endDate && date >= endDate) {
            setDateError('End date must be after start date.');
            setEndDate(null);
        } else {
            setDateError('');
        }
    };

    // Function to handle end date change
    const handleEndDateChange = (date) => {
        if (date && date > startDate) {
            setEndDate(date);
            setDateError('');
        } else {
            setDateError('End date must be after start date.');
            setEndDate(null);
        }
    };

    // Function to handle the click event when the GIF is clicked
    const handleGifClick = () => {
        const orderId = uuidv4(); // Generate a unique order ID
    
        console.log("Product ID:", product_id); // Log the product_id to ensure it's correct
        console.log("Quantity:", quantity); // Log the quantity being borrowed

        // Navigate to Bill.js with relevant data, including the new order ID
        navigate('/bill', {
            state: {
                orderId, // Include the generated order ID
                productId: product_id,
                productName: name,
                price: totalPrice,
                quantity: quantity,
                startDate: startDate?.toISOString().split('T')[0], // Format date for backend
                endDate: endDate?.toISOString().split('T')[0], // Format date for backend
                isPurchase: true, // Add this line
            },
        });
    };

    return (
        <div className="purchase-page">
            <Link to="/dashboard">
                <img src={logo} alt="Company Logo" className="logo" />
            </Link>
            <h1 className="purchase-heading">Purchase Item</h1>
            <div className="purchase-container">
                <div className="purchase-item">
                    <img src={image} alt={name} className="purchase-image" />
                </div>

                <div className="profile-icon" onClick={() => navigate('/profile')}>
                    <img src={profileStatic} alt="Profile icon" className="profile-static" />
                    <img src={profileGif} alt="Profile animation" className="profile-hover" />
                </div>

                <h2 className="purchase-item-name">{name}</h2>

                {initialQuantity === 0 ? (
                    <p className="out-of-stock-message">Out of Stock</p>
                ) : (
                    <div className="quantitypur-container">
                        <label>Quantity:</label>
                        <input
                            type="number"
                            value={quantity}
                            min="0"
                            max={initialQuantity}
                            onChange={handleQuantityChange}
                        />
                        {errorMessage && <p className="error-message">{errorMessage}</p>}
                    </div>
                )}

                <div className="date-picker-container">
                    <div>
                        <label htmlFor="start-date">Start Date:</label>
                        <DatePicker
                            id="start-date"
                            selected={startDate}
                            onChange={handleStartDateChange}
                            dateFormat="yyyy/MM/dd"
                            className="date-picker"
                        />
                    </div>
                    <div>
                        <label htmlFor="end-date">End Date:</label>
                        <DatePicker
                            id="end-date"
                            selected={endDate}
                            onChange={handleEndDateChange}
                            dateFormat="yyyy/MM/dd"
                            className="date-picker"
                            minDate={startDate} // End date cannot be before start date
                        />
                    </div>
                    {dateError && <p className="error-message">{dateError}</p>}
                </div>

                {totalPrice > 0 && (
                    <div className="total-price">
                        <h3>Total Price: ${totalPrice.toFixed(2)}</h3>
                    </div>
                )}
            </div>

            {initialQuantity > 0 && (
                <div className="grocery-wrapper" onClick={handleGifClick}>
                    <img src={groceryStatic} alt="Grocery icon" className="grocery-static" />
                    <img src={groceryGif} alt="Grocery gif" className="grocery-gif hover-gif" />
                </div>
            )}
        </div>
    );
};

export default Purchase;
