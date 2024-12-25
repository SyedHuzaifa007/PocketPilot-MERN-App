import React, { useState } from 'react';
import axios from 'axios';
import './Signup.css'; // Include this CSS file for styling

const Signup = () => {
    const [formData, setFormData] = useState({ username: '', email: '', password: '' });
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
            const response = await axios.post('http://localhost:5000/api/auth/signup', formData);
            console.log('User created:', response.data);
            window.location.href = '/login';
        } catch (error) {
            console.error('Error during signup:', error);
            setErrorMessage('Failed to sign up. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="signup-container">
            <div className="signup-card">
                <h2>Create an Account</h2>
                <p>Join us to track your expenses effortlessly!</p>
                <form onSubmit={handleSubmit} className="signup-form">
                    {errorMessage && <p className="error-message">{errorMessage}</p>}
                    <div className="form-group">
                        <input
                            type="text"
                            name="username"
                            placeholder="Username"
                            value={formData.username}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <input
                            type="email"
                            name="email"
                            placeholder="Email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <input
                            type="password"
                            name="password"
                            placeholder="Password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <button type="submit" className="btn-submit" disabled={loading}>
                        {loading ? 'Signing up...' : 'Sign Up'}
                    </button>
                </form>
                <p className="login-link">
                    Already have an account? <a href="/login">Log in here</a>
                </p>
            </div>
        </div>
    );
};

export default Signup;
