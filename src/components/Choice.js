import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './Choice.css'; // Import CSS

// Profile images
import profileStatic from '../assets/Screenshot_2024-11-12_002001-removebg-preview.png';
import profileGif from '../assets/user_14251527-ezgif.com-gif-maker.gif';


const Choice = () => {
    const location = useLocation();
    const navigate = useNavigate();

    const { product_id, image, name, price_per_day, quantity} = location.state || {};
    console.log(product_id)

    const applyTransitionEffect = (path, state) => {
        document.body.classList.add('curtain-fall');
        setTimeout(() => {
            navigate(path, { state });
            document.body.classList.remove('curtain-fall'); // Clean up the class after navigating
        }, 500);
    };

    const handleBoroClick = () => {
        applyTransitionEffect('/purchase', { product_id, image, name, price_per_day, quantity });
    };

    const handleSellClick = () => {
        applyTransitionEffect('/sell', { product_id, image, name });
    };

    const handleReturnClick = () => {
        applyTransitionEffect('/return', { product_id, image, name });
    };

    return (
        <div className="choice-page">
            <button className="choice-button boro-button" onClick={handleBoroClick}>
                Borrow
            </button>
            <button className="choice-button sell-button" onClick={handleSellClick}>
                Sell
            </button>
            <button className="choice-button return-button" onClick={handleReturnClick}>
                Return
            </button>
        </div>
    );
};

export default Choice;
