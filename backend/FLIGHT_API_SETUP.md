# Flight API Integration Setup

This guide explains how to integrate real flight data using the Amadeus API.

## 🌟 Overview

The MyTrip Budget Wizard now supports **real-time flight pricing** from major airlines through the Amadeus API. When configured, the system will fetch live flight data and fall back to our market-based pricing system if the API is unavailable.

## 🔑 Getting Amadeus API Credentials

### Step 1: Create Amadeus Account
1. Visit [Amadeus for Developers](https://developers.amadeus.com/)
2. Click "Get Started" and create a free account
3. Verify your email address

### Step 2: Create an Application
1. Log into your Amadeus dashboard
2. Click "Create New Application"
3. Fill in application details:
   - **Application Name**: MyTrip Budget Wizard
   - **Application Type**: Testing (for development)
   - **Description**: Trip planning application with flight search

### Step 3: Get API Credentials
After creating your application, you'll receive:
- **Client ID** (API Key)
- **Client Secret** (API Secret)

## ⚙️ Configuration

### Environment Variables

Create a `.env` file in the `backend` directory with your credentials:

```bash
# Amadeus API Configuration
AMADEUS_CLIENT_ID=your_client_id_here
AMADEUS_CLIENT_SECRET=your_client_secret_here
AMADEUS_HOSTNAME=test
USE_REAL_FLIGHT_DATA=true
FLIGHT_API_TIMEOUT=10000
```

### Configuration Options

| Variable | Description | Values |
|----------|-------------|---------|
| `AMADEUS_CLIENT_ID` | Your Amadeus API client ID | String |
| `AMADEUS_CLIENT_SECRET` | Your Amadeus API client secret | String |
| `AMADEUS_HOSTNAME` | API environment | `test` or `production` |
| `USE_REAL_FLIGHT_DATA` | Enable/disable real API calls | `true` or `false` |
| `FLIGHT_API_TIMEOUT` | API timeout in milliseconds | Number (default: 10000) |

## 🏗️ Installation

### Install Dependencies

```bash
cd backend
npm install amadeus axios
```

### Restart the Server

```bash
npm run dev
```

## 📊 API Limits & Pricing

### Free Tier (Test Environment)
- **10,000 API calls/month**
- **10 calls/second**
- **Live data from 450+ airlines**
- **No credit card required**

### Production Tier
- **Pay-per-call pricing**
- **Higher rate limits**
- **Production-grade SLA**
- **Premium support**

## 🧪 Testing the Integration

### 1. Check API Status
```bash
curl http://localhost:5000/api/trips/health/check
```

### 2. Test Flight Search
Generate a trip with real flight data:
```bash
curl -X POST http://localhost:5000/api/trips/generate \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "destination": "Paris, France",
    "budget": 3000,
    "travelers": "2",
    "duration": "7-10",
    "departureCity": "New York, NY (JFK)"
  }'
```

### 3. Verify Data Source
Look for the `isRealData: true` field in flight options to confirm real API data.

## 🔧 Troubleshooting

### Common Issues

**1. "Airport codes not found" Error**
- Check if departure city and destination are supported
- Verify spelling matches exactly our city lists

**2. API Authentication Failed**
- Verify `AMADEUS_CLIENT_ID` and `AMADEUS_CLIENT_SECRET`
- Check if credentials are for the correct environment (test/production)

**3. Rate Limit Exceeded**
- Free tier allows 10 calls/second
- Implement caching for repeated searches

**4. No Flight Results**
- Some routes may not be available
- System automatically falls back to market estimates

### Debug Mode

Enable detailed logging:
```bash
NODE_ENV=development npm run dev
```

Check server logs for Amadeus API calls and responses.

## 🔄 Fallback System

The application includes a robust fallback system:

1. **Primary**: Real Amadeus API data (when configured)
2. **Fallback**: Market-based pricing simulation
3. **Indicator**: UI shows data source with badges

### Data Source Indicators

- 🟢 **Real-time Data**: Live prices from Amadeus API
- 🔵 **Market Estimate**: Simulated pricing based on market rates

## 🌍 Supported Routes

### Major Departure Cities
- **USA**: JFK, LAX, ORD, SFO, MIA, BOS, DCA, ATL, SEA, DEN, PHX, LAS, DFW, IAH
- **Europe**: LHR, CDG, FRA, AMS, MAD, FCO, ZUR
- **Asia Pacific**: NRT, SIN, HKG, SYD, DXB
- **India**: DEL, BOM, BLR, MAA, CCU, HYD, PNQ, AMD

### Popular Destinations
- **50+ international destinations**
- **Major tourist and business centers**
- **Comprehensive airport code mapping**

## 🚀 Benefits of Real API Integration

### ✅ Advantages
- **Live pricing** from 450+ airlines
- **Real availability** and schedules
- **Accurate route information**
- **Current market rates**
- **Professional booking links**

### ⚠️ Considerations
- **API rate limits** (10K calls/month free)
- **Network dependency** (fallback available)
- **Setup complexity** (one-time configuration)

## 🔒 Security Best Practices

1. **Never commit API keys** to version control
2. **Use environment variables** for credentials
3. **Rotate keys periodically**
4. **Monitor API usage** in Amadeus dashboard
5. **Set up rate limiting** in production

## 📈 Monitoring & Analytics

### Amadeus Dashboard
- Track API usage and costs
- Monitor rate limits
- View success/error rates
- Access detailed analytics

### Application Metrics
- Data source usage (real vs simulated)
- API response times
- Fallback frequency
- User search patterns

## 🆘 Support

### Amadeus Support
- [Developer Documentation](https://developers.amadeus.com/self-service)
- [API Reference](https://developers.amadeus.com/self-service/category/air)
- [Community Forum](https://developers.amadeus.com/support)

### Application Support
Check server logs and ensure:
- Environment variables are set correctly
- Network connectivity is available
- API credentials are valid
- Rate limits are not exceeded

---

**Note**: The application works perfectly with simulated data if you prefer not to set up the API integration. Real API integration is optional and provides enhanced accuracy for production use. 