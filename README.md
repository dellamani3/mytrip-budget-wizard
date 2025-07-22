# MyTrip Budget Wizard 🌍✈️

A comprehensive full-stack travel planning application that helps users plan trips with real-time flight pricing, destination recommendations, and detailed itinerary generation.

## 🚀 Features

### Frontend (React + TypeScript + Vite)
- **Modern UI** with Tailwind CSS and Shadcn/ui components
- **Destination Autocomplete** with popular destination suggestions
- **Departure City Search** with support for Indian and international cities
- **Real-time Flight Pricing Insights** with budget analysis
- **Interactive Trip Planning** with dynamic form validation
- **Accommodation Details** with booking integration
- **Responsive Design** optimized for all devices

### Backend (Node.js + Express)
- **RESTful API** with comprehensive endpoints
- **JWT Authentication** with secure login/registration
- **SQLite Database** with user and trip management
- **Amadeus Flight API Integration** with intelligent fallback
- **Advanced Flight Pricing Algorithm** with market-based calculations
- **Input Validation** and sanitization
- **Rate Limiting** and security headers
- **Comprehensive Error Handling**

### Flight Integration
- **Real Flight Data** via Amadeus API (test environment)
- **Intelligent Fallback** to high-quality simulated pricing
- **Multi-route Support** including Indian departures
- **Dynamic Pricing** based on seasonality and demand
- **Flight Insights** with booking recommendations

## 🛠️ Tech Stack

### Frontend
- React 18 with TypeScript
- Vite for fast development
- Tailwind CSS for styling
- Shadcn/ui component library
- React Router for navigation
- Lucide Icons

### Backend
- Node.js with Express.js
- SQLite database
- JWT for authentication
- Bcrypt for password hashing
- Amadeus SDK for flight data
- Express-validator for validation
- Helmet.js for security
- Morgan for logging
- CORS for cross-origin requests
- Rate limiting

## 📦 Installation

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### 1. Clone the Repository
```bash
git clone <repository-url>
cd mytrip-budget-wizard-main
```

### 2. Install Frontend Dependencies
```bash
npm install
```

### 3. Install Backend Dependencies
```bash
cd backend
npm install
```

### 4. Environment Configuration
```bash
# Copy the environment template
cp .env.example .env

# Edit .env file with your configurations
# For Amadeus API (optional):
# - Get free credentials from https://developers.amadeus.com/
# - Set AMADEUS_CLIENT_ID and AMADEUS_CLIENT_SECRET
# - Set USE_REAL_FLIGHT_DATA=true
```

### 5. Database Setup
The SQLite database will be automatically created when you first start the backend.

## 🚀 Running the Application

### Start Backend Server
```bash
cd backend
npm run dev
```
Backend runs on: http://localhost:5000

### Start Frontend Development Server
```bash
# In the root directory
npm run dev
```
Frontend runs on: http://localhost:5173 (or next available port)

## 🔐 Default Credentials

For testing, you can register a new account or use:
- **Username:** `dellamani`
- **Email:** `dellamani@example.com`
- **Password:** `Password123`

**Note:** Password must contain uppercase, lowercase, and numbers.

## 📚 API Documentation

### Authentication Endpoints
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile
- `PUT /api/auth/profile` - Update user profile
- `POST /api/auth/logout` - User logout

### Trip Planning Endpoints
- `POST /api/trips/generate` - Generate new trip plan
- `GET /api/trips` - Get user's trips
- `GET /api/trips/:id` - Get specific trip
- `PUT /api/trips/:id` - Update trip
- `DELETE /api/trips/:id` - Delete trip

### Destination & Departure Endpoints
- `GET /api/destinations/search` - Search destinations
- `GET /api/destinations/popular` - Get popular destinations
- `GET /api/departures` - Get departure cities
- `GET /api/departures/popular` - Get popular departure cities

## 🌟 Key Features Explained

### Intelligent Flight Pricing
- Real-time integration with Amadeus API
- Fallback to market-based pricing algorithm
- Supports 50+ departure cities including major Indian airports
- Dynamic pricing based on route popularity and seasonality

### Advanced Trip Generation
- AI-like itinerary creation based on user preferences
- Budget-aware recommendations
- Activity suggestions based on travel style
- Accommodation matching with booking details

### Security & Performance
- JWT-based authentication
- Password hashing with bcrypt
- Rate limiting to prevent abuse
- Input validation and sanitization
- CORS configuration for secure frontend-backend communication

## 🔧 Configuration Options

### Environment Variables (.env)
```bash
# Server Configuration
PORT=5000
NODE_ENV=development

# Authentication
JWT_SECRET=your_jwt_secret
JWT_EXPIRE=7d

# Database
DB_PATH=./database.sqlite

# CORS
FRONTEND_URL=http://localhost:3000

# Amadeus API (Optional)
AMADEUS_CLIENT_ID=your_client_id
AMADEUS_CLIENT_SECRET=your_client_secret
AMADEUS_HOSTNAME=test
USE_REAL_FLIGHT_DATA=false

# Rate Limiting
RATE_LIMIT_WINDOW=900000
RATE_LIMIT_MAX=100
```

## 🐛 Troubleshooting

### Common Issues

1. **Port Already in Use**
   - Frontend automatically finds next available port
   - Backend: Change PORT in .env file

2. **Database Errors**
   - Delete `backend/database.sqlite` to reset database
   - Restart backend server

3. **Amadeus API Issues**
   - Set `USE_REAL_FLIGHT_DATA=false` to use simulated data
   - Check API credentials in .env file

4. **CORS Errors**
   - Ensure frontend URL is added to backend CORS configuration
   - Check backend/src/server.js origin whitelist

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 🔮 Future Enhancements

- [ ] Real-time weather integration
- [ ] Social features and trip sharing
- [ ] Mobile app with React Native
- [ ] Advanced filtering and search
- [ ] Payment gateway integration
- [ ] Multi-language support
- [ ] Offline mode capabilities

## 📞 Support

For support and questions, please open an issue in the repository.

---

**Built with ❤️ using modern web technologies**
