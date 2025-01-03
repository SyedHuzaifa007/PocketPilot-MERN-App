const express = require("express");
const mongoose = require("mongoose");
const multer = require("multer");
const dotenv = require("dotenv");
const cors = require("cors");
const bodyParser = require('body-parser');
const Record = require('./models/Record');
const authRoutes = require("./routes/authRoutes");
const recordRoutes = require('./routes/recordRoutes');
const path = require('path');
const categoryRoutes = require('./routes/categoryRoutes'); 

// Load environment variables
dotenv.config();

// Initialize express app
const app = express();


// Serve files from the 'backend/uploads' directory// Serving static files from the 'uploads' folder
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
console.log('Serving static files from:', path.join(__dirname, 'uploads'));


// Middleware
app.use(express.json()); // To parse JSON bodies
app.use(bodyParser.json()); 
app.use(cors({
    origin: 'http://localhost:3000', // Allow only frontend to access the API
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
}));



// app.use('/api', categoryRoutes);
app.use("/api/auth", authRoutes);
 // Mount routes at /api

app.use("/api", recordRoutes); // This will handle routes like /api/records
app.use('/api/categories', categoryRoutes);


// Configure multer storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads'); // Directory where files will be saved
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`); // Unique file name
    },
});

// Middleware for file upload
const upload = multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // Limit file size to 5MB
});


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



app.delete('/api/records/:id', async (req, res) => {
    const { id } = req.params;
    try {
        await Record.findByIdAndDelete(id); // Replace with your database query
        res.status(200).json({ message: 'Record deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: 'Failed to delete record' });
    }
});



app.put('/api/records/:id', upload.single('media'), async (req, res) => {
    console.log('PUT /api/records/:id endpoint called');
    const { id } = req.params;

    // Validate ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: 'Invalid record ID' });
    }

    // Extract update data from req.body
    const { name, status, amount, quantity, category, date, details } = req.body;

    const updateData = {
        name,
        status,
        amount,
        quantity,
        category,
        date,
        details,
    };

    // If media is uploaded, include the file path
    if (req.file) {
        updateData.media = `/uploads/${req.file.filename}`;
    }

    try {
        // Update the record in the database
        const updatedRecord = await Record.findByIdAndUpdate(id, updateData, { new: true });
        console.log('Record updated in DB:', updatedRecord);
        if (!updatedRecord) {
            return res.status(404).json({ message: 'Record not found' });
        }
        res.status(200).json(updatedRecord);
    } catch (error) {
        console.error('Error updating record:', error);
        res.status(500).json({ message: 'Failed to update record' });
    }
});

app.post('/api/records/:id', upload.single('media'), async (req, res) => {
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

app.get('/api/records/:id', async (req, res) => {
    const { id } = req.params;  // Extract the ID from URL parameters

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: 'Invalid record ID' });
    }

    try {
        const record = await Record.findById(id);
        if (!record) {
            return res.status(404).json({ message: 'Record not found' });
        }
        return res.json(record);
    } catch (error) {
        console.error('Error fetching record:', error);
        return res.status(500).json({ message: 'Error fetching record' });
    }
});


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
