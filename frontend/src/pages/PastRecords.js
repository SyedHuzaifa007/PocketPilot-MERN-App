import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // React Router v6
import axios from 'axios';
import './PastRecords.css';
// import jsPDF from 'jspdf'; // Uncomment when jsPDF is working

const PastRecords = () => {
    const navigate = useNavigate(); // Hook for navigation
    const [records, setRecords] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchRecords = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/records');
                const recordsWithId = response.data.map(record => ({
                    ...record,
                    id: record._id, // Map _id to id for frontend compatibility
                }));
                setRecords(recordsWithId);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching records:', error);
                setLoading(false);
            }
        };
        
        fetchRecords();
    }, []);

    const handleBackButtonClick = () => {
        navigate('/dashboard'); // Navigate to the dashboard page
    };
    
    const handleDelete = async (id) => {
        const confirmDelete = window.confirm('Are you sure you want to delete this record?');
        if (confirmDelete) {
            try {
                await axios.delete(`/api/records/${id}`);
                setRecords(records.filter(record => record.id !== id));
            } catch (error) {
                console.error('Error deleting record:', error);
            }
        }
    };
    
    const handleUpdate = (id) => {
        console.log('Update record with ID:', id);
    };

    const handleDownloadPDF = () => {
        // const doc = new jsPDF();
        // Add Table Headers and other logic for PDF generation
    };

    const handleShare = () => {
        if (navigator.share) {
            navigator.share({
                title: 'Past Records',
                text: 'Check out the past records!',
                url: window.location.href, // Current page URL
            }).then(() => {
                console.log('Shared successfully');
            }).catch((error) => {
                console.error('Error sharing:', error);
            });
        } else {
            alert('Share feature is not supported on this device.');
        }
    };

    if (loading) {
        return <div className="loading-message">Loading records...</div>;
    }

    if (records.length === 0) {
        return <div className="no-records-message">No records found.</div>;
    }

    return (
        <div className="past-records-container">
            {/* Buttons for download and share */}
            <div className="top-right-buttons">
                <button className="download-button" onClick={handleDownloadPDF}>
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        className="download-icon"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                    </svg>
                    Download PDF
                </button>
                <button className="share-button" onClick={handleShare}>
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        className="share-icon"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12H9m3-3l-3 3-3-3" />
                    </svg>
                    Share
                </button>
            </div>

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
            <h1 className="records-heading">Past Records</h1>
            <table className="records-table">
                <thead>
                    <tr>
                        <th>Sr. No</th>
                        <th>Name</th>
                        <th>Status</th>
                        <th>Amount</th>
                        <th>Quantity</th>
                        <th>Category</th>
                        <th>Date</th>
                        <th>Details</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {records.map((record, index) => (
                        <tr key={record.id}>
                            <td className="bold-text">{index + 1}</td>
                            <td className="bold-text">{record.name}</td>
                            <td className={record.status === 'Income' ? 'income-status' : 'expense-status'}>
                                {record.status}
                            </td>
                            <td className="bold-text">{record.amount}</td>
                            <td className="bold-text">{record.quantity}</td>
                            <td className="bold-text">{record.category}</td>
                            <td className="bold-text">{new Date(record.date).toLocaleDateString()}</td>
                            <td>{record.details}</td>
                            <td className="actions-cell">
                                <button className="update-button" onClick={() => handleUpdate(record.id)}>Update</button>
                                <button className="delete-button" onClick={() => handleDelete(record.id)}>Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default PastRecords;
