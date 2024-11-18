import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './ManageEmployees.css';

const ManageEmployees = () => {
    const navigate = useNavigate();
    const [employees, setEmployees] = useState([]);
    const [newEmployee, setNewEmployee] = useState({ name: '', salary: 0, contact_number: '' });
    const [sortCriterion, setSortCriterion] = useState('name'); // Default sort by name

    // Fetch employees once on mount
    useEffect(() => {
        fetchEmployees();
    }, []);

    // Sort employees when sortCriterion changes
    useEffect(() => {
        sortEmployees();
    }, [sortCriterion]);

    const fetchEmployees = async () => {
        try {
            const response = await fetch('http://localhost:5000/api/employee');
            if (!response.ok) throw new Error('Failed to fetch employees');
            
            const data = await response.json();
            setEmployees(data);  // Directly set the employee data without unnecessary transformation
        } catch (error) {
            console.error("Error fetching employees:", error);
            setEmployees([]); 
        }
    };

    const handleAddEmployee = async () => {
        try {
            await fetch('http://localhost:5000/api/admin/add-employee', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newEmployee),
            });
            fetchEmployees(); // Fetch updated employees after adding
            navigate('/admin/dashboard'); 
        } catch (error) {
            console.error("Error adding employee:", error);
        }
    };

    const handleRemoveEmployee = async (employeeId) => {
        try {
            await fetch(`http://localhost:5000/api/admin/remove-employee/${employeeId}`, { method: 'DELETE' });
            fetchEmployees(); // Fetch updated employees after removal
        } catch (error) {
            console.error("Error removing employee:", error);
        }
    };

    const sortEmployees = () => {
        const sortedEmployees = [...employees].sort((a, b) => {
            switch (sortCriterion) {
                case 'name':
                    return a.name.localeCompare(b.name);
                case 'salary':
                    return a.salary - b.salary;
                case 'contact_number':
                    return a.contact_number.localeCompare(b.contact_number);
                default:
                    return 0;
            }
        });
        setEmployees(sortedEmployees);
    };

    return (
        <div className='manageemployee-page'>
            <div className='manage-employees-container'>
                <h2 className="page-title">Manage Employees</h2>
                
                <div className="add-employee-section">
                    <input 
                        className="input-field"
                        placeholder="Name" 
                        onChange={(e) => setNewEmployee({ ...newEmployee, name: e.target.value })} 
                    />
                    <input 
                        className="input-field"
                        placeholder="Salary" 
                        type="number"
                        onChange={(e) => setNewEmployee({ ...newEmployee, salary: parseFloat(e.target.value) })}
                    />
                    <input 
                        className="input-field"
                        placeholder="Contact Number" 
                        onChange={(e) => setNewEmployee({ ...newEmployee, contact_number: e.target.value })}
                    />
                    <button className="add-button" onClick={handleAddEmployee}>Add Employee</button>
                </div>

                <div className="sort-section">
                    <label className="sort-label">Sort by:</label>
                    <select 
                        className="sort-dropdown"
                        value={sortCriterion}
                        onChange={(e) => setSortCriterion(e.target.value)}
                    >
                        <option value="name">Name</option>
                        <option value="salary">Salary</option>
                        <option value="contact_number">Contact Number</option>
                    </select>
                </div>

                <h3 className="employee-list-title">Employee List</h3>
                <ul className="employee-list">
                    {employees.length > 0 ? (
                        employees.map((employee) => (
                            <li key={employee.id} className="employee-item">
                                {employee.name} - {employee.contact_number} - ${employee.salary} 
                                <button className="remove-button" onClick={() => handleRemoveEmployee(employee.id)}>Remove</button>
                            </li>
                        ))
                    ) : (
                        <li className="employee-item">No employees found.</li>
                    )}
                </ul>
            </div>
        </div>
    );
};

export default ManageEmployees;
