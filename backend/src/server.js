const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const authRoutes = require("./routes/authRoutes"); // Correct relative path

// Load environment variables
dotenv.config();

const app = express();

// Middleware
app.use(express.json()); // To parse JSON bodies
app.use(cors()); // Handle cross-origin requests

// Routes
app.use("/api/auth", authRoutes);

// Connect to MongoDB
mongoose
    .connect(process.env.MONGO_URI, {  // Ensure this is the correct variable name
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => {
        console.log("Connected to MongoDB");
        app.listen(process.env.PORT || 5000, () => {
            console.log("Server is running");
        });
    })
    .catch((err) => {
        console.error("Error connecting to MongoDB", err);
    });
