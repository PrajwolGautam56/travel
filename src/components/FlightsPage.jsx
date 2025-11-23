import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AirportAutocomplete from './AirportAutocomplete';

const FlightsPage = () => {
    const navigate = useNavigate();
    const [searchData, setSearchData] = useState({
        from: '',
        to: '',
        departureDate: '',
        returnDate: '',
        passengers: {
            adults: 1,
            children: 0,
            infants: 0
        },
        class: 'economy'
    });

    const [tripType, setTripType] = useState('oneway');

    const handleSearchChange = (field, value) => {
        setSearchData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleSearch = (e) => {
        e.preventDefault();
        
        // Validate required fields
        if (!searchData.from || !searchData.to || !searchData.departureDate) {
            alert('Please fill in From, To, and Departure Date fields');
            return;
        }

        // Extract airport code from input (format: "KTM - Kathmandu" or just "KTM")
        const extractAirportCode = (input) => {
            if (!input) return '';
            // If input contains " - ", extract the code before it
            if (input.includes(' - ')) {
                return input.split(' - ')[0].trim().toUpperCase();
            }
            // Otherwise, assume it's already a code or extract first 3 uppercase letters
            const match = input.match(/^([A-Z]{3})/);
            return match ? match[1] : input.trim().toUpperCase();
        };

        // Prepare search data for FlightSearchResults
        const searchParams = {
            from: extractAirportCode(searchData.from),
            to: extractAirportCode(searchData.to),
            departureDate: searchData.departureDate,
            returnDate: searchData.returnDate || null,
            tripType: tripType === 'roundtrip' ? 'return' : 'oneway',
            passengers: typeof searchData.passengers === 'object' 
                ? searchData.passengers 
                : { adults: searchData.passengers || 1, children: 0, infants: 0 },
            class: searchData.class || 'economy',
            currency: 'USD',
            region: 'US'
        };

        // Navigate to flight search results page
        navigate('/flight-search', {
            state: { searchData: searchParams }
        });
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
                                <AirportAutocomplete
                                    value={searchData.from}
                                    onChange={(e) => handleSearchChange('from', e.target.value)}
                                    placeholder="City or Airport"
                                    id="from"
                                    name="from"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">To</label>
                                <AirportAutocomplete
                                    value={searchData.to}
                                    onChange={(e) => handleSearchChange('to', e.target.value)}
                                    placeholder="City or Airport"
                                    id="to"
                                    name="to"
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
                                <label className="block text-sm font-medium text-gray-700 mb-2">Adults</label>
                                <select
                                    value={typeof searchData.passengers === 'object' ? searchData.passengers.adults : searchData.passengers}
                                    onChange={(e) => setSearchData(prev => ({
                                        ...prev,
                                        passengers: {
                                            ...(typeof prev.passengers === 'object' ? prev.passengers : { adults: prev.passengers, children: 0, infants: 0 }),
                                            adults: parseInt(e.target.value)
                                        }
                                    }))}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                >
                                    {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => (
                                        <option key={num} value={num}>{num} {num === 1 ? 'Adult' : 'Adults'}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Children</label>
                                <select
                                    value={typeof searchData.passengers === 'object' ? searchData.passengers.children : 0}
                                    onChange={(e) => setSearchData(prev => ({
                                        ...prev,
                                        passengers: {
                                            ...(typeof prev.passengers === 'object' ? prev.passengers : { adults: prev.passengers, children: 0, infants: 0 }),
                                            children: parseInt(e.target.value)
                                        }
                                    }))}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                >
                                    {[0, 1, 2, 3, 4].map(num => (
                                        <option key={num} value={num}>{num} {num === 1 ? 'Child' : 'Children'}</option>
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

            {/* Info Section - Prompt user to search */}
            <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-6 sm:py-8">
                <div className="bg-white rounded-xl shadow-lg p-8 sm:p-12 text-center">
                    <svg className="mx-auto h-16 w-16 text-orange-500 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">Ready to Find Your Perfect Flight?</h2>
                    <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
                        Enter your travel details above and click "Search Flights" to find the best deals from FlightAPI.io. 
                        We'll show you real-time flight options with the best prices.
                    </p>
                    <div className="flex flex-wrap justify-center gap-4 text-sm text-gray-500">
                        <div className="flex items-center">
                            <svg className="w-5 h-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                            Real-time Flight Data
                        </div>
                        <div className="flex items-center">
                            <svg className="w-5 h-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                            Best Price Guarantee
                        </div>
                                                <div className="flex items-center">
                            <svg className="w-5 h-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                                    </svg>
                            Instant Booking
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FlightsPage;
