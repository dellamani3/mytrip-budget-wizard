require('dotenv').config();

module.exports = {
  port: process.env.PORT || 5000,
  nodeEnv: process.env.NODE_ENV || 'development',
  jwtSecret: process.env.JWT_SECRET || 'mytrip_super_secret_key_2024_change_in_production',
  jwtExpire: process.env.JWT_EXPIRE || '7d',
  dbPath: process.env.DB_PATH || './database.sqlite',
  frontendUrl: process.env.FRONTEND_URL || 'http://localhost:3000',
  rateLimitWindow: parseInt(process.env.RATE_LIMIT_WINDOW) || 15 * 60 * 1000, // 15 minutes
  rateLimitMax: parseInt(process.env.RATE_LIMIT_MAX) || 100, // 100 requests per window
  
  // Amadeus API Configuration
  amadeusClientId: process.env.AMADEUS_CLIENT_ID || null,
  amadeusClientSecret: process.env.AMADEUS_CLIENT_SECRET || null,
  amadeusHostname: process.env.AMADEUS_HOSTNAME || 'test', // 'test' or 'production'
  
  // Flight API fallback settings
  useRealFlightData: process.env.USE_REAL_FLIGHT_DATA === 'true' || false,
  flightApiTimeout: parseInt(process.env.FLIGHT_API_TIMEOUT) || 10000 // 10 seconds
}; 