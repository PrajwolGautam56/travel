import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { packagesAPI } from '../services/api';

const PopularPackages = () => {
  const [packages, setPackages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPopularPackages = async () => {
      try {
        const response = await packagesAPI.getPopular();
        // Transform backend data to match frontend format
        const packagesData = (response.packages || []).slice(0, 3).map(pkg => {
          const finalPrice = pkg.pricing?.discountedPrice || pkg.pricing?.originalPrice || 0;
          const originalPrice = pkg.pricing?.originalPrice;
          const discount = pkg.pricing?.discountPercentage || 0;
          const days = pkg.duration?.days || 0;
          const nights = pkg.duration?.nights || 0;
          const duration = days > 0 ? `${days} Day${days > 1 ? 's' : ''}${nights > 0 ? ` / ${nights} Night${nights > 1 ? 's' : ''}` : ''}` : 'N/A';
          
          return {
            id: pkg._id || pkg.id,
            title: pkg.title,
            destination: pkg.destination,
            image: pkg.images?.[0] || pkg.image || 'https://images.unsplash.com/photo-1513634489774-f96762e6f3b6?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
            price: `Rs.${finalPrice.toLocaleString('en-IN')}`,
            originalPrice: originalPrice && originalPrice > finalPrice ? `Rs.${originalPrice.toLocaleString('en-IN')}` : null,
            discount: discount > 0 ? `${discount}% OFF` : null,
            duration: duration,
            highlights: pkg.highlights || pkg.included || []
          };
        });
        setPackages(packagesData);
      } catch (error) {
        console.error('Error fetching popular packages:', error);
        setPackages([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPopularPackages();
  }, []);

  // Fallback mock data
  const mockPackages = [
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

        {isLoading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mb-4"></div>
            <p className="text-gray-600">Loading popular packages...</p>
          </div>
        ) : packages.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600">No popular packages available at the moment.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 mb-8 sm:mb-12">
            {packages.map((pkg) => (
            <div key={pkg.id} className="group bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:border-orange-200 transform hover:-translate-y-2">
              {/* Package Image */}
              <div className="relative h-40 sm:h-48 overflow-hidden">
                <img
                  src={pkg.image}
                  alt={pkg.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="absolute top-3 sm:top-4 right-3 sm:right-4">
                  <span className="bg-gradient-to-r from-orange-500 to-orange-600 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg backdrop-blur-sm">
                    {pkg.discount}
                  </span>
                </div>
              </div>

              {/* Package Content */}
              <div className="p-4 sm:p-6 bg-gradient-to-b from-white to-gray-50">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs sm:text-sm text-orange-500 font-semibold">{pkg.destination}</span>
                  <span className="text-xs sm:text-sm text-gray-500">{pkg.duration}</span>
                </div>

                <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-3">{pkg.title}</h3>

                <div className="mb-4">
                  <h4 className="text-xs sm:text-sm font-semibold text-gray-900 mb-2">Highlights:</h4>
                  <div className="flex flex-wrap gap-1 sm:gap-2">
                    {pkg.highlights.map((highlight, index) => (
                      <span key={index} className="bg-gradient-to-r from-orange-100 to-orange-50 text-orange-800 text-xs px-2.5 py-1 rounded-full font-medium border border-orange-200">
                        {highlight}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between mb-4">
                  <div>
                    <div className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-orange-500 to-orange-600 bg-clip-text text-transparent">{pkg.price}</div>
                    <div className="text-xs sm:text-sm text-gray-500 line-through">{pkg.originalPrice}</div>
                  </div>
                  <Link
                    to={`/packages/${pkg.id}`}
                    className="group/btn bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold py-2 px-3 sm:px-4 rounded-xl transition-all duration-300 cursor-pointer text-sm sm:text-base shadow-md hover:shadow-lg transform hover:scale-105 relative overflow-hidden"
                  >
                    <span className="relative z-10">Book Now</span>
                    <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover/btn:translate-x-[100%] transition-transform duration-700"></div>
                  </Link>
                </div>
              </div>
            </div>
            ))}
          </div>
        )}

        {/* View All Button */}
        <div className="text-center">
          <Link
            to="/packages"
            className="group inline-flex items-center px-4 sm:px-6 py-2.5 sm:py-3 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold rounded-xl hover:shadow-lg transition-all duration-300 text-sm sm:text-base shadow-md transform hover:scale-105 relative overflow-hidden"
          >
            <span className="relative z-10">View All Packages</span>
            <svg className="ml-2 w-4 h-4 sm:w-5 sm:h-5 relative z-10 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
            <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default PopularPackages;
