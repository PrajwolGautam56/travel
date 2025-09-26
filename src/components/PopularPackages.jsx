import React from 'react';
import { Link } from 'react-router-dom';

const PopularPackages = () => {
  const packages = [
    {
      id: 1,
      title: 'London & Paris Adventure',
      destination: 'Nepal & India',
      image: 'https://images.unsplash.com/photo-1513634489774-f96762e6f3b6?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      price: 'Rs.89,999',
      originalPrice: 'Rs.1,25,000',
      discount: '28% OFF',
      duration: '7 Days / 6 Nights',
      highlights: ['Big Ben', 'Eiffel Tower', 'Louvre Museum', 'Buckingham Palace']
    },
    {
      id: 2,
      title: 'Dubai Luxury Escape',
      destination: 'Nepal',
      image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      price: 'Rs.65,500',
      originalPrice: 'Rs.89,000',
      discount: '26% OFF',
      duration: '5 Days / 4 Nights',
      highlights: ['Burj Khalifa', 'Desert Safari', 'Palm Jumeirah', 'Dubai Mall']
    },
    {
      id: 3,
      title: 'Singapore & Malaysia',
      destination: 'Nepal',
      image: 'https://images.unsplash.com/photo-1525625293386-3f8f99389edd?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      price: 'Rs.52,800',
      originalPrice: 'Rs.72,000',
      discount: '27% OFF',
      duration: '6 Days / 5 Nights',
      highlights: ['Marina Bay Sands', 'Sentosa Island', 'Petronas Towers', 'Singapore Flyer']
    }
  ];

  return (
    <section className="py-12 sm:py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-8 sm:mb-12">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-3 sm:mb-4">
            Popular Holiday Packages
          </h2>
          <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto px-4">
            Discover our handpicked travel experiences with flights, hotels, and guided tours included
          </p>
        </div>

        {/* Packages Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 mb-8 sm:mb-12">
          {packages.map((pkg) => (
            <div key={pkg.id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
              {/* Package Image */}
              <div className="relative h-40 sm:h-48">
                <img
                  src={pkg.image}
                  alt={pkg.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-3 sm:top-4 right-3 sm:right-4">
                  <span className="bg-orange-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                    {pkg.discount}
                  </span>
                </div>
              </div>

              {/* Package Content */}
              <div className="p-4 sm:p-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs sm:text-sm text-orange-500 font-medium">{pkg.destination}</span>
                  <span className="text-xs sm:text-sm text-gray-500">{pkg.duration}</span>
                </div>

                <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-3">{pkg.title}</h3>

                <div className="mb-4">
                  <h4 className="text-xs sm:text-sm font-semibold text-gray-900 mb-2">Highlights:</h4>
                  <div className="flex flex-wrap gap-1 sm:gap-2">
                    {pkg.highlights.map((highlight, index) => (
                      <span key={index} className="bg-orange-100 text-orange-800 text-xs px-2 py-1 rounded-full">
                        {highlight}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between mb-4">
                  <div>
                    <div className="text-xl sm:text-2xl font-bold text-orange-500">{pkg.price}</div>
                    <div className="text-xs sm:text-sm text-gray-500 line-through">{pkg.originalPrice}</div>
                  </div>
                  <Link
                    to="/packages"
                    className="bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2 px-3 sm:px-4 rounded-lg transition-colors duration-300 cursor-pointer text-sm sm:text-base"
                  >
                    Book Now
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* View All Button */}
        <div className="text-center">
          <Link
            to="/packages"
            className="inline-flex items-center px-4 sm:px-6 py-2.5 sm:py-3 bg-green-500 text-white font-semibold rounded-lg hover:bg-green-600 transition-colors duration-300 text-sm sm:text-base"
          >
            View All Packages
            <svg className="ml-2 w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default PopularPackages;
