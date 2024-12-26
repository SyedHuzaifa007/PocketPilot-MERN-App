import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"; // Import Router, Routes, Route, and Navigate
import Signup from "./pages/Signup"; // Import Signup page
import Login from "./pages/Login"; // Import Login page
import Dashboard from "./pages/Dashboard";
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
                <Route
                    path="/dashboard"
                    element={
                        <PrivateRoute>
                            <Dashboard />
                        </PrivateRoute>
                    }
                />
                {/* Redirect to login for unknown routes */}
                <Route path="*" element={<Navigate to="/login" />} />
            </Routes>
        </Router>
    );
}

export default App;
