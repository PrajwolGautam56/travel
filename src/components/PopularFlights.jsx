import React from 'react';

const PopularFlights = () => {
  const popularFlights = [
    {
      id: 1,
      from: 'Mumbai',
      to: 'London',
      airline: 'British Airways',
      price: '₹45,000',
      duration: '9h 30m',
      stops: 'Direct',
      departure: '08:30',
      arrival: '12:00',
      date: '15 Dec 2024'
    },
    {
      id: 2,
      from: 'Delhi',
      to: 'Dubai',
      airline: 'Emirates',
      price: '₹28,500',
      duration: '3h 45m',
      stops: 'Direct',
      departure: '14:15',
      arrival: '16:00',
      date: '20 Dec 2024'
    },
    {
      id: 3,
      from: 'Bangalore',
      to: 'Singapore',
      airline: 'Singapore Airlines',
      price: '₹32,000',
      duration: '4h 20m',
      stops: 'Direct',
      departure: '11:45',
      arrival: '18:05',
      date: '18 Dec 2024'
    },
    {
      id: 4,
      from: 'Chennai',
      to: 'Frankfurt',
      airline: 'Lufthansa',
      price: '₹52,000',
      duration: '10h 15m',
      stops: '1 Stop',
      departure: '22:30',
      arrival: '06:45',
      date: '22 Dec 2024'
    }
  ];

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Popular Flights
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Discover our most popular routes with competitive prices and convenient schedules
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {popularFlights.map((flight) => (
            <div key={flight.id} className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden">
              {/* Flight Header */}
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-4 text-white">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium">{flight.airline}</span>
                  <span className="text-xs bg-white/20 px-2 py-1 rounded-full">
                    {flight.stops}
                  </span>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">{flight.price}</div>
                  <div className="text-xs opacity-90">Starting from</div>
                </div>
              </div>

              {/* Flight Details */}
              <div className="p-4">
                {/* Route */}
                <div className="flex items-center justify-between mb-4">
                  <div className="text-center">
                    <div className="text-lg font-semibold text-gray-900">{flight.from}</div>
                    <div className="text-sm text-gray-500">{flight.departure}</div>
                  </div>
                  
                  <div className="flex-1 mx-4">
                    <div className="flex items-center">
                      <div className="flex-1 h-px bg-gray-300"></div>
                      <div className="mx-2">
                        <svg className="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
                        </svg>
                      </div>
                      <div className="flex-1 h-px bg-gray-300"></div>
                    </div>
                    <div className="text-center text-xs text-gray-500 mt-1">{flight.duration}</div>
                  </div>
                  
                  <div className="text-center">
                    <div className="text-lg font-semibold text-gray-900">{flight.to}</div>
                    <div className="text-sm text-gray-500">{flight.arrival}</div>
                  </div>
                </div>

                {/* Date */}
                <div className="text-center text-sm text-gray-600 mb-4">
                  {flight.date}
                </div>

                {/* Book Button */}
                <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-300">
                  Book Now
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* View All Button */}
        <div className="text-center mt-12">
          <button className="bg-transparent border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white font-semibold py-3 px-8 rounded-lg transition-all duration-300">
            View All Flights
          </button>
        </div>
      </div>
    </section>
  );
};

export default PopularFlights;
