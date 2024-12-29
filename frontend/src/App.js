import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"; // Import Router, Routes, Route, and Navigate
import Signup from "./pages/Signup"; // Import Signup page
import Login from "./pages/Login"; // Import Login page
import Dashboard from "./pages/Dashboard";
import Splash from "./pages/Splash";
import AddRecord from './pages/AddRecord';
import PastRecords from './pages/PastRecords';
import 'bootstrap/dist/css/bootstrap.min.css';


function App() {
    const PrivateRoute = ({ children }) => {
        const token = localStorage.getItem("authToken");
        return token ? children : <Navigate to="/login" />;
    };

    return (
        <Router>
            <Routes>
                <Route path="/signup" element={<Signup />} />
                <Route path="/login" element={<Login />} />
                <Route path="/" element={<Splash />} />
                <Route
                    path="/dashboard"
                    element={
                        <PrivateRoute>
                            <Dashboard />
                        </PrivateRoute>
                    }
                />
                <Route path="/add-record" element={<AddRecord />} />
                <Route path="/past-records" element={<PastRecords />} />
                <Route path="*" element={<Navigate to="/login" />} />
            </Routes>
        </Router>
    );
}

export default App;
