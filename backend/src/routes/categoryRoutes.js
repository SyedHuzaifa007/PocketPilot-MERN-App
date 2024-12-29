// const express = require('express');
// const Category = require('./models/category'); // Ensure the path is correct

// const router = express.Router();

// // Route to get all categories
// router.get('/categories', async (req, res) => {
//     try {
//         const categories = await Category.find(); // Fetch all categories from DB
//         res.json(categories); // Return the categories as a JSON response
//     } catch (err) {
//         res.status(500).json({ message: err.message }); // Error handling
//     }
// });

// // Route to add a new category
// router.post('/categories', async (req, res) => {
//     const { name, color } = req.body; // Extract name and color from the request body

//     const newCategory = new Category({
//         name,
//         color,
//     });

//     try {
//         const savedCategory = await newCategory.save(); // Save the new category to DB
//         res.status(201).json(savedCategory); // Return the saved category
//     } catch (err) {
//         res.status(400).json({ message: err.message }); // Error handling
//     }
// });

// module.exports = router;
