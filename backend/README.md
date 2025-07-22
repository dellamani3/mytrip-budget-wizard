# MyTrip Backend API

A secure Node.js/Express backend for the MyTrip Budget Wizard application with JWT authentication, SQLite database, and RESTful API endpoints.

## 🚀 Features

- **JWT Authentication**: Secure token-based authentication
- **SQLite Database**: Lightweight, file-based database
- **Password Hashing**: Bcrypt for secure password storage
- **Input Validation**: Express-validator for request validation
- **Rate Limiting**: Protection against brute force attacks
- **CORS Enabled**: Cross-origin resource sharing
- **Security Headers**: Helmet.js for additional security
- **Error Handling**: Comprehensive error handling and logging

## 📋 Prerequisites

- Node.js (v16.0.0 or higher)
- npm or yarn package manager

## 🛠️ Installation

1. **Navigate to the backend directory:**
   ```bash
   cd backend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables:**
   Create a `.env` file in the backend root directory:
   ```env
   # Server Configuration
   PORT=5000
   NODE_ENV=development

   # JWT Configuration
   JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
   JWT_EXPIRE=7d

   # Database Configuration
   DB_PATH=./database.sqlite

   # CORS Configuration
   FRONTEND_URL=http://localhost:5173

   # Rate Limiting
   RATE_LIMIT_WINDOW=15
   RATE_LIMIT_MAX=100
   ```

4. **Start the server:**
   ```bash
   # Development mode with auto-restart
   npm run dev

   # Production mode
   npm start
   ```

## 🌐 API Endpoints

### Health Check
- **GET** `/health` - Check if the API is running

### Authentication Endpoints

#### Register User
- **POST** `/api/auth/register`
- **Body:**
  ```json
  {
    "username": "johndoe",
    "email": "john@example.com",
    "password": "SecurePass123",
    "firstName": "John",
    "lastName": "Doe"
  }
  ```
- **Response:**
  ```json
  {
    "success": true,
    "message": "User registered successfully",
    "data": {
      "user": {
        "id": 1,
        "username": "johndoe",
        "email": "john@example.com",
        "firstName": "John",
        "lastName": "Doe"
      },
      "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
    }
  }
  ```

#### Login User
- **POST** `/api/auth/login`
- **Body:**
  ```json
  {
    "username": "johndoe",
    "password": "SecurePass123"
  }
  ```
- **Response:**
  ```json
  {
    "success": true,
    "message": "Login successful",
    "data": {
      "user": {
        "id": 1,
        "username": "johndoe",
        "email": "john@example.com",
        "firstName": "John",
        "lastName": "Doe"
      },
      "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
    }
  }
  ```

#### Get User Profile
- **GET** `/api/auth/profile`
- **Headers:** `Authorization: Bearer <token>`
- **Response:**
  ```json
  {
    "success": true,
    "data": {
      "user": {
        "id": 1,
        "username": "johndoe",
        "email": "john@example.com",
        "firstName": "John",
        "lastName": "Doe"
      }
    }
  }
  ```

#### Update User Profile
- **PUT** `/api/auth/profile`
- **Headers:** `Authorization: Bearer <token>`
- **Body:**
  ```json
  {
    "firstName": "John",
    "lastName": "Smith",
    "preferences": {
      "travelStyle": "adventure",
      "budgetRange": "moderate"
    }
  }
  ```

#### Logout User
- **POST** `/api/auth/logout`
- **Headers:** `Authorization: Bearer <token>`

### Destination Search Endpoints

#### Search Destinations
- **GET** `/api/destinations/search`
- **Query Parameters:**
  - `q` (string): Search term (minimum 2 characters)
  - `limit` (number, optional): Number of results to return (default: 10)
  - `popular_only` (boolean, optional): Return only popular destinations
- **Response:**
  ```json
  {
    "success": true,
    "data": {
      "destinations": [
        {
          "id": 1,
          "name": "Paris",
          "country": "France",
          "region": "Europe",
          "display": "Paris, France",
          "popular": true
        }
      ],
      "total": 1,
      "query": "paris"
    }
  }
  ```

#### Get Popular Destinations
- **GET** `/api/destinations/popular`
- **Query Parameters:**
  - `limit` (number, optional): Number of results (default: 20)
  - `region` (string, optional): Filter by region
- **Response:**
  ```json
  {
    "success": true,
    "data": {
      "destinations": [
        {
          "id": 1,
          "name": "Paris",
          "country": "France",
          "region": "Europe",
          "display": "Paris, France",
          "popular": true
        }
      ],
      "total": 1
    }
  }
  ```

#### Get Destinations by Region
- **GET** `/api/destinations/regions`
- **Response:**
  ```json
  {
    "success": true,
    "data": {
      "regions": {
        "Europe": [
          {
            "id": 1,
            "name": "Paris",
            "country": "France",
            "display": "Paris, France",
            "popular": true
          }
        ]
      }
    }
  }
  ```

## 🗄️ Database Schema

### Users Table
```sql
CREATE TABLE users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  username VARCHAR(50) UNIQUE NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  firstName VARCHAR(50),
  lastName VARCHAR(50),
  preferences TEXT,
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

### Trips Table
```sql
CREATE TABLE trips (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  userId INTEGER NOT NULL,
  destination VARCHAR(100),
  budget DECIMAL(10,2),
  travelers INTEGER,
  duration VARCHAR(20),
  travelStyle VARCHAR(50),
  specialRequirements TEXT,
  tripData TEXT,
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (userId) REFERENCES users (id)
);
```

## 🔐 Authentication

The API uses JWT (JSON Web Tokens) for authentication. Include the token in the `Authorization` header:

```
Authorization: Bearer <your-jwt-token>
```

## 🛡️ Security Features

- **Password Hashing**: Passwords are hashed using bcrypt with 12 salt rounds
- **JWT Tokens**: Secure token-based authentication with configurable expiration
- **Rate Limiting**: 100 requests per 15-minute window per IP
- **Input Validation**: All endpoints validate input data
- **CORS Protection**: Configured for specific origins
- **Helmet Security**: Additional security headers

## 📝 Error Handling

The API returns consistent error responses:

```json
{
  "success": false,
  "message": "Error description",
  "errors": ["Detailed error messages"]
}
```

## 🧪 Testing

To test the API endpoints, you can use tools like:
- Postman
- curl
- Insomnia
- Thunder Client (VS Code extension)

Example curl request:
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"johndoe","password":"SecurePass123"}'
```

## 🚀 Deployment

1. Set `NODE_ENV=production`
2. Update `JWT_SECRET` with a strong, unique secret
3. Configure your production database
4. Set up proper CORS origins
5. Configure rate limiting for production traffic

## 📁 Project Structure

```
backend/
├── src/
│   ├── config/
│   │   ├── config.js          # Environment configuration
│   │   └── database.js        # Database setup and connection
│   ├── controllers/
│   │   └── authController.js  # Authentication logic
│   ├── middleware/
│   │   ├── auth.js            # JWT authentication middleware
│   │   └── validation.js      # Input validation rules
│   ├── models/
│   │   └── User.js            # User model and database operations
│   ├── routes/
│   │   └── auth.js            # Authentication routes
│   └── server.js              # Main server file
├── package.json
└── README.md
```

## 📄 License

This project is licensed under the MIT License.

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request 