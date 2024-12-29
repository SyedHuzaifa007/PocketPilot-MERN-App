// models/category.js
const mongoose = require('mongoose');

// Define Category schema
const categorySchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    color: { type: String, required: true },
});

// Create and export the Category model
const Category = mongoose.model('Category', categorySchema);

module.exports = Category;
