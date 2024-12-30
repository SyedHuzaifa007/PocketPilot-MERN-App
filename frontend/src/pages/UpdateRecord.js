import React, { useState, useEffect } from 'react';
import { useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom'; // React Router v6
import axios from 'axios';
import './AddRecord.css';

const UpdateRecord = () => {
    const navigate = useNavigate();
    const { id } = useParams(); // Get the record ID from the URL parameters
    console.log('Record ID:', id);
    

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
    const [categories, setCategories] = useState([]);
    const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);

    // Fetch categories from the backend
    const fetchCategories = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/categories');
            setCategories(response.data);
        } catch (error) {
            console.error('Error fetching categories:', error);
        }
    };


    // Define fetchRecordDetails with useCallback
    const fetchRecordDetails = useCallback(async () => {
        try {
            console.log('Fetching record details for ID:', id);
            console.log(`Fetching: http://localhost:5000/api/records/${id}`);
            const response = await axios.get(`http://localhost:5000/api/records/${id}`);
            if (response.data) {
                setFormData(response.data); // Prefill form with the fetched data
            }
        } catch (error) {
            console.error('Error fetching record:', error);
        }
    }, [id]); // The function depends on the 'id' value
    
    useEffect(() => {
        fetchCategories();
        fetchRecordDetails(); // Fetch the record details based on ID
    }, [id, fetchRecordDetails]); // Now it's safe to include fetchRecordDetails
    
    useEffect(() => {
        console.log('Form data after fetch:', formData);  // Log the form data after it is set
    }, [formData]);

    // Handle form changes
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };

    // Handle category selection
    const handleCategorySelect = (categoryName) => {
        setFormData((prevState) => ({
            ...prevState,
            category: categoryName,
        }));
        setShowCategoryDropdown(false);
    };

    // Handle category addition
    const handleAddCategory = async () => {
        if (
            !categories.some((cat) => cat.name === formData.category) &&
            formData.category.trim() !== ''
        ) {
            const newColor = `#${Math.floor(Math.random() * 16777215).toString(16)}`;
            try {
                const response = await axios.post('http://localhost:5000/api/categories', {
                    name: formData.category,
                    color: newColor,
                });
                setCategories([...categories, response.data]);
                setFormData((prevState) => ({
                    ...prevState,
                    category: '',
                }));
            } catch (error) {
                console.error('Error adding category:', error);
            }
        }
    };

    // Handle quantity change
    const handleQuantityChange = (increment) => {
        setFormData((prevState) => ({
            ...prevState,
            quantity: Math.max(0, prevState.quantity + increment),
        }));
    };

    // Handle form submission (Update the record)
    const handleSubmit = async (e) => {
        e.preventDefault();
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
    
        // Log the form data
        for (const [key, value] of form.entries()) {
            console.log(`${key}: ${value}`);
        }
    
        try {
            const response = await fetch(`http://localhost:5000/api/records/${id}`, {
                method: 'PUT',
                body: form,
            });
    
            if (response.ok) {
                alert('Record updated successfully!');
                navigate('/past-records');
            } else {
                const errorData = await response.json();
                console.error('Error response:', errorData);
                alert('Failed to update the record');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Error updating the record');
        }
    };
    

    const handleBackButtonClick = () => {
        navigate('/past-records'); // Navigate back to the past records page
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
            <h2 className="form-heading">Update Record</h2>
            <form className="add-record-form" onSubmit={handleSubmit}>
                <div className="form-row">
                    <div className="form-group">
                        <label>Name:</label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                        />
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
                            <button type="button" onClick={() => handleQuantityChange(-1)}>
                                -
                            </button>
                            <input type="number" value={formData.quantity} readOnly />
                            <button type="button" onClick={() => handleQuantityChange(1)}>
                                +
                            </button>
                        </div>
                    </div>
                </div>
                <div className="form-row">
                    <div className="form-group">
                        <label>Category:</label>
                        <div className="custom-dropdown">
                            <div
                                className="dropdown-selected"
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
                        <input
                            type="date"
                            name="date"
                            value={formData.date}
                            onChange={handleChange}
                            required
                        />
                    </div>
                </div>
                <div className="form-row">
                    <div className="form-group">
                        <label>Media:</label>
                        <input
                            type="file"
                            name="media"
                            onChange={(e) => setFormData({ ...formData, media: e.target.files[0] })}
                        />
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
                <div className="form-row submit-row">
                    <button type="submit" className="submit-button">
                        Update Record
                    </button>
                </div>
            </form>
        </div>
    );
};

export default UpdateRecord;
