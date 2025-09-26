import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const RentalsPage = () => {
    const [filters, setFilters] = useState({
        location: '',
        pickupDate: '',
        returnDate: '',
        vehicleType: 'all',
        priceRange: [0, 50000],
        transmission: 'all',
        fuelType: 'all'
    });

    const [viewMode, setViewMode] = useState('grid');

    const vehicleTypes = [
        'All Vehicles', 'Economy', 'Compact', 'Mid-size', 'Full-size', 'Luxury', 'SUV', 'Convertible', 'Van', 'Truck'
    ];

    const rentals = [
        {
            id: 1,
            name: 'Toyota Camry 2024',
            type: 'Mid-size',
            image: 'https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
            price: 'Rs.3,500',
            perDay: 'per day',
            rating: 4.8,
            reviews: 1247,
            transmission: 'Automatic',
            fuelType: 'Petrol',
            seats: 5,
            luggage: 2,
            features: ['GPS Navigation', 'Bluetooth', 'Air Conditioning', 'Power Steering'],
            location: 'Kathmandu Airport',
            available: true,
            discount: '15% OFF',
            originalPrice: 'Rs.4,100'
        },
        {
            id: 2,
            name: 'BMW X5 2024',
            type: 'Luxury SUV',
            image: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
            price: 'Rs.8,500',
            perDay: 'per day',
            rating: 4.9,
            reviews: 892,
            transmission: 'Automatic',
            fuelType: 'Petrol',
            seats: 7,
            luggage: 4,
            features: ['Premium Sound System', 'Leather Seats', 'Sunroof', 'Parking Sensors'],
            location: 'Pokhara Airport',
            available: true,
            discount: '20% OFF',
            originalPrice: 'Rs.10,600'
        },
        {
            id: 3,
            name: 'Honda City 2024',
            type: 'Compact',
            image: 'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
            price: 'Rs.2,800',
            perDay: 'per day',
            rating: 4.6,
            reviews: 2156,
            transmission: 'Manual',
            fuelType: 'Petrol',
            seats: 5,
            luggage: 2,
            features: ['Air Conditioning', 'Power Windows', 'Central Locking', 'Music System'],
            location: 'Bharatpur Airport',
            available: true,
            discount: '10% OFF',
            originalPrice: 'Rs.3,100'
        },
        {
            id: 4,
            name: 'Mercedes-Benz E-Class',
            type: 'Luxury',
            image: 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
            price: 'Rs.12,000',
            perDay: 'per day',
            rating: 4.9,
            reviews: 634,
            transmission: 'Automatic',
            fuelType: 'Petrol',
            seats: 5,
            luggage: 3,
            features: ['Premium Interior', 'Advanced Safety', 'Navigation System', 'Heated Seats'],
            location: 'Biratnagar Airport',
            available: false,
            discount: '25% OFF',
            originalPrice: 'Rs.16,000'
        },
        {
            id: 5,
            name: 'Maruti Swift',
            type: 'Economy',
            image: 'https://images.unsplash.com/photo-1606152421802-db97b9c7a11b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
            price: 'Rs.1,800',
            perDay: 'per day',
            rating: 4.4,
            reviews: 3421,
            transmission: 'Manual',
            fuelType: 'Petrol',
            seats: 5,
            luggage: 1,
            features: ['Air Conditioning', 'Power Steering', 'Music System', 'Central Locking'],
            location: 'Lukla Airport',
            available: true,
            discount: '5% OFF',
            originalPrice: 'Rs.1,900'
        },
        {
            id: 6,
            name: 'Audi Q7 2024',
            type: 'Luxury SUV',
            image: 'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
            price: 'Rs.9,500',
            perDay: 'per day',
            rating: 4.8,
            reviews: 756,
            transmission: 'Automatic',
            fuelType: 'Diesel',
            seats: 7,
            luggage: 4,
            features: ['Quattro AWD', 'Virtual Cockpit', 'Bang & Olufsen Sound', 'Panoramic Sunroof'],
            location: 'Nepalgunj Airport',
            available: true,
            discount: '18% OFF',
            originalPrice: 'Rs.11,600'
        }
    ];

    const handleFilterChange = (filterName, value) => {
        setFilters(prev => ({
            ...prev,
            [filterName]: value
        }));
    };

    const filteredRentals = rentals.filter(rental => {
        if (filters.vehicleType !== 'all' && !rental.type.toLowerCase().includes(filters.vehicleType.toLowerCase())) {
            return false;
        }
        if (filters.transmission !== 'all' && rental.transmission !== filters.transmission) {
            return false;
        }
        if (filters.fuelType !== 'all' && rental.fuelType !== filters.fuelType) {
            return false;
        }
        if (filters.priceRange[0] > 0 && parseInt(rental.price.replace(/[Rs.,]/g, '')) < filters.priceRange[0]) {
            return false;
        }
        if (filters.priceRange[1] < 50000 && parseInt(rental.price.replace(/[Rs.,]/g, '')) > filters.priceRange[1]) {
            return false;
        }
        return true;
    });

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="text-center">
                        <h1 className="text-4xl font-bold text-gray-900 mb-4">Car Rentals</h1>
                        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                            Find the perfect vehicle for your journey. Choose from our wide selection of cars, SUVs, and luxury vehicles.
                        </p>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Filters Sidebar */}
                    <div className="lg:w-1/4">
                        <div className="bg-white rounded-lg shadow-sm p-6 sticky top-8">
                            <h3 className="text-lg font-semibold text-gray-900 mb-6">Filter Results</h3>

                            {/* Location */}
                            <div className="mb-6">
                                <label className="block text-sm font-medium text-gray-700 mb-2">Pickup Location</label>
                                <input
                                    type="text"
                                    value={filters.location}
                                    onChange={(e) => handleFilterChange('location', e.target.value)}
                                    placeholder="Enter city or airport"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                />
                            </div>

                            {/* Pickup Date */}
                            <div className="mb-6">
                                <label className="block text-sm font-medium text-gray-700 mb-2">Pickup Date</label>
                                <input
                                    type="date"
                                    value={filters.pickupDate}
                                    onChange={(e) => handleFilterChange('pickupDate', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                />
                            </div>

                            {/* Return Date */}
                            <div className="mb-6">
                                <label className="block text-sm font-medium text-gray-700 mb-2">Return Date</label>
                                <input
                                    type="date"
                                    value={filters.returnDate}
                                    onChange={(e) => handleFilterChange('returnDate', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                />
                            </div>

                            {/* Vehicle Type */}
                            <div className="mb-6">
                                <label className="block text-sm font-medium text-gray-700 mb-2">Vehicle Type</label>
                                <select
                                    value={filters.vehicleType}
                                    onChange={(e) => handleFilterChange('vehicleType', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                >
                                    {vehicleTypes.map(type => (
                                        <option key={type} value={type === 'All Vehicles' ? 'all' : type.toLowerCase()}>
                                            {type}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Transmission */}
                            <div className="mb-6">
                                <label className="block text-sm font-medium text-gray-700 mb-2">Transmission</label>
                                <select
                                    value={filters.transmission}
                                    onChange={(e) => handleFilterChange('transmission', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                >
                                    <option value="all">All</option>
                                    <option value="Manual">Manual</option>
                                    <option value="Automatic">Automatic</option>
                                </select>
                            </div>

                            {/* Fuel Type */}
                            <div className="mb-6">
                                <label className="block text-sm font-medium text-gray-700 mb-2">Fuel Type</label>
                                <select
                                    value={filters.fuelType}
                                    onChange={(e) => handleFilterChange('fuelType', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                >
                                    <option value="all">All</option>
                                    <option value="Petrol">Petrol</option>
                                    <option value="Diesel">Diesel</option>
                                    <option value="Electric">Electric</option>
                                    <option value="Hybrid">Hybrid</option>
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
                                    max="50000"
                                    step="500"
                                    value={filters.priceRange[1]}
                                    onChange={(e) => handleFilterChange('priceRange', [filters.priceRange[0], parseInt(e.target.value)])}
                                    className="w-full"
                                />
                            </div>

                            <button
                                onClick={() => setFilters({
                                    location: '',
                                    pickupDate: '',
                                    returnDate: '',
                                    vehicleType: 'all',
                                    priceRange: [0, 50000],
                                    transmission: 'all',
                                    fuelType: 'all'
                                })}
                                className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 px-4 rounded-md transition-colors"
                            >
                                Clear Filters
                            </button>
                        </div>
                    </div>

                    {/* Results */}
                    <div className="lg:w-3/4">
                        {/* Results Header */}
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
                            <div className="mb-4 sm:mb-0">
                                <h2 className="text-xl font-semibold text-gray-900">
                                    {filteredRentals.length} vehicles found
                                </h2>
                                <p className="text-gray-600">Showing available rental vehicles</p>
                            </div>

                            <div className="flex items-center space-x-4">
                                <div className="flex bg-gray-100 rounded-lg p-1">
                                    <button
                                        onClick={() => setViewMode('grid')}
                                        className={`p-2 rounded-md ${viewMode === 'grid' ? 'bg-white shadow-sm' : 'hover:bg-gray-200'}`}
                                    >
                                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                            <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                                        </svg>
                                    </button>
                                    <button
                                        onClick={() => setViewMode('list')}
                                        className={`p-2 rounded-md ${viewMode === 'list' ? 'bg-white shadow-sm' : 'hover:bg-gray-200'}`}
                                    >
                                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Vehicles Grid/List */}
                        <div className={`${viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6' : 'space-y-6'}`}>
                            {filteredRentals.map((rental) => (
                                <div key={rental.id} className={`bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow ${viewMode === 'list' ? 'flex' : ''}`}>
                                    <div className={`${viewMode === 'list' ? 'w-1/3' : 'w-full'} h-48`}>
                                        <img
                                            src={rental.image}
                                            alt={rental.name}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>

                                    <div className={`p-6 ${viewMode === 'list' ? 'w-2/3' : 'w-full'}`}>
                                        <div className="flex items-start justify-between mb-2">
                                            <h3 className="text-xl font-semibold text-gray-900">{rental.name}</h3>
                                            {rental.discount && (
                                                <span className="bg-orange-100 text-orange-800 text-xs font-medium px-2 py-1 rounded-full">
                                                    {rental.discount}
                                                </span>
                                            )}
                                        </div>

                                        <p className="text-gray-600 mb-2">{rental.type}</p>

                                        <div className="flex items-center mb-4">
                                            <div className="flex items-center">
                                                {[...Array(5)].map((_, i) => (
                                                    <svg
                                                        key={i}
                                                        className={`w-4 h-4 ${i < Math.floor(rental.rating) ? 'text-yellow-400' : 'text-gray-300'}`}
                                                        fill="currentColor"
                                                        viewBox="0 0 20 20"
                                                    >
                                                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                                    </svg>
                                                ))}
                                                <span className="ml-2 text-sm text-gray-600">
                                                    {rental.rating} ({rental.reviews} reviews)
                                                </span>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 gap-4 mb-4 text-sm text-gray-600">
                                            <div className="flex items-center">
                                                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                                </svg>
                                                {rental.location}
                                            </div>
                                            <div className="flex items-center">
                                                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                </svg>
                                                {rental.transmission}
                                            </div>
                                            <div className="flex items-center">
                                                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                                </svg>
                                                {rental.seats} seats
                                            </div>
                                            <div className="flex items-center">
                                                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                                                </svg>
                                                {rental.luggage} bags
                                            </div>
                                        </div>

                                        <div className="flex items-center justify-between">
                                            <div>
                                                <div className="flex items-baseline">
                                                    <span className="text-2xl font-bold text-gray-900">{rental.price}</span>
                                                    <span className="text-gray-600 ml-1">{rental.perDay}</span>
                                                    {rental.originalPrice && (
                                                        <span className="text-sm text-gray-500 line-through ml-2">{rental.originalPrice}</span>
                                                    )}
                                                </div>
                                                <p className="text-sm text-gray-600">{rental.fuelType}</p>
                                            </div>

                                            <div className="flex flex-col items-end space-y-2">
                                                {rental.available ? (
                                                    <Link
                                                        to={`/rentals/${rental.id}`}
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
                                                <span className={`text-xs px-2 py-1 rounded-full ${rental.available
                                                    ? 'bg-green-100 text-green-800'
                                                    : 'bg-red-100 text-red-800'
                                                    }`}>
                                                    {rental.available ? 'Available' : 'Unavailable'}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {filteredRentals.length === 0 && (
                            <div className="text-center py-12">
                                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.29-1.009-5.824-2.709M15 6.291A7.962 7.962 0 0112 4c-2.34 0-4.29 1.009-5.824 2.709" />
                                </svg>
                                <h3 className="mt-2 text-sm font-medium text-gray-900">No vehicles found</h3>
                                <p className="mt-1 text-sm text-gray-500">Try adjusting your filters to see more results.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RentalsPage;
