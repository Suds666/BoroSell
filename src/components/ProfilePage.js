import React, { useEffect, useState, useContext } from 'react';
import { UserContext } from '../UserContext'; // Import UserContext to get the email
import { Link, useNavigate } from 'react-router-dom';
import './ProfilePage.css';
import logo from '../assets/Screenshot 2024-10-16 101238.png';

const ProfilePage = () => {
  const { user } = useContext(UserContext); // Retrieve the user from context
  const [userId, setUserId] = useState(null);
  const [transactions, setTransactions] = useState([]); // State for transactions
  const [error, setError] = useState(null);

  useEffect(() => {
    if (user) {
      // Fetch the user ID based on the email
      fetch(`http://localhost:5000/api/get_user_id?email=${user}`)
        .then((response) => response.json())
        .then((data) => {
          if (data.user_id) {
            setUserId(data.user_id); // Set user ID in state
          } else {
            setError('User not found');
          }
        })
        .catch((err) => {
          setError('User not found');
          console.error(err);
        });
    }
  }, [user]);

  // Fetch transactions after userId is set
  useEffect(() => {
    if (userId) {
      fetch(`http://localhost:5000/api/get_user_transactions?user_id=${userId}`)
        .then((response) => response.json())
        .then((data) => {
          if (data.transactions) {
            setTransactions(data.transactions); // Set transactions in state
          } else {
            setError('No transactions found');
          }
        })
        .catch((err) => {
          setError('An error occurred while fetching transactions');
          console.error(err);
        });
    }
  }, [userId]); // Trigger this effect when userId changes

  return (
    <div className="profile-page">
        <Link to="/dashboard">
            <img src={logo} alt="Company Logo" className="logo" />
        </Link>
      <h1>Profile Page</h1>
      {error && <p>{error}</p>}
      {userId ? (
        <div>
          <h2>Your User ID is: {userId}</h2>
          <h3>Your Transactions</h3>
          {transactions.length > 0 ? (
            <div className="transaction-list">
              {transactions.map((transaction) => (
                <div className="transaction-item" key={transaction.transaction_id}>
                  <img src={transaction.image_link} alt={`Product ${transaction.product_id}`} />
                  <div className="transaction-details">
                    {transaction.transaction_type === 'rent' ? (
                      <>
                        <p><span>Employee ID:</span> {transaction.employee_id}</p>
                        <p><span>Price:</span> ${transaction.price}</p>
                        <p><span>Transaction Type:</span> {transaction.transaction_type}</p>
                        <p><span>Order ID:</span> {transaction.order_id}</p>
                        <p><span>Quantity:</span> {transaction.quantity}</p>
                        <p><span>Start Date:</span> {transaction.start_date}</p>
                        <p><span>End Date:</span> {transaction.end_date}</p>
                      </>
                    ) : (
                      <>
                        <p><span>Employee ID:</span> {transaction.employee_id}</p>
                        <p><span>Transaction Type:</span> {transaction.transaction_type}</p>
                        <p><span>Order ID:</span> {transaction.order_id}</p>
                        <p><span>Quantity:</span> {transaction.quantity}</p>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p>No transactions found.</p>
          )}
        </div>
      ) : (
        <p>Loading your user information...</p>
      )}
    </div>
  );
};

export default ProfilePage;
