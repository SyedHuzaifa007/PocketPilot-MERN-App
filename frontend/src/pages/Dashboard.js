import React, { useState, useEffect } from 'react';
import { FaSignOutAlt, FaChartLine, FaPlusCircle, FaChartBar, FaChartPie } from 'react-icons/fa';
import './Dashboard.css';
import { useNavigate } from 'react-router-dom'; // React Router v6

const Dashboard = () => {
    const navigate = useNavigate();
    const [greeting, setGreeting] = useState('');
    const [income, setIncome] = useState(0);
    const [expense, setExpense] = useState(0);
    const [percentageChange, setPercentageChange] = useState({ income: 0, expense: 0 });
    const [hasFetched, setHasFetched] = useState(false); // New state to ensure fetch happens only once

    const fetchRecords = async () => {
        try {
            const response = await fetch('http://localhost:5000/api/records');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const records = await response.json();
            console.log('Fetched Records:', records);
    
            // Dynamically calculate "current" context
            const currentDate = new Date();
            const contextMonth = currentDate.getMonth(); // 0-based indexing
            const contextYear = currentDate.getFullYear();
    
            // Dynamically calculate "previous" context
            const previousMonth = contextMonth === 0 ? 11 : contextMonth - 1;
            const previousYear = contextMonth === 0 ? contextYear - 1 : contextYear;
    
            let monthlyIncome = 0;
            let monthlyExpense = 0;
            let previousMonthIncome = 0;
            let previousMonthExpense = 0;
    
            records.forEach((record) => {
                console.log('Full Record:', record);
    
                const recordDate = new Date(record.date);
                const amount = parseFloat(record.amount);
    
                if (isNaN(recordDate) || isNaN(amount)) {
                    console.warn('Invalid record:', record);
                    return;
                }
    
                console.log('Record Date (Raw):', record.date, 'Parsed:', recordDate, 'Is Valid:', !isNaN(recordDate));
                console.log('Record Amount:', amount, 'Status:', record.status);
    
                // Match records to context
                const isCurrentMonth = 
                    recordDate.getFullYear() === contextYear && 
                    recordDate.getMonth() === contextMonth;
    
                const isPreviousMonth = 
                    recordDate.getFullYear() === previousYear && 
                    recordDate.getMonth() === previousMonth;
    
                console.log('Is Current Month:', isCurrentMonth, 'Is Previous Month:', isPreviousMonth);
    
                if (record.status === 'Income') {
                    if (isCurrentMonth) monthlyIncome += amount;
                    if (isPreviousMonth) previousMonthIncome += amount;
                } else if (record.status === 'Expense') {
                    if (isCurrentMonth) monthlyExpense += amount;
                    if (isPreviousMonth) previousMonthExpense += amount;
                }
            });
    
            console.log('Calculated Monthly Income:', monthlyIncome);
            console.log('Calculated Monthly Expense:', monthlyExpense);
    
            setIncome(monthlyIncome);
            setExpense(monthlyExpense);
    
            const incomeChange =
                previousMonthIncome > 0
                    ? ((monthlyIncome - previousMonthIncome) / previousMonthIncome) * 100
                    : monthlyIncome > 0
                    ? 100
                    : 0;
    
            const expenseChange =
                previousMonthExpense > 0
                    ? ((monthlyExpense - previousMonthExpense) / previousMonthExpense) * 100
                    : monthlyExpense > 0
                    ? 100
                    : 0;
    
            setPercentageChange({
                income: incomeChange,
                expense: expenseChange,
            });
    
            console.log('Percentage Change:', { income: incomeChange, expense: expenseChange });
        } catch (error) {
            console.error('Failed to fetch records:', error);
        }
    };
    
    
    

    useEffect(() => {
        if (!hasFetched) {
            fetchRecords();
        }
    }, [hasFetched]);

    const handleAddRecordButtonClick = () => navigate('/add-record');
    const handlePastRecordsButtonClick = () => navigate('/past-records');

    const handleLogout = () => {
        if (window.confirm('Are you sure you want to log out?')) {
            window.location.href = '/login';
        }
    };

    const setTimeGreeting = () => {
        const hours = new Date().getHours();
        if (hours >= 5 && hours < 12) setGreeting('Good Morning');
        else if (hours >= 12 && hours < 18) setGreeting('Good Afternoon');
        else if (hours >= 18 && hours < 21) setGreeting('Good Evening');
        else setGreeting('Good Night');
    };

    useEffect(() => {
        setTimeGreeting();
    }, []);

    return (
        <div className="dashboard-container">
            <nav className="navbar">
                <div className="navbar-left">
                    <h1 className="navbar-heading">Pocket Pilot</h1>
                </div>
                <div className="navbar-right">
                    <div className="dropdown">
                        <button className="dropdown-toggle">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94..." />
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

            <div className="greeting-message">
                <h2 className="gradient-text">{greeting}, Huzaifa! Welcome back!</h2>
            </div>

            <div className="cards-container">
    <div className="card">
        <h3>Total Monthly Income</h3>
        <p className="card-amount">PKR {income.toFixed(2)}</p>
    </div>
    <div className="card">
        <h3>Total Monthly Expense</h3>
        <p className="card-amount expense-amount">PKR {expense.toFixed(2)}</p>
    </div>
    <div className="card">
        <h3>Total Savings</h3>
        <p className="card-amount">
            PKR {(income - expense).toFixed(2)}
        </p>
    </div>
    <div className="card">
    <h3>Rate of Change</h3>
    <p className="percentage-change">
        Income: 
        {percentageChange.income >= 0 ? (
            <span className="positive-change">
                <i className="arrow up"></i> {percentageChange.income.toFixed(2)}%
            </span>
        ) : (
            <span className="negative-change">
                <i className="arrow down"></i> {Math.abs(percentageChange.income).toFixed(2)}%
            </span>
        )}
    </p>
    <p className="percentage-change">
        Expense: 
        {percentageChange.expense >= 0 ? (
            <span className="negative-change">
                <i className="arrow up"></i> {percentageChange.expense.toFixed(2)}%
            </span>
        ) : (
            <span className="positive-change">
                <i className="arrow down"></i> {Math.abs(percentageChange.expense).toFixed(2)}%
            </span>
        )}
    </p>
</div>

</div>


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
