const express = require('express');
const router = express.Router();

const tripController = require('../controllers/tripController');
const { handleChatRequest, getChatSuggestions } = require('../controllers/aiChatController');
const { authenticateToken } = require('../middleware/auth');
const { validateTripPlanning } = require('../middleware/validation');

// @route   POST /api/trips/generate
// @desc    Generate a new trip plan
// @access  Private
router.post('/generate', authenticateToken, validateTripPlanning, tripController.generateTrip);

// @route   GET /api/trips
// @desc    Get user's trips with statistics
// @access  Private
router.get('/', authenticateToken, tripController.getUserTrips);

// @route   GET /api/trips/:tripId
// @desc    Get specific trip by ID
// @access  Private
router.get('/:tripId', authenticateToken, tripController.getTripById);

// @route   PUT /api/trips/:tripId
// @desc    Update trip
// @access  Private
router.put('/:tripId', authenticateToken, validateTripPlanning, tripController.updateTrip);

// @route   DELETE /api/trips/:tripId
// @desc    Delete trip (soft delete)
// @access  Private
router.delete('/:tripId', authenticateToken, tripController.deleteTrip);

// @route   POST /api/trips/chat
// @desc    AI Chat for trip customization
// @access  Private
router.post('/chat', authenticateToken, handleChatRequest);

// @route   GET /api/trips/chat/suggestions
// @desc    Get AI chat suggestions
// @access  Private
router.get('/chat/suggestions', authenticateToken, getChatSuggestions);

// Health check route for trips API
router.get('/health/check', (req, res) => {
  res.json({
    success: true,
    message: 'Trips API is running',
    timestamp: new Date().toISOString()
  });
});

module.exports = router; 