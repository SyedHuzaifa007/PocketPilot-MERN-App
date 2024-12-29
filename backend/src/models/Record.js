// models/Record.js
const mongoose = require('mongoose');

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

module.exports = mongoose.model('Record', recordSchema);
