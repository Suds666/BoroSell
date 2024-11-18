import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import './App.css';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import Travel from './components/Travel';
import Vehicle from './components/Vehicle';
import Sports from './components/Sports';
import Electronics from './components/Electronics';
import Utensils from './components/Utensils';
import Purchase from './components/Purchase';
import Sell from './components/Sell';
import Choice from './components/Choice';
import Bill from './components/Bill';
import Return from './components/Return';
import AdminDashboard from './components/AdminDashboard';
import ManageProducts from './components/ManageProducts';
import MostRentedReport from './components/MostRentedReport';
import ManageEmployees from './components/ManageEmployees';
import ProfilePage from './components/ProfilePage';
import { UserProvider } from './UserContext';

function App() {
  return (
    <UserProvider>
      <Router>
        <div className="App">
          <Routes>
            {/* User Routes */}
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/" element={<Navigate to="/login" />} /> {/* Default redirect to login */}

            <Route path="/travel" element={<Travel />} />
            <Route path="/vehicle" element={<Vehicle />} />
            <Route path="/sports" element={<Sports />} />
            <Route path="/electronics" element={<Electronics />} />
            <Route path="/utensils" element={<Utensils />} />
            <Route path="/purchase" element={<Purchase />} />
            <Route path="/sell" element={<Sell />} />
            <Route path="/choice" element={<Choice />} />
            <Route path="/bill" element={<Bill />} />
            <Route path="/return" element={<Return />} />

            {/* Admin Routes */}
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/manage-products" element={<ManageProducts />} />
            <Route path="/admin/manage-rented-report" element={<MostRentedReport />} />
            <Route path="/admin/manage-employees" element={<ManageEmployees />} />
          </Routes>
        </div>
      </Router>
    </UserProvider>
  );
}

export default App;
