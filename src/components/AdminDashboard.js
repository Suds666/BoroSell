import { useState } from "react";
import { Link } from "react-router-dom";
import './AdminDashboard.css';

const AdminDashboard = () => {
    const [hoveredLink, setHoveredLink] = useState(null);

    const handleMouseEnter = (color) => {
        setHoveredLink(color);
    };

    const handleMouseLeave = () => {
        setHoveredLink(null);
    };

    return (
        <div className={`admin-dashboard-container ${hoveredLink}`}>
            <h2 className="admin-dashboard-title">Admin Dashboard</h2>
            <nav className="admin-dashboard-nav">
                <Link 
                    to="/admin/manage-products" 
                    className="admin-dashboard-link"
                    onMouseEnter={() => handleMouseEnter('purple')}
                    onMouseLeave={handleMouseLeave}
                >
                    Manage Products
                </Link>
                <Link 
                    to="/admin/manage-employees" 
                    className="admin-dashboard-link"
                    onMouseEnter={() => handleMouseEnter('red')}
                    onMouseLeave={handleMouseLeave}
                >
                    Manage Employees
                </Link>
                <Link 
                    to="/admin/manage-rented-report" 
                    className="admin-dashboard-link"
                    onMouseEnter={() => handleMouseEnter('blue')}
                    onMouseLeave={handleMouseLeave}
                >
                    View Most Rented Products Report
                </Link>
            </nav>
        </div>
    );
};

export default AdminDashboard;
