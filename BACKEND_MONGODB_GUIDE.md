# Backend API Guide - MongoDB Version

## 📋 Table of Contents
1. [Technology Stack](#technology-stack)
2. [MongoDB Schema Design](#mongodb-schema-design)
3. [API Endpoints](#api-endpoints)
4. [Authentication & Authorization](#authentication--authorization)
5. [Implementation Guide](#implementation-guide)

---

## 🛠️ Technology Stack

### Recommended Stack:
- **Backend Framework**: Node.js with Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens)
- **File Storage**: AWS S3 / Cloudinary (for images)
- **Payment Gateway**: Stripe / PayPal / Razorpay
- **Email Service**: SendGrid / AWS SES / Nodemailer
- **Caching**: Redis (for session management, rate limiting)
- **API Documentation**: Swagger/OpenAPI

---

## 🗄️ MongoDB Schema Design (Mongoose Models)

### 1. User Model
```javascript
// models/User.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  firstName: {
    type: String,
    required: true,
    trim: true
  },
  lastName: {
    type: String,
    required: true,
    trim: true
  },
  phone: {
    type: String,
    trim: true
  },
  dateOfBirth: {
    type: Date
  },
  nationality: {
    type: String
  },
  passportNumber: {
    type: String
  },
  passportExpiry: {
    type: Date
  },
  isEmailVerified: {
    type: Boolean,
    default: false
  },
  isActive: {
    type: Boolean,
    default: true
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  }
}, {
  timestamps: true
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
```

### 2. Admin Model
```javascript
// models/Admin.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const adminSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ['admin', 'super_admin'],
    default: 'admin'
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

adminSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

adminSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('Admin', adminSchema);
```

### 3. Flight Model
```javascript
// models/Flight.js
const mongoose = require('mongoose');

const flightSchema = new mongoose.Schema({
  flightNumber: {
    type: String,
    required: true,
    unique: true,
    uppercase: true
  },
  airline: {
    type: String,
    required: true
  },
  aircraftType: {
    type: String
  },
  from: {
    type: String,
    required: true
  },
  to: {
    type: String,
    required: true
  },
  departureTime: {
    type: String,
    required: true // Format: "HH:MM"
  },
  arrivalTime: {
    type: String,
    required: true
  },
  departureDate: {
    type: Date,
    required: true
  },
  arrivalDate: {
    type: Date,
    required: true
  },
  durationMinutes: {
    type: Number,
    required: true
  },
  stops: {
    type: Number,
    default: 0
  },
  stopLocations: [{
    type: String
  }],
  pricing: {
    base: {
      type: Number,
      required: true
    },
    economy: {
      type: Number,
      required: true
    },
    business: {
      type: Number
    },
    firstClass: {
      type: Number
    }
  },
  seats: {
    total: {
      type: Number,
      required: true
    },
    available: {
      type: Number,
      required: true
    },
    economy: {
      total: Number,
      available: Number
    },
    business: {
      total: Number,
      available: Number
    },
    firstClass: {
      total: Number,
      available: Number
    }
  },
  status: {
    type: String,
    enum: ['scheduled', 'delayed', 'cancelled', 'completed'],
    default: 'scheduled'
  },
  amenities: [{
    type: String
  }]
}, {
  timestamps: true
});

// Index for search queries
flightSchema.index({ from: 1, to: 1, departureDate: 1 });
flightSchema.index({ flightNumber: 1, departureDate: 1 });

module.exports = mongoose.model('Flight', flightSchema);
```

### 4. Flight Booking Model
```javascript
// models/FlightBooking.js
const mongoose = require('mongoose');

const passengerSchema = new mongoose.Schema({
  title: {
    type: String,
    enum: ['Mr', 'Mrs', 'Ms', 'Miss']
  },
  firstName: {
    type: String,
    required: true
  },
  lastName: {
    type: String,
    required: true
  },
  dateOfBirth: {
    type: Date
  },
  gender: {
    type: String,
    enum: ['Male', 'Female', 'Other']
  },
  passportNumber: {
    type: String
  },
  passportExpiry: {
    type: Date
  },
  nationality: {
    type: String
  },
  email: {
    type: String
  },
  phone: {
    type: String
  },
  seatNumber: {
    type: String
  },
  mealPreference: {
    type: String
  },
  specialAssistance: {
    type: Boolean,
    default: false
  },
  baggage: {
    carryOn: {
      type: String,
      default: '7kg'
    },
    checked: {
      type: String,
      default: 'none'
    }
  },
  addOns: {
    seatSelection: {
      type: Boolean,
      default: false
    },
    meals: [{
      type: String
    }],
    extraBaggage: {
      type: Object
    }
  }
}, { _id: false });

const flightBookingSchema = new mongoose.Schema({
  bookingReference: {
    type: String,
    required: true,
    unique: true,
    uppercase: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  flight: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Flight',
    required: true
  },
  returnFlight: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Flight'
  },
  tripType: {
    type: String,
    enum: ['oneway', 'return', 'multicity'],
    required: true
  },
  class: {
    type: String,
    enum: ['economy', 'business', 'first'],
    required: true
  },
  passengers: [passengerSchema],
  departureDate: {
    type: Date,
    required: true
  },
  returnDate: {
    type: Date
  },
  pricing: {
    baseAmount: {
      type: Number,
      required: true
    },
    addOnsAmount: {
      type: Number,
      default: 0
    },
    totalAmount: {
      type: Number,
      required: true
    },
    currency: {
      type: String,
      default: 'NPR'
    }
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'cancelled', 'completed'],
    default: 'pending'
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'refunded', 'failed'],
    default: 'pending'
  },
  paymentId: {
    type: String
  },
  specialRequirements: {
    type: String
  },
  cancellationReason: {
    type: String
  },
  refundAmount: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Indexes
flightBookingSchema.index({ user: 1, createdAt: -1 });
flightBookingSchema.index({ bookingReference: 1 });

module.exports = mongoose.model('FlightBooking', flightBookingSchema);
```

### 5. Helicopter Model
```javascript
// models/Helicopter.js
const mongoose = require('mongoose');

const helicopterSchema = new mongoose.Schema({
  helicopterNumber: {
    type: String,
    required: true,
    unique: true,
    uppercase: true
  },
  model: {
    type: String,
    required: true
  },
  capacity: {
    type: Number,
    required: true,
    min: 1,
    max: 6
  },
  operator: {
    type: String,
    required: true
  },
  baseLocation: {
    type: String,
    required: true
  },
  availableLocations: [{
    type: String
  }],
  pricing: {
    basePricePerHour: {
      type: Number,
      required: true
    },
    scenicTour: {
      type: Number
    },
    charter: {
      type: Number
    },
    mountainLanding: {
      type: Number
    },
    airportTransfer: {
      type: Number
    },
    rescue: {
      type: Number
    }
  },
  status: {
    type: String,
    enum: ['available', 'booked', 'maintenance'],
    default: 'available'
  },
  images: [{
    type: String
  }],
  specifications: {
    maxSpeed: String,
    range: String,
    engine: String
  }
}, {
  timestamps: true
});

helicopterSchema.index({ baseLocation: 1, status: 1 });

module.exports = mongoose.model('Helicopter', helicopterSchema);
```

### 6. Helicopter Booking Model
```javascript
// models/HelicopterBooking.js
const mongoose = require('mongoose');

const helicopterBookingSchema = new mongoose.Schema({
  bookingReference: {
    type: String,
    required: true,
    unique: true,
    uppercase: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  helicopter: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Helicopter',
    required: true
  },
  serviceType: {
    type: String,
    enum: ['scenic', 'charter', 'mountain', 'transfer', 'rescue'],
    required: true
  },
  pickupLocation: {
    type: String,
    required: true
  },
  dropoffLocation: {
    type: String,
    required: true
  },
  bookingDate: {
    type: Date,
    required: true
  },
  bookingTime: {
    type: String,
    required: true // Format: "HH:MM"
  },
  passengers: {
    type: Number,
    required: true,
    min: 1,
    max: 6
  },
  durationHours: {
    type: Number,
    default: 1
  },
  pricing: {
    baseAmount: {
      type: Number,
      required: true
    },
    totalAmount: {
      type: Number,
      required: true
    },
    currency: {
      type: String,
      default: 'NPR'
    }
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'cancelled', 'completed'],
    default: 'pending'
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'refunded', 'failed'],
    default: 'pending'
  },
  paymentId: {
    type: String
  },
  specialRequirements: {
    type: String
  }
}, {
  timestamps: true
});

helicopterBookingSchema.index({ user: 1, createdAt: -1 });
helicopterBookingSchema.index({ bookingReference: 1 });

module.exports = mongoose.model('HelicopterBooking', helicopterBookingSchema);
```

### 7. Hotel Model
```javascript
// models/Hotel.js
const mongoose = require('mongoose');

const hotelSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  location: {
    type: String,
    required: true
  },
  city: {
    type: String,
    required: true
  },
  country: {
    type: String,
    required: true
  },
  description: {
    type: String
  },
  rating: {
    type: Number,
    min: 0,
    max: 5,
    default: 0
  },
  starRating: {
    type: Number,
    min: 1,
    max: 5
  },
  images: [{
    type: String
  }],
  amenities: [{
    type: String
  }],
  pricing: {
    basePricePerNight: {
      type: Number,
      required: true
    },
    currency: {
      type: String,
      default: 'NPR'
    }
  },
  rooms: [{
    type: {
      type: String, // 'single', 'double', 'suite'
      required: true
    },
    price: {
      type: Number,
      required: true
    },
    available: {
      type: Number,
      default: 0
    }
  }],
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

hotelSchema.index({ city: 1, isActive: 1 });
hotelSchema.index({ location: 'text', name: 'text' });

module.exports = mongoose.model('Hotel', hotelSchema);
```

### 8. Package Model
```javascript
// models/Package.js
const mongoose = require('mongoose');

const packageSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  destination: {
    type: String,
    required: true
  },
  description: {
    type: String
  },
  duration: {
    days: {
      type: Number,
      required: true
    },
    nights: {
      type: Number,
      required: true
    }
  },
  images: [{
    type: String
  }],
  pricing: {
    originalPrice: {
      type: Number,
      required: true
    },
    discountedPrice: {
      type: Number
    },
    discountPercentage: {
      type: Number,
      default: 0
    },
    currency: {
      type: String,
      default: 'NPR'
    }
  },
  highlights: [{
    type: String
  }],
  includes: [{
    type: String
  }],
  excludes: [{
    type: String
  }],
  itinerary: [{
    day: Number,
    title: String,
    description: String,
    activities: [String],
    meals: [String],
    accommodation: String
  }],
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

packageSchema.index({ destination: 1, isActive: 1 });
packageSchema.index({ title: 'text', destination: 'text' });

module.exports = mongoose.model('Package', packageSchema);
```

### 9. Payment Model
```javascript
// models/Payment.js
const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  paymentId: {
    type: String,
    required: true,
    unique: true
  },
  bookingId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  bookingType: {
    type: String,
    enum: ['flight', 'helicopter', 'package', 'hotel'],
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  currency: {
    type: String,
    default: 'NPR'
  },
  paymentMethod: {
    type: String,
    enum: ['card', 'bank_transfer', 'wallet', 'cash']
  },
  paymentGateway: {
    type: String,
    enum: ['stripe', 'razorpay', 'paypal']
  },
  gatewayTransactionId: {
    type: String
  },
  gatewayResponse: {
    type: mongoose.Schema.Types.Mixed
  },
  status: {
    type: String,
    enum: ['pending', 'success', 'failed', 'refunded'],
    default: 'pending'
  },
  paymentDate: {
    type: Date
  },
  refundAmount: {
    type: Number,
    default: 0
  },
  refundDate: {
    type: Date
  }
}, {
  timestamps: true
});

paymentSchema.index({ user: 1, createdAt: -1 });
paymentSchema.index({ paymentId: 1 });

module.exports = mongoose.model('Payment', paymentSchema);
```

---

## 🔌 API Endpoints (Same as before, but with MongoDB queries)

### Database Connection (config/database.js)
```javascript
const mongoose = require('mongoose');
require('dotenv').config();

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

module.exports = connectDB;
```

### Auth Controller (MongoDB Version)
```javascript
// controllers/authController.js
const User = require('../models/User');
const Admin = require('../models/Admin');
const { generateToken } = require('../config/jwt');

// User Registration
const register = async (req, res) => {
  try {
    const { email, password, firstName, lastName, phone } = req.body;

    // Check if user exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: 'User already exists with this email'
      });
    }

    // Create user
    const user = await User.create({
      email: email.toLowerCase(),
      password,
      firstName,
      lastName,
      phone
    });

    // Generate token
    const token = generateToken({
      userId: user._id,
      email: user.email,
      role: user.role
    });

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: {
        user: {
          id: user._id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName
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

    // Find user
    const user = await User.findOne({ email: email.toLowerCase() });

    if (!user || !user.isActive) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Verify password
    const isValidPassword = await user.comparePassword(password);

    if (!isValidPassword) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Generate token
    const token = generateToken({
      userId: user._id,
      email: user.email,
      role: user.role
    });

    res.json({
      success: true,
      message: 'Login successful',
      data: {
        user: {
          id: user._id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
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

    const admin = await Admin.findOne({ email: email.toLowerCase() });

    if (!admin || !admin.isActive) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    const isValidPassword = await admin.comparePassword(password);

    if (!isValidPassword) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    const token = generateToken({
      adminId: admin._id,
      email: admin.email,
      role: admin.role
    });

    res.json({
      success: true,
      message: 'Admin login successful',
      data: {
        admin: {
          id: admin._id,
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

### Flight Controller (MongoDB Version)
```javascript
// controllers/flightController.js
const Flight = require('../models/Flight');

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

    const totalPassengers = (passengers?.adults || 0) + 
                           (passengers?.children || 0) + 
                           (passengers?.infants || 0);

    // Build query
    const query = {
      from: { $regex: from, $options: 'i' },
      to: { $regex: to, $options: 'i' },
      departureDate: new Date(departureDate),
      status: 'scheduled'
    };

    // Add seat availability check based on class
    if (classType === 'economy') {
      query['seats.economy.available'] = { $gte: totalPassengers };
    } else if (classType === 'business') {
      query['seats.business.available'] = { $gte: totalPassengers };
    } else if (classType === 'firstClass') {
      query['seats.firstClass.available'] = { $gte: totalPassengers };
    }

    const flights = await Flight.find(query)
      .sort({ departureTime: 1 })
      .lean();

    // Format response
    const formattedFlights = flights.map(flight => {
      let price = flight.pricing.base;
      if (classType === 'economy') {
        price = flight.pricing.economy;
      } else if (classType === 'business') {
        price = flight.pricing.business;
      } else if (classType === 'firstClass') {
        price = flight.pricing.firstClass;
      }

      return {
        id: flight._id,
        flightNumber: flight.flightNumber,
        airline: flight.airline,
        from: flight.from,
        to: flight.to,
        departureTime: flight.departureTime,
        arrivalTime: flight.arrivalTime,
        departureDate: flight.departureDate,
        arrivalDate: flight.arrivalDate,
        duration: formatDuration(flight.durationMinutes),
        stops: flight.stops,
        stopLocations: flight.stopLocations || [],
        price: price,
        availableSeats: classType === 'economy' 
          ? flight.seats.economy.available 
          : classType === 'business'
          ? flight.seats.business.available
          : flight.seats.firstClass.available,
        class: classType
      };
    });

    res.json({
      success: true,
      data: {
        flights: formattedFlights,
        totalResults: formattedFlights.length
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

    const flight = await Flight.findById(id);

    if (!flight) {
      return res.status(404).json({
        success: false,
        message: 'Flight not found'
      });
    }

    res.json({
      success: true,
      data: {
        flight: {
          id: flight._id,
          flightNumber: flight.flightNumber,
          airline: flight.airline,
          aircraftType: flight.aircraftType,
          from: flight.from,
          to: flight.to,
          departureTime: flight.departureTime,
          arrivalTime: flight.arrivalTime,
          departureDate: flight.departureDate,
          arrivalDate: flight.arrivalDate,
          duration: formatDuration(flight.durationMinutes),
          stops: flight.stops,
          stopLocations: flight.stopLocations || [],
          pricing: {
            economy: flight.pricing.economy,
            business: flight.pricing.business,
            firstClass: flight.pricing.firstClass
          },
          seats: flight.seats,
          status: flight.status,
          amenities: flight.amenities || []
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

const formatDuration = (minutes) => {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${hours}h ${mins}m`;
};

module.exports = { searchFlights, getFlightDetails };
```

### Booking Controller (MongoDB Version)
```javascript
// controllers/bookingController.js
const FlightBooking = require('../models/FlightBooking');
const Flight = require('../models/Flight');
const { v4: uuidv4 } = require('uuid');

// Generate booking reference
const generateBookingReference = () => {
  return 'BK' + Date.now().toString(36).toUpperCase() + 
         Math.random().toString(36).substr(2, 5).toUpperCase();
};

// Create Flight Booking
const createFlightBooking = async (req, res) => {
  try {
    const {
      flightId,
      returnFlightId,
      tripType,
      class: classType,
      passengers,
      addOns
    } = req.body;

    const userId = req.user.userId;

    // Get flight details
    const flight = await Flight.findById(flightId);

    if (!flight) {
      return res.status(404).json({
        success: false,
        message: 'Flight not found'
      });
    }

    const totalPassengers = passengers.length;

    // Check seat availability
    let availableSeats = 0;
    if (classType === 'economy') {
      availableSeats = flight.seats.economy.available;
    } else if (classType === 'business') {
      availableSeats = flight.seats.business.available;
    } else if (classType === 'first') {
      availableSeats = flight.seats.firstClass.available;
    }

    if (availableSeats < totalPassengers) {
      return res.status(400).json({
        success: false,
        message: 'Not enough seats available'
      });
    }

    // Calculate total amount
    let basePrice = 0;
    if (classType === 'economy') {
      basePrice = flight.pricing.economy;
    } else if (classType === 'business') {
      basePrice = flight.pricing.business;
    } else if (classType === 'first') {
      basePrice = flight.pricing.firstClass;
    }

    let totalAmount = basePrice * totalPassengers;
    let addOnsAmount = 0;

    // Calculate add-ons
    if (addOns) {
      // Seat selection: 1500 per passenger
      if (addOns.seatSelection) {
        addOnsAmount += 1500 * totalPassengers;
      }
      // Meals: 800 per meal
      if (addOns.meals) {
        addOnsAmount += 800 * addOns.meals.length * totalPassengers;
      }
      // Baggage calculations
      // ... add baggage pricing logic
    }

    totalAmount += addOnsAmount;

    // Handle return flight
    let returnFlight = null;
    if (tripType === 'return' && returnFlightId) {
      returnFlight = await Flight.findById(returnFlightId);
      if (returnFlight) {
        let returnPrice = 0;
        if (classType === 'economy') {
          returnPrice = returnFlight.pricing.economy;
        } else if (classType === 'business') {
          returnPrice = returnFlight.pricing.business;
        } else if (classType === 'first') {
          returnPrice = returnFlight.pricing.firstClass;
        }
        totalAmount += returnPrice * totalPassengers;
      }
    }

    // Create booking
    const booking = await FlightBooking.create({
      bookingReference: generateBookingReference(),
      user: userId,
      flight: flightId,
      returnFlight: returnFlightId || null,
      tripType,
      class: classType,
      passengers: passengers.map(p => ({
        title: p.title,
        firstName: p.firstName,
        lastName: p.lastName,
        dateOfBirth: p.dateOfBirth,
        gender: p.gender,
        passportNumber: p.passportNumber,
        passportExpiry: p.passportExpiry,
        nationality: p.nationality,
        email: p.email,
        phone: p.phone,
        baggage: {
          carryOn: p.baggage?.carryOn || '7kg',
          checked: p.baggage?.checked || 'none'
        },
        addOns: {
          seatSelection: addOns?.seatSelection || false,
          meals: addOns?.meals || [],
          extraBaggage: addOns?.extraBaggage || {}
        }
      })),
      departureDate: flight.departureDate,
      returnDate: tripType === 'return' && returnFlight 
        ? returnFlight.departureDate 
        : null,
      pricing: {
        baseAmount: basePrice * totalPassengers,
        addOnsAmount,
        totalAmount,
        currency: 'NPR'
      },
      status: 'pending',
      paymentStatus: 'pending'
    });

    // Update available seats
    const seatUpdateField = classType === 'economy' 
      ? 'seats.economy.available'
      : classType === 'business'
      ? 'seats.business.available'
      : 'seats.firstClass.available';

    await Flight.findByIdAndUpdate(flightId, {
      $inc: { [seatUpdateField]: -totalPassengers }
    });

    if (returnFlight) {
      await Flight.findByIdAndUpdate(returnFlightId, {
        $inc: { [seatUpdateField]: -totalPassengers }
      });
    }

    res.status(201).json({
      success: true,
      message: 'Booking created successfully',
      data: {
        booking: {
          bookingReference: booking.bookingReference,
          totalAmount: booking.pricing.totalAmount,
          status: booking.status,
          passengers: booking.passengers.length
        }
      }
    });
  } catch (error) {
    console.error('Create booking error:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating booking'
    });
  }
};

// Get User Bookings
const getUserBookings = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { status, page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;

    const query = { user: userId };
    if (status) {
      query.status = status;
    }

    const bookings = await FlightBooking.find(query)
      .populate('flight', 'flightNumber airline from to')
      .populate('returnFlight', 'flightNumber airline from to')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .lean();

    const total = await FlightBooking.countDocuments(query);

    res.json({
      success: true,
      data: {
        bookings: bookings.map(booking => ({
          id: booking._id,
          bookingReference: booking.bookingReference,
          flight: {
            flightNumber: booking.flight.flightNumber,
            airline: booking.flight.airline,
            from: booking.flight.from,
            to: booking.flight.to
          },
          returnFlight: booking.returnFlight ? {
            flightNumber: booking.returnFlight.flightNumber,
            airline: booking.returnFlight.airline,
            from: booking.returnFlight.from,
            to: booking.returnFlight.to
          } : null,
          departureDate: booking.departureDate,
          returnDate: booking.returnDate,
          tripType: booking.tripType,
          class: booking.class,
          totalAmount: booking.pricing.totalAmount,
          status: booking.status,
          paymentStatus: booking.paymentStatus,
          createdAt: booking.createdAt
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

---

## 📝 Environment Variables (.env)

```env
# Server
PORT=3000
NODE_ENV=development

# MongoDB
MONGODB_URI=mongodb://localhost:27017/travel_booking
# Or for MongoDB Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/travel_booking?retryWrites=true&w=majority

# JWT
JWT_SECRET=your_super_secret_jwt_key_change_this
JWT_EXPIRES_IN=24h
JWT_REFRESH_SECRET=your_refresh_secret
JWT_REFRESH_EXPIRES_IN=7d

# Frontend URL
FRONTEND_URL=http://localhost:5173

# Payment Gateway
STRIPE_SECRET_KEY=sk_test_...
RAZORPAY_KEY_ID=rzp_test_...
RAZORPAY_KEY_SECRET=...

# Email
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASSWORD=your_app_password
```

---

## 🚀 Quick Start

### 1. Install Dependencies
```bash
npm install express mongoose bcryptjs jsonwebtoken dotenv cors helmet express-rate-limit joi nodemailer uuid
npm install --save-dev nodemon
```

### 2. Update package.json
```json
{
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js"
  }
}
```

### 3. Update server.js
```javascript
const express = require('express');
const connectDB = require('./config/database');
require('dotenv').config();

// Connect to MongoDB
connectDB();

const app = express();
// ... rest of server setup
```

### 4. Start MongoDB
```bash
# Local MongoDB
mongod

# Or use MongoDB Atlas (cloud)
# Just update MONGODB_URI in .env
```

### 5. Run Server
```bash
npm run dev
```

---

## ✅ Advantages of MongoDB

1. **Flexible Schema**: Easy to modify schemas without migrations
2. **JSON-like Documents**: Natural fit for JavaScript/Node.js
3. **Horizontal Scaling**: Easy to scale with sharding
4. **Rich Queries**: Powerful query language
5. **Embedded Documents**: Store related data together (passengers in bookings)
6. **No Joins**: Faster reads for nested data

---

This MongoDB version provides the same functionality with a more flexible and scalable database solution!

