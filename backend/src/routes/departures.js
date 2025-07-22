const express = require('express');
const router = express.Router();
const { getDepartureCities, getPopularDepartureCities } = require('../controllers/flightPricingController');

// Get all departure cities
router.get('/', (req, res) => {
  try {
    const departureCities = getDepartureCities();
    
    res.json({
      success: true,
      data: departureCities,
      total: departureCities.length
    });
  } catch (error) {
    console.error('Error fetching departure cities:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch departure cities'
    });
  }
});

// Get popular departure cities (hubs)
router.get('/popular', (req, res) => {
  try {
    const { limit = 10 } = req.query;
    const popularCities = getPopularDepartureCities();
    const limitedCities = limit === 'all' ? popularCities : popularCities.slice(0, parseInt(limit));
    
    res.json({
      success: true,
      data: limitedCities,
      total: limitedCities.length
    });
  } catch (error) {
    console.error('Error fetching popular departure cities:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch popular departure cities'
    });
  }
});

// Get departure cities by region
router.get('/region/:region', (req, res) => {
  try {
    const { region } = req.params;
    const allCities = getDepartureCities();
    const citiesByRegion = allCities.filter(city => 
      city.region.toLowerCase() === region.toLowerCase()
    );
    
    res.json({
      success: true,
      data: citiesByRegion,
      total: citiesByRegion.length,
      region: region
    });
  } catch (error) {
    console.error('Error fetching departure cities by region:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch departure cities by region'
    });
  }
});

module.exports = router; 