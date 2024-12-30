import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './RecordDetails.css';

const RecordDetails = () => {
    const { id } = useParams(); // Get record ID from URL
    const navigate = useNavigate(); // Hook for navigation
    const [record, setRecord] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchRecord = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/api/records/${id}`);
                setRecord(response.data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching record details:', error);
                setLoading(false);
            }
        };

        fetchRecord();
    }, [id]);

    const handleBack = () => {
        navigate(-1); // Go back to the previous page
    };

    if (loading) {
        return <div className="loading-message">Loading record details...</div>;
    }

    if (!record) {
        return <div className="error-message">Record not found.</div>;
    }

    return (
        <div className="record-details-container">
            <button className="back-button" onClick={handleBack}>
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
            <h1 className="record-title">Record Details</h1>
            <div className="record-details">
                <p><strong>Name:</strong> {record.name}</p>
                <p><strong>Status:</strong> {record.status}</p>
                <p><strong>Amount:</strong> PKR {record.amount}</p>
                <p><strong>Quantity:</strong> {record.quantity}</p>
                <p><strong>Category:</strong> {record.category}</p>
                <p><strong>Date:</strong> {new Date(record.date).toLocaleDateString()}</p>
                <p><strong>Details:</strong> {record.details}</p>
                {/* Check if there are media files */}
                {record.media && record.media.length > 0 && (
                    <div className="media-section">
                        <h4>Media</h4>
                        <h4>{record.media}</h4>
                        <div className="media-item">
                            {record.media.startsWith('uploads/') ? (
                               <img src={`http://localhost:5000${record.media}`} alt="Media file"
                               className="media-image"
                           />                           
                           
                            ) : (
                                <a href={`http://localhost:5000/${record.media.replace(/^\/+/, '')}`} target="_blank" rel="noopener noreferrer">
                                    {record.media.split('/').pop()} {/* Show file name */}
                                </a>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default RecordDetails;
