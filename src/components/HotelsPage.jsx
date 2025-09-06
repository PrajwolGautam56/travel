import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const HotelsPage = () => {
  const [filters, setFilters] = useState({
    location: '',
    checkIn: '',
    checkOut: '',
    guests: 1,
    rooms: 1,
    priceRange: [0, 100000],
    rating: 0,
    amenities: []
  });

  const [viewMode, setViewMode] = useState('grid'); // grid or list

  const amenities = [
    'Free WiFi', 'Pool', 'Spa', 'Gym', 'Restaurant', 'Bar', 'Room Service',
    'Airport Shuttle', 'Parking', 'Pet Friendly', 'Business Center', 'Concierge'
  ];

  const hotels = [
    {
      id: 1,
      name: 'The Ritz London',
      location: 'London, UK',
      image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      price: '₹25,000',
      perNight: 'per night',
      rating: 4.9,
      reviews: 2847,
      amenities: ['Free WiFi', 'Spa', 'Restaurant', 'Gym', 'Concierge'],
      stars: 5,
      discount: '15% OFF',
      description: 'Experience luxury at its finest in the heart of London. The Ritz offers world-class service, elegant rooms, and Michelin-starred dining.',
      highlights: ['Historic landmark', 'Michelin-starred restaurant', 'Central location', 'Butler service']
    },
    {
      id: 2,
      name: 'Burj Al Arab',
      location: 'Dubai, UAE',
      image: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      price: '₹45,000',
      perNight: 'per night',
      rating: 4.8,
      reviews: 1923,
      amenities: ['Private Beach', 'Infinity Pool', 'Butler Service', 'Helipad', 'Spa'],
      stars: 5,
      discount: '20% OFF',
      description: 'The iconic sail-shaped hotel offers unparalleled luxury with private beach access, infinity pools, and world-class amenities.',
      highlights: ['Iconic architecture', 'Private beach', 'Helipad access', 'Luxury spa']
    },
    {
      id: 3,
      name: 'Marina Bay Sands',
      location: 'Singapore',
      image: 'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      price: '₹35,000',
      perNight: 'per night',
      rating: 4.7,
      reviews: 3156,
      amenities: ['Infinity Pool', 'Casino', 'Shopping Mall', 'SkyPark', 'Restaurant'],
      stars: 5,
      discount: '18% OFF',
      description: 'Famous for its rooftop infinity pool, this iconic hotel offers stunning city views and world-class entertainment.',
      highlights: ['Infinity pool', 'SkyPark access', 'Casino', 'Shopping mall']
    },
    {
      id: 4,
      name: 'Hotel Plaza Athénée',
      location: 'Paris, France',
      image: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      price: '₹38,000',
      perNight: 'per night',
      rating: 4.9,
      reviews: 1678,
      amenities: ['Eiffel Tower View', 'Michelin Restaurant', 'Spa', 'Concierge', 'Gym'],
      stars: 5,
      discount: '12% OFF',
      description: 'Located on Avenue Montaigne, this luxury hotel offers stunning Eiffel Tower views and exceptional French hospitality.',
      highlights: ['Eiffel Tower views', 'Michelin restaurant', 'Fashion district', 'Luxury spa']
    },
    {
      id: 5,
      name: 'The Peninsula Tokyo',
      location: 'Tokyo, Japan',
      image: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      price: '₹42,000',
      perNight: 'per night',
      rating: 4.8,
      reviews: 2341,
      amenities: ['City Views', 'Traditional Spa', 'Sushi Bar', 'Tea Ceremony', 'Gym'],
      stars: 5,
      discount: '25% OFF',
      description: 'Experience traditional Japanese luxury with modern amenities, including a traditional spa and authentic sushi bar.',
      highlights: ['Traditional spa', 'Sushi bar', 'Tea ceremonies', 'City views']
    },
    {
      id: 6,
      name: 'Aman Venice',
      location: 'Venice, Italy',
      image: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      price: '₹55,000',
      perNight: 'per night',
      rating: 4.9,
      reviews: 892,
      amenities: ['Canal Views', 'Private Gondola', 'Art Collection', 'Garden', 'Spa'],
      stars: 5,
      discount: '30% OFF',
      description: 'Set in a 16th-century palazzo, this intimate luxury hotel offers private gondola rides and stunning canal views.',
      highlights: ['Canal views', 'Private gondola', 'Art collection', 'Historic palace']
    }
  ];

  const handleFilterChange = (name, value) => {
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAmenityToggle = (amenity) => {
    setFilters(prev => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter(a => a !== amenity)
        : [...prev.amenities, amenity]
    }));
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
              <h1 className="text-2xl sm:text-3xl font-bold text-white">Hotels & Resorts</h1>
              <p className="text-sm sm:text-base text-orange-100 mt-1">Find your perfect stay worldwide</p>
            </div>
            <div className="flex items-center space-x-2 sm:space-x-4">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-lg ${viewMode === 'grid' ? 'bg-blue-100 text-orange-500' : 'text-gray-400 hover:text-gray-600'}`}
              >
                <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                </svg>
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-lg ${viewMode === 'list' ? 'bg-blue-100 text-orange-500' : 'text-gray-400 hover:text-gray-600'}`}
              >
                <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-6 sm:py-8">
        <div className="flex flex-col lg:flex-row gap-6 sm:gap-8">
          {/* Filters Sidebar */}
          <div className="lg:w-1/4 order-2 lg:order-1">
            <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 sticky top-8">
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">Filters</h3>

              {/* Location */}
              <div className="mb-4 sm:mb-6">
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">Location</label>
                <input
                  type="text"
                  placeholder="Where are you going?"
                  value={filters.location}
                  onChange={(e) => handleFilterChange('location', e.target.value)}
                  className="w-full px-3 sm:px-4 py-2 text-xs sm:text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>

              {/* Dates */}
              <div className="mb-4 sm:mb-6">
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">Check-in</label>
                <input
                  type="date"
                  value={filters.checkIn}
                  onChange={(e) => handleFilterChange('checkIn', e.target.value)}
                  className="w-full px-3 sm:px-4 py-2 text-xs sm:text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>

              <div className="mb-4 sm:mb-6">
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">Check-out</label>
                <input
                  type="date"
                  value={filters.checkOut}
                  onChange={(e) => handleFilterChange('checkOut', e.target.value)}
                  className="w-full px-3 sm:px-4 py-2 text-xs sm:text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>

              {/* Guests & Rooms */}
              <div className="mb-4 sm:mb-6">
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">Guests</label>
                <select
                  value={filters.guests}
                  onChange={(e) => handleFilterChange('guests', parseInt(e.target.value))}
                  className="w-full px-3 sm:px-4 py-2 text-xs sm:text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                >
                  {[1, 2, 3, 4, 5, 6].map(num => (
                    <option key={num} value={num}>{num} Guest{num > 1 ? 's' : ''}</option>
                  ))}
                </select>
              </div>

              <div className="mb-4 sm:mb-6">
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">Rooms</label>
                <select
                  value={filters.rooms}
                  onChange={(e) => handleFilterChange('rooms', parseInt(e.target.value))}
                  className="w-full px-3 sm:px-4 py-2 text-xs sm:text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                >
                  {[1, 2, 3, 4, 5].map(num => (
                    <option key={num} value={num}>{num} Room{num > 1 ? 's' : ''}</option>
                  ))}
                </select>
              </div>

              {/* Price Range */}
              <div className="mb-4 sm:mb-6">
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">Price Range (₹)</label>
                <div className="flex space-x-2">
                  <input
                    type="number"
                    placeholder="Min"
                    value={filters.priceRange[0]}
                    onChange={(e) => handleFilterChange('priceRange', [parseInt(e.target.value), filters.priceRange[1]])}
                    className="w-1/2 px-3 sm:px-4 py-2 text-xs sm:text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                  <input
                    type="number"
                    placeholder="Max"
                    value={filters.priceRange[1]}
                    onChange={(e) => handleFilterChange('priceRange', [filters.priceRange[0], parseInt(e.target.value)])}
                    className="w-1/2 px-3 sm:px-4 py-2 text-xs sm:text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Rating */}
              <div className="mb-4 sm:mb-6">
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">Minimum Rating</label>
                <select
                  value={filters.rating}
                  onChange={(e) => handleFilterChange('rating', parseInt(e.target.value))}
                  className="w-full px-3 sm:px-4 py-2 text-xs sm:text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                >
                  <option value={0}>Any rating</option>
                  <option value={4}>4+ stars</option>
                  <option value={4.5}>4.5+ stars</option>
                  <option value={5}>5 stars only</option>
                </select>
              </div>

              {/* Amenities */}
              <div className="mb-4 sm:mb-6">
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">Amenities</label>
                <div className="space-y-2">
                  {amenities.map(amenity => (
                    <label key={amenity} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={filters.amenities.includes(amenity)}
                        onChange={() => handleAmenityToggle(amenity)}
                        className="h-4 w-4 text-orange-500 focus:ring-orange-500 border-gray-300 rounded"
                      />
                      <span className="ml-2 text-xs sm:text-sm text-gray-700">{amenity}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Apply Filters Button */}
              <button className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-200 text-sm sm:text-base">
                Apply Filters
              </button>
            </div>
          </div>

          {/* Hotel Listings */}
          <div className="lg:w-3/4 order-1 lg:order-2">
            <div className="mb-4 sm:mb-6">
              <p className="text-sm sm:text-base text-gray-600">Showing {hotels.length} hotels</p>
            </div>

            <div className={viewMode === 'grid' ? 'grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6' : 'space-y-4 sm:space-y-6'}>
              {hotels.map((hotel) => (
                <div key={hotel.id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
                  <div className={viewMode === 'grid' ? 'block' : 'flex flex-col sm:flex-row'}>
                    {/* Hotel Image */}
                    <div className={viewMode === 'grid' ? 'h-48 sm:h-64' : 'w-full sm:w-80 h-48 sm:h-64'}>
                      <img
                        src={hotel.image}
                        alt={hotel.name}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Hotel Content */}
                    <div className="p-4 sm:p-6 flex-1">
                      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-3 space-y-2 sm:space-y-0">
                        <div className="flex-1">
                          <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">{hotel.name}</h3>
                          <p className="text-sm sm:text-base text-gray-600 mb-2">{hotel.location}</p>
                          <p className="text-xs sm:text-sm text-gray-700 mb-4 hidden sm:block">{hotel.description}</p>
                        </div>
                        <div className="text-left sm:text-right">
                          <div className="text-xl sm:text-2xl font-bold text-orange-500">{hotel.price}</div>
                          <div className="text-xs sm:text-sm text-gray-500">{hotel.perNight}</div>
                          <div className="mt-2">
                            <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                              {hotel.discount}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Rating and Stars */}
                      <div className="flex items-center mb-3 sm:mb-4">
                        <div className="flex items-center">
                          {[...Array(hotel.stars)].map((_, i) => (
                            <svg key={i} className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                          ))}
                        </div>
                        <span className="ml-2 text-xs sm:text-sm font-medium text-gray-900">{hotel.rating}</span>
                        <span className="ml-1 text-xs sm:text-sm text-gray-500">({hotel.reviews} reviews)</span>
                      </div>

                      {/* Highlights */}
                      <div className="mb-3 sm:mb-4">
                        <h4 className="text-xs sm:text-sm font-semibold text-gray-900 mb-2">Highlights:</h4>
                        <div className="flex flex-wrap gap-1 sm:gap-2">
                          {hotel.highlights.map((highlight, index) => (
                            <span key={index} className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                              {highlight}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Amenities */}
                      <div className="mb-4 sm:mb-6">
                        <h4 className="text-xs sm:text-sm font-semibold text-gray-900 mb-2">Amenities:</h4>
                        <div className="flex flex-wrap gap-1 sm:gap-2">
                          {hotel.amenities.map((amenity, index) => (
                            <span key={index} className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded-full">
                              {amenity}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Book Button */}
                      <Link
                        to={`/hotels/${hotel.id}`}
                        className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2.5 sm:py-3 px-4 sm:px-6 rounded-lg transition-colors duration-300 inline-block text-center text-sm sm:text-base"
                      >
                        Book Now
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HotelsPage;
