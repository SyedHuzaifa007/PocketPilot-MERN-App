import React, { useEffect } from 'react';
import './Splash.css';

const Splash = () => {
    useEffect(() => {
        // Redirect to Dashboard after 3 seconds (or you can adjust the time)
        setTimeout(() => {
            window.location.href = '/Login'; 
        }, 3000); // 3 seconds delay
    }, []);

    return (
        <div className="splash-container">
            <div className="icon-container">
                <div className="icon">
                    {/* Animated Icon */}
                    <svg xmlns="http://www.w3.org/2000/svg" width="80" height="80" viewBox="0 0 24 24">
                        <circle cx="12" cy="12" r="10" fill="none" stroke="#7851a9" strokeWidth="2"/>
                        <path fill="none" stroke="#7851a9" strokeWidth="2" d="M12 2v10l4 4"/>
                        <animateTransform attributeName="transform" type="rotate" from="0 12 12" to="360 12 12" dur="1s" repeatCount="indefinite"/>
                    </svg>
                </div>
            </div>
            <h1 className="app-name">Pocket Pilot</h1>
            <h3 className="loading-text">Track your expenses effortlessly</h3>

            <div className="loading-bar-container">
                <div className="loading-bar"></div>
            </div>
        </div>
    );
};

export default Splash;
