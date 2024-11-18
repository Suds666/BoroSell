import React, { useState } from 'react';
import axios from 'axios';
import { Bar } from 'react-chartjs-2';
import './ManageProducts.css';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);

function ManageProducts() {
    const [products, setProducts] = useState([]);
    const [name, setName] = useState('');
    const [imageLink, setImageLink] = useState('');
    const [categoryId, setCategoryId] = useState('');
    const [pricePerWeek, setPricePerWeek] = useState('');
    const [pricePerDay, setPricePerDay] = useState('');
    const [quantity, setQuantity] = useState('');

    const fetchProducts = async () => {
        if (!categoryId) {
            console.warn('Category ID is empty. Please enter a valid Category ID.');
            return;
        }
        try {
            const response = await axios.get(`http://localhost:5000/api/products/${categoryId}`);
            setProducts(response.data);
        } catch (error) {
            console.error('Error fetching products:', error);
            alert('Failed to fetch products.');
        }
    };

    const handleRemoveProduct = async (productId) => {
        try {
            await axios.delete(`http://localhost:5000/api/admin/remove-product/${productId}`);
            fetchProducts();
            alert('Product removed successfully!');
        } catch (error) {
            console.error('Error removing product:', error.response ? error.response.data : error);
            alert('Failed to remove product.');
        }
    };

    const handleAddProduct = async () => {
        try {
            const newProduct = {
                name,
                image_link: imageLink,
                category_id: categoryId,
                price_per_week: parseFloat(pricePerWeek) || 0,
                price_per_day: parseFloat(pricePerDay) || 0,
                quantity: parseInt(quantity) || 0,
            };
            await axios.post('http://localhost:5000/api/admin/add-product', newProduct);
            fetchProducts();
            setName('');
            setImageLink('');
            setPricePerWeek('');
            setPricePerDay('');
            setQuantity('');
            alert('Product added successfully!');
        } catch (error) {
            console.error('Error adding product:', error);
            alert('Failed to add product.');
        }
    };

    const chartData = {
        labels: products.map((product) => product.name),
        datasets: [
            {
                label: 'Product Quantity',
                data: products.map((product) => product.quantity),
                backgroundColor: 'rgba(0, 0, 0, 0.6)', // Vintage black background
                borderColor: 'rgba(0, 0, 0, 1)', // Vintage black border
                borderWidth: 1,
                yAxisID: 'y',
            },
            {
                label: 'Price Per Day',
                data: products.map((product) => product.price_per_day),
                backgroundColor: 'rgba(183, 28, 28, 0.6)', // Vintage red background
                borderColor: 'rgba(183, 28, 28, 1)', // Vintage red border
                borderWidth: 1,
                yAxisID: 'y1',
            },
        ],
    };

    const chartOptions = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
            },
            title: {
                display: true,
                text: 'Product Quantities and Price Per Day',
            },
        },
        scales: {
            y: {
                type: 'linear',
                position: 'left',
                title: {
                    display: true,
                    text: 'Quantity',
                },
            },
            y1: {
                type: 'linear',
                position: 'right',
                title: {
                    display: true,
                    text: 'Price Per Day ($)',
                },
                grid: {
                    drawOnChartArea: false,
                },
            },
        },
    };

    return (
        <div className='manageproduct-page'>
            <div className="manage-products-container">
                <h2 className="page-title">Manage Products</h2>
                
                <div className="fetch-section">
                    <input 
                        type="text" 
                        className="category-input" 
                        placeholder="Enter Category ID" 
                        value={categoryId} 
                        onChange={(e) => setCategoryId(e.target.value)} 
                    />
                    <button className="fetch-button" onClick={fetchProducts}>Fetch Products by Category</button>
                </div>

                <div className="add-product-section">
                    <h3>Add Product</h3>
                    <input
                        type="text"
                        className="input-field"
                        placeholder="Name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                    <input
                        type="text"
                        className="input-field"
                        placeholder="Image Link"
                        value={imageLink}
                        onChange={(e) => setImageLink(e.target.value)}
                    />
                    <input
                        type="text"
                        className="input-field"
                        placeholder="Price Per Week"
                        value={pricePerWeek}
                        onChange={(e) => setPricePerWeek(e.target.value)}
                    />
                    <input
                        type="text"
                        className="input-field"
                        placeholder="Price Per Day"
                        value={pricePerDay}
                        onChange={(e) => setPricePerDay(e.target.value)}
                    />
                    <input
                        type="text"
                        className="input-field"
                        placeholder="Quantity"
                        value={quantity}
                        onChange={(e) => setQuantity(e.target.value)}
                    />
                    <button className="add-button" onClick={handleAddProduct}>Add Product</button>
                </div>

                <h3 className="product-list-title">Product List</h3>
                <ul className="product-list">
                    {products.map((product) => (
                        <li key={product.id} className="product-item">
                            {product.name} - {product.price_per_day} per day
                            <button className="remove-button" onClick={() => handleRemoveProduct(product.id)}>Remove</button>
                        </li>
                    ))}
                </ul>

                <h3 className="chart-title">Product Quantities and Price Per Day</h3>
                <Bar data={chartData} options={chartOptions} />
            </div>
        </div>
    );
}

export default ManageProducts;
