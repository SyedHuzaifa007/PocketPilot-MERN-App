import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { LineChart, BarChart, PieChart, XAxis, YAxis, Tooltip, Legend, Line, Bar, Pie, Cell, CartesianGrid, ResponsiveContainer } from "recharts";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";
import "./GenerateReport.css";

const GenerateReport = () => {
  const navigate = useNavigate(); // React Router v6
  const [data, setData] = useState([]);
  const [last7Days, setLast7Days] = useState(false);
  const [last15Days, setLast15Days] = useState(false);
  const [last30Days, setLast30Days] = useState(false);
  const [customDate, setCustomDate] = useState(false);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [graphsOnly, setGraphsOnly] = useState(false);
  const [graphsWithAnalysis, setGraphsWithAnalysis] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch("http://localhost:5000/api/records");
      const records = await response.json();
      setData(records);
    };
    fetchData();
  }, []);

  const handleBackButtonClick = () => navigate("/dashboard");

  // Toggle handlers
  const handleLast7DaysChange = () => {
    setLast7Days(!last7Days);
    setLast15Days(false);
    setLast30Days(false);
    setCustomDate(false);
  };

  const handleLast15DaysChange = () => {
    setLast15Days(!last15Days);
    setLast7Days(false);
    setLast30Days(false);
    setCustomDate(false);
  };

  const handleLast30DaysChange = () => {
    setLast30Days(!last30Days);
    setLast7Days(false);
    setLast15Days(false);
    setCustomDate(false);
  };

  const handleCustomDateChange = () => {
    setCustomDate(!customDate);
    setLast7Days(false);
    setLast15Days(false);
    setLast30Days(false);
  };

  const handleGraphsOnlyChange = () => {
    setGraphsOnly(true);
    setGraphsWithAnalysis(false);
  };

  const handleGraphsWithAnalysisChange = () => {
    setGraphsWithAnalysis(true);
    setGraphsOnly(false);
  };

  const filterDataByDateRange = (range) => {
    const now = new Date();
    const rangeStart = new Date();
    rangeStart.setDate(now.getDate() - range);

    return data.filter((record) => {
      const recordDate = new Date(record.date);
      return recordDate >= rangeStart && recordDate <= now;
    });
  };

  const filterDataByCustomDate = () => {
    return data.filter((record) => {
      const recordDate = new Date(record.date);
      return recordDate >= new Date(startDate) && recordDate <= new Date(endDate);
    });
  };

  const getFilteredData = () => {
    if (last7Days) return filterDataByDateRange(7);
    if (last15Days) return filterDataByDateRange(15);
    if (last30Days) return filterDataByDateRange(30);
    if (customDate) return filterDataByCustomDate();
    return data;
  };

  const generateGraphs = () => {
    const filteredData = getFilteredData();
    // Create graphs using Recharts or any library with filteredData
    // The detailed graph generation logic would be similar to the one provided earlier
    return filteredData; // Placeholder return for filteredData
  };

  const generatePDF = () => {
    const filteredData = getFilteredData();
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
            doc.text('\nRecords History', 83, 30);
    
            const tableColumnHeaders = ['Sr. No', 'Name', 'Status', 'Amount (PKR)', 'Quantity', 'Category', 'Date', 'Details'];
            const tableRows = filteredData.map((record, index) => [
                index + 1,
                record.name,
                record.status,
                record.amount,
                record.quantity,
                record.category,
                new Date(record.date).toLocaleDateString('en-GB'),
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
    

    if (graphsOnly || graphsWithAnalysis) {
      doc.addPage();
      doc.setFontSize(15);
      doc.setFont('helvetica', 'bold');
      doc.text("Detailed Analysis", 80, 20);
      // Add graph content here, or export them as images and include them in the PDF
    }

    const fileName = `${documentId}_${timestamp}.pdf`;
    doc.save(fileName);
  };

  const generateExcel = () => {
    const filteredData = getFilteredData();
    const worksheet = XLSX.utils.json_to_sheet(filteredData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Report");
    XLSX.writeFile(workbook, "report.xlsx");
  };


  return (
    <div className="generate-report">
       <button className="back-button2" onClick={handleBackButtonClick}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="back-icon">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                </svg>
                <span className="back-text">Back</span>
            </button>
      <div className="heading">
      <h1>Generate Report</h1>
      </div>

      <div className="toggle-switches">
        {/* Last 7 Days */}
        <div>
          <label>
            <input
              type="checkbox"
              checked={last7Days}
              onChange={handleLast7DaysChange}
            />
            <span className="toggle-label"></span>
            Last 7 Days
          </label>
        </div>

        {/* Last 30 Days */}
        <div>
          <label>
            <input
              type="checkbox"
              checked={last15Days}
              onChange={handleLast15DaysChange}
            />
            <span className="toggle-label"></span>
            Last 15 Days
          </label>
        </div>

        {/* Last 30 Days */}
        <div>
          <label>
            <input
              type="checkbox"
              checked={last30Days}
              onChange={handleLast30DaysChange}
            />
            <span className="toggle-label"></span>
            Last 30 Days
          </label>
        </div>

        {/* Custom Date */}
        <div>
          <label>
            <input
              type="checkbox"
              checked={customDate}
              onChange={handleCustomDateChange}
            />
            <span className="toggle-label"></span>
            Custom Date
          </label>

          {customDate && (
            <div className="date-pickers">
              <DatePicker
                selected={startDate}
                onChange={(date) => setStartDate(date)}
                placeholderText="Pick Start Date"
              />
              <DatePicker
                selected={endDate}
                onChange={(date) => setEndDate(date)}
                placeholderText="Pick End Date"
              />
            </div>
          )}
        </div>

        {/* Graphs Only */}
        <div>
          <label>
            <input
              type="checkbox"
              checked={graphsOnly}
              onChange={handleGraphsOnlyChange}
            />
            <span className="toggle-label"></span>
            Graphs Only
          </label>
        </div>

        {/* Graphs with Analysis */}
        <div>
          <label>
            <input
              type="checkbox"
              checked={graphsWithAnalysis}
              onChange={handleGraphsWithAnalysisChange}
            />
            <span className="toggle-label"></span>
            Graphs with Analysis
          </label>
        </div>

        {/* Buttons */}
        <div className="buttons">
          <button onClick={generatePDF}>Generate PDF Report</button>
          <button onClick={generateExcel}>Generate Excel Report</button>
        </div>
      </div>
    </div>
  );
};

export default GenerateReport;
