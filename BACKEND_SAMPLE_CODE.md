# Backend Sample Code Examples

## Quick Start: Node.js/Express Implementation

### 1. Project Structure
```
backend/
├── config/
│   ├── database.js
│   └── jwt.js
├── controllers/
│   ├── authController.js
│   ├── flightController.js
│   └── bookingController.js
├── middleware/
│   ├── auth.js
│   └── validation.js
├── models/
│   ├── User.js
│   ├── Flight.js
│   └── Booking.js
├── routes/
│   ├── auth.js
│   ├── flights.js
│   └── bookings.js
├── utils/
│   ├── generateBookingRef.js
│   └── sendEmail.js
├── .env
├── package.json
└── server.js
```

### 2. Package.json Dependencies
```json
{
  "name": "travel-booking-backend",
  "version": "1.0.0",
  "dependencies": {
    "express": "^4.18.2",
    "pg": "^8.11.0",
    "bcryptjs": "^2.4.3",
    "jsonwebtoken": "^9.0.0",
    "dotenv": "^16.0.3",
    "cors": "^2.8.5",
    "helmet": "^6.1.5",
    "express-rate-limit": "^6.7.0",
    "joi": "^17.9.2",
    "nodemailer": "^6.9.3",
    "uuid": "^9.0.0"
  },
  "devDependencies": {
    "nodemon": "^2.0.22"
  }
}
```

### 3. Database Configuration (config/database.js)
```javascript
const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

pool.on('connect', () => {
  console.log('Connected to PostgreSQL database');
});

pool.on('error', (err) => {
  console.error('Database connection error:', err);
});

module.exports = pool;
```

### 4. JWT Configuration (config/jwt.js)
```javascript
const jwt = require('jsonwebtoken');
require('dotenv').config();

const generateToken = (payload) => {
  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '24h'
  });
};

const verifyToken = (token) => {
  return jwt.verify(token, process.env.JWT_SECRET);
};

module.exports = { generateToken, verifyToken };
```

### 5. Authentication Middleware (middleware/auth.js)
```javascript
const { verifyToken } = require('../config/jwt');

const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'No token provided'
      });
    }

    const token = authHeader.split(' ')[1];
    const decoded = verifyToken(token);
    
    // Attach user info to request
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Invalid or expired token'
    });
  }
};

const isAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({
      success: false,
      message: 'Admin access required'
    });
  }
  next();
};

module.exports = { authenticate, isAdmin };
```

### 6. Auth Controller (controllers/authController.js)
```javascript
const bcrypt = require('bcryptjs');
const pool = require('../config/database');
const { generateToken } = require('../config/jwt');

// User Registration
const register = async (req, res) => {
  try {
    const { email, password, firstName, lastName, phone } = req.body;

    // Validate input
    if (!email || !password || !firstName || !lastName) {
      return res.status(400).json({
        success: false,
        message: 'All required fields must be provided'
      });
    }

    // Check if user exists
    const existingUser = await pool.query(
      'SELECT id FROM users WHERE email = $1',
      [email]
    );

    if (existingUser.rows.length > 0) {
      return res.status(409).json({
        success: false,
        message: 'User already exists with this email'
      });
    }

    // Hash password
    const saltRounds = 12;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    // Create user
    const result = await pool.query(
      `INSERT INTO users (email, password_hash, first_name, last_name, phone)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING id, email, first_name, last_name, role`,
      [email, passwordHash, firstName, lastName, phone]
    );

    const user = result.rows[0];

    // Generate token
    const token = generateToken({
      userId: user.id,
      email: user.email,
      role: user.role
    });

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: {
        user: {
          id: user.id,
          email: user.email,
          firstName: user.first_name,
          lastName: user.last_name
        },
        token
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// User Login
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required'
      });
    }

    // Find user
    const result = await pool.query(
      'SELECT id, email, password_hash, first_name, last_name, role, is_active FROM users WHERE email = $1',
      [email]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    const user = result.rows[0];

    // Check if user is active
    if (!user.is_active) {
      return res.status(403).json({
        success: false,
        message: 'Account is deactivated'
      });
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password_hash);

    if (!isValidPassword) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Generate token
    const token = generateToken({
      userId: user.id,
      email: user.email,
      role: user.role
    });

    res.json({
      success: true,
      message: 'Login successful',
      data: {
        user: {
          id: user.id,
          email: user.email,
          firstName: user.first_name,
          lastName: user.last_name,
          role: user.role
        },
        token,
        expiresIn: '24h'
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Admin Login
const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const result = await pool.query(
      'SELECT id, email, password_hash, name, role, is_active FROM admins WHERE email = $1',
      [email]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    const admin = result.rows[0];

    if (!admin.is_active) {
      return res.status(403).json({
        success: false,
        message: 'Admin account is deactivated'
      });
    }

    const isValidPassword = await bcrypt.compare(password, admin.password_hash);

    if (!isValidPassword) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    const token = generateToken({
      adminId: admin.id,
      email: admin.email,
      role: admin.role
    });

    res.json({
      success: true,
      message: 'Admin login successful',
      data: {
        admin: {
          id: admin.id,
          email: admin.email,
          name: admin.name,
          role: admin.role
        },
        token
      }
    });
  } catch (error) {
    console.error('Admin login error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

module.exports = { register, login, adminLogin };
```

### 7. Flight Controller (controllers/flightController.js)
```javascript
const pool = require('../config/database');

// Search Flights
const searchFlights = async (req, res) => {
  try {
    const {
      from,
      to,
      departureDate,
      returnDate,
      tripType,
      passengers,
      class: classType
    } = req.body;

    // Build query
    let query = `
      SELECT 
        f.id,
        f.flight_number,
        f.airline,
        f.from_location,
        f.to_location,
        f.departure_time,
        f.arrival_time,
        f.departure_date,
        f.arrival_date,
        f.duration_minutes,
        f.stops,
        f.stop_locations,
        CASE 
          WHEN $5 = 'economy' THEN f.economy_price
          WHEN $5 = 'business' THEN f.business_price
          WHEN $5 = 'first' THEN f.first_class_price
          ELSE f.base_price
        END as price,
        f.available_seats,
        f.status
      FROM flights f
      WHERE f.from_location ILIKE $1
        AND f.to_location ILIKE $2
        AND f.departure_date = $3
        AND f.status = 'scheduled'
        AND f.available_seats >= $4
      ORDER BY f.departure_time ASC
    `;

    const totalPassengers = (passengers?.adults || 0) + (passengers?.children || 0) + (passengers?.infants || 0);
    
    const result = await pool.query(query, [
      `%${from}%`,
      `%${to}%`,
      departureDate,
      totalPassengers,
      classType || 'economy'
    ]);

    // Format response
    const flights = result.rows.map(flight => ({
      id: flight.id,
      flightNumber: flight.flight_number,
      airline: flight.airline,
      from: flight.from_location,
      to: flight.to_location,
      departureTime: flight.departure_time,
      arrivalTime: flight.arrival_time,
      departureDate: flight.departure_date,
      arrivalDate: flight.arrival_date,
      duration: formatDuration(flight.duration_minutes),
      stops: flight.stops,
      stopLocations: flight.stop_locations || [],
      price: parseFloat(flight.price),
      availableSeats: flight.available_seats,
      class: classType
    }));

    res.json({
      success: true,
      data: {
        flights,
        totalResults: flights.length
      }
    });
  } catch (error) {
    console.error('Flight search error:', error);
    res.status(500).json({
      success: false,
      message: 'Error searching flights'
    });
  }
};

// Get Flight Details
const getFlightDetails = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      `SELECT * FROM flights WHERE id = $1`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Flight not found'
      });
    }

    const flight = result.rows[0];

    res.json({
      success: true,
      data: {
        flight: {
          id: flight.id,
          flightNumber: flight.flight_number,
          airline: flight.airline,
          aircraftType: flight.aircraft_type,
          from: flight.from_location,
          to: flight.to_location,
          departureTime: flight.departure_time,
          arrivalTime: flight.arrival_time,
          departureDate: flight.departure_date,
          arrivalDate: flight.arrival_date,
          duration: formatDuration(flight.duration_minutes),
          stops: flight.stops,
          stopLocations: flight.stop_locations || [],
          prices: {
            economy: parseFloat(flight.economy_price),
            business: parseFloat(flight.business_price),
            first: parseFloat(flight.first_class_price)
          },
          availableSeats: flight.available_seats,
          totalSeats: flight.total_seats,
          status: flight.status
        }
      }
    });
  } catch (error) {
    console.error('Get flight details error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching flight details'
    });
  }
};

// Helper function
const formatDuration = (minutes) => {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${hours}h ${mins}m`;
};

module.exports = { searchFlights, getFlightDetails };
```

### 8. Booking Controller (controllers/bookingController.js)
```javascript
const pool = require('../config/database');
const { v4: uuidv4 } = require('uuid');

// Generate unique booking reference
const generateBookingReference = () => {
  return 'BK' + Date.now().toString(36).toUpperCase() + Math.random().toString(36).substr(2, 5).toUpperCase();
};

// Create Flight Booking
const createFlightBooking = async (req, res) => {
  const client = await pool.connect();
  
  try {
    await client.query('BEGIN');

    const {
      flightId,
      returnFlightId,
      tripType,
      class: classType,
      passengers,
      addOns
    } = req.body;

    const userId = req.user.userId;
    const bookingReference = generateBookingReference();

    // Get flight details
    const flightResult = await client.query(
      'SELECT * FROM flights WHERE id = $1',
      [flightId]
    );

    if (flightResult.rows.length === 0) {
      await client.query('ROLLBACK');
      return res.status(404).json({
        success: false,
        message: 'Flight not found'
      });
    }

    const flight = flightResult.rows[0];
    const totalPassengers = passengers.length;

    // Check seat availability
    if (flight.available_seats < totalPassengers) {
      await client.query('ROLLBACK');
      return res.status(400).json({
        success: false,
        message: 'Not enough seats available'
      });
    }

    // Calculate total amount
    let basePrice = 0;
    if (classType === 'economy') {
      basePrice = parseFloat(flight.economy_price);
    } else if (classType === 'business') {
      basePrice = parseFloat(flight.business_price);
    } else if (classType === 'first') {
      basePrice = parseFloat(flight.first_class_price);
    }

    let totalAmount = basePrice * totalPassengers;

    // Add return flight if applicable
    if (tripType === 'return' && returnFlightId) {
      const returnFlightResult = await client.query(
        'SELECT * FROM flights WHERE id = $1',
        [returnFlightId]
      );
      
      if (returnFlightResult.rows.length > 0) {
        const returnFlight = returnFlightResult.rows[0];
        let returnPrice = 0;
        if (classType === 'economy') {
          returnPrice = parseFloat(returnFlight.economy_price);
        } else if (classType === 'business') {
          returnPrice = parseFloat(returnFlight.business_price);
        } else if (classType === 'first') {
          returnPrice = parseFloat(returnFlight.first_class_price);
        }
        totalAmount += returnPrice * totalPassengers;
      }
    }

    // Create booking
    const bookingResult = await client.query(
      `INSERT INTO flight_bookings 
       (booking_reference, user_id, flight_id, departure_date, return_date, trip_type, class_type, total_passengers, total_amount, status)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, 'pending')
       RETURNING id, booking_reference, total_amount`,
      [
        bookingReference,
        userId,
        flightId,
        flight.departure_date,
        tripType === 'return' ? flight.arrival_date : null,
        tripType,
        classType,
        totalPassengers,
        totalAmount
      ]
    );

    const booking = bookingResult.rows[0];

    // Insert passengers
    for (const passenger of passengers) {
      await client.query(
        `INSERT INTO passengers 
         (booking_id, title, first_name, last_name, date_of_birth, gender, passport_number, passport_expiry, nationality, email, phone)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)`,
        [
          booking.id,
          passenger.title,
          passenger.firstName,
          passenger.lastName,
          passenger.dateOfBirth,
          passenger.gender,
          passenger.passportNumber,
          passenger.passportExpiry,
          passenger.nationality,
          passenger.email,
          passenger.phone
        ]
      );
    }

    // Update available seats
    await client.query(
      'UPDATE flights SET available_seats = available_seats - $1 WHERE id = $2',
      [totalPassengers, flightId]
    );

    await client.query('COMMIT');

    res.status(201).json({
      success: true,
      message: 'Booking created successfully',
      data: {
        booking: {
          bookingReference: booking.booking_reference,
          totalAmount: parseFloat(booking.total_amount),
          status: 'pending',
          passengers: passengers.length
        }
      }
    });
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Create booking error:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating booking'
    });
  } finally {
    client.release();
  }
};

// Get User Bookings
const getUserBookings = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { status, page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;

    let query = `
      SELECT 
        fb.id,
        fb.booking_reference,
        fb.departure_date,
        fb.return_date,
        fb.trip_type,
        fb.class_type,
        fb.total_amount,
        fb.status,
        fb.payment_status,
        fb.created_at,
        f.flight_number,
        f.airline,
        f.from_location,
        f.to_location
      FROM flight_bookings fb
      JOIN flights f ON fb.flight_id = f.id
      WHERE fb.user_id = $1
    `;

    const params = [userId];
    
    if (status) {
      query += ` AND fb.status = $${params.length + 1}`;
      params.push(status);
    }

    query += ` ORDER BY fb.created_at DESC LIMIT $${params.length + 1} OFFSET $${params.length + 2}`;
    params.push(limit, offset);

    const result = await pool.query(query, params);

    // Get total count
    const countResult = await pool.query(
      'SELECT COUNT(*) FROM flight_bookings WHERE user_id = $1' + (status ? ' AND status = $2' : ''),
      status ? [userId, status] : [userId]
    );

    const total = parseInt(countResult.rows[0].count);

    res.json({
      success: true,
      data: {
        bookings: result.rows.map(row => ({
          id: row.id,
          bookingReference: row.booking_reference,
          flight: {
            flightNumber: row.flight_number,
            airline: row.airline,
            from: row.from_location,
            to: row.to_location
          },
          departureDate: row.departure_date,
          returnDate: row.return_date,
          tripType: row.trip_type,
          class: row.class_type,
          totalAmount: parseFloat(row.total_amount),
          status: row.status,
          paymentStatus: row.payment_status,
          createdAt: row.created_at
        })),
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          totalPages: Math.ceil(total / limit)
        }
      }
    });
  } catch (error) {
    console.error('Get bookings error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching bookings'
    });
  }
};

module.exports = { createFlightBooking, getUserBookings };
```

### 9. Routes (routes/auth.js)
```javascript
const express = require('express');
const router = express.Router();
const { register, login, adminLogin } = require('../controllers/authController');

router.post('/register', register);
router.post('/login', login);
router.post('/admin/login', adminLogin);

module.exports = router;
```

### 10. Main Server File (server.js)
```javascript
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const app = express();

// Middleware
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use('/api/', limiter);

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/flights', require('./routes/flights'));
app.use('/api/bookings', require('./routes/bookings'));

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : {}
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});
```

---

## Quick Setup Commands

```bash
# Initialize project
npm init -y

# Install dependencies
npm install express pg bcryptjs jsonwebtoken dotenv cors helmet express-rate-limit joi nodemailer uuid

# Install dev dependencies
npm install --save-dev nodemon

# Create .env file
touch .env

# Run migrations (create database tables)
# Use a migration tool like node-pg-migrate or write SQL scripts

# Start development server
npm run dev
```

---

## Testing with Postman/Thunder Client

### Example: User Registration
```
POST http://localhost:3000/api/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "SecurePass123!",
  "firstName": "John",
  "lastName": "Doe",
  "phone": "+977-9841234567"
}
```

### Example: Flight Search
```
POST http://localhost:3000/api/flights/search
Content-Type: application/json

{
  "from": "Kathmandu",
  "to": "Pokhara",
  "departureDate": "2025-12-15",
  "tripType": "oneway",
  "passengers": {
    "adults": 1,
    "children": 0,
    "infants": 0
  },
  "class": "economy"
}
```

---

This provides a solid foundation to start building your backend APIs!

