import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { flightsAPI } from '../services/api';

const PopularFlights = () => {
  const [popularFlights, setPopularFlights] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPopularFlights = async () => {
      try {
        const response = await flightsAPI.getPopular();
        // Transform backend data to match frontend format
        const flights = (response.flights || []).slice(0, 4).map(flight => ({
          id: flight._id || flight.id,
          from: flight.origin || flight.from,
          to: flight.destination || flight.to,
          airline: flight.airline || 'Airline',
          price: `Rs.${(flight.price || flight.pricing?.basePrice || 0).toLocaleString('en-IN')}`,
          duration: flight.duration || 'N/A',
          stops: flight.stops === 0 ? 'Direct' : `${flight.stops} Stop${flight.stops > 1 ? 's' : ''}`,
          departure: flight.departureTime?.substring(0, 5) || 'N/A',
          arrival: flight.arrivalTime?.substring(0, 5) || 'N/A',
          date: new Date(flight.departureDate || Date.now()).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
        }));
        setPopularFlights(flights);
      } catch (error) {
        console.error('Error fetching popular flights:', error);
        // Keep empty array on error
        setPopularFlights([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPopularFlights();
  }, []);

  const handleBookNow = (flight) => {
    navigate('/flight-search', {
      state: {
        searchData: {
          from: flight.from,
          to: flight.to,
          departureDate: new Date().toISOString().split('T')[0],
          passengers: 1
        }
      }
    });
  };

  // Fallback mock data if API fails or no data
  const mockFlights = [
    {
      id: 1,
      from: 'Kathmandu',
      to: 'Pokhara',
      airline: 'British Airways',
      price: 'Rs.45,000',
      duration: '9h 30m',
      stops: 'Direct',
      departure: '08:30',
      arrival: '12:00',
      date: '15 Dec 2024'
    },
    {
      id: 2,
      from: 'Pokhara',
      to: 'Chitwan',
      airline: 'Emirates',
      price: 'Rs.28,500',
      duration: '3h 45m',
      stops: 'Direct',
      departure: '14:15',
      arrival: '16:00',
      date: '20 Dec 2024'
    },
    {
      id: 3,
      from: 'Bharatpur',
      to: 'Biratnagar',
      airline: 'Singapore Airlines',
      price: 'Rs.32,000',
      duration: '4h 20m',
      stops: 'Direct',
      departure: '11:45',
      arrival: '18:05',
      date: '18 Dec 2024'
    },
    {
      id: 4,
      from: 'Biratnagar',
      to: 'Lukla',
      airline: 'Lufthansa',
      price: 'Rs.52,000',
      duration: '10h 15m',
      stops: '1 Stop',
      departure: '22:30',
      arrival: '06:45',
      date: '22 Dec 2024'
    }
  ];

  return (
    <section className="py-12 sm:py-16 md:py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-3 sm:mb-4">
            Popular Flights
          </h2>
          <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto px-4">
            Discover our most popular routes with competitive prices and convenient schedules
          </p>
        </div>

        {isLoading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mb-4"></div>
            <p className="text-gray-600">Loading popular flights...</p>
          </div>
        ) : popularFlights.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600">No popular flights available at the moment.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {popularFlights.map((flight) => (
            <div key={flight.id} className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100 hover:border-orange-200 transform hover:-translate-y-2">
              {/* Flight Header */}
              <div className="bg-gradient-to-br from-orange-500 to-orange-600 p-3 sm:p-4 text-white relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="relative z-10 flex justify-between items-center mb-2">
                  <span className="text-xs sm:text-sm font-semibold">{flight.airline}</span>
                  <span className="text-xs bg-white/30 backdrop-blur-sm px-2 py-1 rounded-full font-medium">
                    {flight.stops}
                  </span>
                </div>
                <div className="relative z-10 text-center">
                  <div className="text-xl sm:text-2xl font-bold drop-shadow-sm">{flight.price}</div>
                  <div className="text-xs opacity-90 mt-1">Starting from</div>
                </div>
              </div>

              {/* Flight Details */}
              <div className="p-3 sm:p-4 bg-gradient-to-b from-white to-gray-50">
                {/* Route */}
                <div className="flex items-center justify-between mb-3 sm:mb-4">
                  <div className="text-center">
                    <div className="text-base sm:text-lg font-semibold text-gray-900">{flight.from}</div>
                    <div className="text-xs sm:text-sm text-gray-500">{flight.departure}</div>
                  </div>

                  <div className="flex-1 mx-2 sm:mx-4">
                    <div className="flex items-center">
                      <div className="flex-1 h-px bg-gray-300"></div>
                      <div className="mx-1 sm:mx-2">
                        <svg className="w-3 h-3 sm:w-4 sm:h-4 text-orange-500" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
                        </svg>
                      </div>
                      <div className="flex-1 h-px bg-gray-300"></div>
                    </div>
                    <div className="text-center text-xs text-gray-500 mt-1">{flight.duration}</div>
                  </div>

                  <div className="text-center">
                    <div className="text-base sm:text-lg font-semibold text-gray-900">{flight.to}</div>
                    <div className="text-xs sm:text-sm text-gray-500">{flight.arrival}</div>
                  </div>
                </div>

                {/* Date */}
                <div className="text-center text-xs sm:text-sm text-gray-600 mb-3 sm:mb-4">
                  {flight.date}
                </div>

                {/* Book Button */}
                <button 
                  onClick={() => handleBookNow(flight)}
                  className="group/btn w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold py-2.5 px-3 sm:px-4 rounded-xl transition-all duration-300 text-sm sm:text-base shadow-md hover:shadow-lg transform hover:scale-[1.02] relative overflow-hidden"
                >
                  <span className="relative z-10">Book Now</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover/btn:translate-x-[100%] transition-transform duration-700"></div>
                </button>
              </div>
            </div>
            ))}
          </div>
        )}

        {/* View All Button */}
        <div className="text-center mt-8 sm:mt-12">
          <button className="group relative bg-transparent border-2 border-orange-500 text-orange-500 hover:bg-orange-500 hover:text-white font-semibold py-2.5 sm:py-3 px-6 sm:px-8 rounded-xl transition-all duration-300 text-sm sm:text-base shadow-md hover:shadow-lg transform hover:scale-105 overflow-hidden">
            <span className="relative z-10">View All Flights</span>
            <div className="absolute inset-0 bg-orange-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
          </button>
        </div>
      </div>
    </section>
  );
};

export default PopularFlights;
