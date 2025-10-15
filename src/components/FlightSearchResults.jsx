import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  MapPinIcon,
  StarIcon,
  CalendarIcon,
  UserGroupIcon
} from '@heroicons/react/24/outline';

const FlightSearchResults = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const searchData = location.state?.searchData || {
    from: 'DEL',
    to: 'LHR',
    departureDate: '2024-01-15',
    returnDate: '2024-01-22',
    passengers: 1
  };

  const [expandedFlight, setExpandedFlight] = useState(null);
  const [hoveredFlight, setHoveredFlight] = useState(null);
  const [sortBy, setSortBy] = useState('price');
  const [filterAirline, setFilterAirline] = useState('all');
  const [filterStops, setFilterStops] = useState('all');
  const [filterTime, setFilterTime] = useState('all');
  const [filterPrice, setFilterPrice] = useState('all');
  const [viewMode, setViewMode] = useState('grid');

  // Mock flight data with detailed segments and stopovers
  const flights = [
    {
      id: 1,
      airline: 'Singapore Airlines',
      airlineCode: 'SQ',
      logo: 'images/Airline Logo.png',
      departure: 'KTM',
      arrival: 'GVA',
      departureTime: '22:50',
      arrivalTime: '22:25',
      duration: '27h 20m',
      stops: 2,
      price: 127030,
      originalPrice: 150000,
      cabin: 'Economy',
      aircraft: 'Boeing 737-800',
      departureDate: '2024-10-21',
      returnDate: '2024-10-22',
      fareType: 'Flexi',
      baggage: '30kg',
      refundable: true,
      changeable: true,
      rating: 4.8,
      reviews: 1247,
      departureTerminal: 'T1',
      arrivalTerminal: 'T1',
      departureAirport: 'Kathmandu, Tribhuvan Intl',
      arrivalAirport: 'Geneva, Cointrin',
      segments: [
        {
          id: 1,
          airline: 'Singapore Airlines',
          flightNumber: 'SQ 441',
          departure: 'KTM',
          departureCity: 'Kathmandu',
          arrival: 'SIN',
          arrivalCity: 'Singapore',
          departureTime: '22:50',
          arrivalTime: '06:15',
          duration: '4h 25m',
          aircraft: 'Boeing 787-10',
          departureDate: '2024-10-21',
          arrivalDate: '2024-10-22',
          departureTerminal: 'Terminal Intl',
          arrivalTerminal: 'Terminal 3',
          departureAirport: 'Tribhuvan Intl',
          arrivalAirport: 'Changi',
          layover: null
        },
        {
          id: 2,
          airline: 'Singapore Airlines',
          flightNumber: 'SQ 326',
          departure: 'SIN',
          departureCity: 'Singapore',
          arrival: 'FRA',
          arrivalCity: 'Frankfurt',
          departureTime: '10:55',
          arrivalTime: '18:00',
          duration: '12h 5m',
          aircraft: 'Airbus A380-800',
          departureDate: '2024-10-22',
          arrivalDate: '2024-10-22',
          departureTerminal: 'Terminal 3',
          arrivalTerminal: 'Terminal 1',
          departureAirport: 'Changi',
          arrivalAirport: 'Rhein Main',
          layover: '4h 40m'
        },
        {
          id: 3,
          airline: 'Swiss International Air Lines',
          flightNumber: 'SQ 2903',
          departure: 'FRA',
          departureCity: 'Frankfurt',
          arrival: 'GVA',
          arrivalCity: 'Geneva',
          departureTime: '21:10',
          arrivalTime: '22:25',
          duration: '1h 15m',
          aircraft: 'Airbus A220-100',
          departureDate: '2024-10-22',
          arrivalDate: '2024-10-22',
          departureTerminal: 'Terminal 1',
          arrivalTerminal: 'Terminal 1',
          departureAirport: 'Rhein Main',
          arrivalAirport: 'Cointrin',
          layover: '3h 10m',
          operatedBy: 'Swiss International Air Lines'
        }
      ],
      fareConditions: {
        baggage: '30kg',
        seatSelection: 'Complimentary (Standard & Forward Zone Seats)',
        milesEarned: '8584 KrisFlyer miles',
        upgradeWithMiles: 'Allowed',
        cancellationFee: 'USD 100.00',
        changeFee: 'Complimentary (fare difference may apply)',
        note: 'SQ 2903 is a flight operated by Swiss International Air Lines. Fare conditions for baggage allowance, seat selection, earning of miles and upgrading with miles indicated below are only for Singapore Airlines operated flights.'
      }
    },
    {
      id: 2,
      airline: 'Singapore Airlines',
      airlineCode: 'SQ',
      logo: 'images/Airline Logo.png',
      departure: 'KTM',
      arrival: 'GVA',
      departureTime: '22:50',
      arrivalTime: '09:25',
      duration: '38h 20m',
      stops: 2,
      price: 127030,
      originalPrice: 150000,
      cabin: 'Economy',
      aircraft: 'Boeing 737-800',
      departureDate: '2024-10-21',
      returnDate: '2024-10-23',
      fareType: 'Flexi',
      baggage: '30kg',
      refundable: true,
      changeable: true,
      rating: 4.7,
      reviews: 892,
      departureTerminal: 'T1',
      arrivalTerminal: 'T1',
      departureAirport: 'Kathmandu, Tribhuvan Intl',
      arrivalAirport: 'Geneva, Cointrin',
      segments: [
        {
          id: 1,
          airline: 'Singapore Airlines',
          flightNumber: 'SQ 441',
          departure: 'KTM',
          departureCity: 'Kathmandu',
          arrival: 'SIN',
          arrivalCity: 'Singapore',
          departureTime: '22:50',
          arrivalTime: '06:15',
          duration: '4h 25m',
          aircraft: 'Boeing 787-10',
          departureDate: '2024-10-21',
          arrivalDate: '2024-10-22',
          departureTerminal: 'Terminal Intl',
          arrivalTerminal: 'Terminal 3',
          departureAirport: 'Tribhuvan Intl',
          arrivalAirport: 'Changi',
          layover: null
        },
        {
          id: 2,
          airline: 'Singapore Airlines',
          flightNumber: 'SQ 26',
          departure: 'SIN',
          departureCity: 'Singapore',
          arrival: 'FRA',
          arrivalCity: 'Frankfurt',
          departureTime: '10:55',
          arrivalTime: '18:00',
          duration: '12h 5m',
          aircraft: 'Airbus A380-800',
          departureDate: '2024-10-22',
          arrivalDate: '2024-10-22',
          departureTerminal: 'Terminal 3',
          arrivalTerminal: 'Terminal 1',
          departureAirport: 'Changi',
          arrivalAirport: 'Rhein Main',
          layover: '17h 40m'
        },
        {
          id: 3,
          airline: 'Swiss International Air Lines',
          flightNumber: 'SQ 2951',
          departure: 'FRA',
          departureCity: 'Frankfurt',
          arrival: 'GVA',
          arrivalCity: 'Geneva',
          departureTime: '21:10',
          arrivalTime: '09:25',
          duration: '1h 15m',
          aircraft: 'Airbus A220-100',
          departureDate: '2024-10-22',
          arrivalDate: '2024-10-23',
          departureTerminal: 'Terminal 1',
          arrivalTerminal: 'Terminal 1',
          departureAirport: 'Rhein Main',
          arrivalAirport: 'Cointrin',
          layover: '1h 5m',
          operatedBy: 'Swiss International Air Lines'
        }
      ],
      fareConditions: {
        baggage: '30kg',
        seatSelection: 'Complimentary (Standard & Forward Zone Seats)',
        milesEarned: '8584 KrisFlyer miles',
        upgradeWithMiles: 'Allowed',
        cancellationFee: 'USD 100.00',
        changeFee: 'Complimentary (fare difference may apply)',
        note: 'SQ 2951 is a flight operated by Swiss International Air Lines. Fare conditions for baggage allowance, seat selection, earning of miles and upgrading with miles indicated below are only for Singapore Airlines operated flights.'
      }
    },
    {
      id: 3,
      airline: 'British Airways',
      airlineCode: 'BA',
      logo: 'images/Airline Logo.png',
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
      fareType: 'Basic',
      baggage: '23kg',
      refundable: false,
      changeable: false,
      rating: 4.5,
      reviews: 1567,
      departureTerminal: 'T3',
      arrivalTerminal: 'T5',
      departureAirport: 'Indira Gandhi International Airport',
      arrivalAirport: 'Heathrow Airport',
      segments: [
        {
          id: 1,
          airline: 'British Airways',
          flightNumber: 'BA 142',
          departure: 'DEL',
          departureCity: 'Delhi',
          arrival: 'LHR',
          arrivalCity: 'London',
          departureTime: '01:45',
          arrivalTime: '06:55',
          duration: '8h 10m',
          aircraft: 'Boeing 787-9 Dreamliner',
          departureDate: '2024-01-15',
          arrivalDate: '2024-01-15',
          departureTerminal: 'Terminal 3',
          arrivalTerminal: 'Terminal 5',
          departureAirport: 'Indira Gandhi Intl',
          arrivalAirport: 'Heathrow',
          layover: null
        }
      ],
      fareConditions: {
        baggage: '23kg',
        seatSelection: 'Paid (from £25)',
        milesEarned: '6230 Avios',
        upgradeWithMiles: 'Available',
        cancellationFee: 'Non-refundable',
        changeFee: '£75 + fare difference',
        note: 'This is a non-refundable fare. Changes are subject to availability and fare difference. Seat selection available for purchase from £25.'
      }
    },
    {
      id: 4,
      airline: 'Lufthansa',
      airlineCode: 'LH',
      logo: 'images/Airline Logo.png',
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
      fareType: 'Saver',
      baggage: '23kg',
      refundable: false,
      changeable: true,
      rating: 4.6,
      reviews: 734,
      departureTerminal: 'T3',
      arrivalTerminal: 'T2',
      departureAirport: 'Indira Gandhi International Airport',
      arrivalAirport: 'Heathrow Airport',
      segments: [
        {
          id: 1,
          airline: 'Lufthansa',
          flightNumber: 'LH 761',
          departure: 'DEL',
          departureCity: 'Delhi',
          arrival: 'FRA',
          arrivalCity: 'Frankfurt',
          departureTime: '03:20',
          arrivalTime: '08:05',
          duration: '6h 45m',
          aircraft: 'Airbus A350-900',
          departureDate: '2024-01-15',
          arrivalDate: '2024-01-15',
          departureTerminal: 'Terminal 3',
          arrivalTerminal: 'Terminal 1',
          departureAirport: 'Indira Gandhi Intl',
          arrivalAirport: 'Rhein Main',
          layover: '1h 45m'
        },
        {
          id: 2,
          airline: 'Lufthansa',
          flightNumber: 'LH 440',
          departure: 'FRA',
          departureCity: 'Frankfurt',
          arrival: 'LHR',
          arrivalCity: 'London',
          departureTime: '09:50',
          arrivalTime: '10:15',
          duration: '1h 25m',
          aircraft: 'Airbus A320',
          departureDate: '2024-01-15',
          arrivalDate: '2024-01-15',
          departureTerminal: 'Terminal 1',
          arrivalTerminal: 'Terminal 2',
          departureAirport: 'Rhein Main',
          arrivalAirport: 'Heathrow',
          layover: null
        }
      ]
    },
    {
      id: 5,
      airline: 'Air India',
      airlineCode: 'AI',
      logo: 'images/Airline Logo.png',
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
      fareType: 'Basic',
      baggage: '25kg',
      refundable: false,
      changeable: false,
      rating: 4.2,
      reviews: 2341,
      departureTerminal: 'T3',
      arrivalTerminal: 'T2',
      departureAirport: 'Indira Gandhi International Airport',
      arrivalAirport: 'Heathrow Airport',
      segments: [
        {
          id: 1,
          airline: 'Air India',
          flightNumber: 'AI 161',
          departure: 'DEL',
          departureCity: 'Delhi',
          arrival: 'LHR',
          arrivalCity: 'London',
          departureTime: '06:30',
          arrivalTime: '11:45',
          duration: '8h 15m',
          aircraft: 'Boeing 787-8 Dreamliner',
          departureDate: '2024-01-15',
          arrivalDate: '2024-01-15',
          departureTerminal: 'Terminal 3',
          arrivalTerminal: 'Terminal 2',
          departureAirport: 'Indira Gandhi Intl',
          arrivalAirport: 'Heathrow',
          layover: null
        }
      ],
      fareConditions: {
        baggage: '25kg',
        seatSelection: 'Complimentary (Standard seats)',
        milesEarned: '3890 Flying Returns miles',
        upgradeWithMiles: 'Not available on this fare',
        cancellationFee: 'Non-refundable',
        changeFee: 'Rs. 5000 + fare difference',
        note: 'This is a non-refundable basic fare. Seat selection is complimentary for standard seats. Premium seat selection available for additional charges.'
      }
    },
    {
      id: 6,
      airline: 'Virgin Atlantic',
      airlineCode: 'VS',
      logo: 'images/Airline Logo.png',
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
      fareType: 'Premium',
      baggage: '30kg',
      refundable: true,
      changeable: true,
      rating: 4.4,
      reviews: 567,
      departureTerminal: 'T3',
      arrivalTerminal: 'T3',
      departureAirport: 'Indira Gandhi International Airport',
      arrivalAirport: 'Heathrow Airport',
      segments: [
        {
          id: 1,
          airline: 'Virgin Atlantic',
          flightNumber: 'VS 301',
          departure: 'DEL',
          departureCity: 'Delhi',
          arrival: 'LHR',
          arrivalCity: 'London',
          departureTime: '08:45',
          arrivalTime: '14:00',
          duration: '8h 15m',
          aircraft: 'Boeing 787-9 Dreamliner',
          departureDate: '2024-01-15',
          arrivalDate: '2024-01-15',
          departureTerminal: 'Terminal 3',
          arrivalTerminal: 'Terminal 3',
          departureAirport: 'Indira Gandhi Intl',
          arrivalAirport: 'Heathrow',
          layover: null
        }
      ],
      fareConditions: {
        baggage: '30kg',
        seatSelection: 'Complimentary (All seats)',
        milesEarned: '6780 Flying Club miles',
        upgradeWithMiles: 'Available (subject to availability)',
        cancellationFee: 'Free cancellation up to 24 hours',
        changeFee: 'Free changes up to 24 hours before departure',
        note: 'This is a flexible fare with free cancellation and changes up to 24 hours before departure. All seat selection is complimentary. Premium service includes priority boarding and enhanced meal options.'
      }
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
    return `Rs.${price.toLocaleString('en-IN')}`;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatSegmentDate = (dateString) => {
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.toLocaleDateString('en-US', { month: 'short' });
    const dayOfWeek = date.toLocaleDateString('en-US', { weekday: 'short' });
    return `${day} ${month} (${dayOfWeek})`;
  };

  const handleFlightSelect = (flight) => {
    // Navigate directly to flight booking page
    navigate(`/flight-booking/${flight.id}`);
  };

  const handleFlightExpand = (flightId) => {
    setExpandedFlight(expandedFlight === flightId ? null : flightId);
  };

  const handleFlightHover = (flightId) => {
    setHoveredFlight(flightId);
  };

  const handleFlightLeave = () => {
    setHoveredFlight(null);
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
            <div className="space-y-8">
              {filteredFlights.map((flight) => (
                <div
                  key={flight.id}
                  className={`bg-white rounded-2xl shadow-sm border transition-all duration-300 ${hoveredFlight === flight.id
                    ? 'shadow-lg border-blue-300'
                    : 'border-gray-200 hover:shadow-md'
                    }`}
                  onMouseEnter={() => handleFlightHover(flight.id)}
                  onMouseLeave={handleFlightLeave}
                >
                  {/* Main Flight Card */}
                  <div className="p-6 sm:p-8">
                    {/* Header with Airline and Price */}
                    <div className="flex items-center justify-between mb-8">
                      <div className="flex items-center space-x-4">
                        <img src={flight.logo} alt={flight.airline} className="w-20 h-10 object-contain" />
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">{flight.airline}</h3>
                          <div className="text-sm text-gray-500">
                            <span>{flight.aircraft}</span>
                          </div>
                        </div>
                      </div>

                      <div className="text-right">
                        <div className="text-lg font-semibold text-blue-600">{formatPrice(flight.price)}</div>
                      </div>
                    </div>

                    {/* Main Flight Route - Large and Clear */}
                    <div className="flex items-center justify-between mb-8">
                      {/* Departure */}
                      <div className="text-center flex-1">
                        <div className="text-xl sm:text-2xl font-semibold text-gray-900 mb-2">{flight.departureTime}</div>
                        <div className="text-base font-medium text-gray-700 mb-1">{flight.departure}</div>
                        <div className="text-sm text-gray-500">{flight.departureTerminal}</div>
                        <div className="text-xs text-gray-400 mt-1">{flight.departureAirport}</div>
                      </div>

                      {/* Flight Path with Stopovers */}
                      <div className="flex-1 mx-8">
                        <div className="text-center mb-4">
                          <div className="text-base font-medium text-gray-700 mb-1">
                            {flight.stops === 0 ? 'Direct Flight' : `${flight.stops} stop${flight.stops > 1 ? 's' : ''}`}
                          </div>
                          <div className="text-lg font-semibold text-gray-900">{flight.duration}</div>
                        </div>

                        {/* Visual Timeline */}
                        <div className="flex items-center justify-center">
                          <div className="flex-1 h-0.5 bg-gray-300 rounded-full"></div>
                          <div className="w-2 h-2 bg-blue-500 rounded-full mx-2"></div>
                          {flight.stops > 0 && (
                            <>
                              <div className="flex-1 h-0.5 bg-gray-300 rounded-full"></div>
                              {Array.from({ length: flight.stops }, (_, index) => (
                                <React.Fragment key={index}>
                                  <div className="w-2 h-2 bg-orange-400 rounded-full mx-2"></div>
                                  {index < flight.stops - 1 && (
                                    <div className="flex-1 h-0.5 bg-gray-300 rounded-full"></div>
                                  )}
                                </React.Fragment>
                              ))}
                              <div className="flex-1 h-0.5 bg-gray-300 rounded-full"></div>
                            </>
                          )}
                          <div className="w-2 h-2 bg-green-500 rounded-full mx-2"></div>
                          <div className="flex-1 h-0.5 bg-gray-300 rounded-full"></div>
                        </div>

                        {/* Stopover Details */}
                        {flight.stops > 0 && (
                          <div className="text-center mt-3">
                            <div className="text-sm text-gray-600">
                              {flight.segments?.map((segment, index) =>
                                segment.layover ? `${segment.arrival} (${segment.layover})` : null
                              ).filter(Boolean).join(' • ')}
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Arrival */}
                      <div className="text-center flex-1">
                        <div className="text-xl sm:text-2xl font-semibold text-gray-900 mb-2">{flight.arrivalTime}</div>
                        <div className="text-base font-medium text-gray-700 mb-1">{flight.arrival}</div>
                        <div className="text-sm text-gray-500">{flight.arrivalTerminal}</div>
                        <div className="text-xs text-gray-400 mt-1">{flight.arrivalAirport}</div>
                      </div>
                    </div>

                    {/* Flight Information and Action Buttons */}
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                      <div className="text-sm text-gray-600 font-medium">
                        Baggage: {flight.baggage} • {flight.refundable ? 'Refundable' : 'Non-refundable'}
                      </div>

                      <div className="flex flex-col sm:flex-row gap-3">
                        <button
                          className="bg-blue-600 text-white px-8 py-2.5 rounded-lg hover:bg-blue-700 transition-colors font-semibold text-base"
                          onClick={() => handleFlightSelect(flight)}
                        >
                          Select Flight
                        </button>

                        <button
                          onClick={() => handleFlightExpand(flight.id)}
                          className="flex items-center justify-center space-x-2 text-blue-600 hover:text-blue-800 transition-colors px-6 py-2.5 border border-blue-200 rounded-lg hover:bg-blue-50"
                        >
                          <span className="font-medium text-sm">More details</span>
                          <svg
                            className={`w-4 h-4 transition-transform ${expandedFlight === flight.id ? 'rotate-180' : ''}`}
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Expanded Details */}
                  {expandedFlight === flight.id && (
                    <div className="border-t border-gray-200 bg-gray-50 p-6 sm:p-8">
                      {/* Detailed Flight Segments */}
                      <div className="mb-8">
                        <h4 className="text-xl font-semibold text-gray-900 mb-6">Flight Details</h4>
                        <div className="space-y-4">
                          {flight.segments?.map((segment, index) => (
                            <div key={segment.id} className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
                              {/* Flight Path Row */}
                              <div className="flex items-center justify-between mb-4">
                                {/* Departure Section */}
                                <div className="flex-1">
                                  <div className="text-lg font-semibold text-blue-900 mb-1">{segment.departure} {segment.departureTime}</div>
                                  <div className="text-base font-medium text-gray-800 mb-1">{segment.departureCity}</div>
                                  <div className="text-sm text-gray-600">{formatSegmentDate(segment.departureDate)}</div>
                                  <div className="text-sm text-gray-500">{segment.departureAirport}</div>
                                  <div className="text-xs text-gray-400">{segment.departureTerminal}</div>
                                </div>

                                {/* Flight Path with Airplane Icon */}
                                <div className="flex-1 mx-8 relative">
                                  <div className="flex items-center justify-center">
                                    <div className="flex-1 h-0.5 bg-gray-300"></div>
                                    <div className="mx-3">
                                      <svg className="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z" />
                                      </svg>
                                    </div>
                                    <div className="flex-1 h-0.5 bg-gray-300"></div>
                                  </div>
                                  <div className="text-center text-xs text-gray-600 mt-2">{segment.duration}</div>
                                </div>

                                {/* Arrival Section */}
                                <div className="flex-1 text-right">
                                  <div className="text-lg font-semibold text-blue-900 mb-1">{segment.arrival} {segment.arrivalTime}</div>
                                  <div className="text-base font-medium text-gray-800 mb-1">{segment.arrivalCity}</div>
                                  <div className="text-sm text-gray-600">{formatSegmentDate(segment.arrivalDate)}</div>
                                  <div className="text-sm text-gray-500">{segment.arrivalAirport}</div>
                                  <div className="text-xs text-gray-400">{segment.arrivalTerminal}</div>
                                </div>
                              </div>

                              {/* Airline Information */}
                              <div className="flex items-center justify-between border-t border-gray-200 pt-4">
                                <div className="flex items-center space-x-3">
                                  <img src={flight.logo} alt={segment.airline} className="w-8 h-4 object-contain" />
                                  <div>
                                    <div className="font-medium text-gray-900">{segment.airline} • {segment.flightNumber}</div>
                                    {segment.operatedBy && (
                                      <div className="text-xs text-gray-400">Operated by {segment.operatedBy}</div>
                                    )}
                                  </div>
                                </div>
                                <div className="text-right">
                                  <div className="text-sm font-medium text-gray-900">{segment.aircraft}</div>
                                </div>
                              </div>

                              {/* Layover Information */}
                              {segment.layover && (
                                <div className="mt-4 pt-4 border-t border-gray-200">
                                  <div className="flex items-center justify-center space-x-2">
                                    <svg className="w-4 h-4 text-orange-500" fill="currentColor" viewBox="0 0 20 20">
                                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                                    </svg>
                                    <span className="text-sm text-orange-600 font-medium">
                                      Layover time: {segment.layover}
                                    </span>
                                  </div>
                                </div>
                              )}

                              {/* Less details link for last segment */}
                              {index === flight.segments.length - 1 && (
                                <div className="mt-4 pt-4 border-t border-gray-200 text-center">
                                  <button
                                    onClick={() => handleFlightExpand(flight.id)}
                                    className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                                  >
                                    &gt; Less details
                                  </button>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Fare Conditions */}
                      {flight.fareConditions && (
                        <div className="bg-white rounded-lg p-4 border border-gray-200">
                          <h4 className="text-lg font-semibold text-gray-900 mb-4">Fare Conditions</h4>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <div className="flex justify-between">
                                <span className="text-sm text-gray-600">Baggage:</span>
                                <span className="text-sm font-medium">{flight.fareConditions.baggage}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-sm text-gray-600">Seat Selection:</span>
                                <span className="text-sm font-medium">{flight.fareConditions.seatSelection}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-sm text-gray-600">Miles Earned:</span>
                                <span className="text-sm font-medium">{flight.fareConditions.milesEarned}</span>
                              </div>
                            </div>
                            <div className="space-y-2">
                              <div className="flex justify-between">
                                <span className="text-sm text-gray-600">Upgrade with Miles:</span>
                                <span className="text-sm font-medium">{flight.fareConditions.upgradeWithMiles}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-sm text-gray-600">Cancellation Fee:</span>
                                <span className="text-sm font-medium">{flight.fareConditions.cancellationFee}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-sm text-gray-600">Change Fee:</span>
                                <span className="text-sm font-medium">{flight.fareConditions.changeFee}</span>
                              </div>
                            </div>
                          </div>

                          {flight.fareConditions.note && (
                            <div className="mt-4 pt-4 border-t border-gray-200">
                              <div className="text-xs text-gray-600 bg-yellow-50 p-3 rounded-lg">
                                <strong>Note:</strong> {flight.fareConditions.note}
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>

          </div>
        </div>
      </div>
    </div >
  );
};

export default FlightSearchResults;
