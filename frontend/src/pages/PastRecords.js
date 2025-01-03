import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // React Router v6
import axios from 'axios';
import './PastRecords.css';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';

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
    
                // Sort records by date in descending order (most recent first)
                const sortedRecords = recordsWithId.sort((a, b) => new Date(b.date) - new Date(a.date));
    
                setRecords(sortedRecords);
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
    

    const handleDelete = async (id, event) => {
        // Prevent the click event from propagating to the row's onClick
        event.stopPropagation();
        
        // Show confirmation dialog
        const confirmDelete = window.confirm('Are you sure you want to delete this record?');
    
        // If the user confirms, proceed to delete
        if (confirmDelete) {
            try {
                // Send DELETE request to server to delete the record from the database
                await axios.delete(`http://localhost:5000/api/records/${id}`);
                
                // Update the state to remove the deleted record from the UI
                setRecords(records.filter(record => record.id !== id));
                navigate('/past-records', { replace: true }); // Refresh the page
            } catch (error) {
                console.error('Error deleting record:', error);
                alert('An error occurred while deleting the record.');
            }
        }
    };
    
    // PastRecords Component
    const handleUpdate = (record, event) => {
        // Prevent the click event from propagating to the row's onClick
        event.stopPropagation();
        // Navigate to the UpdateRecord page
        navigate(`/update-record/${record.id}`);
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

        const tableColumnHeaders = ['Sr. No', 'Name', 'Status', 'Amount (PKR)', 'Quantity', 'Category', 'Date', 'Details'];
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

    const handleDownloadExcel = () => {
        const timestamp = new Date().toISOString().replace(/[-:]/g, '').replace('T', '_').split('.')[0];
        const documentId = Math.floor(1000 + Math.random() * 9000);

        const tableColumnHeaders = ['Sr. No', 'Name', 'Status', 'Amount (PKR)', 'Quantity', 'Category', 'Date', 'Details'];
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

        const ws = XLSX.utils.aoa_to_sheet([tableColumnHeaders, ...tableRows]);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Past Records');

        const fileName = `${documentId}_${timestamp}.xlsx`;
        XLSX.writeFile(wb, fileName);
    };

    if (loading) {
        return <div className="loading-message">Loading records...</div>;
    }

    if (records.length === 0) {
        return <div className="no-records-message">No records found.</div>;
    }

    return (
        <div className="past-records-container">
            <div class="top-right-buttons">
        <button class="download-button" onClick={handleDownloadPDF}>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="size-6">
        <path d="M5.625 1.5c-1.036 0-1.875.84-1.875 1.875v17.25c0 1.035.84 1.875 1.875 1.875h12.75c1.035 0 1.875-.84 1.875-1.875V12.75A3.75 3.75 0 0 0 16.5 9h-1.875a1.875 1.875 0 0 1-1.875-1.875V5.25A3.75 3.75 0 0 0 9 1.5H5.625Z" />
        <path d="M12.971 1.816A5.23 5.23 0 0 1 14.25 5.25v1.875c0 .207.168.375.375.375H16.5a5.23 5.23 0 0 1 3.434 1.279 9.768 9.768 0 0 0-6.963-6.963Z" />
        </svg>
        <span class="button-text">Download PDF</span>
        </button>
        <button className="download-button" onClick={handleDownloadExcel}>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="size-5">
        <path d="M15.5 2A1.5 1.5 0 0 0 14 3.5v13a1.5 1.5 0 0 0 1.5 1.5h1a1.5 1.5 0 0 0 1.5-1.5v-13A1.5 1.5 0 0 0 16.5 2h-1ZM9.5 6A1.5 1.5 0 0 0 8 7.5v9A1.5 1.5 0 0 0 9.5 18h1a1.5 1.5 0 0 0 1.5-1.5v-9A1.5 1.5 0 0 0 10.5 6h-1ZM3.5 10A1.5 1.5 0 0 0 2 11.5v5A1.5 1.5 0 0 0 3.5 18h1A1.5 1.5 0 0 0 6 16.5v-5A1.5 1.5 0 0 0 4.5 10h-1Z" />
        </svg>
                    <span className="button-text">Download Excel</span>
                </button>
        <button class="share-button">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="size-6">
        <path fill-rule="evenodd" d="M15.75 4.5a3 3 0 1 1 .825 2.066l-8.421 4.679a3.002 3.002 0 0 1 0 1.51l8.421 4.679a3 3 0 1 1-.729 1.31l-8.421-4.678a3 3 0 1 1 0-4.132l8.421-4.679a3 3 0 0 1-.096-.755Z" clip-rule="evenodd" />
        </svg>
        <span class="button-text">Share</span>
        </button>    
        </div>
            <button className="back-button" onClick={handleBackButtonClick}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="back-icon">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
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
                        <th>Amount (PKR)</th>
                        <th>Quantity</th>
                        <th>Category</th>
                        <th>Date</th>
                        <th>Details</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {records.map((record, index) => (
                        <tr
                            key={record.id}
                            className="record-row"
                            onClick={() => navigate(`/record-details/${record.id}`)} // Row click navigates to RecordDetails
                        >
                            <td className="bold-text">{index + 1}</td>
                            <td className="bold-text">{record.name}</td>
                            <td className={record.status === 'Income' ? 'income-status' : 'expense-status'}>
                                {record.status}
                            </td>
                            <td className="bold-text">{record.amount}</td>
                            <td className="bold-text">{record.quantity}</td>
                            <td className="bold-text">{record.category}</td>
                            <td className="bold-text">{new Date(record.date).toLocaleDateString('en-GB')}</td>
                            <td>{record.details}</td>
                            <td className="actions-cell">
                                <button
                                    className="update-button"
                                    onClick={(e) => handleUpdate(record, e)} // Pass event to prevent bubbling
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="size-5">
                                        <path d="m5.433 13.917 1.262-3.155A4 4 0 0 1 7.58 9.42l6.92-6.918a2.121 2.121 0 0 1 3 3l-6.92 6.918c-.383.383-.84.685-1.343.886l-3.154 1.262a.5.5 0 0 1-.65-.65Z" />
                                        <path d="M3.5 5.75c0-.69.56-1.25 1.25-1.25H10A.75.75 0 0 0 10 3H4.75A2.75 2.75 0 0 0 2 5.75v9.5A2.75 2.75 0 0 0 4.75 18h9.5A2.75 2.75 0 0 0 17 15.25V10a.75.75 0 0 0-1.5 0v5.25c0 .69-.56 1.25-1.25 1.25h-9.5c-.69 0-1.25-.56-1.25-1.25v-9.5Z" />
                                    </svg>
                                    <span class="button-text">Update</span>
                                </button>
                                <button
                                    className="delete-button"
                                    onClick={(e) => handleDelete(record.id, e)} // Pass event to prevent bubbling
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="size-5">
                                        <path fill-rule="evenodd" d="M8.75 1A2.75 2.75 0 0 0 6 3.75v.443c-.795.077-1.584.176-2.365.298a.75.75 0 1 0 .23 1.482l.149-.022.841 10.518A2.75 2.75 0 0 0 7.596 19h4.807a2.75 2.75 0 0 0 2.742-2.53l.841-10.52.149.023a.75.75 0 0 0 .23-1.482A41.03 41.03 0 0 0 14 4.193V3.75A2.75 2.75 0 0 0 11.25 1h-2.5ZM10 4c.84 0 1.673.025 2.5.075V3.75c0-.69-.56-1.25-1.25-1.25h-2.5c-.69 0-1.25.56-1.25 1.25v.325C8.327 4.025 9.16 4 10 4ZM8.58 7.72a.75.75 0 0 0-1.5.06l.3 7.5a.75.75 0 1 0 1.5-.06l-.3-7.5Zm4.34.06a.75.75 0 1 0-1.5-.06l-.3 7.5a.75.75 0 1 0 1.5.06l.3-7.5Z" clip-rule="evenodd" />
                                    </svg>
                                    <span class="button-text">Delete</span>
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default PastRecords;
