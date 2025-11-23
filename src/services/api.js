/**
 * API Service for Backend Communication
 * Base URL: http://localhost:5001/api
 */

const API_BASE_URL = 'http://localhost:5001/api';

/**
 * Generic API request function
 */
const apiRequest = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  // For admin endpoints, use only adminToken; for user endpoints, use userToken
  // Hotel bookings can be done without authentication (guest bookings)
  const isAdminEndpoint = endpoint.startsWith('/admin');
  const isGuestBooking = endpoint === '/bookings/hotels' && options.method === 'POST';
  const userToken = localStorage.getItem('userToken');
  const token = isAdminEndpoint 
    ? localStorage.getItem('adminToken')
    : isGuestBooking 
      ? userToken || null // Use token if available, but don't require it for guest bookings
      : userToken;
  
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
    ...options,
  };

  try {
    const response = await fetch(url, config);
    const data = await response.json();

    if (!response.ok) {
      const error = new Error(data.message || data.error || 'An error occurred');
      error.response = { data, status: response.status };
      throw error;
    }

    // Normalize response - extract data if it exists, but preserve top-level fields like bookingReference
    if (data.data) {
      // Merge top-level fields (like bookingReference) with data object
      return {
        ...data.data,
        // Preserve important top-level fields
        bookingReference: data.bookingReference || data.data.bookingReference,
        success: data.success,
        message: data.message
      };
    }
    
    // For responses without data wrapper, return the whole response
    return data;
  } catch (error) {
    console.error('API Error:', error);
    // If it's not already an Error with response, preserve the original error
    if (!error.response) {
      error.response = { data: { message: error.message }, status: 0 };
    }
    throw error;
  }
};

/**
 * Auth API
 */
export const authAPI = {
  // User Registration
  register: async (userData) => {
    return apiRequest('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  },

  // User Login
  login: async (email, password) => {
    return apiRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  },

  // Admin Login
  adminLogin: async (email, password) => {
    return apiRequest('/auth/admin/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  },

  // Get Current User
  getCurrentUser: async () => {
    return apiRequest('/auth/me');
  },
};

/**
 * Flights API
 */
export const flightsAPI = {
  // Search Flights
  search: async (searchParams) => {
    return apiRequest('/flights/search', {
      method: 'POST',
      body: JSON.stringify(searchParams),
    });
  },

  // Get Flight by ID
  getById: async (flightId) => {
    return apiRequest(`/flights/${flightId}`);
  },

  // Get Popular Flights
  getPopular: async () => {
    return apiRequest('/flights/popular');
  },
};

/**
 * Bookings API
 */
export const bookingsAPI = {
  // Create Flight Booking
  createFlightBooking: async (bookingData) => {
    return apiRequest('/bookings/flights', {
      method: 'POST',
      body: JSON.stringify(bookingData),
    });
  },

  // Create Package Booking
  createPackageBooking: async (bookingData) => {
    return apiRequest('/bookings/packages', {
      method: 'POST',
      body: JSON.stringify(bookingData),
    });
  },

  // Create Helicopter Booking
  createHelicopterBooking: async (bookingData) => {
    return apiRequest('/bookings/helicopters', {
      method: 'POST',
      body: JSON.stringify(bookingData),
    });
  },

  // Create Package Booking
  createPackageBooking: async (bookingData) => {
    return apiRequest('/bookings/packages', {
      method: 'POST',
      body: JSON.stringify(bookingData),
    });
  },

  // Create Hotel Booking
  createHotelBooking: async (bookingData) => {
    return apiRequest('/bookings/hotels', {
      method: 'POST',
      body: JSON.stringify(bookingData),
    });
  },

  // Get User Bookings
  getUserBookings: async () => {
    return apiRequest('/bookings/my-bookings');
  },

  // Get User Flight Bookings
  getUserFlightBookings: async () => {
    return apiRequest('/bookings/flights');
  },

  // Get User Package Bookings
  getUserPackageBookings: async () => {
    return apiRequest('/bookings/packages');
  },

  // Get User Helicopter Bookings
  getUserHelicopterBookings: async () => {
    return apiRequest('/bookings/helicopters');
  },

  // Get User Hotel Bookings
  getUserHotelBookings: async () => {
    return apiRequest('/bookings/hotels');
  },

  // Get Booking by Reference
  getByReference: async (reference) => {
    return apiRequest(`/bookings/reference/${reference}`);
  },

  // Cancel Booking
  cancelBooking: async (bookingType, bookingId, reason) => {
    return apiRequest(`/bookings/${bookingType}/${bookingId}/cancel`, {
      method: 'PUT',
      body: JSON.stringify({ reason }),
    });
  },
};

/**
 * Packages API
 */
export const packagesAPI = {
  // Get All Packages
  getAll: async () => {
    return apiRequest('/packages');
  },

  // Get Package by ID
  getById: async (packageId) => {
    return apiRequest(`/packages/${packageId}`);
  },

  // Get Popular Packages
  getPopular: async () => {
    return apiRequest('/packages/popular');
  },
};

/**
 * Helicopters API
 */
export const helicoptersAPI = {
  // Get All Helicopters
  getAll: async () => {
    return apiRequest('/helicopters');
  },

  // Get Helicopter by ID
  getById: async (helicopterId) => {
    return apiRequest(`/helicopters/${helicopterId}`);
  },
};

/**
 * Hotels API
 */
export const hotelsAPI = {
  // Get All Hotels
  getAll: async () => {
    return apiRequest('/hotels');
  },

  // Get Hotel by ID
  getById: async (hotelId) => {
    return apiRequest(`/hotels/${hotelId}`);
  },

  // Search Hotels
  search: async (searchParams) => {
    return apiRequest('/hotels/search', {
      method: 'POST',
      body: JSON.stringify(searchParams),
    });
  },
};

/**
 * User API
 */
export const userAPI = {
  // Get User Profile
  getProfile: async () => {
    return apiRequest('/users/profile');
  },

  // Update User Profile
  updateProfile: async (userData) => {
    return apiRequest('/users/profile', {
      method: 'PUT',
      body: JSON.stringify(userData),
    });
  },
};

/**
 * Admin API
 */
export const adminAPI = {
  // Get Dashboard Stats
  getDashboard: async () => {
    return apiRequest('/admin/dashboard');
  },

  // Get All Bookings
  getAllBookings: async () => {
    return apiRequest('/admin/bookings');
  },

  // Get Flight Bookings
  getFlightBookings: async () => {
    return apiRequest('/admin/bookings/flights');
  },

  // Get Package Bookings
  getPackageBookings: async () => {
    return apiRequest('/admin/bookings/packages');
  },

  // Get Helicopter Bookings
  getHelicopterBookings: async () => {
    return apiRequest('/admin/bookings/helicopters');
  },

  // Get Hotel Bookings
  getHotelBookings: async () => {
    return apiRequest('/admin/bookings/hotels');
  },

  // Get All Inquiries
  getInquiries: async () => {
    return apiRequest('/admin/inquiries');
  },

  // Update Inquiry Status
  updateInquiryStatus: async (inquiryId, status, response) => {
    return apiRequest(`/admin/inquiries/${inquiryId}`, {
      method: 'PUT',
      body: JSON.stringify({ status, response }),
    });
  },

  // Get All Users
  getUsers: async () => {
    return apiRequest('/admin/users');
  },

  // Update Booking Status
  updateBookingStatus: async (bookingType, bookingId, status) => {
    return apiRequest(`/admin/bookings/${bookingType}/${bookingId}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
    });
  },

  // Get All Packages (Admin)
  getAllPackages: async () => {
    return apiRequest('/admin/packages');
  },

  // Create Package
  createPackage: async (packageData) => {
    return apiRequest('/admin/packages', {
      method: 'POST',
      body: JSON.stringify(packageData),
    });
  },

  // Update Package
  updatePackage: async (packageId, packageData) => {
    return apiRequest(`/admin/packages/${packageId}`, {
      method: 'PUT',
      body: JSON.stringify(packageData),
    });
  },

  // Delete Package
  deletePackage: async (packageId) => {
    return apiRequest(`/admin/packages/${packageId}`, {
      method: 'DELETE',
    });
  },

  // Get All Helicopters (Admin)
  getAllHelicopters: async () => {
    return apiRequest('/admin/helicopters');
  },

  // Create Helicopter
  createHelicopter: async (helicopterData) => {
    return apiRequest('/admin/helicopters', {
      method: 'POST',
      body: JSON.stringify(helicopterData),
    });
  },

  // Update Helicopter
  updateHelicopter: async (helicopterId, helicopterData) => {
    return apiRequest(`/admin/helicopters/${helicopterId}`, {
      method: 'PUT',
      body: JSON.stringify(helicopterData),
    });
  },

  // Delete Helicopter
  deleteHelicopter: async (helicopterId) => {
    return apiRequest(`/admin/helicopters/${helicopterId}`, {
      method: 'DELETE',
    });
  },

  // Get All Hotels (Admin)
  getAllHotels: async () => {
    return apiRequest('/admin/hotels');
  },

  // Create Hotel
  createHotel: async (hotelData) => {
    return apiRequest('/admin/hotels', {
      method: 'POST',
      body: JSON.stringify(hotelData),
    });
  },

  // Update Hotel
  updateHotel: async (hotelId, hotelData) => {
    return apiRequest(`/admin/hotels/${hotelId}`, {
      method: 'PUT',
      body: JSON.stringify(hotelData),
    });
  },

  // Delete Hotel
  deleteHotel: async (hotelId) => {
    return apiRequest(`/admin/hotels/${hotelId}`, {
      method: 'DELETE',
    });
  },

  // Get All Inquiries
  getInquiries: async () => {
    return apiRequest('/admin/inquiries');
  },

  // Update Inquiry Status
  updateInquiryStatus: async (inquiryId, status) => {
    return apiRequest(`/admin/inquiries/${inquiryId}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
    });
  },
};

/**
 * Inquiries API
 */
export const inquiriesAPI = {
  // Create Inquiry
  create: async (inquiryData) => {
    return apiRequest('/inquiries', {
      method: 'POST',
      body: JSON.stringify(inquiryData),
    });
  },
};

export default {
  authAPI,
  flightsAPI,
  bookingsAPI,
  packagesAPI,
  helicoptersAPI,
  hotelsAPI,
  userAPI,
  adminAPI,
  inquiriesAPI,
};

