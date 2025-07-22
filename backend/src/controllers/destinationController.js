// Popular destinations database
const destinations = [
  // Europe
  { id: 1, name: "Paris", country: "France", region: "Europe", popular: true },
  { id: 2, name: "London", country: "United Kingdom", region: "Europe", popular: true },
  { id: 3, name: "Rome", country: "Italy", region: "Europe", popular: true },
  { id: 4, name: "Barcelona", country: "Spain", region: "Europe", popular: true },
  { id: 5, name: "Amsterdam", country: "Netherlands", region: "Europe", popular: true },
  { id: 6, name: "Prague", country: "Czech Republic", region: "Europe", popular: true },
  { id: 7, name: "Vienna", country: "Austria", region: "Europe", popular: true },
  { id: 8, name: "Berlin", country: "Germany", region: "Europe", popular: true },
  { id: 9, name: "Santorini", country: "Greece", region: "Europe", popular: true },
  { id: 10, name: "Venice", country: "Italy", region: "Europe", popular: true },
  
  // Asia
  { id: 11, name: "Tokyo", country: "Japan", region: "Asia", popular: true },
  { id: 12, name: "Bali", country: "Indonesia", region: "Asia", popular: true },
  { id: 13, name: "Bangkok", country: "Thailand", region: "Asia", popular: true },
  { id: 14, name: "Singapore", country: "Singapore", region: "Asia", popular: true },
  { id: 15, name: "Seoul", country: "South Korea", region: "Asia", popular: true },
  { id: 16, name: "Dubai", country: "UAE", region: "Asia", popular: true },
  { id: 17, name: "Kyoto", country: "Japan", region: "Asia", popular: true },
  { id: 18, name: "Hong Kong", country: "Hong Kong", region: "Asia", popular: true },
  { id: 19, name: "Mumbai", country: "India", region: "Asia", popular: true },
  { id: 20, name: "Phuket", country: "Thailand", region: "Asia", popular: true },
  
  // North America
  { id: 21, name: "New York", country: "United States", region: "North America", popular: true },
  { id: 22, name: "Los Angeles", country: "United States", region: "North America", popular: true },
  { id: 23, name: "San Francisco", country: "United States", region: "North America", popular: true },
  { id: 24, name: "Las Vegas", country: "United States", region: "North America", popular: true },
  { id: 25, name: "Toronto", country: "Canada", region: "North America", popular: true },
  { id: 26, name: "Vancouver", country: "Canada", region: "North America", popular: true },
  { id: 27, name: "Miami", country: "United States", region: "North America", popular: true },
  { id: 28, name: "Chicago", country: "United States", region: "North America", popular: true },
  { id: 29, name: "Mexico City", country: "Mexico", region: "North America", popular: false },
  { id: 30, name: "Cancun", country: "Mexico", region: "North America", popular: true },
  
  // South America
  { id: 31, name: "Rio de Janeiro", country: "Brazil", region: "South America", popular: true },
  { id: 32, name: "Buenos Aires", country: "Argentina", region: "South America", popular: true },
  { id: 33, name: "Lima", country: "Peru", region: "South America", popular: true },
  { id: 34, name: "Santiago", country: "Chile", region: "South America", popular: false },
  { id: 35, name: "Bogota", country: "Colombia", region: "South America", popular: false },
  
  // Africa
  { id: 36, name: "Cape Town", country: "South Africa", region: "Africa", popular: true },
  { id: 37, name: "Marrakech", country: "Morocco", region: "Africa", popular: true },
  { id: 38, name: "Cairo", country: "Egypt", region: "Africa", popular: true },
  { id: 39, name: "Nairobi", country: "Kenya", region: "Africa", popular: false },
  { id: 40, name: "Casablanca", country: "Morocco", region: "Africa", popular: false },
  
  // Oceania
  { id: 41, name: "Sydney", country: "Australia", region: "Oceania", popular: true },
  { id: 42, name: "Melbourne", country: "Australia", region: "Oceania", popular: true },
  { id: 43, name: "Auckland", country: "New Zealand", region: "Oceania", popular: true },
  { id: 44, name: "Brisbane", country: "Australia", region: "Oceania", popular: false },
  
  // Additional popular destinations
  { id: 45, name: "Reykjavik", country: "Iceland", region: "Europe", popular: true },
  { id: 46, name: "Istanbul", country: "Turkey", region: "Europe", popular: true },
  { id: 47, name: "Lisbon", country: "Portugal", region: "Europe", popular: true },
  { id: 48, name: "Edinburgh", country: "Scotland", region: "Europe", popular: true },
  { id: 49, name: "Costa Rica", country: "Costa Rica", region: "Central America", popular: true },
  { id: 50, name: "Maldives", country: "Maldives", region: "Asia", popular: true },
  
  // India
  { name: "Mumbai, India", country: "India", region: "India", popular: true, description: "Financial capital and Bollywood hub" },
  { name: "New Delhi, India", country: "India", region: "India", popular: true, description: "Historic capital with rich heritage" },
  { name: "Bangalore, India", country: "India", region: "India", popular: true, description: "Garden city and tech hub" },
  { name: "Jaipur, India", country: "India", region: "India", popular: true, description: "Pink city with royal palaces" },
  { name: "Cochin, India", country: "India", region: "India", popular: true, description: "Queen of Arabian Sea" },
  { name: "Varanasi, India", country: "India", region: "India", popular: true, description: "Spiritual capital on River Ganges" },
  { name: "Chennai, India", country: "India", region: "India", popular: false, description: "Gateway to South India" },
  { name: "Kolkata, India", country: "India", region: "India", popular: false, description: "Cultural capital of India" },
  { name: "Hyderabad, India", country: "India", region: "India", popular: false, description: "City of pearls and biryani" }
];

// Search destinations with autocomplete
const searchDestinations = async (req, res) => {
  try {
    const { q: query, limit = 10, popular_only = false } = req.query;
    
    if (!query || query.length < 2) {
      // Return popular destinations if no query or query too short
      const popularDestinations = destinations
        .filter(dest => dest.popular)
        .slice(0, parseInt(limit))
        .map(dest => ({
          id: dest.id,
          name: dest.name,
          country: dest.country,
          region: dest.region,
          display: `${dest.name}, ${dest.country}`,
          popular: dest.popular
        }));
        
      return res.json({
        success: true,
        data: {
          destinations: popularDestinations,
          total: popularDestinations.length
        }
      });
    }

    // Search destinations matching the query
    const searchTerm = query.toLowerCase();
    let filteredDestinations = destinations.filter(dest => {
      const nameMatch = dest.name.toLowerCase().includes(searchTerm);
      const countryMatch = dest.country.toLowerCase().includes(searchTerm);
      const regionMatch = dest.region.toLowerCase().includes(searchTerm);
      
      return nameMatch || countryMatch || regionMatch;
    });

    // Filter by popularity if requested
    if (popular_only === 'true') {
      filteredDestinations = filteredDestinations.filter(dest => dest.popular);
    }

    // Sort by relevance (exact matches first, then popular destinations)
    filteredDestinations.sort((a, b) => {
      const aNameExact = a.name.toLowerCase() === searchTerm;
      const bNameExact = b.name.toLowerCase() === searchTerm;
      const aNameStart = a.name.toLowerCase().startsWith(searchTerm);
      const bNameStart = b.name.toLowerCase().startsWith(searchTerm);
      
      if (aNameExact && !bNameExact) return -1;
      if (!aNameExact && bNameExact) return 1;
      if (aNameStart && !bNameStart) return -1;
      if (!aNameStart && bNameStart) return 1;
      if (a.popular && !b.popular) return -1;
      if (!a.popular && b.popular) return 1;
      
      return a.name.localeCompare(b.name);
    });

    // Limit results
    const limitedResults = filteredDestinations
      .slice(0, parseInt(limit))
      .map(dest => ({
        id: dest.id,
        name: dest.name,
        country: dest.country,
        region: dest.region,
        display: `${dest.name}, ${dest.country}`,
        popular: dest.popular
      }));

    res.json({
      success: true,
      data: {
        destinations: limitedResults,
        total: filteredDestinations.length,
        query: query
      }
    });

  } catch (error) {
    console.error('Search destinations error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error during destination search'
    });
  }
};

// Get popular destinations
const getPopularDestinations = async (req, res) => {
  try {
    const { limit = 20, region } = req.query;
    
    let popularDestinations = destinations.filter(dest => dest.popular);
    
    // Filter by region if specified
    if (region) {
      popularDestinations = popularDestinations.filter(
        dest => dest.region.toLowerCase() === region.toLowerCase()
      );
    }
    
    // Limit results
    const limitedResults = popularDestinations
      .slice(0, parseInt(limit))
      .map(dest => ({
        id: dest.id,
        name: dest.name,
        country: dest.country,
        region: dest.region,
        display: `${dest.name}, ${dest.country}`,
        popular: dest.popular
      }));

    res.json({
      success: true,
      data: {
        destinations: limitedResults,
        total: limitedResults.length
      }
    });

  } catch (error) {
    console.error('Get popular destinations error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error while fetching popular destinations'
    });
  }
};

// Get destinations by region
const getDestinationsByRegion = async (req, res) => {
  try {
    const regions = {};
    
    destinations.forEach(dest => {
      if (!regions[dest.region]) {
        regions[dest.region] = [];
      }
      regions[dest.region].push({
        id: dest.id,
        name: dest.name,
        country: dest.country,
        display: `${dest.name}, ${dest.country}`,
        popular: dest.popular
      });
    });

    // Sort destinations within each region
    Object.keys(regions).forEach(region => {
      regions[region].sort((a, b) => {
        if (a.popular && !b.popular) return -1;
        if (!a.popular && b.popular) return 1;
        return a.name.localeCompare(b.name);
      });
    });

    res.json({
      success: true,
      data: {
        regions
      }
    });

  } catch (error) {
    console.error('Get destinations by region error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error while fetching destinations by region'
    });
  }
};

module.exports = {
  searchDestinations,
  getPopularDestinations,
  getDestinationsByRegion
}; 