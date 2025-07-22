// Flight pricing data based on real market rates
const amadeusService = require('../services/amadeusService');
const config = require('../config/config');

const flightPricingData = {
  // Major departure cities with their airport codes and regions
  departureCities: {
    // North America
    "New York, NY (JFK)": { region: "northeast", timezone: "EST", hub: true },
    "Los Angeles, CA (LAX)": { region: "west", timezone: "PST", hub: true },
    "Chicago, IL (ORD)": { region: "midwest", timezone: "CST", hub: true },
    "San Francisco, CA (SFO)": { region: "west", timezone: "PST", hub: true },
    "Miami, FL (MIA)": { region: "southeast", timezone: "EST", hub: true },
    "Boston, MA (BOS)": { region: "northeast", timezone: "EST", hub: false },
    "Washington, DC (DCA)": { region: "northeast", timezone: "EST", hub: false },
    "Atlanta, GA (ATL)": { region: "southeast", timezone: "EST", hub: true },
    "Seattle, WA (SEA)": { region: "west", timezone: "PST", hub: false },
    "Denver, CO (DEN)": { region: "west", timezone: "MST", hub: true },
    "Phoenix, AZ (PHX)": { region: "west", timezone: "MST", hub: false },
    "Las Vegas, NV (LAS)": { region: "west", timezone: "PST", hub: false },
    "Dallas, TX (DFW)": { region: "south", timezone: "CST", hub: true },
    "Houston, TX (IAH)": { region: "south", timezone: "CST", hub: true },
    
    // Europe
    "London, UK (LHR)": { region: "europe", timezone: "GMT", hub: true },
    "Paris, France (CDG)": { region: "europe", timezone: "CET", hub: true },
    "Frankfurt, Germany (FRA)": { region: "europe", timezone: "CET", hub: true },
    "Amsterdam, Netherlands (AMS)": { region: "europe", timezone: "CET", hub: true },
    "Madrid, Spain (MAD)": { region: "europe", timezone: "CET", hub: false },
    "Rome, Italy (FCO)": { region: "europe", timezone: "CET", hub: false },
    "Zurich, Switzerland (ZUR)": { region: "europe", timezone: "CET", hub: false },
    
    // Asia Pacific
    "Tokyo, Japan (NRT)": { region: "asia", timezone: "JST", hub: true },
    "Singapore (SIN)": { region: "asia", timezone: "SGT", hub: true },
    "Hong Kong (HKG)": { region: "asia", timezone: "HKT", hub: true },
    "Sydney, Australia (SYD)": { region: "oceania", timezone: "AEST", hub: true },
    "Dubai, UAE (DXB)": { region: "middle_east", timezone: "GST", hub: true },
    
    // India
    "New Delhi, India (DEL)": { region: "india", timezone: "IST", hub: true },
    "Mumbai, India (BOM)": { region: "india", timezone: "IST", hub: true },
    "Bangalore, India (BLR)": { region: "india", timezone: "IST", hub: true },
    "Chennai, India (MAA)": { region: "india", timezone: "IST", hub: false },
    "Kolkata, India (CCU)": { region: "india", timezone: "IST", hub: false },
    "Hyderabad, India (HYD)": { region: "india", timezone: "IST", hub: false },
    "Pune, India (PNQ)": { region: "india", timezone: "IST", hub: false },
    "Ahmedabad, India (AMD)": { region: "india", timezone: "IST", hub: false }
  },

  // Base prices from major US/European cities (in USD)
  destinations: {
    // Europe
    "Paris, France": { base: 450, distance: "medium", popular: true, season_multiplier: 1.2 },
    "London, United Kingdom": { base: 400, distance: "medium", popular: true, season_multiplier: 1.15 },
    "Rome, Italy": { base: 480, distance: "medium", popular: true, season_multiplier: 1.3 },
    "Barcelona, Spain": { base: 420, distance: "medium", popular: true, season_multiplier: 1.25 },
    "Amsterdam, Netherlands": { base: 380, distance: "medium", popular: true, season_multiplier: 1.1 },
    "Prague, Czech Republic": { base: 350, distance: "medium", popular: true, season_multiplier: 1.05 },
    "Vienna, Austria": { base: 390, distance: "medium", popular: false, season_multiplier: 1.1 },
    "Berlin, Germany": { base: 370, distance: "medium", popular: true, season_multiplier: 1.1 },
    "Santorini, Greece": { base: 520, distance: "medium", popular: true, season_multiplier: 1.4 },
    "Venice, Italy": { base: 460, distance: "medium", popular: true, season_multiplier: 1.3 },
    "Reykjavik, Iceland": { base: 280, distance: "short", popular: true, season_multiplier: 1.0 },
    "Istanbul, Turkey": { base: 550, distance: "long", popular: true, season_multiplier: 1.2 },
    "Lisbon, Portugal": { base: 400, distance: "medium", popular: true, season_multiplier: 1.15 },
    "Edinburgh, Scotland": { base: 380, distance: "medium", popular: true, season_multiplier: 1.1 },

    // Asia
    "Tokyo, Japan": { base: 750, distance: "long", popular: true, season_multiplier: 1.2 },
    "Bali, Indonesia": { base: 850, distance: "long", popular: true, season_multiplier: 1.3 },
    "Bangkok, Thailand": { base: 680, distance: "long", popular: true, season_multiplier: 1.1 },
    "Singapore, Singapore": { base: 720, distance: "long", popular: true, season_multiplier: 1.15 },
    "Seoul, South Korea": { base: 780, distance: "long", popular: true, season_multiplier: 1.1 },
    "Dubai, UAE": { base: 650, distance: "long", popular: true, season_multiplier: 1.2 },
    "Kyoto, Japan": { base: 760, distance: "long", popular: true, season_multiplier: 1.2 },
    "Hong Kong, Hong Kong": { base: 700, distance: "long", popular: true, season_multiplier: 1.15 },
    "Mumbai, India": { base: 620, distance: "long", popular: false, season_multiplier: 1.05 },
    "Phuket, Thailand": { base: 720, distance: "long", popular: true, season_multiplier: 1.25 },
    "Maldives, Maldives": { base: 950, distance: "long", popular: true, season_multiplier: 1.4 },

    // North America
    "New York, United States": { base: 250, distance: "short", popular: true, season_multiplier: 1.1 },
    "Los Angeles, United States": { base: 180, distance: "short", popular: true, season_multiplier: 1.05 },
    "San Francisco, United States": { base: 200, distance: "short", popular: true, season_multiplier: 1.1 },
    "Las Vegas, United States": { base: 150, distance: "short", popular: true, season_multiplier: 1.2 },
    "Toronto, Canada": { base: 220, distance: "short", popular: true, season_multiplier: 1.0 },
    "Vancouver, Canada": { base: 240, distance: "short", popular: true, season_multiplier: 1.05 },
    "Miami, United States": { base: 190, distance: "short", popular: true, season_multiplier: 1.15 },
    "Chicago, United States": { base: 170, distance: "short", popular: true, season_multiplier: 1.0 },
    "Cancun, Mexico": { base: 320, distance: "medium", popular: true, season_multiplier: 1.3 },

    // South America
    "Rio de Janeiro, Brazil": { base: 580, distance: "long", popular: true, season_multiplier: 1.2 },
    "Buenos Aires, Argentina": { base: 620, distance: "long", popular: true, season_multiplier: 1.1 },
    "Lima, Peru": { base: 450, distance: "medium", popular: true, season_multiplier: 1.15 },

    // Africa
    "Cape Town, South Africa": { base: 850, distance: "long", popular: true, season_multiplier: 1.2 },
    "Marrakech, Morocco": { base: 520, distance: "medium", popular: true, season_multiplier: 1.25 },
    "Cairo, Egypt": { base: 580, distance: "long", popular: true, season_multiplier: 1.1 },

    // Oceania
    "Sydney, Australia": { base: 950, distance: "long", popular: true, season_multiplier: 1.15 },
    "Melbourne, Australia": { base: 920, distance: "long", popular: true, season_multiplier: 1.1 },
    "Auckland, New Zealand": { base: 880, distance: "long", popular: true, season_multiplier: 1.1 },

    // Central America
    "Costa Rica, Costa Rica": { base: 380, distance: "medium", popular: true, season_multiplier: 1.2 },

    // India
    "Mumbai, India": { base: 650, distance: "long", popular: true, season_multiplier: 1.1 },
    "New Delhi, India": { base: 680, distance: "long", popular: true, season_multiplier: 1.15 },
    "Bangalore, India": { base: 720, distance: "long", popular: true, season_multiplier: 1.1 },
    "Chennai, India": { base: 660, distance: "long", popular: false, season_multiplier: 1.05 },
    "Kolkata, India": { base: 640, distance: "long", popular: false, season_multiplier: 1.0 },
    "Hyderabad, India": { base: 690, distance: "long", popular: false, season_multiplier: 1.05 },
    "Jaipur, India": { base: 620, distance: "long", popular: true, season_multiplier: 1.2 },
    "Cochin, India": { base: 670, distance: "long", popular: true, season_multiplier: 1.25 },
    "Varanasi, India": { base: 580, distance: "long", popular: true, season_multiplier: 1.15 }
  },

  // Route distance multipliers based on departure-destination pairs
  getRouteMultiplier: function(departureCity, destination) {
    const departureCityData = this.departureCities[departureCity];
    const destinationData = this.destinations[destination];
    
    if (!departureCityData || !destinationData) return 1.0;
    
    // Same region routes are cheaper
    if (departureCityData.region === this.getDestinationRegion(destination)) {
      return 0.85;
    }
    
    // Special pricing for Indian departures to Asian destinations
    if (departureCityData.region === "india") {
      const destRegion = this.getDestinationRegion(destination);
      if (destRegion === "asia" || destRegion === "middle_east") {
        return 0.75; // Better rates for nearby Asian destinations
      }
      if (destRegion === "europe") {
        return 0.90; // Slightly better rates to Europe via Gulf carriers
      }
    }
    
    // Hub cities generally have better rates
    if (departureCityData.hub) {
      return 0.95;
    }
    
    return 1.0;
  },

  getDestinationRegion: function(destination) {
    const regionMap = {
      "Europe": ["Paris, France", "London, United Kingdom", "Rome, Italy", "Barcelona, Spain", 
                "Amsterdam, Netherlands", "Prague, Czech Republic", "Vienna, Austria", "Berlin, Germany",
                "Santorini, Greece", "Venice, Italy", "Reykjavik, Iceland", "Istanbul, Turkey",
                "Lisbon, Portugal", "Edinburgh, Scotland"],
      "Asia": ["Tokyo, Japan", "Bali, Indonesia", "Bangkok, Thailand", "Singapore, Singapore",
               "Seoul, South Korea", "Kyoto, Japan", "Hong Kong, Hong Kong", 
               "Phuket, Thailand"],
      "India": ["Mumbai, India", "New Delhi, India", "Bangalore, India", "Chennai, India", 
               "Kolkata, India", "Hyderabad, India", "Pune, India", "Ahmedabad, India",
               "Jaipur, India", "Cochin, India", "Varanasi, India"],
      "Middle East": ["Dubai, UAE"],
      "North America": ["New York, United States", "Los Angeles, United States", "San Francisco, United States",
                       "Las Vegas, United States", "Toronto, Canada", "Vancouver, Canada",
                       "Miami, United States", "Chicago, United States"],
      "Central America": ["Cancun, Mexico", "Costa Rica, Costa Rica"],
      "South America": ["Rio de Janeiro, Brazil", "Buenos Aires, Argentina", "Lima, Peru"],
      "Africa": ["Cape Town, South Africa", "Marrakech, Morocco", "Cairo, Egypt"],
      "Oceania": ["Sydney, Australia", "Melbourne, Australia", "Auckland, New Zealand"],
      "Special": ["Maldives, Maldives"]
    };
    
    for (const [region, destinations] of Object.entries(regionMap)) {
      if (destinations.includes(destination)) {
        return region.toLowerCase().replace(" ", "_");
      }
    }
    return "international";
  },

  // Class multipliers
  classMultipliers: {
    economy: 1.0,
    premium: 1.8,
    business: 3.2,
    first: 5.5
  },

  // Route type multipliers
  routeMultipliers: {
    direct: 1.0,
    oneStop: 0.85,
    multiStop: 0.75
  },

  // Booking timing multipliers
  bookingMultipliers: {
    advance: 0.9,      // 2+ months ahead
    normal: 1.0,       // 1-2 months ahead
    lastMinute: 1.4    // Less than 2 weeks
  },

  // Seasonal pricing (current approximation)
  getCurrentSeasonMultiplier: function() {
    const month = new Date().getMonth() + 1; // 1-12
    if (month >= 6 && month <= 8) return 1.3; // Summer peak
    if (month >= 12 || month <= 2) return 1.2; // Winter holidays
    if (month >= 3 && month <= 5) return 1.1; // Spring
    return 1.0; // Fall
  }
};

// Generate realistic flight options for a destination
const generateFlightOptions = async (destination, budget, travelers, departureCity = "New York, NY (JFK)") => {
  
  // Try to get real flight data from Amadeus API first
  if (config.useRealFlightData && amadeusService.isConfigured()) {
    try {
      // Calculate departure date (7 days from now for demo)
      const departureDate = new Date();
      departureDate.setDate(departureDate.getDate() + 7);
      const formattedDate = departureDate.toISOString().split('T')[0];
      
      console.log(`Trying Amadeus API for: ${departureCity} -> ${destination}`);
      
      const realFlightOffers = await amadeusService.searchFlightOffers(
        departureCity,
        destination,
        formattedDate,
        parseInt(travelers) || 1
      );
      
      if (realFlightOffers && realFlightOffers.length > 0) {
        console.log(`Found ${realFlightOffers.length} real flight offers`);
        
        // Add budget validation to real flight data
        const validatedOffers = validateFlightBudget(realFlightOffers, budget, travelers);
        return validatedOffers;
      } else {
        console.log('No real flight offers found, falling back to simulated data');
      }
    } catch (error) {
      console.error('Error fetching real flight data:', error.message);
      console.log('Falling back to simulated pricing system');
    }
  } else {
    console.log('Real flight data disabled or not configured, using simulated pricing');
  }
  
  // Fallback to our existing pricing system
  return generateSimulatedFlightOptions(destination, budget, travelers, departureCity);
};

// Separate function for our simulated pricing system (renamed from original)
const generateSimulatedFlightOptions = (destination, budget, travelers, departureCity = "New York, NY (JFK)") => {
  const destinationData = flightPricingData.destinations[destination];
  
  // Fallback for unknown destinations
  if (!destinationData) {
    const basePrice = 500; // Default base price
    const seasonMultiplier = flightPricingData.getCurrentSeasonMultiplier();
    const routeMultiplier = flightPricingData.getRouteMultiplier(departureCity, destination);
    
    return [
      {
        id: "economy",
        airline: "SkyConnect Airlines",
        type: "Economy Class",
        route: `${departureCity} → ${destination}`,
        duration: "12h 30m (1 stop)",
        cost: Math.round(basePrice * seasonMultiplier * routeMultiplier),
        departure: "08:30 AM",
        arrival: "11:00 PM (+1 day)",
        stopover: "Frankfurt (2h 15m)",
        aircraft: "Boeing 787-9",
        baggage: "23kg checked, 7kg carry-on",
        meals: "2 meals included",
        entertainment: "Personal screen with 1000+ movies",
        bookingLink: "https://skyconnect.com/book/flight123",
        isRealData: false
      }
    ];
  }

  const basePrice = destinationData.base;
  const seasonMultiplier = flightPricingData.getCurrentSeasonMultiplier();
  const popularityMultiplier = destinationData.popular ? 1.1 : 0.95;
  const destinationSeasonMultiplier = destinationData.season_multiplier;
  const routeMultiplier = flightPricingData.getRouteMultiplier(departureCity, destination);

  // Calculate base pricing with all factors
  const adjustedBasePrice = basePrice * seasonMultiplier * popularityMultiplier * destinationSeasonMultiplier * routeMultiplier;

  // Generate flight options with realistic pricing
  const flightOptions = [
    {
      id: "economy",
      airline: "SkyConnect Airlines",
      type: "Economy Class",
      route: `${departureCity} → ${destination}`,
      duration: destinationData.distance === "short" ? "3h 45m (Direct)" : 
                destinationData.distance === "medium" ? "8h 30m (1 stop)" : "14h 30m (1 stop)",
      cost: Math.round(adjustedBasePrice * flightPricingData.classMultipliers.economy * flightPricingData.routeMultipliers.oneStop),
      departure: "08:30 AM",
      arrival: destinationData.distance === "short" ? "12:15 PM (same day)" : 
                destinationData.distance === "medium" ? "5:00 PM (same day)" : "11:00 PM (+1 day)",
      stopover: destinationData.distance === "short" ? "Direct flight" : 
                destinationData.distance === "medium" ? "Frankfurt (1h 45m)" : "Singapore (2h 30m)",
      aircraft: "Boeing 787-9",
      baggage: "23kg checked, 7kg carry-on",
      meals: destinationData.distance === "short" ? "Snacks and beverages" : "2 meals included",
      entertainment: "Personal screen with 1000+ movies",
      bookingLink: "https://skyconnect.com/book/flight123",
      isRealData: false
    },
    {
      id: "premium",
      airline: "Premium Airways",
      type: "Premium Economy",
      route: `${departureCity} → ${destination}`,
      duration: destinationData.distance === "short" ? "3h 30m (Direct)" : 
                destinationData.distance === "medium" ? "7h 45m (Direct)" : "12h 45m (Direct)",
      cost: Math.round(adjustedBasePrice * flightPricingData.classMultipliers.premium * flightPricingData.routeMultipliers.direct),
      departure: "10:15 AM",
      arrival: destinationData.distance === "short" ? "1:45 PM (same day)" : 
                destinationData.distance === "medium" ? "6:00 PM (same day)" : "11:00 PM (same day)",
      stopover: "Direct flight",
      aircraft: "Airbus A350-900",
      baggage: "32kg checked, 10kg carry-on",
      meals: destinationData.distance === "short" ? "Premium snacks and drinks" : "3 premium meals + snacks",
      entertainment: "Large personal screen, noise-canceling headphones",
      bookingLink: "https://premiumairways.com/book/flight456",
      isRealData: false
    },
    {
      id: "business",
      airline: "Luxury Airlines",
      type: "Business Class",
      route: `${departureCity} → ${destination}`,
      duration: destinationData.distance === "short" ? "3h 20m (Direct)" : 
                destinationData.distance === "medium" ? "7h 20m (Direct)" : "11h 20m (Direct)",
      cost: Math.round(adjustedBasePrice * flightPricingData.classMultipliers.business * flightPricingData.routeMultipliers.direct),
      departure: "09:45 AM",
      arrival: destinationData.distance === "short" ? "1:05 PM (same day)" : 
                destinationData.distance === "medium" ? "5:05 PM (same day)" : "9:05 PM (same day)",
      stopover: "Direct flight",
      aircraft: destinationData.distance === "long" ? "Boeing 777-300ER" : "Airbus A321",
      baggage: "40kg checked, 14kg carry-on",
      meals: "Gourmet dining, premium beverages",
      entertainment: "Lie-flat seats, premium entertainment system",
      bookingLink: "https://luxuryairlines.com/book/flight789",
      isRealData: false
    }
  ];

  // Add budget-conscious option for expensive destinations
  if (adjustedBasePrice > 600) {
    flightOptions.unshift({
      id: "budget",
      airline: "Budget Connect",
      type: "Economy Basic",
      route: `${departureCity} → ${destination}`,
      duration: destinationData.distance === "short" ? "5h 15m (1 stop)" : 
                destinationData.distance === "medium" ? "12h 30m (2 stops)" : "18h 45m (2 stops)",
      cost: Math.round(adjustedBasePrice * 0.7 * flightPricingData.routeMultipliers.multiStop),
      departure: "05:30 AM",
      arrival: destinationData.distance === "short" ? "10:45 AM (same day)" : 
                destinationData.distance === "medium" ? "6:00 PM (same day)" : "12:15 PM (+1 day)",
      stopover: destinationData.distance === "short" ? "Chicago (1h 30m)" : 
                destinationData.distance === "medium" ? "Chicago (2h), Frankfurt (1h 45m)" : "Chicago (3h), Frankfurt (2h 30m)",
      aircraft: "Boeing 737-800",
      baggage: "15kg checked, 7kg carry-on",
      meals: "Meals available for purchase",
      entertainment: "Overhead screens, WiFi available",
      bookingLink: "https://budgetconnect.com/book/flight101",
      isRealData: false
    });
  }

  return flightOptions;
};

// Check if flight pricing fits within budget
const validateFlightBudget = (flightOptions, totalBudget, travelers) => {
  const maxFlightBudget = totalBudget * 0.5; // Max 50% of budget for flights
  const travelerCount = parseInt(travelers) || 1;
  
  return flightOptions.map(option => ({
    ...option,
    totalCost: option.cost * travelerCount,
    withinBudget: (option.cost * travelerCount) <= maxFlightBudget,
    budgetPercentage: Math.round(((option.cost * travelerCount) / totalBudget) * 100)
  }));
};

// Get flight price insights
const getFlightPriceInsights = (destination, flightOptions) => {
  const destinationData = flightPricingData.destinations[destination];
  
  if (!destinationData) {
    return {
      priceRange: "Standard pricing",
      bestTime: "Book 2-8 weeks in advance for best rates",
      seasonality: "Prices may vary by season"
    };
  }

  const insights = {
    priceRange: destinationData.distance === "short" ? "Domestic/Short-haul rates" :
                destinationData.distance === "medium" ? "Medium-haul international rates" :
                "Long-haul international rates",
    bestTime: destinationData.distance === "long" ? "Book 2-3 months in advance" : "Book 3-8 weeks in advance",
    seasonality: destinationData.season_multiplier > 1.2 ? "Peak season destination - expect higher prices" :
                 destinationData.season_multiplier > 1.1 ? "Popular season - moderate price increase" :
                 "Off-peak pricing available"
  };

  // Add current season info
  const currentSeason = flightPricingData.getCurrentSeasonMultiplier();
  if (currentSeason > 1.2) {
    insights.currentSeason = "Peak travel season - prices are elevated";
  } else if (currentSeason > 1.1) {
    insights.currentSeason = "Busy season - moderate price increase";
  } else {
    insights.currentSeason = "Good time to book - reasonable prices";
  }

  return insights;
};

// Get list of available departure cities
const getDepartureCities = () => {
  return Object.keys(flightPricingData.departureCities).map(city => ({
    city,
    region: flightPricingData.departureCities[city].region,
    timezone: flightPricingData.departureCities[city].timezone,
    isHub: flightPricingData.departureCities[city].hub
  }));
};

// Get popular departure cities (hubs)
const getPopularDepartureCities = () => {
  return Object.keys(flightPricingData.departureCities)
    .filter(city => flightPricingData.departureCities[city].hub)
    .map(city => ({
      city,
      region: flightPricingData.departureCities[city].region,
      timezone: flightPricingData.departureCities[city].timezone,
      isHub: true
    }));
};

module.exports = {
  generateFlightOptions,
  validateFlightBudget,
  getFlightPriceInsights,
  getDepartureCities,
  getPopularDepartureCities,
  flightPricingData
}; 