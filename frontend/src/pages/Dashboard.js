import React, { useState, useEffect } from 'react';
import { FaSignOutAlt, FaChartLine, FaPlusCircle, FaChartBar, FaChartPie } from 'react-icons/fa';
import './Dashboard.css';
import { useNavigate } from 'react-router-dom'; // React Router v6
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell, Legend } from 'recharts';

const Dashboard = () => {
    const navigate = useNavigate();
    const [greeting, setGreeting] = useState('');
    const [income, setIncome] = useState(0);
    const [expense, setExpense] = useState(0);
    const [percentageChange, setPercentageChange] = useState({ income: 0, expense: 0 });
    const [hasFetched, setHasFetched] = useState(false); // New state to ensure fetch happens only once

    const [data, setData] = useState([]);

  // Fetch data from the API
  useEffect(() => {
    const getData = async () => {
      const response = await fetch('http://localhost:5000/api/records');
      const records = await response.json();
      setData(records);
    };
    
    getData();
  }, []);

  // Helper function to format date to YYYY-MM-DD
  const formatDate = (date) => {
    const d = new Date(date);
    return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
  };

  const colorPalette = [
    "#28a745", "#e74c3c", "#3498db", "#f39c12", "#9b59b6", "#1abc9c", 
    "#16a085", "#e67e22", "#2980b9", "#2ecc71", "#d35400", "#8e44ad", 
    "#f1c40f", "#34495e", "#7d3c98", "#ff6347", "#ff8c00", "#6c3483", 
    "#af7ac5", "#273c75", "#5dade2", "#f54242", "#2980b9", "#f54291", 
    "#c0392b", "#7f8c8d", "#3b3b6d", "#f542d3", "#c0392b", "#e67e22"
  ];
  
  
  // Function to dynamically map categories to colors
const getCategoryColor = (category, categoryMapping) => {
    if (!categoryMapping[category]) {
        const nextColor = colorPalette[Object.keys(categoryMapping).length % colorPalette.length];
        categoryMapping[category] = nextColor;
    }
    return categoryMapping[category];
};

  
  let categoryColorMapping = {};

  // 1. Income by Days (Last 30 Days)
  const processIncomeByDays = () => {
    const last30Days = new Date();
    last30Days.setDate(last30Days.getDate() - 30);

    const incomeData = data.filter(record => {
      return record.status === 'Income' && new Date(record.date) >= last30Days;
    }).map(record => ({
      date: record.date,
      amount: record.amount || 0,
    }));

    // Group income by date
    const groupedData = incomeData.reduce((acc, curr) => {
      const date = formatDate(curr.date);
      if (!acc[date]) {
        acc[date] = 0;
      }
      acc[date] += curr.amount;
      return acc;
    }, {});

    // Convert grouped data into an array of objects
    return Object.keys(groupedData).map(date => ({
      date,
      amount: groupedData[date],
    }));
  };

  // 2. Expense by Days (Last 30 Days)
  const processExpenseByDays = () => {
    const last30Days = new Date();
    last30Days.setDate(last30Days.getDate() - 30);

    const expenseData = data.filter(record => {
      return record.status === 'Expense' && new Date(record.date) >= last30Days;
    }).map(record => ({
      date: record.date,
      amount: record.amount || 0,
    }));

    // Group expense by date
    const groupedData = expenseData.reduce((acc, curr) => {
      const date = formatDate(curr.date);
      if (!acc[date]) {
        acc[date] = 0;
      }
      acc[date] += curr.amount;
      return acc;
    }, {});

    // Convert grouped data into an array of objects
    return Object.keys(groupedData).map(date => ({
      date,
      amount: groupedData[date],
    }));
  };

  // 3. Income by Months (Past Year)
  const processIncomeByMonths = () => {
    const incomeData = data
      .filter(record => record.status === 'Income')
      .map(record => {
        const date = new Date(record.date);
        const month = date.getMonth(); // 0-11 for months
        const year = date.getFullYear();
        const monthName = date.toLocaleString('default', { month: 'long' }); // Get full month name
  
        return {
          monthYear: `${monthName}, ${year}`, // Format as "Month, Year"
          amount: record.amount || 0,
        };
      });
  
    // Group income by month-year
    const groupedData = incomeData.reduce((acc, curr) => {
      if (!acc[curr.monthYear]) {
        acc[curr.monthYear] = 0;
      }
      acc[curr.monthYear] += curr.amount;
      return acc;
    }, {});
  
    // Convert grouped data into an array of objects
    return Object.keys(groupedData).map(monthYear => ({
      month: monthYear, // Use formatted "Month, Year"
      amount: groupedData[monthYear],
    }));
  };
  
  const processExpenseByMonths = () => {
    const expenseData = data
      .filter(record => record.status === 'Expense')
      .map(record => {
        const date = new Date(record.date);
        const month = date.getMonth(); // 0-11 for months
        const year = date.getFullYear();
        const monthName = date.toLocaleString('default', { month: 'long' }); // Get full month name
  
        return {
          monthYear: `${monthName}, ${year}`, // Format as "Month, Year"
          amount: record.amount || 0,
        };
      });
  
    // Group expense by month-year
    const groupedData = expenseData.reduce((acc, curr) => {
      if (!acc[curr.monthYear]) {
        acc[curr.monthYear] = 0;
      }
      acc[curr.monthYear] += curr.amount;
      return acc;
    }, {});
  
    // Convert grouped data into an array of objects
    return Object.keys(groupedData).map(monthYear => ({
      month: monthYear, // Use formatted "Month, Year"
      amount: groupedData[monthYear],
    }));
  };
  
// 5. Income by Categories (Last 30 Days)
const processIncomeByCategory = () => {
  const incomeData = data
    .filter(record => record.status === 'Income' && isValidDate(record.date))
    .map(record => ({
      category: record.category || 'Uncategorized',
      amount: isNaN(record.amount) ? 0 : record.amount, // Ensure valid amount
    }));

  // Group income by category
  const groupedData = incomeData.reduce((acc, curr) => {
    if (!acc[curr.category]) {
      acc[curr.category] = 0;
    }
    acc[curr.category] += curr.amount;
    return acc;
  }, {});

  // Convert grouped data into an array of objects
  const result = Object.keys(groupedData).map(category => ({
    category,
    value: groupedData[category],
  }));

  return result.length > 0 ? result : [{ category: "Income", value: "No Data" }];
};

// 6. Expense by Categories (Last 30 Days)
const processExpenseByCategory = () => {
  const expenseData = data
    .filter(record => record.status === 'Expense' && isValidDate(record.date))
    .map(record => ({
      category: record.category || 'Uncategorized',
      amount: isNaN(record.amount) ? 0 : record.amount, // Ensure valid amount
    }));

  // Group expense by category
  const groupedData = expenseData.reduce((acc, curr) => {
    if (!acc[curr.category]) {
      acc[curr.category] = 0;
    }
    acc[curr.category] += curr.amount;
    return acc;
  }, {});

  // Convert grouped data into an array of objects
  const result = Object.keys(groupedData).map(category => ({
    category,
    value: groupedData[category],
  }));

  return result.length > 0 ? result : [{ category: "Expense", value: "No Data" }];
};

// Helper to validate date (last 30 days)
const isValidDate = (dateStr) => {
  const date = new Date(dateStr);
  const now = new Date();
  const thirtyDaysAgo = new Date(now.setDate(now.getDate() - 30));
  return date >= thirtyDaysAgo && date <= new Date();
};

  // 7. Comparison between Income and Expenses (This Month vs Last Month)
  const comparisonData = () => {
  const currentMonth = new Date().getMonth() + 1; // 1-based index
  const currentYear = new Date().getFullYear();

  // Helper function to calculate income or expense for a given month and year
  const calculateAmount = (status, month, year) =>
    data
      .filter(record => {
        const recordDate = new Date(record.date);
        return (
          record.status === status &&
          recordDate.getMonth() + 1 === month &&
          recordDate.getFullYear() === year
        );
      })
      .reduce((acc, record) => acc + (record.amount || 0), 0);

  // Generate data for the current month and the last 6 months
  const comparisonData = [];
  for (let i = 0; i < 7; i++) {
    const date = new Date(currentYear, currentMonth - 1 - i, 1); // Go back month by month
    const monthName = date.toLocaleString('default', { month: 'long' }); // Get full month name
    const year = date.getFullYear();

    comparisonData.push({
      month: `${monthName}, ${year}`, // e.g., "November, 2024"
      income: calculateAmount('Income', date.getMonth() + 1, year),
      expense: calculateAmount('Expense', date.getMonth() + 1, year),
    });
  }

  return comparisonData.reverse(); // Reverse to show the earliest month first
};



  // 8. Categories with Most Spending and Income
  const spendingAndIncomeCategories = () => {
    const incomeByCategory = processIncomeByCategory();
    const expenseByCategory = processExpenseByCategory();
  
    // Safely get the top categories or return default values
    const topIncomeCategory = incomeByCategory.length > 0 
      ? incomeByCategory.sort((a, b) => b.value - a.value)[0] 
      : { category: "Income", value: "No Data" };
  
    const topExpenseCategory = expenseByCategory.length > 0 
      ? expenseByCategory.sort((a, b) => b.value - a.value)[0] 
      : { category: "Expense", value: "No Data" };
  
    return { topIncomeCategory, topExpenseCategory };
  };

  const currentYear = new Date().getFullYear();

  
    const fetchRecords = async () => {
        try {
            const response = await fetch('http://localhost:5000/api/records');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const records = await response.json();
            console.log('Fetched Records:', records);
            setHasFetched(true);
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
            console.log(spendingAndIncomeCategories());
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
    const handleGenerateReportButtonClick = () => navigate('/generate-report');

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
            <div>
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
            </div>

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
                <button className="action-button" onClick={handleGenerateReportButtonClick}>
                    <FaChartBar /> Generate Report
                </button>
                <button className="action-button">
                    <FaChartPie /> Generate Analysis
                </button>
            </div>

            <h3 className="greeting-message">Detailed Analysis</h3>

            <div className="graphs-container">
  <div className="graph">
    <div className="chart-title">Income by Days</div>
    <ResponsiveContainer className="recharts-responsive-container" height={400}>
      <LineChart data={processIncomeByDays()}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Line type="monotone" dataKey="amount" stroke="green" name="Income Amount" />
      </LineChart>
    </ResponsiveContainer>
  </div>

  <div className="graph">
    <div className="chart-title">Expense by Days</div>
    <ResponsiveContainer className="recharts-responsive-container" height={400}>
      <LineChart data={processExpenseByDays()}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Line type="monotone" dataKey="amount" stroke="#fc2803" name="Expense Amount" />
      </LineChart>
    </ResponsiveContainer>
  </div>

  <div className="graph">
    <div className="chart-title">Income by Months</div>
    <ResponsiveContainer className="recharts-responsive-container" height={400}>
      <BarChart data={processIncomeByMonths()}>
        <XAxis dataKey="month" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="amount" fill="green" name="Income Amount" />
      </BarChart>
    </ResponsiveContainer>
  </div>

  <div className="graph">
    <div className="chart-title">Expense by Months</div>
    <ResponsiveContainer className="recharts-responsive-container" height={400}>
      <BarChart data={processExpenseByMonths()}>
        <XAxis dataKey="month" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="amount" fill="#fc2803" name="Expense Amount" />
      </BarChart>
    </ResponsiveContainer>
  </div>

  <div className="graph">
    <div className="chart-title">Income by Categories</div>
    <ResponsiveContainer className="recharts-responsive-container" height={400}>
      <PieChart>
        <Pie
          data={processIncomeByCategory()}
          dataKey="value"
          nameKey="category"
          outerRadius={150}
        >
          {processIncomeByCategory().map((entry) => (
            <Cell
              key={`cell-${entry.category}`}
              fill={getCategoryColor(entry.category, categoryColorMapping)}
            />
          ))}
        </Pie>
        <Tooltip />
        <Legend layout="vertical" align="right" verticalAlign="middle" />
      </PieChart>
    </ResponsiveContainer>
  </div>

  <div className="graph">
    <div className="chart-title">Expense by Categories</div>
    <ResponsiveContainer className="recharts-responsive-container" height={400}>
      <PieChart>
        <Pie
          data={processExpenseByCategory()}
          dataKey="value"
          nameKey="category"
          outerRadius={150}
        >
          {processExpenseByCategory().map((entry) => (
            <Cell
              key={`cell-${entry.category}`}
              fill={getCategoryColor(entry.category, categoryColorMapping)}
            />
          ))}
        </Pie>
        <Tooltip />
        <Legend layout="vertical" align="right" verticalAlign="middle" />
      </PieChart>
    </ResponsiveContainer>
  </div>

  <div className="graph">
  <div className="chart-title">Income vs Expense (Last 6 Months)</div>
  <ResponsiveContainer className="recharts-responsive-container" height={400}>
    <BarChart data={comparisonData()}>
      <XAxis dataKey="month" />
      <YAxis />
      <Tooltip />
      <Legend />
      <Bar dataKey="income" fill="green" name="Income" />
      <Bar dataKey="expense" fill="#fc2803" name="Expense" />
    </BarChart>
  </ResponsiveContainer>
</div>

  <div className="graph">
  <div className="chart-title">Top Categories Income Vs Expense</div>
  <ResponsiveContainer className="recharts-responsive-container" height={400}>
    <PieChart>
      <Pie
        data={[
          {
            name: spendingAndIncomeCategories().topIncomeCategory.category,
            value: spendingAndIncomeCategories().topIncomeCategory.value,
          },
          {
            name: spendingAndIncomeCategories().topExpenseCategory.category,
            value: spendingAndIncomeCategories().topExpenseCategory.value,
          },
        ]}
        dataKey="value"
        nameKey="category"
        outerRadius={150}
      >
        {[
          spendingAndIncomeCategories().topIncomeCategory,
          spendingAndIncomeCategories().topExpenseCategory,
        ].map((entry, index) => (
          <Cell
            key={`cell-${entry.category}`}
            fill={getCategoryColor(entry.category, categoryColorMapping)}
          />
        ))}
      </Pie>
      <Tooltip />
      <Legend layout="vertical" align="right" verticalAlign="middle" />
    </PieChart>
  </ResponsiveContainer>
</div>
</div>
<footer className="footer">
      <div className="footer-container">
        <div className="footer-section">
          <h4>About Us</h4>
          <p>
            We are dedicated to providing the best solutions for your financial management.
            Stay organized and in control of your income and expenses.
          </p>
        </div>
        <div className="footer-section">
          <h4>Quick Links</h4>
          <ul>
            <li><a href="/home">Home</a></li>
            <li><a href="/about">About</a></li>
            <li><a href="/contact">Contact</a></li>
            <li><a href="/privacy-policy">Privacy Policy</a></li>
          </ul>
        </div>
        <div className="footer-section">
          <h4>Contact Us</h4>
          <p>Email: support@example.com</p>
          <p>Phone: +1 (555) 123-4567</p>
          <p>Address: 123 Main Street, City, Country</p>
        </div>
      </div>
      <div className="footer-bottom">
        <p>&copy; {currentYear} Your Company Name. All Rights Reserved.</p>
      </div>
    </footer>
</div>
    );
};

export default Dashboard;