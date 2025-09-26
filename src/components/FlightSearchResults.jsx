import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  MapPinIcon,
  StarIcon,
  CalendarIcon,
  UserGroupIcon
} from '@heroicons/react/24/outline';

const FlightSearchResults = () => {
  const location = useLocation();
  const searchData = location.state?.searchData || {
    from: 'DEL',
    to: 'LHR',
    departureDate: '2024-01-15',
    returnDate: '2024-01-22',
    passengers: 1
  };

  const [selectedFlight, setSelectedFlight] = useState(null);
  const [sortBy, setSortBy] = useState('price');
  const [filterAirline, setFilterAirline] = useState('all');
  const [filterStops, setFilterStops] = useState('all');
  const [filterTime, setFilterTime] = useState('all');
  const [filterPrice, setFilterPrice] = useState('all');
  const [viewMode, setViewMode] = useState('grid');

  // Mock flight data with more realistic information
  const flights = [
    {
      id: 1,
      airline: 'Qatar Airways',
      airlineCode: 'QR',
      logo: 'https://via.placeholder.com/80x40/0052CC/FFFFFF?text=QR',
      departure: 'DEL',
      arrival: 'LHR',
      departureTime: '02:30',
      arrivalTime: '07:45',
      duration: '8h 15m',
      stops: 0,
      price: 55300,
      originalPrice: 65000,
      cabin: 'Economy',
      aircraft: 'Boeing 777-300ER',
      departureDate: '2024-01-15',
      returnDate: '2024-01-22',
      features: ['Meal Included', 'Entertainment', 'WiFi', 'Power Outlet'],
      fareType: 'Saver',
      baggage: '30kg',
      refundable: false,
      changeable: true,
      rating: 4.8,
      reviews: 1247,
      departureTerminal: 'T3',
      arrivalTerminal: 'T5',
      departureAirport: 'Indira Gandhi International Airport',
      arrivalAirport: 'Heathrow Airport'
    },
    {
      id: 2,
      airline: 'Emirates',
      airlineCode: 'EK',
      logo: 'https://via.placeholder.com/80x40/D71920/FFFFFF?text=EK',
      departure: 'DEL',
      arrival: 'LHR',
      departureTime: '04:15',
      arrivalTime: '09:30',
      duration: '8h 15m',
      stops: 1,
      stopDetails: 'Dubai (DXB) - 2h 30m',
      price: 48500,
      originalPrice: 58000,
      cabin: 'Economy',
      aircraft: 'Airbus A380',
      departureDate: '2024-01-15',
      returnDate: '2024-01-22',
      features: ['Meal Included', 'Entertainment', 'WiFi', 'Lounge Access', 'Shower'],
      fareType: 'Flex',
      baggage: '35kg',
      refundable: true,
      changeable: true,
      rating: 4.7,
      reviews: 892,
      departureTerminal: 'T3',
      arrivalTerminal: 'T3',
      departureAirport: 'Indira Gandhi International Airport',
      arrivalAirport: 'Heathrow Airport'
    },
    {
      id: 3,
      airline: 'British Airways',
      airlineCode: 'BA',
      logo: 'https://via.placeholder.com/80x40/0750B8/FFFFFF?text=BA',
      departure: 'DEL',
      arrival: 'LHR',
      departureTime: '01:45',
      arrivalTime: '06:55',
      duration: '8h 10m',
      stops: 0,
      price: 62300,
      originalPrice: 72000,
      cabin: 'Economy',
      aircraft: 'Boeing 787-9 Dreamliner',
      departureDate: '2024-01-15',
      returnDate: '2024-01-22',
      features: ['Meal Included', 'Entertainment', 'WiFi'],
      fareType: 'Basic',
      baggage: '23kg',
      refundable: false,
      changeable: false,
      rating: 4.5,
      reviews: 1567,
      departureTerminal: 'T3',
      arrivalTerminal: 'T5',
      departureAirport: 'Indira Gandhi International Airport',
      arrivalAirport: 'Heathrow Airport'
    },
    {
      id: 4,
      airline: 'Lufthansa',
      airlineCode: 'LH',
      logo: 'https://via.placeholder.com/80x40/05164D/FFFFFF?text=LH',
      departure: 'DEL',
      arrival: 'LHR',
      departureTime: '03:20',
      arrivalTime: '10:15',
      duration: '9h 55m',
      stops: 1,
      stopDetails: 'Frankfurt (FRA) - 1h 45m',
      price: 41200,
      originalPrice: 52000,
      cabin: 'Economy',
      aircraft: 'Airbus A350-900',
      departureDate: '2024-01-15',
      returnDate: '2024-01-22',
      features: ['Meal Included', 'Entertainment', 'WiFi', 'Power Outlet'],
      fareType: 'Saver',
      baggage: '23kg',
      refundable: false,
      changeable: true,
      rating: 4.6,
      reviews: 734,
      departureTerminal: 'T3',
      arrivalTerminal: 'T2',
      departureAirport: 'Indira Gandhi International Airport',
      arrivalAirport: 'Heathrow Airport'
    },
    {
      id: 5,
      airline: 'Air India',
      airlineCode: 'AI',
      logo: 'https://via.placeholder.com/80x40/FF6B35/FFFFFF?text=AI',
      departure: 'DEL',
      arrival: 'LHR',
      departureTime: '06:30',
      arrivalTime: '11:45',
      duration: '8h 15m',
      stops: 0,
      price: 38900,
      originalPrice: 45000,
      cabin: 'Economy',
      aircraft: 'Boeing 787-8 Dreamliner',
      departureDate: '2024-01-15',
      returnDate: '2024-01-22',
      features: ['Meal Included', 'Entertainment'],
      fareType: 'Basic',
      baggage: '25kg',
      refundable: false,
      changeable: false,
      rating: 4.2,
      reviews: 2341,
      departureTerminal: 'T3',
      arrivalTerminal: 'T2',
      departureAirport: 'Indira Gandhi International Airport',
      arrivalAirport: 'Heathrow Airport'
    },
    {
      id: 6,
      airline: 'Virgin Atlantic',
      airlineCode: 'VS',
      logo: 'https://via.placeholder.com/80x40/DA291C/FFFFFF?text=VS',
      departure: 'DEL',
      arrival: 'LHR',
      departureTime: '08:45',
      arrivalTime: '14:00',
      duration: '8h 15m',
      stops: 0,
      price: 67800,
      originalPrice: 78000,
      cabin: 'Economy',
      aircraft: 'Boeing 787-9 Dreamliner',
      departureDate: '2024-01-15',
      returnDate: '2024-01-22',
      features: ['Meal Included', 'Entertainment', 'WiFi', 'Premium Service'],
      fareType: 'Premium',
      baggage: '30kg',
      refundable: true,
      changeable: true,
      rating: 4.4,
      reviews: 567,
      departureTerminal: 'T3',
      arrivalTerminal: 'T3',
      departureAirport: 'Indira Gandhi International Airport',
      arrivalAirport: 'Heathrow Airport'
    }
  ];

  // Fare calendar data for flexible dates
  const fareCalendar = [
    { date: '2024-01-15', price: 55300, available: true, bestPrice: false },
    { date: '2024-01-16', price: 48500, available: true, bestPrice: true },
    { date: '2024-01-17', price: 62300, available: true, bestPrice: false },
    { date: '2024-01-18', price: 41200, available: true, bestPrice: false },
    { date: '2024-01-19', price: 58900, available: true, bestPrice: false },
    { date: '2024-01-20', price: 45600, available: true, bestPrice: false },
    { date: '2024-01-21', price: 67800, available: true, bestPrice: false },
    { date: '2024-01-22', price: 52300, available: true, bestPrice: false }
  ];

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0
    }).format(price);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    });
  };

  const handleFlightSelect = (flight) => {
    setSelectedFlight(flight);
  };

  const getFilteredFlights = () => {
    let filtered = [...flights];

    // Apply airline filter
    if (filterAirline !== 'all') {
      filtered = filtered.filter(flight => flight.airline === filterAirline);
    }

    // Apply stops filter
    if (filterStops === 'direct') {
      filtered = filtered.filter(flight => flight.stops === 0);
    } else if (filterStops === '1stop') {
      filtered = filtered.filter(flight => flight.stops === 1);
    }

    // Apply price filter
    if (filterPrice === 'under50k') {
      filtered = filtered.filter(flight => flight.price < 50000);
    } else if (filterPrice === '50k-60k') {
      filtered = filtered.filter(flight => flight.price >= 50000 && flight.price <= 60000);
    } else if (filterPrice === 'above60k') {
      filtered = filtered.filter(flight => flight.price > 60000);
    }

    // Apply sorting
    switch (sortBy) {
      case 'price':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'duration':
        filtered.sort((a, b) => parseInt(a.duration) - parseInt(b.duration));
        break;
      case 'departure':
        filtered.sort((a, b) => a.departureTime.localeCompare(b.departureTime));
        break;
      case 'rating':
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      default:
        break;
    }

    return filtered;
  };

  const filteredFlights = getFilteredFlights();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="relative bg-orange-500 overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0">
          <img
            src="images/white-clouds-blue-sky-daytime.jpg"
            alt="Airplane flying over clouds"
            className="w-full h-full object-cover opacity-100"
          />
          <div className="absolute inset-0 bg-orange-600/80 opacity-40"></div>
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-3 sm:px-4 py-4 sm:py-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-white">Flight Search Results</h1>
              <div className="flex flex-col sm:flex-row sm:items-center space-y-1 sm:space-y-0 sm:space-x-4 mt-2 text-xs sm:text-sm text-orange-100">
                <div className="flex items-center space-x-2">
                  <MapPinIcon className="w-3 h-3 sm:w-4 sm:h-4" />
                  <span>{searchData.from} → {searchData.to}</span>
                </div>
                <span className="hidden sm:inline">•</span>
                <div className="flex items-center space-x-2">
                  <CalendarIcon className="w-3 h-3 sm:w-4 sm:h-4" />
                  <span>{formatDate(searchData.departureDate)}</span>
                </div>
                <span className="hidden sm:inline">•</span>
                <div className="flex items-center space-x-2">
                  <UserGroupIcon className="w-3 h-3 sm:w-4 sm:h-4" />
                  <span>{searchData.passengers} Passenger{searchData.passengers > 1 ? 's' : ''}</span>
                </div>
              </div>
            </div>
            <Link
              to="/"
              className="text-orange-500 hover:text-orange-600 font-medium flex items-center space-x-2 text-sm sm:text-base"
            >
              <span>←</span>
              <span>Modify Search</span>
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-3 sm:px-4 py-4 sm:py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 sm:gap-6">

          {/* Left Sidebar - Filters */}
          <div className="lg:col-span-1 order-2 lg:order-1">
            <div className="bg-white rounded-xl shadow-sm border p-4 sm:p-6 sticky top-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-base sm:text-lg font-semibold text-gray-900">Filters</h3>
                <button
                  onClick={() => {
                    setFilterAirline('all');
                    setFilterStops('all');
                    setFilterTime('all');
                    setFilterPrice('all');
                  }}
                  className="text-xs sm:text-sm text-orange-500 hover:text-orange-600"
                >
                  Clear All
                </button>
              </div>

              {/* Price Range */}
              <div className="mb-4 sm:mb-6">
                <h4 className="font-medium text-gray-700 mb-2 sm:mb-3 text-sm sm:text-base">Price Range</h4>
                <div className="space-y-1 sm:space-y-2">
                  {[
                    { value: 'under50k', label: 'Under Rs.50,000' },
                    { value: '50k-60k', label: 'Rs.50,000 - Rs.60,000' },
                    { value: 'above60k', label: 'Above Rs.60,000' }
                  ].map(option => (
                    <label key={option.value} className="flex items-center">
                      <input
                        type="radio"
                        name="priceFilter"
                        value={option.value}
                        checked={filterPrice === option.value}
                        onChange={(e) => setFilterPrice(e.target.value)}
                        className="text-orange-500 focus:ring-orange-500"
                      />
                      <span className="ml-2 text-xs sm:text-sm text-gray-600">{option.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Airlines */}
              <div className="mb-4 sm:mb-6">
                <h4 className="font-medium text-gray-700 mb-2 sm:mb-3 text-sm sm:text-base">Airlines</h4>
                <div className="space-y-1 sm:space-y-2">
                  {['Qatar Airways', 'Emirates', 'British Airways', 'Lufthansa', 'Air India', 'Virgin Atlantic'].map(airline => (
                    <label key={airline} className="flex items-center">
                      <input
                        type="radio"
                        name="airlineFilter"
                        value={airline}
                        checked={filterAirline === airline}
                        onChange={(e) => setFilterAirline(e.target.value)}
                        className="text-orange-500 focus:ring-orange-500"
                      />
                      <span className="ml-2 text-xs sm:text-sm text-gray-600">{airline}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Stops */}
              <div className="mb-4 sm:mb-6">
                <h4 className="font-medium text-gray-700 mb-2 sm:mb-3 text-sm sm:text-base">Stops</h4>
                <div className="space-y-1 sm:space-y-2">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="stopsFilter"
                      value="all"
                      checked={filterStops === 'all'}
                      onChange={(e) => setFilterStops(e.target.value)}
                      className="text-orange-500 focus:ring-orange-500"
                    />
                    <span className="ml-2 text-xs sm:text-sm text-gray-600">All</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="stopsFilter"
                      value="direct"
                      checked={filterStops === 'direct'}
                      onChange={(e) => setFilterStops(e.target.value)}
                      className="text-orange-500 focus:ring-orange-500"
                    />
                    <span className="ml-2 text-xs sm:text-sm text-gray-600">Direct</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="stopsFilter"
                      value="1stop"
                      checked={filterStops === '1stop'}
                      onChange={(e) => setFilterStops(e.target.value)}
                      className="text-orange-500 focus:ring-orange-500"
                    />
                    <span className="ml-2 text-xs sm:text-sm text-gray-600">1 Stop</span>
                  </label>
                </div>
              </div>

              {/* Departure Time */}
              <div className="mb-4 sm:mb-6">
                <h4 className="font-medium text-gray-700 mb-2 sm:mb-3 text-sm sm:text-base">Departure Time</h4>
                <div className="space-y-1 sm:space-y-2">
                  {[
                    { value: 'early', label: 'Early Morning (00:00-06:00)' },
                    { value: 'morning', label: 'Morning (06:00-12:00)' },
                    { value: 'afternoon', label: 'Afternoon (12:00-18:00)' },
                    { value: 'evening', label: 'Evening (18:00-24:00)' }
                  ].map(option => (
                    <label key={option.value} className="flex items-center">
                      <input
                        type="checkbox"
                        className="rounded border-gray-300 text-orange-500 focus:ring-orange-500"
                      />
                      <span className="ml-2 text-xs sm:text-sm text-gray-600">{option.label}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3 order-1 lg:order-2">

            {/* Fare Calendar */}
            <div className="bg-white rounded-xl shadow-sm border p-4 sm:p-6 mb-4 sm:mb-6">
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">Flexible Dates - Fare Calendar</h3>
              <div className="grid grid-cols-4 sm:grid-cols-8 gap-1 sm:gap-2">
                {fareCalendar.map((day, index) => (
                  <div
                    key={index}
                    className={`text-center p-2 sm:p-3 rounded-lg border cursor-pointer transition-all ${day.bestPrice
                      ? 'border-green-500 bg-green-50'
                      : day.available
                        ? 'border-gray-200 hover:border-blue-300 hover:bg-blue-50'
                        : 'border-gray-100 bg-gray-50 text-gray-400'
                      }`}
                  >
                    <div className="text-xs text-gray-500 mb-1">{formatDate(day.date)}</div>
                    <div className={`font-semibold text-xs sm:text-sm ${day.bestPrice ? 'text-green-600' : day.available ? 'text-gray-900' : 'text-gray-400'
                      }`}>
                      Rs.{day.price.toLocaleString()}
                    </div>
                    {day.bestPrice && (
                      <div className="text-xs text-green-600 font-medium mt-1">Best</div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Sort and Results Count */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 space-y-2 sm:space-y-0">
              <p className="text-sm sm:text-base text-gray-600">{filteredFlights.length} flights found</p>
              <div className="flex items-center space-x-4">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="border border-gray-300 rounded-lg px-3 py-2 text-xs sm:text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full sm:w-auto"
                >
                  <option value="price">Price: Low to High</option>
                  <option value="duration">Duration: Shortest</option>
                  <option value="departure">Departure Time</option>
                  <option value="rating">Rating: Highest</option>
                </select>
              </div>
            </div>

            {/* Flight Results */}
            <div className="space-y-3 sm:space-y-4">
              {filteredFlights.map((flight) => (
                <div
                  key={flight.id}
                  className={`bg-white rounded-xl shadow-sm border p-4 sm:p-6 cursor-pointer transition-all hover:shadow-md ${selectedFlight?.id === flight.id ? 'ring-2 ring-blue-500 border-blue-500' : 'border-gray-200'
                    }`}
                  onClick={() => handleFlightSelect(flight)}
                >
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
                    {/* Airline Info */}
                    <div className="flex items-center space-x-3 sm:space-x-4">
                      <img src={flight.logo} alt={flight.airline} className="w-16 h-8 sm:w-20 sm:h-10 object-contain" />
                      <div>
                        <h3 className="font-semibold text-gray-900 text-sm sm:text-base">{flight.airline}</h3>
                        <div className="flex flex-col sm:flex-row sm:items-center space-y-1 sm:space-y-0 sm:space-x-2 text-xs sm:text-sm text-gray-500">
                          <span>{flight.aircraft}</span>
                          <span className="hidden sm:inline">•</span>
                          <div className="flex items-center space-x-1">
                            <StarIcon className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-400 fill-current" />
                            <span>{flight.rating}</span>
                            <span>({flight.reviews})</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Flight Route */}
                    <div className="flex items-center justify-between lg:space-x-8">
                      <div className="text-center">
                        <div className="text-lg sm:text-2xl font-bold text-gray-900">{flight.departureTime}</div>
                        <div className="text-xs sm:text-sm text-gray-500">{flight.departure}</div>
                        <div className="text-xs text-gray-400">{flight.departureTerminal}</div>
                        <div className="text-xs text-gray-400 hidden sm:block">{flight.departureAirport}</div>
                      </div>

                      <div className="text-center flex-1 mx-2 sm:mx-4">
                        <div className="text-xs sm:text-sm text-gray-500 mb-1">{flight.duration}</div>
                        <div className="flex items-center">
                          <div className="flex-1 h-px bg-gray-300"></div>
                          <div className="w-2 h-2 sm:w-3 sm:h-3 bg-blue-500 rounded-full mx-1"></div>
                          <div className="flex-1 h-px bg-gray-300"></div>
                        </div>
                        <div className="text-xs text-gray-400 mt-1">
                          {flight.stops === 0 ? 'Direct' : flight.stopDetails}
                        </div>
                      </div>

                      <div className="text-center">
                        <div className="text-lg sm:text-2xl font-bold text-gray-900">{flight.arrivalTime}</div>
                        <div className="text-xs sm:text-sm text-gray-500">{flight.arrival}</div>
                        <div className="text-xs text-gray-400">{flight.arrivalTerminal}</div>
                        <div className="text-xs text-gray-400 hidden sm:block">{flight.arrivalAirport}</div>
                      </div>
                    </div>

                    {/* Price and Actions */}
                    <div className="text-center lg:text-right">
                      <div className="text-xl sm:text-3xl font-bold text-blue-600">{formatPrice(flight.price)}</div>
                      {flight.originalPrice > flight.price && (
                        <div className="text-xs sm:text-sm text-gray-500 line-through">{formatPrice(flight.originalPrice)}</div>
                      )}
                      <div className="text-xs text-gray-500 mt-1">{flight.fareType} Fare</div>

                      <button className="mt-3 bg-blue-600 text-white px-4 sm:px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium text-sm sm:text-base w-full sm:w-auto">
                        Select
                      </button>
                    </div>
                  </div>

                  {/* Flight Features */}
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
                      <div className="flex flex-wrap items-center gap-2">
                        {flight.features.map((feature, index) => (
                          <span key={index} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                            {feature}
                          </span>
                        ))}
                      </div>
                      <div className="text-xs text-gray-500">
                        Baggage: {flight.baggage} • {flight.refundable ? 'Refundable' : 'Non-refundable'}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Selected Flight Summary */}
            {selectedFlight && (
              <div className="mt-4 sm:mt-6 bg-blue-50 border border-blue-200 rounded-xl p-4 sm:p-6">
                <h3 className="text-base sm:text-lg font-semibold text-blue-900 mb-3 sm:mb-4">Selected Flight</h3>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
                  <div>
                    <p className="text-blue-900 font-medium text-sm sm:text-base">
                      {selectedFlight.airline} • {selectedFlight.departure} → {selectedFlight.arrival}
                    </p>
                    <p className="text-blue-700 text-xs sm:text-sm">
                      {selectedFlight.departureTime} - {selectedFlight.arrivalTime} • {selectedFlight.duration}
                    </p>
                    <p className="text-blue-600 text-xs sm:text-sm">
                      {selectedFlight.departureTerminal} → {selectedFlight.arrivalTerminal}
                    </p>
                  </div>
                  <div className="text-center sm:text-right">
                    <p className="text-xl sm:text-2xl font-bold text-blue-900">{formatPrice(selectedFlight.price)}</p>
                    <Link
                      to={`/flight-booking/${selectedFlight.id}`}
                      className="inline-block bg-blue-600 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium text-sm sm:text-base w-full sm:w-auto"
                    >
                      Continue to Booking
                    </Link>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FlightSearchResults;
