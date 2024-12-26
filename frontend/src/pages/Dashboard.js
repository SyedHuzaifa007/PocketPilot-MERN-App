import React, { useState, useEffect } from 'react';
import { redirect } from 'react-router-dom';
import { FaCogs, FaSignOutAlt, FaChartLine, FaPlusCircle } from 'react-icons/fa';
import './Dashboard.css';

const Dashboard = () => {
    const [greeting, setGreeting] = useState('');

    const handleLogout = () => {
        // You can clear localStorage or sessionStorage here if needed
        // localStorage.removeItem('user'); // Example

        // Redirect to login page
        redirect('/pages/Login');
    };

    // Function to set the greeting based on the time of day
    const setTimeGreeting = () => {
        const hours = new Date().getHours();
        if (hours >= 5 && hours < 12) {
            setGreeting('Good Morning');
        } else if (hours >= 12 && hours < 18) {
            setGreeting('Good Afternoon');
        } else if (hours >= 18 && hours < 21) {
            setGreeting('Good Evening');
        } else {
            setGreeting('Good Night');
        }
    };

    useEffect(() => {
        setTimeGreeting(); // Set greeting when the component mounts
    }, []);

    return (
        <div className="dashboard-container">
            {/* Navbar */}
            <nav className="navbar">
                <div className="navbar-left">
                    <h1 className="navbar-heading">Pocket Pilot</h1>
                </div>
                <div className="navbar-right">
                    <div className="dropdown">
                        <button className="dropdown-toggle">
                            <FaCogs />
                        </button>
                        <div className="dropdown-menu">
                            <button className="dropdown-item">Settings</button>
                            <button className="dropdown-item" onClick={handleLogout}>
                                <FaSignOutAlt /> Logout
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Greeting Message */}
            <div className="greeting-message">
                <h2 className="gradient-text">{greeting}, Huzaifa! Welcome back!</h2>
            </div>

            {/* Cards Section */}
            <div className="cards-container">
                <div className="card">
                    <h3>Total Monthly Income</h3>
                    <p className="card-amount">$2,850</p>
                </div>
                <div className="card">
                    <h3>Total Monthly Expense</h3>
                    <p className="card-amount">$1,400</p>
                </div>
                <div className="card">
                    <h3>Total Savings</h3>
                    <p className="card-amount">$1,450</p>
                </div>
                <div className="card">
                    <h3>Income to Expense Ratio</h3>
                    <p className="card-amount">2.0</p>
                </div>
            </div>

            {/* Buttons Section */}
            <div className="buttons-container">
                <button className="action-button">
                    <FaPlusCircle /> Add New Record
                </button>
                <button className="action-button">
                    <FaChartLine /> Past Records
                </button>
                <button className="action-button">
                    <FaChartLine /> Generate Report
                </button>
                <button className="action-button">
                    <FaChartLine /> Generate Analysis
                </button>
            </div>

            {/* Graphs Section */}
            <div className="graphs-container">
                <div className="graph">
                    <div className="graph-placeholder">Graph 1</div>
                </div>
                <div className="graph">
                    <div className="graph-placeholder">Graph 2</div>
                </div>
                <div className="graph">
                    <div className="graph-placeholder">Graph 3</div>
                </div>
                <div className="graph">
                    <div className="graph-placeholder">Graph 4</div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;