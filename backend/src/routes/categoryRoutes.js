// routes/categoryRoutes.js
const express = require('express');
const router = express.Router();
const Category = require('../models/Category');

// GET all categories
router.get('/', async (req, res) => {
    try {
        const categories = await Category.find();
        res.json(categories);
    } catch (error) {
        console.error('Error fetching categories:', error);
        res.status(500).json({ message: 'Error fetching categories' });
    }
});

// POST new category
router.post('/', async (req, res) => {
    console.log('Request body:', req.body);  // Log the request body

    const { name, color } = req.body;

    try {
        // Check if category already exists
        const existingCategory = await Category.findOne({ name });
        if (existingCategory) {
            return res.status(400).json({ message: 'Category already exists' });
        }

        const newCategory = new Category({ name, color });
        await newCategory.save();

        console.log('New category added:', newCategory);  // Log the newly added category
        res.status(201).json(newCategory);
    } catch (error) {
        console.error('Error adding category:', error);
        res.status(500).json({ message: 'Error adding category' });
    }
});


module.exports = router;
