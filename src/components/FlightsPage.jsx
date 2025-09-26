import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const FlightsPage = () => {
    const [searchData, setSearchData] = useState({
        from: '',
        to: '',
        departureDate: '',
        returnDate: '',
        passengers: 1,
        class: 'economy'
    });

    const [filters, setFilters] = useState({
        priceRange: [0, 100000],
        airlines: 'all',
        stops: 'all',
        departureTime: 'all',
        arrivalTime: 'all'
    });

    const [viewMode, setViewMode] = useState('grid');
    const [tripType, setTripType] = useState('roundtrip');

    const airlines = [
        'All Airlines', 'Air India', 'IndiGo', 'SpiceJet', 'Vistara', 'GoAir', 'AirAsia', 'Jet Airways'
    ];

    const flights = [
        {
            id: 1,
            airline: 'Air India',
            flightNumber: 'AI 101',
            from: 'KTM',
            to: 'PKR',
            fromCity: 'Kathmandu',
            toCity: 'Pokhara',
            departure: '08:30',
            arrival: '10:45',
            duration: '2h 15m',
            price: 'Rs.8,500',
            originalPrice: 'Rs.12,000',
            discount: '29% OFF',
            class: 'Economy',
            stops: 'Non-stop',
            aircraft: 'Boeing 737',
            baggage: '15kg',
            meals: 'Included',
            rating: 4.2,
            reviews: 1247,
            departureDate: '2024-12-15',
            arrivalDate: '2024-12-15',
            available: true
        },
        {
            id: 2,
            airline: 'IndiGo',
            flightNumber: '6E 205',
            from: 'KTM',
            to: 'PKR',
            fromCity: 'Kathmandu',
            toCity: 'Pokhara',
            departure: '14:20',
            arrival: '16:35',
            duration: '2h 15m',
            price: 'Rs.7,200',
            originalPrice: 'Rs.9,500',
            discount: '24% OFF',
            class: 'Economy',
            stops: 'Non-stop',
            aircraft: 'Airbus A320',
            baggage: '15kg',
            meals: 'Paid',
            rating: 4.5,
            reviews: 2156,
            departureDate: '2024-12-15',
            arrivalDate: '2024-12-15',
            available: true
        },
        {
            id: 3,
            airline: 'Vistara',
            flightNumber: 'UK 945',
            from: 'KTM',
            to: 'PKR',
            fromCity: 'Kathmandu',
            toCity: 'Pokhara',
            departure: '19:45',
            arrival: '22:00',
            duration: '2h 15m',
            price: 'Rs.9,800',
            originalPrice: 'Rs.13,200',
            discount: '26% OFF',
            class: 'Business',
            stops: 'Non-stop',
            aircraft: 'Boeing 787',
            baggage: '25kg',
            meals: 'Included',
            rating: 4.7,
            reviews: 892,
            departureDate: '2024-12-15',
            arrivalDate: '2024-12-15',
            available: true
        },
        {
            id: 4,
            airline: 'SpiceJet',
            flightNumber: 'SG 8156',
            from: 'KTM',
            to: 'PKR',
            fromCity: 'Kathmandu',
            toCity: 'Pokhara',
            departure: '06:15',
            arrival: '08:30',
            duration: '2h 15m',
            price: 'Rs.6,500',
            originalPrice: 'Rs.8,800',
            discount: '26% OFF',
            class: 'Economy',
            stops: 'Non-stop',
            aircraft: 'Boeing 737',
            baggage: '15kg',
            meals: 'Paid',
            rating: 4.1,
            reviews: 1834,
            departureDate: '2024-12-15',
            arrivalDate: '2024-12-15',
            available: false
        },
        {
            id: 5,
            airline: 'Air India',
            flightNumber: 'AI 203',
            from: 'KTM',
            to: 'PKR',
            fromCity: 'Kathmandu',
            toCity: 'Pokhara',
            departure: '11:30',
            arrival: '13:45',
            duration: '2h 15m',
            price: 'Rs.8,200',
            originalPrice: 'Rs.11,500',
            discount: '29% OFF',
            class: 'Economy',
            stops: 'Non-stop',
            aircraft: 'Airbus A321',
            baggage: '15kg',
            meals: 'Included',
            rating: 4.3,
            reviews: 1567,
            departureDate: '2024-12-15',
            arrivalDate: '2024-12-15',
            available: true
        },
        {
            id: 6,
            airline: 'GoAir',
            flightNumber: 'G8 304',
            from: 'KTM',
            to: 'PKR',
            fromCity: 'Kathmandu',
            toCity: 'Pokhara',
            departure: '16:00',
            arrival: '18:15',
            duration: '2h 15m',
            price: 'Rs.7,800',
            originalPrice: 'Rs.10,200',
            discount: '24% OFF',
            class: 'Economy',
            stops: 'Non-stop',
            aircraft: 'Airbus A320',
            baggage: '15kg',
            meals: 'Paid',
            rating: 4.0,
            reviews: 1123,
            departureDate: '2024-12-15',
            arrivalDate: '2024-12-15',
            available: true
        }
    ];

    const handleSearchChange = (field, value) => {
        setSearchData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleFilterChange = (filterName, value) => {
        setFilters(prev => ({
            ...prev,
            [filterName]: value
        }));
    };

    const filteredFlights = flights.filter(flight => {
        if (filters.airlines !== 'all' && flight.airline !== filters.airlines) {
            return false;
        }
        if (filters.stops !== 'all') {
            if (filters.stops === 'nonstop' && flight.stops !== 'Non-stop') {
                return false;
            }
            if (filters.stops === '1stop' && flight.stops === 'Non-stop') {
                return false;
            }
        }
        if (filters.priceRange[0] > 0 && parseInt(flight.price.replace(/[Rs.,]/g, '')) < filters.priceRange[0]) {
            return false;
        }
        if (filters.priceRange[1] < 100000 && parseInt(flight.price.replace(/[Rs.,]/g, '')) > filters.priceRange[1]) {
            return false;
        }
        return true;
    });

    const handleSearch = (e) => {
        e.preventDefault();
        // Handle search logic here
        console.log('Searching flights:', searchData);
    };

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
                <div className="relative z-10 max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
                        <div>
                            <h1 className="text-2xl sm:text-3xl font-bold text-white">Flight Search</h1>
                            <p className="text-sm sm:text-base text-orange-100 mt-1">Find and book the best flight deals worldwide</p>
                        </div>
                        <div className="flex items-center space-x-2 sm:space-x-4">
                            <button
                                onClick={() => setViewMode('grid')}
                                className={`p-2 rounded-lg ${viewMode === 'grid' ? 'bg-orange-100 text-orange-500' : 'text-gray-400 hover:text-gray-600'}`}
                            >
                                <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                                </svg>
                            </button>
                            <button
                                onClick={() => setViewMode('list')}
                                className={`p-2 rounded-lg ${viewMode === 'list' ? 'bg-orange-100 text-orange-500' : 'text-gray-400 hover:text-gray-600'}`}
                            >
                                <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Search Form */}
            <div className="bg-white shadow-sm border-b">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <form onSubmit={handleSearch} className="space-y-4">
                        {/* Trip Type */}
                        <div className="flex justify-center mb-6">
                            <div className="bg-gray-100 rounded-lg p-1">
                                <button
                                    type="button"
                                    onClick={() => setTripType('roundtrip')}
                                    className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${tripType === 'roundtrip'
                                        ? 'bg-white shadow-sm text-gray-900'
                                        : 'text-gray-600 hover:text-gray-900'
                                        }`}
                                >
                                    Round Trip
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setTripType('oneway')}
                                    className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${tripType === 'oneway'
                                        ? 'bg-white shadow-sm text-gray-900'
                                        : 'text-gray-600 hover:text-gray-900'
                                        }`}
                                >
                                    One Way
                                </button>
                            </div>
                        </div>

                        {/* Search Fields */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">From</label>
                                <input
                                    type="text"
                                    value={searchData.from}
                                    onChange={(e) => handleSearchChange('from', e.target.value)}
                                    placeholder="City or Airport"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">To</label>
                                <input
                                    type="text"
                                    value={searchData.to}
                                    onChange={(e) => handleSearchChange('to', e.target.value)}
                                    placeholder="City or Airport"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Departure</label>
                                <input
                                    type="date"
                                    value={searchData.departureDate}
                                    onChange={(e) => handleSearchChange('departureDate', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                />
                            </div>

                            {tripType === 'roundtrip' && (
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Return</label>
                                    <input
                                        type="date"
                                        value={searchData.returnDate}
                                        onChange={(e) => handleSearchChange('returnDate', e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                    />
                                </div>
                            )}
                        </div>

                        {/* Passengers and Class */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Passengers</label>
                                <select
                                    value={searchData.passengers}
                                    onChange={(e) => handleSearchChange('passengers', parseInt(e.target.value))}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                >
                                    {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => (
                                        <option key={num} value={num}>{num} {num === 1 ? 'Passenger' : 'Passengers'}</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Class</label>
                                <select
                                    value={searchData.class}
                                    onChange={(e) => handleSearchChange('class', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                >
                                    <option value="economy">Economy</option>
                                    <option value="premium">Premium Economy</option>
                                    <option value="business">Business</option>
                                    <option value="first">First Class</option>
                                </select>
                            </div>
                        </div>

                        {/* Search Button */}
                        <div className="flex justify-center">
                            <button
                                type="submit"
                                className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 rounded-lg font-medium transition-colors shadow-lg hover:shadow-xl"
                            >
                                Search Flights
                            </button>
                        </div>
                    </form>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-6 sm:py-8">
                <div className="flex flex-col lg:flex-row gap-6 sm:gap-8">
                    {/* Filters Sidebar */}
                    <div className="lg:w-1/4 order-2 lg:order-1">
                        <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 sticky top-8">
                            <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">Filters</h3>

                            {/* Airlines */}
                            <div className="mb-6">
                                <label className="block text-sm font-medium text-gray-700 mb-2">Airlines</label>
                                <select
                                    value={filters.airlines}
                                    onChange={(e) => handleFilterChange('airlines', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                >
                                    {airlines.map(airline => (
                                        <option key={airline} value={airline === 'All Airlines' ? 'all' : airline}>
                                            {airline}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Stops */}
                            <div className="mb-6">
                                <label className="block text-sm font-medium text-gray-700 mb-2">Stops</label>
                                <select
                                    value={filters.stops}
                                    onChange={(e) => handleFilterChange('stops', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                >
                                    <option value="all">All</option>
                                    <option value="nonstop">Non-stop</option>
                                    <option value="1stop">1 Stop</option>
                                    <option value="2stops">2+ Stops</option>
                                </select>
                            </div>

                            {/* Price Range */}
                            <div className="mb-6">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Price Range: Rs.{filters.priceRange[0]} - Rs.{filters.priceRange[1]}
                                </label>
                                <input
                                    type="range"
                                    min="0"
                                    max="100000"
                                    step="1000"
                                    value={filters.priceRange[1]}
                                    onChange={(e) => handleFilterChange('priceRange', [filters.priceRange[0], parseInt(e.target.value)])}
                                    className="w-full"
                                />
                            </div>

                            <button
                                onClick={() => setFilters({
                                    priceRange: [0, 100000],
                                    airlines: 'all',
                                    stops: 'all',
                                    departureTime: 'all',
                                    arrivalTime: 'all'
                                })}
                                className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 px-4 rounded-md transition-colors"
                            >
                                Clear Filters
                            </button>
                        </div>
                    </div>

                    {/* Results */}
                    <div className="lg:w-3/4 order-1 lg:order-2">
                        <div className="mb-4 sm:mb-6">
                            <p className="text-sm sm:text-base text-gray-600">Showing {filteredFlights.length} flights</p>
                        </div>

                        {/* Flights List */}
                        <div className="space-y-4">
                            {filteredFlights.map((flight) => (
                                <div key={flight.id} className="bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow">
                                    <div className="p-6">
                                        <div className="flex items-center justify-between mb-4">
                                            <div className="flex items-center space-x-4">
                                                <div className="text-center">
                                                    <div className="text-2xl font-bold text-gray-900">{flight.departure}</div>
                                                    <div className="text-sm text-gray-600">{flight.from}</div>
                                                    <div className="text-xs text-gray-500">{flight.fromCity}</div>
                                                </div>

                                                <div className="flex-1 text-center">
                                                    <div className="text-sm text-gray-600 mb-1">{flight.duration}</div>
                                                    <div className="border-t border-gray-200 relative">
                                                        <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-gray-400 rounded-full"></div>
                                                        <div className="absolute -top-1 right-1/2 transform translate-x-1/2 w-2 h-2 bg-gray-400 rounded-full"></div>
                                                    </div>
                                                    <div className="text-xs text-gray-500 mt-1">{flight.stops}</div>
                                                </div>

                                                <div className="text-center">
                                                    <div className="text-2xl font-bold text-gray-900">{flight.arrival}</div>
                                                    <div className="text-sm text-gray-600">{flight.to}</div>
                                                    <div className="text-xs text-gray-500">{flight.toCity}</div>
                                                </div>
                                            </div>

                                            <div className="text-right">
                                                <div className="flex items-baseline justify-end mb-1">
                                                    <span className="text-3xl font-bold text-gray-900">{flight.price}</span>
                                                    {flight.originalPrice && (
                                                        <span className="text-sm text-gray-500 line-through ml-2">{flight.originalPrice}</span>
                                                    )}
                                                </div>
                                                {flight.discount && (
                                                    <span className="bg-orange-100 text-orange-800 text-xs font-medium px-2 py-1 rounded-full">
                                                        {flight.discount}
                                                    </span>
                                                )}
                                            </div>
                                        </div>

                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center space-x-6 text-sm text-gray-600">
                                                <div className="flex items-center">
                                                    <span className="font-medium">{flight.airline}</span>
                                                    <span className="ml-2 text-gray-500">{flight.flightNumber}</span>
                                                </div>
                                                <div className="flex items-center">
                                                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                                                    </svg>
                                                    {flight.aircraft}
                                                </div>
                                                <div className="flex items-center">
                                                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                                                    </svg>
                                                    {flight.baggage}
                                                </div>
                                                <div className="flex items-center">
                                                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                    </svg>
                                                    {flight.meals}
                                                </div>
                                            </div>

                                            <div className="flex items-center space-x-4">
                                                <div className="text-right">
                                                    <div className="flex items-center mb-1">
                                                        {[...Array(5)].map((_, i) => (
                                                            <svg
                                                                key={i}
                                                                className={`w-4 h-4 ${i < Math.floor(flight.rating) ? 'text-yellow-400' : 'text-gray-300'}`}
                                                                fill="currentColor"
                                                                viewBox="0 0 20 20"
                                                            >
                                                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                                            </svg>
                                                        ))}
                                                        <span className="ml-2 text-sm text-gray-600">
                                                            {flight.rating} ({flight.reviews})
                                                        </span>
                                                    </div>
                                                    <div className="text-xs text-gray-500">{flight.class}</div>
                                                </div>

                                                {flight.available ? (
                                                    <Link
                                                        to={`/flight-booking/${flight.id}`}
                                                        className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-lg font-medium transition-colors"
                                                    >
                                                        Book Now
                                                    </Link>
                                                ) : (
                                                    <button
                                                        disabled
                                                        className="bg-gray-300 text-gray-500 px-6 py-2 rounded-lg font-medium cursor-not-allowed"
                                                    >
                                                        Not Available
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {filteredFlights.length === 0 && (
                            <div className="text-center py-12">
                                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                                </svg>
                                <h3 className="mt-2 text-sm font-medium text-gray-900">No flights found</h3>
                                <p className="mt-1 text-sm text-gray-500">Try adjusting your search criteria or filters.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FlightsPage;
