import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const PackagesPage = () => {
  const [filters, setFilters] = useState({
    destination: '',
    duration: '',
    priceRange: [0, 200000],
    rating: 0,
    packageType: 'all',
    departureDate: ''
  });

  const [viewMode, setViewMode] = useState('grid');

  const packageTypes = [
    'All Packages', 'Honeymoon', 'Adventure', 'Cultural', 'Beach', 'Mountain', 'City Break', 'Luxury'
  ];

  const packages = [
    {
      id: 1,
      title: 'London & Paris Adventure',
      destination: 'Nepal & India',
      description: 'Explore two iconic European cities with flights and 4-star hotels. Experience the best of British and French culture, cuisine, and landmarks.',
      image: 'https://images.unsplash.com/photo-1513634489774-f96762e6f3b6?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      duration: '7 Days / 6 Nights',
      price: 'Rs.89,999',
      originalPrice: 'Rs.1,25,000',
      discount: '28% OFF',
      rating: 4.8,
      reviews: 1247,
      packageType: 'Cultural',
      departureDate: '15 Dec 2024',
      includes: [
        'Return Flights from Mumbai',
        '4-Star Hotel in London (3 nights)',
        '4-Star Hotel in Paris (3 nights)',
        'Airport Transfers',
        'City Tours with Guide',
        'Breakfast Daily',
        'Eurostar Train (London to Paris)',
        'Travel Insurance'
      ],
      highlights: [
        'Big Ben & Houses of Parliament',
        'Eiffel Tower & Louvre Museum',
        'Buckingham Palace',
        'Notre-Dame Cathedral',
        'Westminster Abbey',
        'Champs-Élysées'
      ],
      itinerary: [
        'Day 1: Arrive London, City Tour',
        'Day 2: London Sightseeing',
        'Day 3: London Free Day',
        'Day 4: Travel to Paris',
        'Day 5: Paris Sightseeing',
        'Day 6: Paris Free Day',
        'Day 7: Departure'
      ]
    },
    {
      id: 2,
      title: 'Dubai Luxury Escape',
      destination: 'Nepal',
      description: 'Experience the magic of Dubai with premium accommodations, desert adventures, and iconic landmarks. Perfect for luxury seekers and adventure lovers.',
      image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      duration: '5 Days / 4 Nights',
      price: 'Rs.65,500',
      originalPrice: 'Rs.89,000',
      discount: '26% OFF',
      rating: 4.9,
      reviews: 892,
      packageType: 'Luxury',
      departureDate: '20 Dec 2024',
      includes: [
        'Return Flights from Delhi',
        '5-Star Hotel with Desert View',
        'Desert Safari with BBQ Dinner',
        'Burj Khalifa Observation Deck',
        'Dubai Mall & Fountain Show',
        'Palm Jumeirah Tour',
        'Half-Day City Tour',
        'Airport Transfers'
      ],
      highlights: [
        'Burj Khalifa (World\'s Tallest Building)',
        'Desert Safari with Dune Bashing',
        'Palm Jumeirah & Atlantis',
        'Dubai Mall & Fountain Show',
        'Gold Souk & Spice Market',
        'Jumeirah Beach'
      ],
      itinerary: [
        'Day 1: Arrive Dubai, Check-in',
        'Day 2: City Tour & Burj Khalifa',
        'Day 3: Desert Safari',
        'Day 4: Palm Jumeirah & Shopping',
        'Day 5: Departure'
      ]
    },
    {
      id: 3,
      title: 'Singapore & Malaysia Discovery',
      destination: 'Southeast Asia',
      description: 'Discover the best of Southeast Asia with guided tours, cultural experiences, and modern city life. Perfect blend of urban and natural attractions.',
      image: 'https://images.unsplash.com/photo-1525625293386-3f8f99389edd?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      duration: '6 Days / 5 Nights',
      price: 'Rs.52,800',
      originalPrice: 'Rs.72,000',
      discount: '27% OFF',
      rating: 4.7,
      reviews: 1563,
      packageType: 'Cultural',
      departureDate: '18 Dec 2024',
      includes: [
        'Return Flights from Bangalore',
        '4-Star Hotels in Both Cities',
        'Guided Tours in Singapore',
        'Malaysia Day Trip',
        'Meals: Breakfast & 2 Dinners',
        'Singapore Flyer',
        'Marina Bay Sands Light Show',
        'All Transfers'
      ],
      highlights: [
        'Marina Bay Sands & Gardens',
        'Sentosa Island & Universal Studios',
        'Petronas Towers (Kuala Lumpur)',
        'Singapore Flyer',
        'Chinatown & Little India',
        'Batu Caves (Malaysia)'
      ],
      itinerary: [
        'Day 1: Arrive Singapore',
        'Day 2: Singapore City Tour',
        'Day 3: Sentosa Island',
        'Day 4: Malaysia Day Trip',
        'Day 5: Singapore Free Day',
        'Day 6: Departure'
      ]
    },
    {
      id: 4,
      title: 'Swiss Alps Adventure',
      destination: 'Switzerland',
      description: 'Mountain adventures with scenic train journeys, cozy alpine stays, and breathtaking views. Perfect for nature lovers and adventure seekers.',
      image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      duration: '8 Days / 7 Nights',
      price: 'Rs.1,15,000',
      originalPrice: 'Rs.1,45,000',
      discount: '21% OFF',
      rating: 4.9,
      reviews: 734,
      packageType: 'Adventure',
      departureDate: '22 Dec 2024',
      includes: [
        'Return Flights from Mumbai',
        'Mountain Hotels & Resorts',
        'Swiss Travel Pass (8 Days)',
        'Ski Equipment & Lessons',
        'Cable Car Passes',
        'Guided Hiking Tours',
        'Traditional Swiss Dinner',
        'All Mountain Transfers'
      ],
      highlights: [
        'Jungfraujoch (Top of Europe)',
        'Zermatt & Matterhorn',
        'Interlaken & Lake Thun',
        'Lucerne & Chapel Bridge',
        'Bernese Oberland',
        'Swiss Chocolate Factory'
      ],
      itinerary: [
        'Day 1: Arrive Zurich, Travel to Interlaken',
        'Day 2: Jungfraujoch Excursion',
        'Day 3: Interlaken & Lake Thun',
        'Day 4: Travel to Zermatt',
        'Day 5: Matterhorn & Skiing',
        'Day 6: Lucerne Day Trip',
        'Day 7: Bern & Chocolate Factory',
        'Day 8: Departure'
      ]
    },
    {
      id: 5,
      title: 'Bali Honeymoon Paradise',
      destination: 'Indonesia',
      description: 'Romantic getaway to Bali with private villas, beachfront dining, and cultural experiences. Perfect for newlyweds and couples.',
      image: 'https://images.unsplash.com/photo-1537953773345-d172ccf13cf1?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      duration: '6 Days / 5 Nights',
      price: 'Rs.78,500',
      originalPrice: 'Rs.95,000',
      discount: '17% OFF',
      rating: 4.8,
      reviews: 1123,
      packageType: 'Honeymoon',
      departureDate: '25 Dec 2024',
      includes: [
        'Return Flights from Chennai',
        'Private Pool Villa',
        'Couple Spa Treatment',
        'Romantic Beach Dinner',
        'Private Temple Tour',
        'Rice Terrace Trek',
        'Sunset Cruise',
        'All Meals Included'
      ],
      highlights: [
        'Private Pool Villa with Ocean View',
        'Ubud Rice Terraces',
        'Tanah Lot Temple',
        'Nusa Penida Island',
        'Traditional Balinese Massage',
        'Romantic Beach Dinner'
      ],
      itinerary: [
        'Day 1: Arrive Bali, Check-in Villa',
        'Day 2: Ubud Cultural Tour',
        'Day 3: Nusa Penida Island',
        'Day 4: Spa & Relaxation',
        'Day 5: Temple Tour & Shopping',
        'Day 6: Departure'
      ]
    },
    {
      id: 6,
      title: 'Japan Cherry Blossom Tour',
      destination: 'Japan',
      description: 'Experience Japan during cherry blossom season with traditional culture, modern cities, and natural beauty. Limited time seasonal package.',
      image: 'https://images.unsplash.com/photo-1545569341-9eb8b30979d9?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      duration: '7 Days / 6 Nights',
      price: 'Rs.95,000',
      originalPrice: 'Rs.1,20,000',
      discount: '21% OFF',
      rating: 4.9,
      reviews: 567,
      packageType: 'Cultural',
      departureDate: '1 Apr 2025',
      includes: [
        'Return Flights from Delhi',
        'Traditional Ryokan Stay',
        'Bullet Train Passes',
        'Cherry Blossom Viewing',
        'Tea Ceremony Experience',
        'Sushi Making Class',
        'All City Transfers',
        'English Speaking Guide'
      ],
      highlights: [
        'Cherry Blossom Viewing (Sakura)',
        'Traditional Ryokan Experience',
        'Bullet Train to Kyoto',
        'Tea Ceremony & Sushi Class',
        'Mount Fuji Views',
        'Traditional Gardens'
      ],
      itinerary: [
        'Day 1: Arrive Tokyo',
        'Day 2: Tokyo Cherry Blossoms',
        'Day 3: Bullet Train to Kyoto',
        'Day 4: Kyoto Temples & Gardens',
        'Day 5: Nara & Deer Park',
        'Day 6: Return to Tokyo',
        'Day 7: Departure'
      ]
    }
  ];

  const handleFilterChange = (name, value) => {
    setFilters(prev => ({
      ...prev,
      [name]: value
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
              <h1 className="text-2xl sm:text-3xl font-bold text-white">Holiday Packages</h1>
              <p className="text-sm sm:text-base text-orange-100 mt-1">All-inclusive travel experiences worldwide</p>
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

      <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-6 sm:py-8">
        <div className="flex flex-col lg:flex-row gap-6 sm:gap-8">
          {/* Filters Sidebar */}
          <div className="lg:w-1/4 order-2 lg:order-1">
            <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 sticky top-8">
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">Filters</h3>

              {/* Destination */}
              <div className="mb-4 sm:mb-6">
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">Destination</label>
                <input
                  type="text"
                  placeholder="Where do you want to go?"
                  value={filters.destination}
                  onChange={(e) => handleFilterChange('destination', e.target.value)}
                  className="w-full px-3 sm:px-4 py-2 text-xs sm:text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                />
              </div>

              {/* Package Type */}
              <div className="mb-4 sm:mb-6">
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">Package Type</label>
                <select
                  value={filters.packageType}
                  onChange={(e) => handleFilterChange('packageType', e.target.value)}
                  className="w-full px-3 sm:px-4 py-2 text-xs sm:text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                >
                  {packageTypes.map(type => (
                    <option key={type} value={type === 'All Packages' ? 'all' : type.toLowerCase()}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>

              {/* Duration */}
              <div className="mb-4 sm:mb-6">
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">Duration</label>
                <select
                  value={filters.duration}
                  onChange={(e) => handleFilterChange('duration', e.target.value)}
                  className="w-full px-3 sm:px-4 py-2 text-xs sm:text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                >
                  <option value="">Any duration</option>
                  <option value="3-5">3-5 Days</option>
                  <option value="6-8">6-8 Days</option>
                  <option value="9-12">9-12 Days</option>
                  <option value="13+">13+ Days</option>
                </select>
              </div>

              {/* Departure Date */}
              <div className="mb-4 sm:mb-6">
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">Departure Date</label>
                <input
                  type="date"
                  value={filters.departureDate}
                  onChange={(e) => handleFilterChange('departureDate', e.target.value)}
                  className="w-full px-3 sm:px-4 py-2 text-xs sm:text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                />
              </div>

              {/* Price Range */}
              <div className="mb-4 sm:mb-6">
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">Price Range (Rs.)</label>
                <div className="flex space-x-2">
                  <input
                    type="number"
                    placeholder="Min"
                    value={filters.priceRange[0]}
                    onChange={(e) => handleFilterChange('priceRange', [parseInt(e.target.value), filters.priceRange[1]])}
                    className="w-1/2 px-3 sm:px-4 py-2 text-xs sm:text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  />
                  <input
                    type="number"
                    placeholder="Max"
                    value={filters.priceRange[1]}
                    onChange={(e) => handleFilterChange('priceRange', [filters.priceRange[0], parseInt(e.target.value)])}
                    className="w-1/2 px-3 sm:px-4 py-2 text-xs sm:text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  />
                </div>
              </div>

              {/* Rating */}
              <div className="mb-4 sm:mb-6">
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">Minimum Rating</label>
                <select
                  value={filters.rating}
                  onChange={(e) => handleFilterChange('rating', parseInt(e.target.value))}
                  className="w-full px-3 sm:px-4 py-2 text-xs sm:text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                >
                  <option value={0}>Any rating</option>
                  <option value={4}>4+ stars</option>
                  <option value={4.5}>4.5+ stars</option>
                  <option value={5}>5 stars only</option>
                </select>
              </div>

              {/* Apply Filters Button */}
              <button className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-200 text-sm sm:text-base">
                Apply Filters
              </button>
            </div>
          </div>

          {/* Package Listings */}
          <div className="lg:w-3/4 order-1 lg:order-2">
            <div className="mb-4 sm:mb-6">
              <p className="text-sm sm:text-base text-gray-600">Showing {packages.length} packages</p>
            </div>

            <div className={viewMode === 'grid' ? 'grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6' : 'space-y-4 sm:space-y-6'}>
              {packages.map((pkg) => (
                <div key={pkg.id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
                  <div className={viewMode === 'grid' ? 'block' : 'flex flex-col sm:flex-row'}>
                    {/* Package Image */}
                    <div className={viewMode === 'grid' ? 'h-48 sm:h-64' : 'w-full sm:w-80 h-48 sm:h-64'}>
                      <img
                        src={pkg.image}
                        alt={pkg.title}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Package Content */}
                    <div className="p-4 sm:p-6 flex-1">
                      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-3 space-y-2 sm:space-y-0">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="bg-orange-100 text-orange-800 text-xs px-2 py-1 rounded-full">
                              {pkg.packageType}
                            </span>
                            <span className="text-xs sm:text-sm text-gray-500">{pkg.destination}</span>
                          </div>
                          <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">{pkg.title}</h3>
                          <p className="text-xs sm:text-sm text-gray-700 mb-4 hidden sm:block">{pkg.description}</p>
                        </div>
                        <div className="text-left sm:text-right">
                          <div className="text-xl sm:text-2xl font-bold text-orange-500">{pkg.price}</div>
                          <div className="text-xs sm:text-sm text-gray-500 line-through">{pkg.originalPrice}</div>
                          <div className="mt-2">
                            <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                              {pkg.discount}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Rating and Duration */}
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-3 sm:mb-4 space-y-2 sm:space-y-0">
                        <div className="flex items-center">
                          {[...Array(5)].map((_, i) => (
                            <svg
                              key={i}
                              className={`w-3 h-3 sm:w-4 sm:h-4 ${i < Math.floor(pkg.rating) ? 'text-yellow-400' : 'text-gray-300'}`}
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                          ))}
                          <span className="ml-2 text-xs sm:text-sm font-medium text-gray-900">{pkg.rating}</span>
                          <span className="ml-1 text-xs sm:text-sm text-gray-500">({pkg.reviews} reviews)</span>
                        </div>
                        <div className="text-xs sm:text-sm text-gray-600">{pkg.duration}</div>
                      </div>

                      {/* Highlights */}
                      <div className="mb-3 sm:mb-4">
                        <h4 className="text-xs sm:text-sm font-semibold text-gray-900 mb-2">Highlights:</h4>
                        <div className="flex flex-wrap gap-1 sm:gap-2">
                          {pkg.highlights.slice(0, 4).map((highlight, index) => (
                            <span key={index} className="bg-orange-100 text-orange-800 text-xs px-2 py-1 rounded-full">
                              {highlight}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* What's Included */}
                      <div className="mb-4 sm:mb-6">
                        <h4 className="text-xs sm:text-sm font-semibold text-gray-900 mb-2">What's Included:</h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {pkg.includes.slice(0, 4).map((item, index) => (
                            <div key={index} className="flex items-center text-xs sm:text-sm text-gray-600">
                              <svg className="w-3 h-3 sm:w-4 sm:h-4 text-green-500 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                              </svg>
                              <span className="truncate">{item}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Book Button */}
                      <Link
                        to={`/packages/${pkg.id}`}
                        className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2.5 sm:py-3 px-4 sm:px-6 rounded-lg transition-colors duration-300 inline-block text-center text-sm sm:text-base"
                      >
                        Book Package
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

export default PackagesPage;
