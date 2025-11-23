# Backend API Development Guide

## 📋 Table of Contents
1. [Technology Stack Recommendations](#technology-stack-recommendations)
2. [Database Schema Design](#database-schema-design)
3. [API Endpoints](#api-endpoints)
4. [Authentication & Authorization](#authentication--authorization)
5. [API Response Format](#api-response-format)
6. [Implementation Checklist](#implementation-checklist)

---

## 🛠️ Technology Stack Recommendations

### Recommended Stack:
- **Backend Framework**: Node.js with Express.js OR Python with FastAPI/Django
- **Database**: PostgreSQL (for relational data) + MongoDB (optional for logs)
- **Authentication**: JWT (JSON Web Tokens)
- **File Storage**: AWS S3 / Cloudinary (for images)
- **Payment Gateway**: Stripe / PayPal / Razorpay
- **Email Service**: SendGrid / AWS SES / Nodemailer
- **Caching**: Redis (for session management, rate limiting)
- **API Documentation**: Swagger/OpenAPI

---

## 🗄️ Database Schema Design

### 1. Users Table
```sql
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    phone VARCHAR(20),
    date_of_birth DATE,
    nationality VARCHAR(100),
    passport_number VARCHAR(50),
    passport_expiry DATE,
    is_email_verified BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    role VARCHAR(20) DEFAULT 'user', -- 'user', 'admin'
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 2. Admins Table
```sql
CREATE TABLE admins (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    name VARCHAR(100),
    role VARCHAR(20) DEFAULT 'admin', -- 'admin', 'super_admin'
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 3. Flights Table
```sql
CREATE TABLE flights (
    id SERIAL PRIMARY KEY,
    flight_number VARCHAR(20) UNIQUE NOT NULL,
    airline VARCHAR(100) NOT NULL,
    aircraft_type VARCHAR(50),
    from_location VARCHAR(100) NOT NULL,
    to_location VARCHAR(100) NOT NULL,
    departure_time TIME NOT NULL,
    arrival_time TIME NOT NULL,
    departure_date DATE NOT NULL,
    arrival_date DATE NOT NULL,
    duration_minutes INTEGER,
    stops INTEGER DEFAULT 0,
    stop_locations TEXT[], -- Array of stop locations
    base_price DECIMAL(10, 2) NOT NULL,
    economy_price DECIMAL(10, 2),
    business_price DECIMAL(10, 2),
    first_class_price DECIMAL(10, 2),
    available_seats INTEGER,
    total_seats INTEGER,
    status VARCHAR(20) DEFAULT 'scheduled', -- 'scheduled', 'delayed', 'cancelled', 'completed'
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 4. Flight Bookings Table
```sql
CREATE TABLE flight_bookings (
    id SERIAL PRIMARY KEY,
    booking_reference VARCHAR(20) UNIQUE NOT NULL,
    user_id INTEGER REFERENCES users(id),
    flight_id INTEGER REFERENCES flights(id),
    booking_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    departure_date DATE NOT NULL,
    return_date DATE, -- NULL for one-way
    trip_type VARCHAR(20) NOT NULL, -- 'oneway', 'return', 'multicity'
    class_type VARCHAR(20) NOT NULL, -- 'economy', 'business', 'first'
    total_passengers INTEGER NOT NULL,
    total_amount DECIMAL(10, 2) NOT NULL,
    currency VARCHAR(10) DEFAULT 'NPR',
    status VARCHAR(20) DEFAULT 'pending', -- 'pending', 'confirmed', 'cancelled', 'completed'
    payment_status VARCHAR(20) DEFAULT 'pending', -- 'pending', 'paid', 'refunded'
    payment_id VARCHAR(100),
    special_requirements TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 5. Passengers Table
```sql
CREATE TABLE passengers (
    id SERIAL PRIMARY KEY,
    booking_id INTEGER REFERENCES flight_bookings(id) ON DELETE CASCADE,
    title VARCHAR(10), -- 'Mr', 'Mrs', 'Ms', 'Miss'
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    date_of_birth DATE,
    gender VARCHAR(10),
    passport_number VARCHAR(50),
    passport_expiry DATE,
    nationality VARCHAR(100),
    email VARCHAR(255),
    phone VARCHAR(20),
    seat_number VARCHAR(10),
    meal_preference VARCHAR(50),
    special_assistance BOOLEAN DEFAULT FALSE,
    baggage_allowance JSONB, -- {carry_on: '7kg', checked: '20kg'}
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 6. Helicopters Table
```sql
CREATE TABLE helicopters (
    id SERIAL PRIMARY KEY,
    helicopter_number VARCHAR(20) UNIQUE NOT NULL,
    model VARCHAR(100) NOT NULL,
    capacity INTEGER NOT NULL,
    operator VARCHAR(100),
    base_location VARCHAR(100) NOT NULL,
    available_locations TEXT[], -- Array of available locations
    base_price_per_hour DECIMAL(10, 2) NOT NULL,
    status VARCHAR(20) DEFAULT 'available', -- 'available', 'booked', 'maintenance'
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 7. Helicopter Bookings Table
```sql
CREATE TABLE helicopter_bookings (
    id SERIAL PRIMARY KEY,
    booking_reference VARCHAR(20) UNIQUE NOT NULL,
    user_id INTEGER REFERENCES users(id),
    helicopter_id INTEGER REFERENCES helicopters(id),
    service_type VARCHAR(50) NOT NULL, -- 'scenic', 'charter', 'mountain', 'transfer', 'rescue'
    pickup_location VARCHAR(255) NOT NULL,
    dropoff_location VARCHAR(255) NOT NULL,
    booking_date DATE NOT NULL,
    booking_time TIME NOT NULL,
    passengers INTEGER NOT NULL,
    duration_hours DECIMAL(4, 2),
    total_amount DECIMAL(10, 2) NOT NULL,
    currency VARCHAR(10) DEFAULT 'NPR',
    status VARCHAR(20) DEFAULT 'pending',
    payment_status VARCHAR(20) DEFAULT 'pending',
    special_requirements TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 8. Hotels Table
```sql
CREATE TABLE hotels (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    location VARCHAR(255) NOT NULL,
    city VARCHAR(100),
    country VARCHAR(100),
    description TEXT,
    rating DECIMAL(2, 1), -- 1.0 to 5.0
    star_rating INTEGER, -- 1 to 5
    images TEXT[], -- Array of image URLs
    amenities TEXT[], -- ['wifi', 'pool', 'gym', etc.]
    base_price_per_night DECIMAL(10, 2) NOT NULL,
    currency VARCHAR(10) DEFAULT 'NPR',
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 9. Packages Table
```sql
CREATE TABLE packages (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    destination VARCHAR(255) NOT NULL,
    description TEXT,
    duration_days INTEGER NOT NULL,
    duration_nights INTEGER NOT NULL,
    images TEXT[],
    original_price DECIMAL(10, 2) NOT NULL,
    discounted_price DECIMAL(10, 2),
    discount_percentage INTEGER,
    highlights TEXT[], -- Array of highlights
    includes TEXT[], -- Array of what's included
    excludes TEXT[], -- Array of what's excluded
    itinerary JSONB, -- Detailed itinerary
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 10. Package Bookings Table
```sql
CREATE TABLE package_bookings (
    id SERIAL PRIMARY KEY,
    booking_reference VARCHAR(20) UNIQUE NOT NULL,
    user_id INTEGER REFERENCES users(id),
    package_id INTEGER REFERENCES packages(id),
    booking_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    travel_date DATE NOT NULL,
    passengers INTEGER NOT NULL,
    total_amount DECIMAL(10, 2) NOT NULL,
    currency VARCHAR(10) DEFAULT 'NPR',
    status VARCHAR(20) DEFAULT 'pending',
    payment_status VARCHAR(20) DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 11. Payments Table
```sql
CREATE TABLE payments (
    id SERIAL PRIMARY KEY,
    payment_id VARCHAR(100) UNIQUE NOT NULL,
    booking_id INTEGER,
    booking_type VARCHAR(20) NOT NULL, -- 'flight', 'helicopter', 'package', 'hotel'
    user_id INTEGER REFERENCES users(id),
    amount DECIMAL(10, 2) NOT NULL,
    currency VARCHAR(10) DEFAULT 'NPR',
    payment_method VARCHAR(50), -- 'card', 'bank_transfer', 'wallet'
    payment_gateway VARCHAR(50), -- 'stripe', 'razorpay', 'paypal'
    gateway_transaction_id VARCHAR(255),
    status VARCHAR(20) DEFAULT 'pending', -- 'pending', 'success', 'failed', 'refunded'
    payment_date TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

---

## 🔌 API Endpoints

### Authentication APIs

#### 1. User Registration
```
POST /api/auth/register
Body: {
  email: string,
  password: string,
  firstName: string,
  lastName: string,
  phone?: string
}
Response: {
  success: boolean,
  message: string,
  data: {
    user: { id, email, firstName, lastName },
    token: string
  }
}
```

#### 2. User Login
```
POST /api/auth/login
Body: {
  email: string,
  password: string,
  rememberMe?: boolean
}
Response: {
  success: boolean,
  message: string,
  data: {
    user: { id, email, firstName, lastName, role },
    token: string,
    expiresIn: number
  }
}
```

#### 3. Admin Login
```
POST /api/auth/admin/login
Body: {
  email: string,
  password: string
}
Response: {
  success: boolean,
  message: string,
  data: {
    admin: { id, email, name, role },
    token: string
  }
}
```

#### 4. Refresh Token
```
POST /api/auth/refresh
Headers: { Authorization: Bearer <refresh_token> }
Response: {
  success: boolean,
  data: {
    token: string,
    expiresIn: number
  }
}
```

#### 5. Logout
```
POST /api/auth/logout
Headers: { Authorization: Bearer <token> }
Response: {
  success: boolean,
  message: string
}
```

---

### Flight APIs

#### 6. Search Flights
```
POST /api/flights/search
Body: {
  from: string,
  to: string,
  departureDate: string (YYYY-MM-DD),
  returnDate?: string (YYYY-MM-DD),
  tripType: 'oneway' | 'return' | 'multicity',
  passengers: {
    adults: number,
    children: number,
    infants: number
  },
  class: 'economy' | 'business' | 'first',
  flexibleDates?: boolean
}
Response: {
  success: boolean,
  data: {
    flights: [
      {
        id: number,
        flightNumber: string,
        airline: string,
        from: string,
        to: string,
        departureTime: string,
        arrivalTime: string,
        duration: string,
        stops: number,
        price: number,
        availableSeats: number,
        class: string
      }
    ],
    totalResults: number
  }
}
```

#### 7. Get Flight Details
```
GET /api/flights/:id
Response: {
  success: boolean,
  data: {
    flight: {
      id: number,
      flightNumber: string,
      airline: string,
      aircraftType: string,
      from: string,
      to: string,
      departureTime: string,
      arrivalTime: string,
      duration: string,
      stops: number,
      stopLocations: string[],
      prices: {
        economy: number,
        business: number,
        first: number
      },
      availableSeats: number,
      amenities: string[]
    }
  }
}
```

#### 8. Create Flight Booking
```
POST /api/bookings/flights
Headers: { Authorization: Bearer <token> }
Body: {
  flightId: number,
  returnFlightId?: number,
  tripType: string,
  class: string,
  passengers: [
    {
      title: string,
      firstName: string,
      lastName: string,
      dateOfBirth: string,
      gender: string,
      passportNumber: string,
      passportExpiry: string,
      nationality: string,
      email: string,
      phone: string,
      seatPreference?: string,
      mealPreference?: string,
      specialAssistance?: boolean,
      baggage: {
        carryOn: string,
        checked: string
      }
    }
  ],
  addOns?: {
    seatSelection: boolean,
    meals: string[],
    baggage: object
  }
}
Response: {
  success: boolean,
  data: {
    booking: {
      bookingReference: string,
      totalAmount: number,
      status: string,
      passengers: array
    }
  }
}
```

#### 9. Get User Bookings
```
GET /api/bookings/flights
Headers: { Authorization: Bearer <token> }
Query: { status?: string, page?: number, limit?: number }
Response: {
  success: boolean,
  data: {
    bookings: array,
    pagination: {
      page: number,
      limit: number,
      total: number,
      totalPages: number
    }
  }
}
```

#### 10. Get Booking Details
```
GET /api/bookings/flights/:bookingReference
Headers: { Authorization: Bearer <token> }
Response: {
  success: boolean,
  data: {
    booking: {
      bookingReference: string,
      flight: object,
      passengers: array,
      totalAmount: number,
      status: string,
      paymentStatus: string,
      createdAt: string
    }
  }
}
```

#### 11. Cancel Booking
```
PUT /api/bookings/flights/:bookingReference/cancel
Headers: { Authorization: Bearer <token> }
Response: {
  success: boolean,
  message: string,
  data: {
    refundAmount: number,
    refundStatus: string
  }
}
```

#### 12. Check Flight Status
```
GET /api/flights/status
Query: {
  flightNumber: string,
  date: string (YYYY-MM-DD)
}
Response: {
  success: boolean,
  data: {
    flight: {
      flightNumber: string,
      status: string, // 'on-time', 'delayed', 'cancelled'
      actualDepartureTime?: string,
      actualArrivalTime?: string,
      delayMinutes?: number
    }
  }
}
```

---

### Helicopter APIs

#### 13. Search Helicopters
```
POST /api/helicopters/search
Body: {
  pickupLocation: string,
  dropoffLocation: string,
  date: string (YYYY-MM-DD),
  time: string (HH:MM),
  serviceType: string,
  passengers: number
}
Response: {
  success: boolean,
  data: {
    helicopters: [
      {
        id: number,
        model: string,
        operator: string,
        capacity: number,
        price: number,
        available: boolean
      }
    ]
  }
}
```

#### 14. Create Helicopter Booking
```
POST /api/bookings/helicopters
Headers: { Authorization: Bearer <token> }
Body: {
  helicopterId: number,
  serviceType: string,
  pickupLocation: string,
  dropoffLocation: string,
  date: string,
  time: string,
  passengers: number,
  specialRequirements?: string
}
Response: {
  success: boolean,
  data: {
    booking: {
      bookingReference: string,
      totalAmount: number,
      status: string
    }
  }
}
```

---

### Hotel APIs

#### 15. Get Hotels List
```
GET /api/hotels
Query: {
  location?: string,
  city?: string,
  minPrice?: number,
  maxPrice?: number,
  rating?: number,
  amenities?: string[],
  page?: number,
  limit?: number
}
Response: {
  success: boolean,
  data: {
    hotels: array,
    pagination: object
  }
}
```

#### 16. Get Hotel Details
```
GET /api/hotels/:id
Response: {
  success: boolean,
  data: {
    hotel: {
      id: number,
      name: string,
      location: string,
      description: string,
      rating: number,
      images: string[],
      amenities: string[],
      rooms: array,
      prices: object
    }
  }
}
```

---

### Package APIs

#### 17. Get Packages List
```
GET /api/packages
Query: {
  destination?: string,
  minPrice?: number,
  maxPrice?: number,
  duration?: number,
  page?: number,
  limit?: number
}
Response: {
  success: boolean,
  data: {
    packages: array,
    pagination: object
  }
}
```

#### 18. Get Package Details
```
GET /api/packages/:id
Response: {
  success: boolean,
  data: {
    package: {
      id: number,
      title: string,
      destination: string,
      description: string,
      duration: object,
      images: string[],
      highlights: string[],
      includes: string[],
      itinerary: object,
      prices: object
    }
  }
}
```

---

### Payment APIs

#### 19. Create Payment
```
POST /api/payments/create
Headers: { Authorization: Bearer <token> }
Body: {
  bookingId: number,
  bookingType: 'flight' | 'helicopter' | 'package',
  amount: number,
  currency: string,
  paymentMethod: string
}
Response: {
  success: boolean,
  data: {
    paymentId: string,
    paymentIntent: object, // Gateway specific
    redirectUrl?: string
  }
}
```

#### 20. Verify Payment
```
POST /api/payments/verify
Headers: { Authorization: Bearer <token> }
Body: {
  paymentId: string,
  gatewayResponse: object
}
Response: {
  success: boolean,
  message: string,
  data: {
    payment: object,
    booking: object
  }
}
```

---

### User Profile APIs

#### 21. Get User Profile
```
GET /api/users/profile
Headers: { Authorization: Bearer <token> }
Response: {
  success: boolean,
  data: {
    user: {
      id: number,
      email: string,
      firstName: string,
      lastName: string,
      phone: string,
      bookings: {
        flights: number,
        helicopters: number,
        packages: number
      }
    }
  }
}
```

#### 22. Update User Profile
```
PUT /api/users/profile
Headers: { Authorization: Bearer <token> }
Body: {
  firstName?: string,
  lastName?: string,
  phone?: string,
  dateOfBirth?: string,
  nationality?: string,
  passportNumber?: string
}
Response: {
  success: boolean,
  message: string,
  data: {
    user: object
  }
}
```

---

### Admin APIs

#### 23. Get Dashboard Stats
```
GET /api/admin/dashboard
Headers: { Authorization: Bearer <admin_token> }
Response: {
  success: boolean,
  data: {
    stats: {
      totalBookings: number,
      totalRevenue: number,
      pendingBookings: number,
      activeFlights: number,
      activeHelicopters: number
    },
    recentBookings: array,
    revenueChart: array
  }
}
```

#### 24. Manage Flights
```
GET /api/admin/flights
POST /api/admin/flights
PUT /api/admin/flights/:id
DELETE /api/admin/flights/:id
```

#### 25. Manage Helicopters
```
GET /api/admin/helicopters
POST /api/admin/helicopters
PUT /api/admin/helicopters/:id
DELETE /api/admin/helicopters/:id
```

---

## 🔐 Authentication & Authorization

### JWT Token Structure
```json
{
  "userId": 123,
  "email": "user@example.com",
  "role": "user",
  "iat": 1234567890,
  "exp": 1234571490
}
```

### Middleware Example (Node.js/Express)
```javascript
const authenticate = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ success: false, message: 'No token provided' });
    }
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ success: false, message: 'Invalid token' });
  }
};

const isAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ success: false, message: 'Admin access required' });
  }
  next();
};
```

---

## 📦 API Response Format

### Success Response
```json
{
  "success": true,
  "message": "Operation successful",
  "data": {
    // Response data
  }
}
```

### Error Response
```json
{
  "success": false,
  "message": "Error message",
  "error": {
    "code": "ERROR_CODE",
    "details": "Detailed error information"
  }
}
```

### Pagination Response
```json
{
  "success": true,
  "data": {
    "items": [],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 100,
      "totalPages": 10,
      "hasNext": true,
      "hasPrev": false
    }
  }
}
```

---

## ✅ Implementation Checklist

### Phase 1: Setup & Authentication
- [ ] Set up project structure
- [ ] Configure database (PostgreSQL)
- [ ] Set up authentication (JWT)
- [ ] Create user registration API
- [ ] Create user login API
- [ ] Create admin login API
- [ ] Implement password hashing (bcrypt)
- [ ] Add email verification

### Phase 2: Flight Management
- [ ] Create flights table
- [ ] Create flight search API
- [ ] Create flight details API
- [ ] Create flight booking API
- [ ] Create booking management APIs
- [ ] Implement seat selection
- [ ] Add flight status checking

### Phase 3: Helicopter Management
- [ ] Create helicopters table
- [ ] Create helicopter search API
- [ ] Create helicopter booking API
- [ ] Implement availability checking

### Phase 4: Hotels & Packages
- [ ] Create hotels table
- [ ] Create packages table
- [ ] Create hotel listing APIs
- [ ] Create package listing APIs
- [ ] Create booking APIs for hotels/packages

### Phase 5: Payment Integration
- [ ] Integrate payment gateway (Stripe/Razorpay)
- [ ] Create payment API
- [ ] Implement payment verification
- [ ] Add refund handling
- [ ] Create payment history API

### Phase 6: Admin Panel
- [ ] Create admin dashboard API
- [ ] Create flight management APIs
- [ ] Create helicopter management APIs
- [ ] Create booking management APIs
- [ ] Add analytics APIs

### Phase 7: Additional Features
- [ ] Email notifications (booking confirmations)
- [ ] SMS notifications (optional)
- [ ] File upload (for documents)
- [ ] Search functionality
- [ ] Filtering and sorting
- [ ] Rate limiting
- [ ] API documentation (Swagger)

---

## 🔒 Security Best Practices

1. **Password Security**
   - Use bcrypt with salt rounds (10-12)
   - Enforce strong password policies
   - Implement password reset flow

2. **JWT Security**
   - Use strong secret keys
   - Set appropriate expiration times
   - Implement refresh tokens
   - Store tokens securely (httpOnly cookies for web)

3. **Input Validation**
   - Validate all inputs
   - Sanitize user inputs
   - Use parameterized queries (prevent SQL injection)

4. **Rate Limiting**
   - Implement rate limiting on all endpoints
   - Use Redis for rate limiting
   - Different limits for authenticated/unauthenticated users

5. **CORS Configuration**
   - Configure CORS properly
   - Allow only trusted origins

6. **Error Handling**
   - Don't expose sensitive error details
   - Log errors properly
   - Return generic error messages to clients

---

## 📝 Environment Variables

```env
# Server
PORT=3000
NODE_ENV=production

# Database
DB_HOST=localhost
DB_PORT=5432
DB_NAME=travel_booking
DB_USER=your_user
DB_PASSWORD=your_password

# JWT
JWT_SECRET=your_super_secret_jwt_key
JWT_EXPIRES_IN=24h
JWT_REFRESH_SECRET=your_refresh_secret
JWT_REFRESH_EXPIRES_IN=7d

# Payment Gateway
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PUBLISHABLE_KEY=pk_test_...
RAZORPAY_KEY_ID=rzp_test_...
RAZORPAY_KEY_SECRET=...

# Email
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASSWORD=your_app_password

# File Storage
AWS_ACCESS_KEY_ID=...
AWS_SECRET_ACCESS_KEY=...
AWS_BUCKET_NAME=...
AWS_REGION=...

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379
```

---

## 🚀 Quick Start Example (Node.js/Express)

```javascript
// server.js
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

const app = express();

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());

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
// ... more routes

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : {}
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
```

---

## 📚 Additional Resources

- **Express.js Documentation**: https://expressjs.com/
- **PostgreSQL Documentation**: https://www.postgresql.org/docs/
- **JWT Guide**: https://jwt.io/
- **Stripe API**: https://stripe.com/docs/api
- **Swagger/OpenAPI**: https://swagger.io/

---

**Note**: This is a comprehensive guide. Start with Phase 1 and gradually implement other phases. Test each API endpoint thoroughly before moving to the next phase.

