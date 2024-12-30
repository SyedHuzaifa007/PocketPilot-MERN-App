import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // React Router v6
import axios from 'axios';
import './PastRecords.css';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

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
        const doc = new jsPDF('p', 'mm', 'a4');
        const timestamp = new Date().toISOString().replace(/[-:]/g, '').replace('T', '_').split('.')[0];
        const documentId = Math.floor(1000 + Math.random() * 9000);

        doc.setFontSize(10);
        doc.text(`File ID: ${documentId}`, 10, 10);
        const date = new Date().toLocaleDateString('en-GB');  
        const time = new Date().toLocaleTimeString();   
    
        doc.text(`Date: ${date}`, 10, 20); 
        doc.text(`Time: ${time}`, 10, 25); 

        doc.setFontSize(15);
        doc.setFont('helvetica', 'bold');
        doc.text('\nPast Records', 87, 30);

        const tableColumnHeaders = ['Sr. No', 'Name', 'Status', 'Amount', 'Quantity', 'Category', 'Date', 'Details'];
        const tableRows = records.map((record, index) => [
            index + 1,
            record.name,
            record.status,
            record.amount,
            record.quantity,
            record.category,
            new Date(record.date).toLocaleDateString(),
            record.details,
        ]);

        doc.autoTable({
            head: [tableColumnHeaders],
            body: tableRows,
            startY: 40,
        });

        const pageCount = doc.internal.getNumberOfPages();
        doc.setFontSize(8);
        for (let i = 1; i <= pageCount; i++) {
            doc.setPage(i);
            doc.text(`Page ${i} of ${pageCount}`, doc.internal.pageSize.width / 2, doc.internal.pageSize.height - 10, {
                align: 'center',
            });
        }

        const fileName = `${documentId}_${timestamp}.pdf`;
        doc.save(fileName);
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
            <div class="top-right-buttons">
        <button class="download-button" onClick={handleDownloadPDF}>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="size-6">
  <path d="M5.625 1.5c-1.036 0-1.875.84-1.875 1.875v17.25c0 1.035.84 1.875 1.875 1.875h12.75c1.035 0 1.875-.84 1.875-1.875V12.75A3.75 3.75 0 0 0 16.5 9h-1.875a1.875 1.875 0 0 1-1.875-1.875V5.25A3.75 3.75 0 0 0 9 1.5H5.625Z" />
  <path d="M12.971 1.816A5.23 5.23 0 0 1 14.25 5.25v1.875c0 .207.168.375.375.375H16.5a5.23 5.23 0 0 1 3.434 1.279 9.768 9.768 0 0 0-6.963-6.963Z" />
</svg>

        <span class="button-text">Download PDF</span>
        </button>
        <button class="share-button">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="size-6">
  <path fill-rule="evenodd" d="M15.75 4.5a3 3 0 1 1 .825 2.066l-8.421 4.679a3.002 3.002 0 0 1 0 1.51l8.421 4.679a3 3 0 1 1-.729 1.31l-8.421-4.678a3 3 0 1 1 0-4.132l8.421-4.679a3 3 0 0 1-.096-.755Z" clip-rule="evenodd" />
</svg>

        <span class="button-text">Share</span>
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
