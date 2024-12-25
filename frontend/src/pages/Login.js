import React, { useState } from 'react';
import axios from 'axios';
import './Login.css'; // Include this CSS file for styling

const Login = () => {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setErrorMessage('');

        try {
            const response = await axios.post('http://localhost:5000/api/auth/login', formData);
            console.log('User logged in:', response.data);
            localStorage.setItem('authToken', response.data.token);
            window.location.href = '/dashboard';
        } catch (error) {
            console.error('Error during login:', error);
            setErrorMessage('Failed to log in. Please check your credentials.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-container">
            <div className="login-card">
                <h2>Expense Tracker Login</h2>
                <p>Track your expenses effortlessly</p>
                <form onSubmit={handleSubmit} className="login-form">
                    {errorMessage && <p className="error-message">{errorMessage}</p>}
                    <div className="form-group">
                        <input
                            type="email"
                            name="email"
                            placeholder="Enter your email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <input
                            type="password"
                            name="password"
                            placeholder="Enter your password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <button type="submit" className="btn-submit" disabled={loading}>
                        {loading ? 'Logging in...' : 'Login'}
                    </button>
                </form>
                <p className="signup-link">
                    Don’t have an account? <a href="/signup">Sign up here</a>
                </p>
            </div>
        </div>
    );
};

export default Login;
