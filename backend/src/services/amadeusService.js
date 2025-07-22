const config = require('../config/config');

// Only initialize Amadeus if credentials are available
let amadeus = null;

const initializeAmadeus = () => {
  if (config.amadeusClientId && config.amadeusClientSecret) {
    try {
      console.log('🔧 Initializing Amadeus with:', {
        clientId: config.amadeusClientId?.substring(0, 8) + '...',
        hostname: config.amadeusHostname,
        useRealData: config.useRealFlightData
      });
      
      const Amadeus = require('amadeus');
      amadeus = new Amadeus({
        clientId: config.amadeusClientId,
        clientSecret: config.amadeusClientSecret,
        hostname: config.amadeusHostname // 'test' for testing, 'production' for live
      });
      console.log('✅ Amadeus API initialized successfully');
      return true;
    } catch (error) {
      console.error('❌ Failed to initialize Amadeus API:', error.message);
      amadeus = null;
      return false;
    }
  } else {
    console.log('ℹ️  Amadeus API credentials not configured - using simulated flight data');
    return false;
  }
};

// Try to initialize on startup
initializeAmadeus();

// Airport codes mapping for our departure cities
const airportCodes = {
  "New York, NY (JFK)": "JFK",
  "Los Angeles, CA (LAX)": "LAX", 
  "Chicago, IL (ORD)": "ORD",
  "San Francisco, CA (SFO)": "SFO",
  "Miami, FL (MIA)": "MIA",
  "Boston, MA (BOS)": "BOS",
  "Washington, DC (DCA)": "DCA",
  "Atlanta, GA (ATL)": "ATL",
  "Seattle, WA (SEA)": "SEA",
  "Denver, CO (DEN)": "DEN",
  "Phoenix, AZ (PHX)": "PHX",
  "Las Vegas, NV (LAS)": "LAS",
  "Dallas, TX (DFW)": "DFW",
  "Houston, TX (IAH)": "IAH",
  
  // Europe
  "London, UK (LHR)": "LHR",
  "Paris, France (CDG)": "CDG",
  "Frankfurt, Germany (FRA)": "FRA",
  "Amsterdam, Netherlands (AMS)": "AMS",
  "Madrid, Spain (MAD)": "MAD",
  "Rome, Italy (FCO)": "FCO",
  "Zurich, Switzerland (ZUR)": "ZUR",
  
  // Asia Pacific
  "Tokyo, Japan (NRT)": "NRT",
  "Singapore (SIN)": "SIN",
  "Hong Kong (HKG)": "HKG",
  "Sydney, Australia (SYD)": "SYD",
  "Dubai, UAE (DXB)": "DXB",
  
  // India
  "New Delhi, India (DEL)": "DEL",
  "Mumbai, India (BOM)": "BOM",
  "Bangalore, India (BLR)": "BLR",
  "Chennai, India (MAA)": "MAA",
  "Kolkata, India (CCU)": "CCU",
  "Hyderabad, India (HYD)": "HYD",
  "Pune, India (PNQ)": "PNQ",
  "Ahmedabad, India (AMD)": "AMD"
};

// Destination to airport code mapping
const destinationToAirport = {
  "Paris, France": "CDG",
  "London, United Kingdom": "LHR", 
  "Rome, Italy": "FCO",
  "Barcelona, Spain": "BCN",
  "Amsterdam, Netherlands": "AMS",
  "Prague, Czech Republic": "PRG",
  "Vienna, Austria": "VIE",
  "Berlin, Germany": "BER",
  "Santorini, Greece": "JTR",
  "Venice, Italy": "VCE",
  "Reykjavik, Iceland": "KEF",
  "Istanbul, Turkey": "IST",
  "Lisbon, Portugal": "LIS",
  "Edinburgh, Scotland": "EDI",
  
  // Asia
  "Tokyo, Japan": "NRT",
  "Bali, Indonesia": "DPS",
  "Bangkok, Thailand": "BKK",
  "Singapore, Singapore": "SIN",
  "Seoul, South Korea": "ICN",
  "Dubai, UAE": "DXB",
  "Kyoto, Japan": "KIX",
  "Hong Kong, Hong Kong": "HKG",
  "Mumbai, India": "BOM",
  "Phuket, Thailand": "HKT",
  "Maldives, Maldives": "MLE",
  
  // North America
  "New York, United States": "JFK",
  "Los Angeles, United States": "LAX",
  "San Francisco, United States": "SFO",
  "Las Vegas, United States": "LAS",
  "Toronto, Canada": "YYZ",
  "Vancouver, Canada": "YVR",
  "Miami, United States": "MIA",
  "Chicago, United States": "ORD",
  "Cancun, Mexico": "CUN",
  
  // Indian destinations
  "New Delhi, India": "DEL",
  "Bangalore, India": "BLR",
  "Chennai, India": "MAA",
  "Kolkata, India": "CCU",
  "Hyderabad, India": "HYD",
  "Jaipur, India": "JAI",
  "Cochin, India": "COK",
  "Varanasi, India": "VNS",
  
  // Others
  "Rio de Janeiro, Brazil": "GIG",
  "Buenos Aires, Argentina": "EZE",
  "Lima, Peru": "LIM",
  "Cape Town, South Africa": "CPT",
  "Marrakech, Morocco": "RAK",
  "Cairo, Egypt": "CAI",
  "Sydney, Australia": "SYD",
  "Melbourne, Australia": "MEL",
  "Auckland, New Zealand": "AKL",
  "Costa Rica, Costa Rica": "SJO"
};

class AmadeusService {
  
  // Search for flight offers
  async searchFlightOffers(originCity, destinationName, departureDate, travelers = 1, returnDate = null) {
    if (!amadeus) {
      console.warn('Amadeus API not initialized. Cannot search flights.');
      // Return null to trigger fallback to our pricing system
      return null;
    }

    try {
      const originCode = airportCodes[originCity];
      const destinationCode = destinationToAirport[destinationName];
      
      if (!originCode || !destinationCode) {
        throw new Error(`Airport codes not found for route: ${originCity} -> ${destinationName}`);
      }

      console.log(`Searching flights: ${originCode} -> ${destinationCode} on ${departureDate}`);

      const searchParams = {
        originLocationCode: originCode,
        destinationLocationCode: destinationCode,
        departureDate: departureDate,
        adults: travelers,
        max: 10, // Limit results
        currencyCode: 'USD'
      };

      // Add return date for round trip
      if (returnDate) {
        searchParams.returnDate = returnDate;
      }

      const response = await amadeus.shopping.flightOffersSearch.get(searchParams);
      
      return this.parseFlightOffers(response.data, originCity, destinationName);
      
    } catch (error) {
      console.error('Amadeus API Error Details:');
      console.error('Error message:', error.message);
      console.error('Error code:', error.code);
      console.error('Error response:', error.response?.data);
      console.error('Full error:', error);
      
      // Return null to trigger fallback to our pricing system
      return null;
    }
  }

  // Parse Amadeus flight offers into our format
  parseFlightOffers(offers, originCity, destinationName) {
    if (!offers || offers.length === 0) {
      return null;
    }

    const parsedOffers = offers.slice(0, 4).map((offer, index) => {
      const itinerary = offer.itineraries[0];
      const segment = itinerary.segments[0];
      const lastSegment = itinerary.segments[itinerary.segments.length - 1];
      
      // Calculate duration
      const totalDuration = this.parseDuration(itinerary.duration);
      
      // Determine flight type based on price range
      const price = parseFloat(offer.price.total);
      let flightType = 'economy';
      let airline = 'Multiple Airlines';
      
      // Get airline from first segment
      if (segment.carrierCode) {
        airline = this.getAirlineName(segment.carrierCode);
      }
      
      // Categorize by price (rough estimation)
      if (price < 500) {
        flightType = index === 0 ? 'budget' : 'economy';
      } else if (price < 1000) {
        flightType = 'economy';
      } else if (price < 2000) {
        flightType = 'premium';
      } else {
        flightType = 'business';
      }

      return {
        id: flightType + '_' + index,
        airline: airline,
        type: this.getFlightTypeLabel(flightType),
        route: `${originCity} → ${destinationName}`,
        duration: totalDuration,
        cost: Math.round(price),
        departure: this.formatTime(segment.departure.at),
        arrival: this.formatTime(lastSegment.arrival.at),
        stopover: itinerary.segments.length > 1 ? `${itinerary.segments.length - 1} stop(s)` : 'Direct flight',
        aircraft: segment.aircraft?.code || 'Various',
        baggage: 'Included as per airline policy',
        meals: price > 1000 ? 'Meals included' : 'Meals available for purchase',
        entertainment: 'As per airline offering',
        bookingLink: `https://amadeus.com/book/${offer.id}`,
        // Add Amadeus-specific data
        amadeusOfferId: offer.id,
        validatingAirlineCodes: offer.validatingAirlineCodes,
        isRealData: true
      };
    });

    return parsedOffers;
  }

  // Helper methods
  parseDuration(duration) {
    // Parse ISO 8601 duration (PT2H30M)
    const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?/);
    const hours = parseInt(match[1] || 0);
    const minutes = parseInt(match[2] || 0);
    
    if (hours && minutes) {
      return `${hours}h ${minutes}m`;
    } else if (hours) {
      return `${hours}h`;
    } else {
      return `${minutes}m`;
    }
  }

  formatTime(isoDateTime) {
    const date = new Date(isoDateTime);
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    });
  }

  getAirlineName(carrierCode) {
    const airlines = {
      'AA': 'American Airlines',
      'UA': 'United Airlines', 
      'DL': 'Delta Air Lines',
      'BA': 'British Airways',
      'LH': 'Lufthansa',
      'AF': 'Air France',
      'KL': 'KLM',
      'EK': 'Emirates',
      'QR': 'Qatar Airways',
      'SQ': 'Singapore Airlines',
      'AI': 'Air India',
      '6E': 'IndiGo',
      'SG': 'SpiceJet',
      'UK': 'Vistara'
    };
    
    return airlines[carrierCode] || `${carrierCode} Airlines`;
  }

  getFlightTypeLabel(type) {
    const labels = {
      'budget': 'Economy Basic',
      'economy': 'Economy Class', 
      'premium': 'Premium Economy',
      'business': 'Business Class',
      'first': 'First Class'
    };
    
    return labels[type] || 'Economy Class';
  }

  // Check if API is properly configured
  isConfigured() {
    return amadeus !== null;
  }
}

module.exports = new AmadeusService(); 