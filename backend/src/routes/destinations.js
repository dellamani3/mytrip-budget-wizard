const express = require('express');
const router = express.Router();

const destinationController = require('../controllers/destinationController');

// @route   GET /api/destinations/search
// @desc    Search destinations with autocomplete
// @access  Public
// @query   q (search term), limit (number of results), popular_only (boolean)
router.get('/search', destinationController.searchDestinations);

// @route   GET /api/destinations/popular
// @desc    Get popular destinations
// @access  Public
// @query   limit (number of results), region (filter by region)
router.get('/popular', destinationController.getPopularDestinations);

// @route   GET /api/destinations/regions
// @desc    Get destinations grouped by region
// @access  Public
router.get('/regions', destinationController.getDestinationsByRegion);

// Health check route for destinations API
router.get('/health/check', (req, res) => {
  res.json({
    success: true,
    message: 'Destinations API is running',
    timestamp: new Date().toISOString()
  });
});

module.exports = router; 