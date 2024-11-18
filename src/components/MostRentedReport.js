import React, { useEffect, useState } from 'react';
import { Pie } from 'react-chartjs-2';
import './MostRentedReport.css'; // Importing the CSS file for styling
import {
    Chart as ChartJS,
    ArcElement,
    Tooltip,
    Legend,
    Title
} from 'chart.js';

// Register chart components
ChartJS.register(ArcElement, Tooltip, Legend, Title);

const MostRentedReport = () => {
    const [report, setReport] = useState([]);

    useEffect(() => {
        const fetchReport = async () => {
            const response = await fetch('http://localhost:5000/api/admin/most-rented-products');
            const data = await response.json();
            setReport(data);
        };
        fetchReport();
    }, []);

    // Prepare chart data for Pie chart
    const chartData = {
        labels: report.map(item => item.name), // Product names as labels
        datasets: [
            {
                label: 'Rent Count',
                data: report.map(item => item.rent_count), // Rent counts as data
                backgroundColor: [
                    '#FF6384', // Red
                    '#36A2EB', // Blue
                    '#FFCE56', // Yellow
                    '#4BC0C0', // Teal
                    '#FF9F40', // Orange
                    '#9966FF', // Purple
                ],
                hoverOffset: 4
            }
        ]
    };

    // Chart options
    const chartOptions = {
        responsive: true,
        plugins: {
            title: {
                display: true,
                text: 'Most Rented Products Distribution'
            },
            tooltip: {
                callbacks: {
                    label: function (context) {
                        return `${context.label}: ${context.raw} rented`;
                    }
                }
            }
        }
    };

    return (
        <div className="mostrented-report-page">
            <div className="mostrented-report-container">
                <h2 className="page-title">Most Rented Products</h2>
                
                <ul className="report-list">
                    {report.length > 0 ? (
                        report.map((item) => (
                            <li key={item.product_id} className="report-item">
                                <span className="product-name">{item.name}</span>: 
                                <span className="rent-count"> Rented {item.rent_count} times</span>
                            </li>
                        ))
                    ) : (
                        <li className="no-report-item">No data available.</li>
                    )}
                </ul>

                {/* Pie Chart */}
                {report.length > 0 && (
                    <div className="chart-container">
                        <Pie data={chartData} options={chartOptions} />
                    </div>
                )}
            </div>
        </div>
    );
};

export default MostRentedReport;
