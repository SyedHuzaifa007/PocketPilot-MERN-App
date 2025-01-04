import React, { useState } from 'react';
import './GenerateReport.css';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { useNavigate } from 'react-router-dom'; // React Router v6
// import { set } from 'react-datepicker/dist/date_utils';

const GenerateReport = () => {
  const navigate = useNavigate(); // React Router v6
  const [last7Days, setLast7Days] = useState(false);
  const [last15Days, setLast15Days] = useState(false);
  const [last30Days, setLast30Days] = useState(false);
  const [customDate, setCustomDate] = useState(false);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [graphsOnly, setGraphsOnly] = useState(false);
  const [graphsWithAnalysis, setGraphsWithAnalysis] = useState(false);

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

  const handleBackButtonClick = () => {
    navigate('/dashboard'); // Navigate to the dashboard page
};

  // Ensure that only one of "Graphs Only" or "Graphs with Analysis" can be selected
  const handleGraphsOnlyChange = () => {
    setGraphsOnly(true);
    setGraphsWithAnalysis(false);
  };

  const handleGraphsWithAnalysisChange = () => {
    setGraphsWithAnalysis(true);
    setGraphsOnly(false);
  };

  const handleGeneratePDF = () => {
    // Logic to generate PDF report
    alert('Generating PDF Report...');
  };

  const handleGenerateExcel = () => {
    // Logic to generate Excel report
    alert('Generating Excel Report...');
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
          <button onClick={handleGeneratePDF}>Generate PDF Report</button>
          <button onClick={handleGenerateExcel}>Generate Excel Report</button>
        </div>
      </div>
    </div>
  );
};

export default GenerateReport;
