import React, { useState, useEffect } from 'react';
import { FaSignOutAlt, FaChartLine, FaPlusCircle, FaChartBar, FaChartPie } from 'react-icons/fa';
import './Dashboard.css';
import { useNavigate } from 'react-router-dom'; // React Router v6

const Dashboard = () => {
    const navigate = useNavigate();
    const [greeting, setGreeting] = useState('');

    const handleAddRecordButtonClick = () => {
        navigate('/add-record'); // Navigate to the dashboard page
    };

    const handlePastRecordsButtonClick = () => {
        navigate('/past-records'); // Navigate to the dashboard page
    };

    const handleLogout = () => {
    const confirmLogout = window.confirm("Are you sure you want to log out?");
    if (confirmLogout) {
        // You can clear localStorage or sessionStorage here if needed
        // localStorage.removeItem('user'); // Example

        // Redirect to login page
        window.location.href = '/login';
    }
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
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
  <path stroke-linecap="round" stroke-linejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.325.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 0 1 1.37.49l1.296 2.247a1.125 1.125 0 0 1-.26 1.431l-1.003.827c-.293.241-.438.613-.43.992a7.723 7.723 0 0 1 0 .255c-.008.378.137.75.43.991l1.004.827c.424.35.534.955.26 1.43l-1.298 2.247a1.125 1.125 0 0 1-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.47 6.47 0 0 1-.22.128c-.331.183-.581.495-.644.869l-.213 1.281c-.09.543-.56.94-1.11.94h-2.594c-.55 0-1.019-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 0 1-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 0 1-1.369-.49l-1.297-2.247a1.125 1.125 0 0 1 .26-1.431l1.004-.827c.292-.24.437-.613.43-.991a6.932 6.932 0 0 1 0-.255c.007-.38-.138-.751-.43-.992l-1.004-.827a1.125 1.125 0 0 1-.26-1.43l1.297-2.247a1.125 1.125 0 0 1 1.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.086.22-.128.332-.183.582-.495.644-.869l.214-1.28Z" />
  <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
</svg>


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
                <p className="card-amount expense-amount">$1,400</p> {/* Add a specific class here */}
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
                <button className="action-button" onClick={handleAddRecordButtonClick}>
                    <FaPlusCircle /> Add New Record
                </button>
                <button className="action-button" onClick={handlePastRecordsButtonClick}>
                    <FaChartLine /> Past Records
                </button>
                <button className="action-button">
                    <FaChartBar /> Generate Report
                </button>
                <button className="action-button">
                    <FaChartPie /> Generate Analysis
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