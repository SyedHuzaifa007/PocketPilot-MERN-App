const express = require("express");
const mongoose = require("mongoose");
const multer = require("multer"); // Make sure multer is installed
const dotenv = require("dotenv");
const cors = require("cors");
const authRoutes = require("./routes/authRoutes"); // Correct relative path
const categoryRoutes = require('./routes/categoryRoutes'); 

// Load environment variables
dotenv.config();

// Initialize express app
const app = express();

// Middleware
app.use(express.json()); // To parse JSON bodies
app.use(cors()); // Handle cross-origin requests

app.use('/api', categoryRoutes);
app.use("/api/auth", authRoutes);


// Set up file storage with multer
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); // Save files in the "uploads" directory
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    },
});
const upload = multer({ storage });

// Define Record schema and model
const recordSchema = new mongoose.Schema({
    name: String,
    status: String,
    amount: Number,
    quantity: Number,
    category: String,
    date: String,
    media: String,
    details: String,
});

const Record = mongoose.model('Record', recordSchema);

// Route to handle record submission
app.post('/add-record', upload.single('media'), async (req, res) => {
    // Extract values from the request body and file (if any)
    const { name, status, amount, quantity, category, date, details } = req.body;
    const media = req.file ? `/uploads/${req.file.filename}` : null; // If media is uploaded, save the file path

    const newRecord = new Record({
        name,
        status,
        amount,
        quantity,
        category,
        date,
        details,
        media, // Store the media path
    });

    try {
        const savedRecord = await newRecord.save();
        res.status(201).json(savedRecord); // Return the saved record as the response
        console.log('Record added:', savedRecord);
    } catch (err) {
        res.status(400).json({ message: err.message }); // Error handling
    }
});

// Connect to MongoDB
mongoose
    .connect(process.env.MONGO_URI, {
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
