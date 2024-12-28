import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // React Router v6
import axios from 'axios';
import './AddRecord.css';

const AddRecord = () => {
    const navigate = useNavigate(); // Hook for navigation
    const [formData, setFormData] = useState({
        name: '',
        status: 'Income',
        amount: '',
        quantity: 0,
        category: '',
        date: '',
        media: null,
        details: '',
    });


    const [categories, setCategories] = useState([
        { name: 'Food', color: '#f39c12' },
        { name: 'Transport', color: '#3498db' },
        { name: 'Entertainment', color: '#e74c3c' },
        { name: 'Shopping', color: '#9b59b6' },
    ]);

    const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);

    // Handle form changes
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    // Handle quantity change
    const handleQuantityChange = (increment) => {
        setFormData({
            ...formData,
            quantity: Math.max(0, formData.quantity + increment),
        });
    };

    // Handle category selection
    const handleCategorySelect = (categoryName) => {
        setFormData({ ...formData, category: categoryName });
        setShowCategoryDropdown(false);
    };

    // Handle category addition
    const handleAddCategory = () => {
        if (
            !categories.some((cat) => cat.name === formData.category) &&
            formData.category.trim() !== ''
        ) {
            const newColor = `#${Math.floor(Math.random() * 16777215).toString(16)}`; // Random color
            setCategories([...categories, { name: formData.category, color: newColor }]);
        }
    };

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (!event.target.closest('.custom-dropdown')) {
                setShowCategoryDropdown(false);
            }
        };
        document.addEventListener('click', handleClickOutside);
        return () => {
            document.removeEventListener('click', handleClickOutside);
        };
    }, []);

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        // Prepare form data including media (if any)
        const form = new FormData();
        form.append('name', formData.name);
        form.append('status', formData.status);
        form.append('amount', formData.amount);
        form.append('quantity', formData.quantity);
        form.append('category', formData.category);
        form.append('date', formData.date);
        form.append('details', formData.details);
        if (formData.media) {
            form.append('media', formData.media);
        }

        try {
            const response = await fetch('http://localhost:5000/add-record', {
                method: 'POST',
                body: form,
            });
            
            if (response.ok) {
                const data = await response.json();
                alert('Record added successfully!');
                console.log('Record added:', data);
                // Optionally reset the form after successful submission
                setFormData({
                    name: '',
                    status: 'Income',
                    amount: '',
                    quantity: 0,
                    category: '',
                    date: '',
                    media: null,
                    details: '',
                });
            } else {
                alert('Failed to add the record');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Error adding the record');
        }
    };

    // Back button click handler
    const handleBackButtonClick = () => {
        navigate('/dashboard'); // Navigate to the dashboard page
    };

    return (
        <div className="add-record-container">
            <button className="back-button" onClick={handleBackButtonClick}>
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    className="back-icon"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M15 19l-7-7 7-7"
                    />
                </svg>
                <span className="back-text">Back</span>
            </button>
            <h2 className="form-heading">Add New Record</h2>
            <form className="add-record-form" onSubmit={handleSubmit}>
                <div className="form-row">
                    <div className="form-group">
                        <label>Name:</label>
                        <input type="text" name="name" value={formData.name} onChange={handleChange} required />
                    </div>
                    <div className="form-group">
                        <label>Status:</label>
                        <select
                            name="status"
                            value={formData.status}
                            onChange={handleChange}
                            className={`status-label ${
                                formData.status === 'Income' ? 'status-income' : 'status-expense'
                            }`}
                        >
                            <option value="Income">Income</option>
                            <option value="Expense">Expense</option>
                        </select>
                    </div>
                </div>
                <div className="form-row">
                    <div className="form-group">
                        <label>Amount (PKR):</label>
                        <input
                            type="number"
                            name="amount"
                            value={formData.amount}
                            onChange={handleChange}
                            step="0.01"
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Quantity:</label>
                        <div className="quantity-controls">
                            <button type="button" onClick={() => handleQuantityChange(-1)}>-</button>
                            <input type="number" value={formData.quantity} readOnly />
                            <button type="button" onClick={() => handleQuantityChange(1)}>+</button>
                        </div>
                    </div>
                </div>
                <div className="form-row">
                    <div className="form-group">
                        <label>Category:</label>
                        <div className="custom-dropdown">
                            <div
                                className="dropdown-selected"
                                style={{
                                    backgroundColor:
                                        categories.find((cat) => cat.name === formData.category)?.color || '#ffffff',
                                    color: formData.category ? '#ffffff' : '#000000',
                                }}
                                onClick={() => setShowCategoryDropdown(!showCategoryDropdown)}
                            >
                                {formData.category || 'Select a category'}
                            </div>
                            {showCategoryDropdown && (
                                <div className="dropdown-options">
                                    {categories.map((category, index) => (
                                        <div
                                            key={index}
                                            className="dropdown-option"
                                            style={{ backgroundColor: category.color }}
                                            onClick={() => handleCategorySelect(category.name)}
                                        >
                                            {category.name}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                        <input
                            type="text"
                            placeholder="Add new category"
                            value={formData.category}
                            onChange={handleChange}
                            onBlur={handleAddCategory}
                            name="category"
                        />
                    </div>
                    <div className="form-group">
                        <label>Date:</label>
                        <input type="date" name="date" value={formData.date} onChange={handleChange} required />
                    </div>
                </div>
                <div className="form-row">
                    <div className="form-group">
                        <label>Media:</label>
                        <input type="file" name="media" onChange={(e) => setFormData({ ...formData, media: e.target.files[0] })} />
                    </div>
                    <div className="form-group">
                        <label>Details:</label>
                        <textarea
                            name="details"
                            value={formData.details}
                            onChange={handleChange}
                            placeholder="Enter details about the record"
                        ></textarea>
                    </div>
                </div>
            </form>
            <div className="form-row submit-row">
        <button type="submit" className="submit-button" onClick={handleSubmit}>Add Record</button>
    </div>
        </div>
    );
};

export default AddRecord;
