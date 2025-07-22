const { validationResult } = require('express-validator');

// AI Chat service for trip customization
class AIChatService {
  constructor() {
    // Define activity categories and their associated activities
    this.activityCategories = {
      cultural: [
        'Visit local museums',
        'Explore historic districts',
        'Traditional cultural shows',
        'Art gallery tours',
        'Heritage site visits',
        'Local craft workshops',
        'Cultural performances',
        'Religious site tours'
      ],
      food: [
        'Food market exploration',
        'Cooking classes',
        'Street food tours',
        'Local restaurant experiences',
        'Wine/beer tasting',
        'Traditional cuisine workshops',
        'Food festivals',
        'Farm-to-table experiences'
      ],
      outdoor: [
        'Nature hikes',
        'Park exploration',
        'Outdoor sports',
        'Beach activities',
        'Mountain climbing',
        'Cycling tours',
        'Water sports',
        'Wildlife watching'
      ],
      adventure: [
        'Extreme sports',
        'Rock climbing',
        'Bungee jumping',
        'Zip lining',
        'Skydiving',
        'White water rafting',
        'Paragliding',
        'Adventure parks'
      ],
      shopping: [
        'Local markets',
        'Shopping districts',
        'Boutique stores',
        'Souvenir hunting',
        'Fashion shopping',
        'Antique shopping',
        'Craft markets',
        'Designer outlets'
      ],
      relaxation: [
        'Spa treatments',
        'Beach lounging',
        'Peaceful gardens',
        'Meditation sessions',
        'Yoga classes',
        'Wellness retreats',
        'Hot springs',
        'Scenic viewpoints'
      ],
      nightlife: [
        'Local bars and pubs',
        'Night markets',
        'Live music venues',
        'Dance clubs',
        'Evening cruises',
        'Rooftop lounges',
        'Night tours',
        'Entertainment shows'
      ]
    };

    this.timeSlots = [
      'Morning (9:00 AM - 12:00 PM)',
      'Afternoon (1:00 PM - 5:00 PM)',
      'Evening (6:00 PM - 9:00 PM)'
    ];
  }

  // Parse user message to understand intent
  parseUserIntent(message) {
    const lowerMessage = message.toLowerCase();
    
    // Extract day number
    const dayMatch = lowerMessage.match(/day\s+(\d+)/);
    const dayNumber = dayMatch ? parseInt(dayMatch[1]) : null;

    // Extract intent (replace, add, make more, etc.)
    let intent = 'modify';
    if (lowerMessage.includes('replace') || lowerMessage.includes('change')) {
      intent = 'replace';
    } else if (lowerMessage.includes('add') || lowerMessage.includes('include')) {
      intent = 'add';
    } else if (lowerMessage.includes('remove') || lowerMessage.includes('delete')) {
      intent = 'remove';
    } else if (lowerMessage.includes('more') || lowerMessage.includes('focus on')) {
      intent = 'enhance';
    }

    // Extract activity categories
    const categories = [];
    Object.keys(this.activityCategories).forEach(category => {
      if (lowerMessage.includes(category) || 
          (category === 'cultural' && (lowerMessage.includes('culture') || lowerMessage.includes('museum') || lowerMessage.includes('historic'))) ||
          (category === 'food' && (lowerMessage.includes('dining') || lowerMessage.includes('restaurant') || lowerMessage.includes('cuisine'))) ||
          (category === 'outdoor' && (lowerMessage.includes('nature') || lowerMessage.includes('outdoor') || lowerMessage.includes('hiking'))) ||
          (category === 'adventure' && (lowerMessage.includes('adventurous') || lowerMessage.includes('extreme') || lowerMessage.includes('thrilling')))) {
        categories.push(category);
      }
    });

    return {
      dayNumber,
      intent,
      categories,
      originalMessage: message
    };
  }

  // Generate new activities based on categories
  generateActivitiesForCategories(categories, destination, existingActivities = []) {
    const newActivities = [];
    
    categories.forEach(category => {
      const availableActivities = this.activityCategories[category];
      // Select 2-3 random activities from each category
      const selectedCount = Math.min(3, availableActivities.length);
      const selected = this.getRandomItems(availableActivities, selectedCount);
      
      selected.forEach((activity, index) => {
        newActivities.push({
          time: this.timeSlots[index % this.timeSlots.length],
          activity: `${activity} in ${destination}`,
          description: this.generateActivityDescription(activity, destination),
          category: category,
          duration: this.getActivityDuration(activity),
          cost: this.getActivityCost(activity)
        });
      });
    });

    return newActivities;
  }

  // Get random items from array
  getRandomItems(array, count) {
    const shuffled = array.sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
  }

  // Generate activity description
  generateActivityDescription(activity, destination) {
    const descriptions = {
      'Visit local museums': `Explore the rich history and culture at ${destination}'s renowned museums`,
      'Food market exploration': `Discover local flavors and ingredients at bustling markets in ${destination}`,
      'Nature hikes': `Experience the natural beauty surrounding ${destination} with guided hiking trails`,
      'Local bars and pubs': `Experience ${destination}'s nightlife scene at authentic local establishments`,
      'Shopping districts': `Browse unique local goods and international brands in ${destination}'s shopping areas`
    };
    
    return descriptions[activity] || `Enjoy ${activity.toLowerCase()} in the beautiful city of ${destination}`;
  }

  // Get activity duration
  getActivityDuration(activity) {
    const durations = {
      'Visit local museums': '2-3 hours',
      'Food market exploration': '1-2 hours',
      'Nature hikes': '3-4 hours',
      'Cooking classes': '2-3 hours',
      'Shopping districts': '2-4 hours'
    };
    
    return durations[activity] || '2-3 hours';
  }

  // Get activity cost estimate
  getActivityCost(activity) {
    const costs = {
      'Visit local museums': '$15-25',
      'Food market exploration': '$20-40',
      'Nature hikes': '$10-30',
      'Cooking classes': '$50-80',
      'Shopping districts': '$50-200+'
    };
    
    return costs[activity] || '$20-50';
  }

  // Process user request and modify itinerary
  processRequest(message, tripData) {
    const intent = this.parseUserIntent(message);
    
    if (!intent.dayNumber) {
      return {
        response: "I'd be happy to help! Please specify which day you'd like to modify (e.g., 'day 2', 'day 3', etc.)",
        dayModified: null,
        updatedActivities: null
      };
    }

    if (!intent.categories.length) {
      return {
        response: "I understand you want to modify day " + intent.dayNumber + ". Could you please specify what type of activities you're interested in? For example: cultural, food, outdoor, adventure, shopping, relaxation, or nightlife activities.",
        dayModified: null,
        updatedActivities: null
      };
    }

    // Generate new activities based on intent
    const destination = tripData.destination || "your destination";
    let updatedActivities = [];

    switch (intent.intent) {
      case 'replace':
        updatedActivities = this.generateActivitiesForCategories(intent.categories, destination);
        break;
        
      case 'add':
        // Get existing activities for the day
        const existingDay = tripData.activities && tripData.activities[intent.dayNumber - 1] 
          ? tripData.activities[intent.dayNumber - 1].activities 
          : [];
        const newActivities = this.generateActivitiesForCategories(intent.categories, destination);
        updatedActivities = [...existingDay, ...newActivities];
        break;
        
      case 'enhance':
        updatedActivities = this.generateActivitiesForCategories(intent.categories, destination);
        break;
        
      default:
        updatedActivities = this.generateActivitiesForCategories(intent.categories, destination);
    }

    // Generate response message
    const categoryNames = intent.categories.join(', ');
    let responseMessage = '';
    
    switch (intent.intent) {
      case 'replace':
        responseMessage = `Perfect! I've replaced day ${intent.dayNumber} with ${categoryNames} activities in ${destination}. Your day now focuses on these exciting experiences!`;
        break;
      case 'add':
        responseMessage = `Great! I've added ${categoryNames} activities to day ${intent.dayNumber}. You now have a nice mix of experiences for that day!`;
        break;
      case 'enhance':
        responseMessage = `Excellent! I've enhanced day ${intent.dayNumber} with more ${categoryNames} experiences in ${destination}. This should give you a richer ${categoryNames} experience!`;
        break;
      default:
        responseMessage = `I've updated day ${intent.dayNumber} with ${categoryNames} activities in ${destination}. Hope you love the new itinerary!`;
    }

    return {
      response: responseMessage,
      dayModified: intent.dayNumber,
      updatedActivities: updatedActivities
    };
  }
}

// Initialize AI chat service
const aiChatService = new AIChatService();

// Handle AI chat requests
const handleChatRequest = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: errors.array()
      });
    }

    const { message, tripData, conversationHistory } = req.body;

    if (!message || !tripData) {
      return res.status(400).json({
        success: false,
        message: 'Message and trip data are required'
      });
    }

    // Process the user's request
    const result = aiChatService.processRequest(message, tripData);

    res.json({
      success: true,
      response: result.response,
      dayModified: result.dayModified,
      updatedActivities: result.updatedActivities,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('AI Chat error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error during AI chat processing'
    });
  }
};

// Get chat suggestions
const getChatSuggestions = (req, res) => {
  try {
    const suggestions = [
      "Make day 2 more cultural",
      "Add food experiences to day 1",
      "Replace shopping with nature activities",
      "Make day 3 more adventurous",
      "Add relaxation activities to day 4",
      "Focus on nightlife for day 5",
      "Replace indoor activities with outdoor ones",
      "Add more local cultural experiences"
    ];

    res.json({
      success: true,
      suggestions: suggestions
    });
  } catch (error) {
    console.error('Error getting chat suggestions:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get chat suggestions'
    });
  }
};

module.exports = {
  handleChatRequest,
  getChatSuggestions,
  AIChatService
}; 