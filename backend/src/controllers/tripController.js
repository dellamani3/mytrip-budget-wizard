const { validationResult } = require('express-validator');
const Trip = require('../models/Trip');
const { generateFlightOptions, validateFlightBudget, getFlightPriceInsights } = require('./flightPricingController');

// AI Trip Generation Simulation
const generateTripPlan = async (tripData) => {
  const { destination, budget, travelers, duration, travelStyle, departureCity } = tripData;
  
  // Default departure city if not provided
  const selectedDepartureCity = departureCity || "New York, NY (JFK)";
  
  // Simulate AI processing delay
  const destinations = destination 
    ? [destination] 
    : [
        'Bali, Indonesia', 'Paris, France', 'Tokyo, Japan', 'Barcelona, Spain',
        'Santorini, Greece', 'Dubai, UAE', 'Bangkok, Thailand', 'New York, United States',
        'Rome, Italy', 'Reykjavik, Iceland', 'Marrakech, Morocco', 'Costa Rica, Costa Rica'
      ];

  const selectedDestination = destination || destinations[Math.floor(Math.random() * destinations.length)];
  
  try {
    // Generate realistic flight options using the new pricing system with departure city
    const flightOptions = await generateFlightOptions(selectedDestination, budget, travelers, selectedDepartureCity);
    const flightOptionsWithBudget = validateFlightBudget(flightOptions, budget, travelers);
    const flightInsights = getFlightPriceInsights(selectedDestination, flightOptions);

    // Calculate remaining budget after accounting for flights (using cheapest option)
    const cheapestFlight = flightOptions.reduce((min, flight) => 
      flight.cost < min.cost ? flight : min, flightOptions[0]);
    const flightCost = cheapestFlight.cost * (parseInt(travelers) || 1);
    const remainingBudget = budget - flightCost;

    // Budget allocation for remaining expenses
    const budgetAllocation = {
      flights: flightCost,
      accommodation: Math.floor(remainingBudget * 0.45), // 45% of remaining budget
      activities: Math.floor(remainingBudget * 0.30),    // 30% of remaining budget
      food: Math.floor(remainingBudget * 0.15),          // 15% of remaining budget
      transport: Math.floor(remainingBudget * 0.10)      // 10% of remaining budget
    };

    // Generate accommodation options
    const accommodationOptions = [
      {
        id: "budget",
        name: "Cozy Beach Hostel",
        type: "3-star boutique hostel",
        cost: Math.floor(budgetAllocation.accommodation * 0.6),
        amenities: ["Pool", "Free WiFi", "Beach Access"],
        location: "Central Area",
        description: "A charming hostel with modern amenities and vibrant social atmosphere",
        roomType: "Shared dormitory (4-bed)",
        checkIn: "2:00 PM",
        checkOut: "11:00 AM",
        included: ["Free breakfast", "Beach towels", "Luggage storage"],
        facilities: ["24/7 reception", "Laundry service", "Tour desk", "Bicycle rental"],
        distance: "50m from beach, 5 min walk to restaurants",
        cancellation: "Free cancellation up to 24 hours",
        rating: "4.2/5 (Based on 1,250 reviews)",
        bookingLink: "https://beachhostel.com/book/room123"
      },
      {
        id: "standard",
        name: "Tropical Paradise Resort",
        type: "4-star beachfront resort",
        cost: budgetAllocation.accommodation,
        amenities: ["Pool", "Spa", "Beach Access", "Free WiFi"],
        location: "Premium Beach Area",
        description: "Elegant resort offering perfect blend of comfort and traditional hospitality",
        roomType: "Deluxe Ocean View Room",
        checkIn: "3:00 PM",
        checkOut: "12:00 PM",
        included: ["Daily breakfast", "Airport shuttle", "Welcome drink", "Beach activities"],
        facilities: ["3 restaurants", "Infinity pool", "Spa & wellness center", "Kids club", "Fitness center"],
        distance: "Beachfront location, 15 min to shopping center",
        cancellation: "Free cancellation up to 48 hours",
        rating: "4.6/5 (Based on 2,180 reviews)",
        bookingLink: "https://tropicalparadise.com/book/room456"
      },
      {
        id: "luxury",
        name: "Royal Ocean Villa",
        type: "5-star luxury villa",
        cost: Math.floor(budgetAllocation.accommodation * 1.8),
        amenities: ["Private Pool", "Spa", "Butler Service", "Beach Access", "Free WiFi", "Restaurant"],
        location: "Exclusive Cliffs",
        description: "Ultra-luxurious private villa with breathtaking ocean views and personalized butler service",
        roomType: "Private Villa with Ocean View",
        checkIn: "2:00 PM",
        checkOut: "1:00 PM",
        included: ["Personal butler", "Private chef available", "Luxury transfers", "Spa treatments", "All meals"],
        facilities: ["Private infinity pool", "Home theater", "Wine cellar", "Private beach access", "Helipad"],
        distance: "Private beach access, helicopter transfers available",
        cancellation: "Free cancellation up to 7 days",
        rating: "4.9/5 (Based on 850 reviews)",
        bookingLink: "https://royaloceanvilla.com/book/villa789"
      }
    ];

    // Generate activities based on travel style
    const activityTypes = {
      adventure: ["adventure", "nature", "sports"],
      cultural: ["culture", "history", "art"],
      relaxation: ["wellness", "beach", "spa"],
      luxury: ["fine_dining", "shopping", "exclusive"],
      budget: ["free", "local", "walking"]
    };

    const selectedActivityTypes = activityTypes[travelStyle] || ["culture", "nature", "food"];
    const activitiesPerDay = Math.min(7, parseInt(String(duration).split('-')[0]) || 5);
    
    const activities = [];
    for (let day = 1; day <= activitiesPerDay; day++) {
      const activityType = selectedActivityTypes[Math.floor(Math.random() * selectedActivityTypes.length)];
      const activityCost = Math.floor((budgetAllocation.activities / activitiesPerDay) * (0.5 + Math.random()));
      
      activities.push({
        day,
        title: generateActivityTitle(activityType),
        cost: activityCost,
        type: activityType
      });
    }

    return {
      destination: selectedDestination,
      duration,
      travelers,
      budgetAllocation,
      flightOptions: flightOptionsWithBudget, // Use the validated flight options
      accommodationOptions,
      activities,
      totalActivitiesCost: activities.reduce((sum, act) => sum + act.cost, 0),
      flightInsights, // Add flight pricing insights
      recommendations: {
        bestTime: "April to October (peak season)",
        weather: "Tropical climate, average 28°C",
        currency: "Local Currency",
        language: "English widely spoken",
        timezone: "+8 GMT"
      },
      generatedAt: new Date().toISOString(),
      dataSource: flightOptions.some(f => f.isRealData) ? "real_api_data" : "simulated_data"
    };
  } catch (error) {
    console.error('Error in generateTripPlan:', error);
    throw new Error('Trip generation failed. Please try again.');
  }
};

// Generate a new trip plan
const generateTrip = async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { destination, budget, travelers, duration, travelStyle, specialRequirements, departureCity } = req.body;
    const userId = req.user.id;

    // Generate AI trip plan
    const generatedTrip = await generateTripPlan({
      destination,
      budget: parseFloat(budget),
      travelers,
      duration,
      travelStyle,
      specialRequirements,
      departureCity
    });

    // Save trip to database
    const savedTrip = await Trip.create({
      userId,
      destination: generatedTrip.destination,
      budget: parseFloat(budget),
      travelers,
      duration,
      travelStyle,
      specialRequirements,
      tripData: generatedTrip
    });

    res.status(201).json({
      success: true,
      message: 'Trip generated successfully',
      data: {
        trip: savedTrip.toJSON()
      }
    });

  } catch (error) {
    console.error('Trip generation error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error during trip generation'
    });
  }
};

// Helper function to generate activity titles
const generateActivityTitle = (activityType) => {
  const activityTitles = {
    adventure: [
      "Mountain Hiking & Sunrise Trek",
      "White Water Rafting Adventure", 
      "Rock Climbing & Rappelling",
      "Jungle Zip-lining Experience",
      "Scuba Diving Expedition",
      "Paragliding Over Valleys",
      "Off-road ATV Adventure"
    ],
    culture: [
      "Historic Temple & Museum Tour",
      "Traditional Cooking Class",
      "Local Art & Craft Workshop", 
      "Cultural Dance Performance",
      "Heritage Walking Tour",
      "Traditional Market Experience",
      "Local Festival Participation"
    ],
    history: [
      "Ancient Architecture Tour",
      "Historical Sites Exploration",
      "War Memorial & Museum Visit",
      "Archaeological Site Discovery",
      "Colonial Heritage Walk"
    ],
    art: [
      "Local Gallery & Artist Studio Tour",
      "Traditional Craft Workshop",
      "Street Art & Mural Discovery",
      "Contemporary Art Museum Visit",
      "Artisan Market Exploration"
    ],
    wellness: [
      "Beach Day & Spa Treatment",
      "Yoga & Meditation Session",
      "Hot Springs & Wellness",
      "Ayurvedic Massage & Therapy",
      "Mindfulness & Nature Therapy"
    ],
    beach: [
      "Luxury Resort Pool Day",
      "Beach Massage & Cocktails", 
      "Sunset Cruise & Dinner",
      "Water Sports & Snorkeling",
      "Beachside Dining Experience"
    ],
    spa: [
      "Full Day Spa & Wellness Package",
      "Traditional Healing & Spa",
      "Couples Massage & Relaxation",
      "Detox & Rejuvenation Program",
      "Luxury Spa & Beauty Treatment"
    ],
    fine_dining: [
      "Michelin Star Restaurant Experience",
      "Wine Tasting & Gourmet Dinner",
      "Chef's Table & Culinary Journey",
      "Private Dining with Local Chef",
      "Rooftop Restaurant & City Views"
    ],
    shopping: [
      "Luxury Shopping Districts Tour",
      "Designer Boutique & Fashion Walk",
      "Local Markets & Artisan Shopping",
      "Vintage & Antique Hunting",
      "Shopping Mall & Entertainment"
    ],
    exclusive: [
      "Private Yacht Charter Experience",
      "Helicopter City Tour",
      "VIP Cultural Site Access",
      "Private Guide & Exclusive Tour",
      "Celebrity Chef Cooking Class"
    ],
    nature: [
      "National Park & Wildlife Safari",
      "Botanical Garden & Nature Walk",
      "Bird Watching & Photography",
      "Waterfall Hike & Swimming",
      "Scenic Nature Trail & Picnic"
    ],
    sports: [
      "Golf Course & Country Club",
      "Tennis & Racquet Sports",
      "Cycling Tour & Adventure",
      "Water Sports & Activities",
      "Fitness & Outdoor Training"
    ],
    free: [
      "Free Walking Tour of City",
      "Public Park & Garden Visit",
      "Free Museum Day Exploration",
      "Street Performance & Art",
      "Local Community Event"
    ],
    local: [
      "Local Neighborhood Exploration",
      "Community Market Visit",
      "Traditional Craft Demonstration", 
      "Local Family Home Visit",
      "Authentic Street Food Tour"
    ],
    walking: [
      "Historic City Center Walk",
      "Architectural Heritage Tour",
      "Local Neighborhood Discovery",
      "Self-Guided Cultural Walk",
      "Scenic Waterfront Promenade"
    ]
  };
  
  const titles = activityTitles[activityType] || activityTitles.culture;
  return titles[Math.floor(Math.random() * titles.length)];
};

// Get user's trips
const getUserTrips = async (req, res) => {
  try {
    const userId = req.user.id;
    const limit = parseInt(req.query.limit) || 10;

    const trips = await Trip.findByUserId(userId, limit);
    const stats = await Trip.getUserTripStats(userId);

    res.json({
      success: true,
      data: {
        trips,
        stats
      }
    });

  } catch (error) {
    console.error('Get trips error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error while fetching trips'
    });
  }
};

// Get specific trip by ID
const getTripById = async (req, res) => {
  try {
    const { tripId } = req.params;
    const userId = req.user.id;

    const trip = await Trip.findByIdAndUserId(tripId, userId);

    if (!trip) {
      return res.status(404).json({
        success: false,
        message: 'Trip not found'
      });
    }

    res.json({
      success: true,
      data: {
        trip: trip.toJSON()
      }
    });

  } catch (error) {
    console.error('Get trip by ID error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error while fetching trip'
    });
  }
};

// Update trip
const updateTrip = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { tripId } = req.params;
    const userId = req.user.id;
    const { destination, budget, travelers, duration, travelStyle, specialRequirements, departureCity } = req.body;

    const trip = await Trip.findByIdAndUserId(tripId, userId);

    if (!trip) {
      return res.status(404).json({
        success: false,
        message: 'Trip not found'
      });
    }

    // Regenerate trip plan with new parameters
    const updatedTripData = await generateTripPlan({
      destination,
      budget: parseFloat(budget),
      travelers,
      duration,
      travelStyle,
      specialRequirements,
      departureCity
    });

    const updated = await trip.update({
      destination: updatedTripData.destination,
      budget: parseFloat(budget),
      travelers,
      duration,
      travelStyle,
      specialRequirements,
      tripData: updatedTripData
    });

    if (updated) {
      const updatedTrip = await Trip.findByIdAndUserId(tripId, userId);
      
      res.json({
        success: true,
        message: 'Trip updated successfully',
        data: {
          trip: updatedTrip.toJSON()
        }
      });
    } else {
      res.status(400).json({
        success: false,
        message: 'Failed to update trip'
      });
    }

  } catch (error) {
    console.error('Update trip error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error during trip update'
    });
  }
};

// Delete trip
const deleteTrip = async (req, res) => {
  try {
    const { tripId } = req.params;
    const userId = req.user.id;

    const trip = await Trip.findByIdAndUserId(tripId, userId);

    if (!trip) {
      return res.status(404).json({
        success: false,
        message: 'Trip not found'
      });
    }

    const deleted = await trip.delete();

    if (deleted) {
      res.json({
        success: true,
        message: 'Trip deleted successfully'
      });
    } else {
      res.status(400).json({
        success: false,
        message: 'Failed to delete trip'
      });
    }

  } catch (error) {
    console.error('Delete trip error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error during trip deletion'
    });
  }
};

module.exports = {
  generateTrip,
  getUserTrips,
  getTripById,
  updateTrip,
  deleteTrip
}; 