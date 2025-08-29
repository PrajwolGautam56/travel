import React from 'react';
import { Link } from 'react-router-dom';

const PopularPackages = () => {
  const packages = [
    {
      id: 1,
      title: 'London & Paris Adventure',
      destination: 'UK & France',
      image: 'https://images.unsplash.com/photo-1513634489774-f96762e6f3b6?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      price: '₹89,999',
      originalPrice: '₹1,25,000',
      discount: '28% OFF',
      duration: '7 Days / 6 Nights',
      highlights: ['Big Ben', 'Eiffel Tower', 'Louvre Museum', 'Buckingham Palace']
    },
    {
      id: 2,
      title: 'Dubai Luxury Escape',
      destination: 'UAE',
      image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      price: '₹65,500',
      originalPrice: '₹89,000',
      discount: '26% OFF',
      duration: '5 Days / 4 Nights',
      highlights: ['Burj Khalifa', 'Desert Safari', 'Palm Jumeirah', 'Dubai Mall']
    },
    {
      id: 3,
      title: 'Singapore & Malaysia',
      destination: 'Southeast Asia',
      image: 'https://images.unsplash.com/photo-1525625293386-3f8f99389edd?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      price: '₹52,800',
      originalPrice: '₹72,000',
      discount: '27% OFF',
      duration: '6 Days / 5 Nights',
      highlights: ['Marina Bay Sands', 'Sentosa Island', 'Petronas Towers', 'Singapore Flyer']
    }
  ];

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Popular Holiday Packages
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Discover our handpicked travel experiences with flights, hotels, and guided tours included
          </p>
        </div>

        {/* Packages Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {packages.map((pkg) => (
            <div key={pkg.id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
              {/* Package Image */}
              <div className="relative h-48">
                <img 
                  src={pkg.image} 
                  alt={pkg.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-4 right-4">
                  <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                    {pkg.discount}
                  </span>
                </div>
              </div>

              {/* Package Content */}
              <div className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-blue-600 font-medium">{pkg.destination}</span>
                  <span className="text-sm text-gray-500">{pkg.duration}</span>
                </div>
                
                <h3 className="text-xl font-bold text-gray-900 mb-3">{pkg.title}</h3>
                
                <div className="mb-4">
                  <h4 className="text-sm font-semibold text-gray-900 mb-2">Highlights:</h4>
                  <div className="flex flex-wrap gap-2">
                    {pkg.highlights.map((highlight, index) => (
                      <span key={index} className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                        {highlight}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between mb-4">
                  <div>
                    <div className="text-2xl font-bold text-blue-600">{pkg.price}</div>
                    <div className="text-sm text-gray-500 line-through">{pkg.originalPrice}</div>
                  </div>
                  <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-300">
                    Book Now
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* View All Button */}
        <div className="text-center">
          <Link
            to="/packages"
            className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl"
          >
            View All Packages
            <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default PopularPackages;
