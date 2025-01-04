import React, { useState } from 'react';
import './GenerateReport.css';

const GenerateReport = () => {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const handleGenerateReport = async () => {
    if (startDate && endDate) {
      try {
        const response = await fetch(`/api/generate-report?start=${startDate}&end=${endDate}`);
        const data = await response.blob();
        const link = document.createElement('a');
        link.href = URL.createObjectURL(data);
        link.download = `report_${startDate}_to_${endDate}.pdf`;
        link.click();
      } catch (error) {
        console.error('Error generating report:', error);
      }
    } else {
      alert('Please select both start and end dates.');
    }
  };

  return (
    <div className="report-page">
      <h1>Generate Reports</h1>
      <div>
        <label>Start Date: </label>
        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
        />
      </div>
      <div>
        <label>End Date: </label>
        <input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
        />
      </div>
      <button onClick={handleGenerateReport}>Generate Report</button>
    </div>
  );
};

export default GenerateReport;
