import React, { useEffect, useState, useContext } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { UserContext } from '../UserContext';
import logo from '../assets/Screenshot 2024-10-16 101238.png';
import './Bill.css';

// Profile images
import profileStatic from '../assets/Screenshot_2024-11-12_002001-removebg-preview.png';
import profileGif from '../assets/user_14251527-ezgif.com-gif-maker.gif';


const Bill = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { user } = useContext(UserContext);
    const { orderId, productId, productName, price = 0, quantity, startDate, endDate, isSell, isPurchase } = location.state || {};
    const [employeeId, setEmployeeId] = useState(null);
    const [employeeName, setEmployeeName] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [userId, setUserId] = useState(null);

    useEffect(() => {
        const fetchUserId = async () => {
            try {
                const response = await fetch(`http://localhost:5000/api/user?email=${user}`);
                const data = await response.json();
                if (response.ok) {
                    setUserId(data.user_id);
                } else {
                    setErrorMessage(data.error);
                }
            } catch (error) {
                console.error('Error fetching user ID:', error);
                setErrorMessage('Failed to fetch user ID');
            }
        };

        fetchUserId();
    }, [user]);

    useEffect(() => {
        const fetchRandomEmployee = async () => {
            try {
                const response = await fetch('http://localhost:5000/api/random-employee');
                const data = await response.json();
                setEmployeeId(data.id);
                setEmployeeName(data.name);
            } catch (error) {
                console.error('Error fetching employee data:', error);
            }
        };

        fetchRandomEmployee();
    }, []);

    const handleSubmit = async () => {
        const transactionType = isSell ? 'sell' : (isPurchase ? 'rent' : 'return');
        const transaction = {
            order_id: orderId,
            user_id: userId,
            employee_id: employeeId,
            product_id: productId,
            price: transactionType === 'sell' ? null : price,
            transaction_type: transactionType,
            start_date: transactionType === 'rent' ? startDate : null,
            end_date: transactionType === 'rent' ? endDate : null,
            quantity: transactionType === 'return' ? quantity : quantity, // Use the correct quantity for rent or return
        };

        try {
            const response = await fetch('http://localhost:5000/api/transactions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(transaction),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to create transaction');
            }

            const data = await response.json();
            console.log('Transaction created successfully:', data);

            // If it's a return, update product quantity in the database
            if (transactionType === 'return') {
                await returnProduct(productId, orderId, quantity);
            }

            // Redirect to Dashboard after successful submission
            navigate('/dashboard');
        } catch (error) {
            console.error('Error submitting transaction:', error);
            setErrorMessage('Error submitting transaction: ' + error.message);
        }
    };

    const returnProduct = async (productId, orderId, quantity) => {
        try {
            const response = await fetch('http://localhost:5000/api/return-product', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    order_id: orderId,
                    product_id: productId,
                    quantity_returned: quantity,
                    user_id: userId,  // Make sure you pass the user ID
                    employee_id: employeeId  // Make sure you pass the employee ID
                }),
            });
    
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to return product');
            }
    
            const data = await response.json();
            console.log('Product returned successfully:', data);
        } catch (error) {
            console.error('Error returning product:', error);
        }
    };
    

    return (
        <div className="bill-container">
            <div className="profile-icon" onClick={() => navigate('/profile')}>
            <img src={profileStatic} alt="Profile icon" className="profile-static" />
            <img src={profileGif} alt="Profile animation" className="profile-hover" />
            </div>
            <Link to="/dashboard">
                <img src={logo} alt="Company Logo" className="logo" />
            </Link>
            <div className="bill">
                <h2>Bill Summary</h2>
                {errorMessage && <p className="error-message">{errorMessage}</p>}
                <p>Order ID: {orderId}</p>
                <p>Employee ID: {employeeId}</p>
                <p>Employee Name: {employeeName}</p>
                <p>User ID: {userId}</p>
                <p>Product Name: {productName}</p>
                <p>Quantity: {quantity}</p>
                {isPurchase && (
                    <>
                        <p>Start Date: {startDate}</p>
                        <p>End Date: {endDate}</p>
                        <p>Total Price: ${price.toFixed(2)}</p>
                    </>
                )}
                <button onClick={handleSubmit}>
                    {isSell ? 'Confirm Sell' : (isPurchase ? 'Confirm Purchase' : 'Confirm Return')}
                </button>
            </div>
        </div>
    );
};

export default Bill;