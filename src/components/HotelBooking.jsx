import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import {
  UserIcon,
  CreditCardIcon,
  MapPinIcon,
  CheckCircleIcon,
  CalendarIcon,
  BuildingOfficeIcon
} from '@heroicons/react/24/outline';
import { hotelsAPI, bookingsAPI } from '../services/api';

const HotelBooking = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [hotel, setHotel] = useState(null);
  const [isLoadingHotel, setIsLoadingHotel] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  
  // Booking data
  const [bookingData, setBookingData] = useState({
    checkIn: '',
    checkOut: '',
    guests: {
      adults: 1,
      children: 0
    },
    rooms: 1,
    selectedRoom: null,
    guestDetails: [],
    specialRequirements: ''
  });
  
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('');
  const [paymentData, setPaymentData] = useState({
    cardNumber: '',
    cardHolder: '',
    expiryDate: '',
    cvv: '',
    billingAddress: ''
  });
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Check login status
  useEffect(() => {
    const checkLogin = () => {
      const token = localStorage.getItem('userToken');
      setIsLoggedIn(!!token);
    };
    checkLogin();
    // Check periodically in case user logs in from another tab
    const interval = setInterval(checkLogin, 1000);
    return () => clearInterval(interval);
  }, []);

  // Fetch hotel data and restore pending booking if exists
  useEffect(() => {
    const fetchHotel = async () => {
      if (!id) return;
      
      setIsLoadingHotel(true);
      setError(null);
      try {
        // Check for pending booking data (after login)
        const pendingBooking = localStorage.getItem('pendingHotelBooking');
        if (pendingBooking) {
          try {
            const savedData = JSON.parse(pendingBooking);
            if (savedData.returnUrl === `/hotel-booking/${id}`) {
              // Restore saved booking data
              if (savedData.hotel) {
                setHotel(savedData.hotel);
              }
              if (savedData.bookingData) {
                setBookingData(savedData.bookingData);
              }
              if (savedData.selectedPaymentMethod) {
                setSelectedPaymentMethod(savedData.selectedPaymentMethod);
              }
              if (savedData.paymentData) {
                setPaymentData(savedData.paymentData);
              }
              // Clear pending booking
              localStorage.removeItem('pendingHotelBooking');
              // Show message
              alert('Welcome back! Your booking details have been restored. Please complete your booking.');
            }
          } catch (e) {
            console.error('Error restoring booking data:', e);
          }
        }

        // Check if hotel data is passed from previous page
        const hotelFromState = location.state?.hotel;
        if (hotelFromState) {
          // Ensure hotel has both id and _id for compatibility
          const hotelWithId = {
            ...hotelFromState,
            id: hotelFromState.id || hotelFromState._id || id,
            _id: hotelFromState._id || hotelFromState.id || id
          };
          setHotel(hotelWithId);
          // Initialize booking data from state if available
          if (location.state?.bookingData) {
            setBookingData(prev => ({
              ...prev,
              ...location.state.bookingData
            }));
          }
        } else {
          // Fetch from backend
          const response = await hotelsAPI.getById(id);
          const hotelData = response.hotel || response;
          
          // Transform backend data
          const transformedHotel = {
            id: hotelData.id || hotelData._id || id,
            _id: hotelData._id || hotelData.id || id,
            name: hotelData.name,
            location: hotelData.location,
            address: hotelData.address,
            phone: hotelData.contact?.phone || hotelData.phone,
            email: hotelData.contact?.email || hotelData.email,
            description: hotelData.description,
            image: hotelData.images?.[0] || hotelData.image,
            gallery: hotelData.images || [hotelData.image],
            rating: hotelData.rating || 0,
            reviews: hotelData.reviews || 0,
            stars: hotelData.stars || 0,
            amenities: hotelData.amenities || [],
            rooms: hotelData.rooms || [],
            pricing: hotelData.pricing,
            pricePerNight: hotelData.pricing?.basePrice || hotelData.pricing?.basePricePerNight || hotelData.pricePerNight || 0,
            policies: hotelData.policies || {
              checkIn: '3:00 PM',
              checkOut: '12:00 PM',
              cancellation: 'Free cancellation up to 24 hours before check-in'
            }
          };
          
          setHotel(transformedHotel);
        }
      } catch (err) {
        console.error('Error fetching hotel:', err);
        setError(err.message || 'Failed to load hotel details');
      } finally {
        setIsLoadingHotel(false);
      }
    };

    fetchHotel();
  }, [id, location.state]);

  // Initialize guest details based on number of guests
  useEffect(() => {
    const totalGuests = bookingData.guests.adults + bookingData.guests.children;
    const guestDetails = Array.from({ length: totalGuests }, (_, index) => ({
      id: index + 1,
      title: '',
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      isAdult: index < bookingData.guests.adults
    }));

    setBookingData(prev => ({
      ...prev,
      guestDetails
    }));
  }, [bookingData.guests.adults, bookingData.guests.children]);

  const calculateNights = () => {
    if (bookingData.checkIn && bookingData.checkOut) {
      const checkIn = new Date(bookingData.checkIn);
      const checkOut = new Date(bookingData.checkOut);
      const diffTime = Math.abs(checkOut - checkIn);
      return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    }
    return 0;
  };

  const calculateTotalPrice = () => {
    if (!hotel || !bookingData.selectedRoom || calculateNights() === 0) return 0;
    
    // Get price from selected room or hotel base price
    let pricePerNight = 0;
    const selectedRoom = bookingData.selectedRoom;
    
    if (selectedRoom.price) {
      // Handle both string (e.g., "Rs.25,000") and number formats
      if (typeof selectedRoom.price === 'string') {
        pricePerNight = parseInt(selectedRoom.price.replace(/[^\d]/g, '')) || 0;
      } else if (typeof selectedRoom.price === 'number') {
        pricePerNight = selectedRoom.price;
      } else if (selectedRoom.pricing?.basePrice) {
        pricePerNight = selectedRoom.pricing.basePrice;
      }
    } else if (selectedRoom.pricing?.basePrice) {
      pricePerNight = selectedRoom.pricing.basePrice;
    } else if (hotel.pricePerNight) {
      pricePerNight = hotel.pricePerNight;
    } else if (hotel.pricing?.basePrice) {
      pricePerNight = hotel.pricing.basePrice;
    } else if (hotel.pricing?.basePricePerNight) {
      pricePerNight = hotel.pricing.basePricePerNight;
    }
    
    return pricePerNight * calculateNights() * bookingData.rooms;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setBookingData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleGuestChange = (index, field, value) => {
    const updatedGuests = [...bookingData.guestDetails];
    updatedGuests[index] = {
      ...updatedGuests[index],
      [field]: value
    };

    setBookingData(prev => ({
      ...prev,
      guestDetails: updatedGuests
    }));
  };

  const handleRoomSelection = (room) => {
    setBookingData(prev => ({
      ...prev,
      selectedRoom: room
    }));
  };

  const handleNext = () => {
    // Validate current step before proceeding
    if (currentStep === 1) {
      if (!bookingData.checkIn || !bookingData.checkOut) {
        alert('Please select check-in and check-out dates');
        return;
      }
      if (!bookingData.selectedRoom) {
        alert('Please select a room');
        return;
      }
      if (calculateNights() <= 0) {
        alert('Check-out date must be after check-in date');
        return;
      }
    } else if (currentStep === 2) {
      // Validate guest details
      const invalidGuests = bookingData.guestDetails.filter(g => 
        !g.firstName || !g.lastName || !g.email || !g.phone
      );
      if (invalidGuests.length > 0) {
        alert('Please fill in all required guest details');
        return;
      }
    }

    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    const token = localStorage.getItem('userToken');
    
    if (!selectedPaymentMethod) {
      alert('Please select a payment method');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      // Validate required fields
      if (!hotel || !hotel.id) {
        throw new Error('Hotel information is missing');
      }
      if (!bookingData.checkIn || !bookingData.checkOut) {
        throw new Error('Please select check-in and check-out dates');
      }
      if (!bookingData.selectedRoom) {
        throw new Error('Please select a room');
      }
      if (!bookingData.guestDetails || bookingData.guestDetails.length === 0) {
        throw new Error('Please fill in guest details');
      }

      const hotelId = hotel._id || hotel.id || id;
      if (!hotelId) {
        throw new Error('Hotel ID is missing. Please try again.');
      }

      // Get primary guest info for guest bookings
      const primaryGuest = bookingData.guestDetails && bookingData.guestDetails.length > 0 
        ? bookingData.guestDetails[0] 
        : null;
      
      const bookingPayload = {
        hotelId: hotelId,
        checkIn: bookingData.checkIn,
        checkOut: bookingData.checkOut,
        guests: bookingData.guests || { adults: 1, children: 0 },
        rooms: [{
          roomType: bookingData.selectedRoom?.name || bookingData.selectedRoom?.roomType || 'Standard Room',
          quantity: bookingData.rooms || 1,
          guests: (bookingData.guests?.adults || 1) + (bookingData.guests?.children || 0)
        }],
        guestDetails: (bookingData.guestDetails || []).map(g => ({
          title: g.title || '',
          firstName: g.firstName || '',
          lastName: g.lastName || '',
          email: g.email || '',
          phone: g.phone || ''
        })),
        specialRequirements: bookingData.specialRequirements || '',
        // For guest bookings (when not logged in)
        ...(token ? {} : {
          guestEmail: primaryGuest?.email || '',
          guestPhone: primaryGuest?.phone || '',
          guestName: primaryGuest ? `${primaryGuest.firstName || ''} ${primaryGuest.lastName || ''}`.trim() : ''
        })
      };

      console.log('Submitting booking payload:', bookingPayload);

      const response = await bookingsAPI.createHotelBooking(bookingPayload);
      
      const bookingRef = response.bookingReference || response.booking?.bookingReference || 'N/A';
      alert(`Booking successful! Booking Reference: ${bookingRef}\n\n${!token ? 'Please save this reference number. You can view your booking details using this reference.' : ''}`);
      
      // Clear any pending booking data
      localStorage.removeItem('pendingHotelBooking');
      
      // Navigate based on login status
      if (token) {
        navigate('/profile');
      } else {
        // For guest bookings, redirect to home with success message
        navigate('/', { 
          state: { 
            bookingSuccess: true,
            bookingReference: bookingRef
          } 
        });
      }
    } catch (err) {
      console.error('Booking error:', err);
      console.error('Error details:', {
        message: err.message,
        response: err.response?.data,
        status: err.response?.status
      });
      const errorMessage = err.response?.data?.message || err.message || 'Booking failed. Please try again.';
      setError(errorMessage);
      alert(`Booking failed: ${errorMessage}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const steps = [
    { number: 1, name: 'Booking Details', icon: CalendarIcon },
    { number: 2, name: 'Guest Information', icon: UserIcon },
    { number: 3, name: 'Payment', icon: CreditCardIcon }
  ];

  // Loading state
  if (isLoadingHotel) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mb-4"></div>
          <p className="text-gray-600">Loading hotel details...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !hotel) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error || 'Hotel not found'}</p>
          <button
            onClick={() => navigate('/hotels')}
            className="bg-orange-500 text-white px-6 py-2 rounded-lg hover:bg-orange-600"
          >
            Back to Hotels
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => navigate(`/hotels/${id}`)}
              className="text-orange-500 hover:text-orange-600 flex items-center"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to Hotel Details
            </button>
            <h1 className="text-2xl font-bold text-gray-900">Complete Your Booking</h1>
            <div className="w-24"></div> {/* Spacer for centering */}
          </div>
        </div>
      </div>

      {/* Progress Steps */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-center">
            {steps.map((step, index) => {
              const Icon = step.icon;
              return (
                <div key={step.number} className="flex items-center">
                  <div className={`flex flex-col items-center ${currentStep >= step.number ? 'text-orange-500' : 'text-gray-400'}`}>
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 ${
                      currentStep > step.number 
                        ? 'bg-orange-500 border-orange-500 text-white' 
                        : currentStep === step.number
                        ? 'border-orange-500 text-orange-500'
                        : 'border-gray-300 text-gray-400'
                    }`}>
                      {currentStep > step.number ? (
                        <CheckCircleIcon className="w-6 h-6" />
                      ) : (
                        <Icon className="w-5 h-5" />
                      )}
                    </div>
                    <span className="mt-2 text-xs sm:text-sm font-medium">{step.name}</span>
                  </div>
                  {index < steps.length - 1 && (
                    <div className={`w-16 sm:w-24 h-0.5 mx-2 sm:mx-4 ${
                      currentStep > step.number ? 'bg-orange-500' : 'bg-gray-300'
                    }`} />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Hotel Summary */}
            <div className="bg-white rounded-xl shadow-sm border p-6 mb-6">
              <div className="flex items-start gap-4">
                <img
                  src={hotel.image}
                  alt={hotel.name}
                  className="w-24 h-24 object-cover rounded-lg"
                />
                <div className="flex-1">
                  <h2 className="text-xl font-bold text-gray-900">{hotel.name}</h2>
                  <p className="text-gray-600 flex items-center mt-1">
                    <MapPinIcon className="w-4 h-4 mr-1" />
                    {hotel.location}
                  </p>
                  <div className="flex items-center mt-2">
                    {[...Array(hotel.stars || 0)].map((_, i) => (
                      <svg key={i} className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                    <span className="ml-2 text-sm text-gray-600">{hotel.rating} ({hotel.reviews} reviews)</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Step 1: Booking Details */}
            {currentStep === 1 && (
              <div className="space-y-6">
                {/* Dates and Guests */}
                <div className="bg-white rounded-xl shadow-sm border p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Booking Details</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Check-in Date <span className="text-orange-500">*</span>
                      </label>
                      <input
                        type="date"
                        name="checkIn"
                        value={bookingData.checkIn}
                        onChange={handleInputChange}
                        min={new Date().toISOString().split('T')[0]}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Check-out Date <span className="text-orange-500">*</span>
                      </label>
                      <input
                        type="date"
                        name="checkOut"
                        value={bookingData.checkOut}
                        onChange={handleInputChange}
                        min={bookingData.checkIn || new Date().toISOString().split('T')[0]}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Adults</label>
                      <select
                        value={bookingData.guests.adults}
                        onChange={(e) => setBookingData(prev => ({
                          ...prev,
                          guests: { ...prev.guests, adults: parseInt(e.target.value) }
                        }))}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                      >
                        {[1, 2, 3, 4, 5, 6].map(num => (
                          <option key={num} value={num}>{num} Adult{num > 1 ? 's' : ''}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Children</label>
                      <select
                        value={bookingData.guests.children}
                        onChange={(e) => setBookingData(prev => ({
                          ...prev,
                          guests: { ...prev.guests, children: parseInt(e.target.value) }
                        }))}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                      >
                        {[0, 1, 2, 3, 4].map(num => (
                          <option key={num} value={num}>{num} Child{num !== 1 ? 'ren' : ''}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Number of Rooms</label>
                      <select
                        name="rooms"
                        value={bookingData.rooms}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                      >
                        {[1, 2, 3, 4, 5].map(num => (
                          <option key={num} value={num}>{num} Room{num > 1 ? 's' : ''}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  {calculateNights() > 0 && (
                    <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                      <p className="text-sm text-gray-700">
                        <span className="font-medium">Duration:</span> {calculateNights()} night{calculateNights() !== 1 ? 's' : ''}
                      </p>
                    </div>
                  )}
                </div>

                {/* Room Selection */}
                <div className="bg-white rounded-xl shadow-sm border p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Select Your Room</h3>
                  <div className="space-y-4">
                    {hotel.rooms && hotel.rooms.length > 0 ? (
                      hotel.rooms.map((room) => (
                        <div
                          key={room.id || room._id}
                          className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
                            bookingData.selectedRoom?.id === room.id || 
                            bookingData.selectedRoom?._id === room._id
                              ? 'border-orange-500 bg-orange-50'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                          onClick={() => handleRoomSelection(room)}
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <h4 className="font-semibold text-gray-900">{room.name}</h4>
                              <p className="text-sm text-gray-600 mt-1">{room.description || room.occupancy}</p>
                              <div className="mt-2 flex flex-wrap gap-2">
                                {room.features && room.features.map((feature, idx) => (
                                  <span key={idx} className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded">
                                    {feature}
                                  </span>
                                ))}
                              </div>
                            </div>
                            <div className="text-right ml-4">
                              <div className="text-lg font-bold text-orange-500">
                                {(() => {
                                  if (room.price) {
                                    if (typeof room.price === 'string') {
                                      return room.price;
                                    } else if (typeof room.price === 'number') {
                                      return `Rs.${room.price.toLocaleString('en-IN')}`;
                                    } else if (room.pricing?.basePrice) {
                                      return `Rs.${room.pricing.basePrice.toLocaleString('en-IN')}`;
                                    }
                                  }
                                  const fallbackPrice = hotel.pricePerNight || hotel.pricing?.basePrice || hotel.pricing?.basePricePerNight || 0;
                                  return `Rs.${fallbackPrice.toLocaleString('en-IN')}`;
                                })()}
                              </div>
                              <div className="text-xs text-gray-500">per night</div>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-8 text-gray-500">
                        No rooms available
                      </div>
                    )}
                  </div>
                </div>

                {/* Special Requirements */}
                <div className="bg-white rounded-xl shadow-sm border p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Special Requirements (Optional)</h3>
                  <textarea
                    name="specialRequirements"
                    value={bookingData.specialRequirements}
                    onChange={handleInputChange}
                    rows={4}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                    placeholder="Any special requests or requirements..."
                  />
                </div>
              </div>
            )}

            {/* Step 2: Guest Information */}
            {currentStep === 2 && (
              <div className="space-y-6">
                <div className="bg-white rounded-xl shadow-sm border p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Guest Information</h3>
                  <div className="space-y-6">
                    {bookingData.guestDetails.map((guest, index) => (
                      <div key={guest.id} className="border-t pt-6 first:border-t-0 first:pt-0">
                        <h4 className="font-medium text-gray-900 mb-4">
                          {guest.isAdult ? 'Adult' : 'Child'} {index + 1}
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                            <select
                              value={guest.title}
                              onChange={(e) => handleGuestChange(index, 'title', e.target.value)}
                              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                            >
                              <option value="">Select</option>
                              <option value="Mr">Mr</option>
                              <option value="Mrs">Mrs</option>
                              <option value="Ms">Ms</option>
                              <option value="Dr">Dr</option>
                            </select>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              First Name <span className="text-orange-500">*</span>
                            </label>
                            <input
                              type="text"
                              value={guest.firstName}
                              onChange={(e) => handleGuestChange(index, 'firstName', e.target.value)}
                              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                              required
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Last Name <span className="text-orange-500">*</span>
                            </label>
                            <input
                              type="text"
                              value={guest.lastName}
                              onChange={(e) => handleGuestChange(index, 'lastName', e.target.value)}
                              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                              required
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Email <span className="text-orange-500">*</span>
                            </label>
                            <input
                              type="email"
                              value={guest.email}
                              onChange={(e) => handleGuestChange(index, 'email', e.target.value)}
                              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                              required
                            />
                          </div>
                          <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Phone <span className="text-orange-500">*</span>
                            </label>
                            <input
                              type="tel"
                              value={guest.phone}
                              onChange={(e) => handleGuestChange(index, 'phone', e.target.value)}
                              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                              placeholder="+977 98XXXXXXXX"
                              required
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Payment */}
            {currentStep === 3 && (
              <div className="space-y-6">
                <div className="bg-white rounded-xl shadow-sm border p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Payment Method</h3>
                  <div className="space-y-3">
                    {['Credit Card', 'Debit Card', 'Bank Transfer', 'Cash on Arrival'].map((method) => (
                      <label
                        key={method}
                        className={`flex items-center p-4 border-2 rounded-lg cursor-pointer transition-all ${
                          selectedPaymentMethod === method
                            ? 'border-orange-500 bg-orange-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <input
                          type="radio"
                          name="paymentMethod"
                          value={method}
                          checked={selectedPaymentMethod === method}
                          onChange={(e) => setSelectedPaymentMethod(e.target.value)}
                          className="text-orange-500 focus:ring-orange-500"
                        />
                        <span className="ml-3 font-medium text-gray-900">{method}</span>
                      </label>
                    ))}
                  </div>

                  {selectedPaymentMethod && (selectedPaymentMethod === 'Credit Card' || selectedPaymentMethod === 'Debit Card') && (
                    <div className="mt-6 pt-6 border-t border-gray-200">
                      <h4 className="font-medium text-gray-900 mb-4">Card Details</h4>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Card Number</label>
                          <input
                            type="text"
                            value={paymentData.cardNumber}
                            onChange={(e) => setPaymentData(prev => ({ ...prev, cardNumber: e.target.value }))}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                            placeholder="1234 5678 9012 3456"
                            maxLength={19}
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Card Holder Name</label>
                          <input
                            type="text"
                            value={paymentData.cardHolder}
                            onChange={(e) => setPaymentData(prev => ({ ...prev, cardHolder: e.target.value }))}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                            placeholder="John Doe"
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Expiry Date</label>
                            <input
                              type="text"
                              value={paymentData.expiryDate}
                              onChange={(e) => setPaymentData(prev => ({ ...prev, expiryDate: e.target.value }))}
                              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                              placeholder="MM/YY"
                              maxLength={5}
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">CVV</label>
                            <input
                              type="text"
                              value={paymentData.cvv}
                              onChange={(e) => setPaymentData(prev => ({ ...prev, cvv: e.target.value }))}
                              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                              placeholder="123"
                              maxLength={4}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between mt-8">
              <button
                onClick={handlePrevious}
                disabled={currentStep === 1}
                className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              {currentStep < 3 ? (
                <button
                  onClick={handleNext}
                  className="px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600"
                >
                  Next
                </button>
              ) : (
                <button
                  onClick={handleSubmit}
                  disabled={isSubmitting || !selectedPaymentMethod}
                  className="w-full px-6 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed font-semibold text-base transition-colors"
                >
                  {isSubmitting ? 'Processing...' : 'Complete Booking'}
                </button>
              )}
            </div>
          </div>

          {/* Sidebar - Booking Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm border p-6 sticky top-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Booking Summary</h3>
              
              {bookingData.selectedRoom && (
                <div className="mb-4 pb-4 border-b border-gray-200">
                  <p className="font-medium text-gray-900">{bookingData.selectedRoom.name}</p>
                  <p className="text-sm text-gray-600 mt-1">
                    {bookingData.rooms} room{bookingData.rooms > 1 ? 's' : ''} • {bookingData.guests.adults + bookingData.guests.children} guest{bookingData.guests.adults + bookingData.guests.children > 1 ? 's' : ''}
                  </p>
                </div>
              )}

              {bookingData.checkIn && bookingData.checkOut && (
                <div className="mb-4 pb-4 border-b border-gray-200 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Check-in:</span>
                    <span className="text-gray-900">{new Date(bookingData.checkIn).toLocaleDateString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Check-out:</span>
                    <span className="text-gray-900">{new Date(bookingData.checkOut).toLocaleDateString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Nights:</span>
                    <span className="text-gray-900">{calculateNights()}</span>
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Room rate:</span>
                  <span className="text-gray-900">
                    {(() => {
                      const roomPrice = bookingData.selectedRoom?.price;
                      let displayPrice = '';
                      if (roomPrice) {
                        if (typeof roomPrice === 'string') {
                          displayPrice = roomPrice;
                        } else if (typeof roomPrice === 'number') {
                          displayPrice = `Rs.${roomPrice.toLocaleString('en-IN')}`;
                        } else if (bookingData.selectedRoom?.pricing?.basePrice) {
                          displayPrice = `Rs.${bookingData.selectedRoom.pricing.basePrice.toLocaleString('en-IN')}`;
                        }
                      }
                      if (!displayPrice) {
                        displayPrice = `Rs.${(hotel.pricePerNight || hotel.pricing?.basePrice || hotel.pricing?.basePricePerNight || 0).toLocaleString('en-IN')}`;
                      }
                      return `${displayPrice} × ${calculateNights()} night${calculateNights() !== 1 ? 's' : ''}`;
                    })()}
                  </span>
                </div>
                {bookingData.rooms > 1 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Rooms:</span>
                    <span className="text-gray-900">{bookingData.rooms}</span>
                  </div>
                )}
                <div className="pt-4 border-t border-gray-200 flex justify-between font-semibold text-lg">
                  <span>Total:</span>
                  <span className="text-orange-500">Rs.{calculateTotalPrice().toLocaleString()}</span>
                </div>
              </div>

              {hotel.policies && (
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <h4 className="font-medium text-gray-900 mb-2 text-sm">Policies</h4>
                  <div className="text-xs text-gray-600 space-y-1">
                    <p><span className="font-medium">Check-in:</span> {hotel.policies.checkIn}</p>
                    <p><span className="font-medium">Check-out:</span> {hotel.policies.checkOut}</p>
                    {hotel.policies.cancellation && (
                      <p><span className="font-medium">Cancellation:</span> {hotel.policies.cancellation}</p>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HotelBooking;

