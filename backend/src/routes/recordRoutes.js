const express = require('express');
const Record = require('../models/Record');
const router = express.Router();

router.get('/records', async (req, res) => {
    console.log('GET /api/records endpoint called');
    try {
        const records = await Record.find();
        console.log('Fetched records:', records);
        res.json(records);
    } catch (error) {
        console.error('Error fetching records:', error);
        res.status(500).json({ error: 'Failed to fetch records' });
    }
});

module.exports = router;
