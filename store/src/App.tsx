import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate, Link } from 'react-router-dom';
import Customers from './components/Customers/Customers';
import Login from './components/Login/Login';
import Users from './components/Users/Users';
import Warehouses from './components/Warehouses/Warehouse';
import Stocks from './components/Stocks/Stocks';
import Products from './components/Products/Products';
import Sales from './components/Sales/Sales';
import './App.css';

const App: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(true);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false); // Track login state

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleLogin = () => {
    setIsLoggedIn(true); // Update login state
    setIsSidebarOpen(false); // Hide sidebar on login
  };

  return (
    <Router>
      <div className="app-container">
        {/* Sidebar */}
        {isLoggedIn && ( // Only show the sidebar if logged in
          <div className={`sidebar ${isSidebarOpen ? 'open' : 'closed'}`}>
            <button className="toggle-btn" onClick={toggleSidebar}>
              {isSidebarOpen ? 'Hide' : 'Show'} Menu
            </button>
            <nav className="nav-menu">
              <Link to="/customers">Customers</Link>
              <Link to="/users">Users</Link>
              <Link to="/warehouses">Warehouses</Link>
              <Link to="/stocks">Stocks</Link>
              <Link to="/products">Products</Link>
              <Link to="/sales">Sales</Link>
            </nav>
          </div>
        )}

        {/* Main Content */}
        <div className="content">
          <Routes>
            <Route path="/" element={<Navigate to="/login" />} />
            <Route path="/login" element={<Login onLogin={handleLogin} />} />
            <Route path="/customers" element={isLoggedIn ? <Customers /> : <Navigate to="/login" />} />
            <Route path="/users" element={isLoggedIn ? <Users /> : <Navigate to="/login" />} />
            <Route path="/warehouses" element={isLoggedIn ? <Warehouses /> : <Navigate to="/login" />} />
            <Route path="/stocks" element={isLoggedIn ? <Stocks /> : <Navigate to="/login" />} />
            <Route path="/products" element={isLoggedIn ? <Products /> : <Navigate to="/login" />} />
            <Route path="/sales" element={isLoggedIn ? <Sales /> : <Navigate to="/login" />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
};

export default App;
