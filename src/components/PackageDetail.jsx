import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const PackageDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [bookingData, setBookingData] = useState({
    departureDate: '',
    guests: 1,
    rooms: 1,
    specialRequests: ''
  });

  // Mock package data - in real app this would come from API
  const packageData = {
    id: 1,
    title: 'London & Paris Adventure',
    destination: 'UK & France',
    description: 'Explore two iconic European cities with flights and 4-star hotels. Experience the best of British and French culture, cuisine, and landmarks. This carefully curated package includes guided tours, comfortable accommodations, and seamless travel between cities.',
    image: 'https://images.unsplash.com/photo-1513634489774-f96762e6f3b6?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1513634489774-f96762e6f3b6?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1571896349842-33c89424de2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
    ],
    duration: '7 Days / 6 Nights',
    price: '₹89,999',
    originalPrice: '₹1,25,000',
    discount: '28% OFF',
    rating: 4.8,
    reviews: 1247,
    packageType: 'Cultural',
    departureCity: 'Mumbai',
    highlights: [
      'Big Ben & Houses of Parliament',
      'Eiffel Tower & Louvre Museum',
      'Buckingham Palace',
      'Notre-Dame Cathedral',
      'Westminster Abbey',
      'Champs-Élysées',
      'Tower Bridge',
      'Arc de Triomphe'
    ],
    includes: [
      'Return Flights from Mumbai',
      '4-Star Hotel in London (3 nights)',
      '4-Star Hotel in Paris (3 nights)',
      'Airport Transfers',
      'City Tours with Professional Guide',
      'Breakfast Daily',
      'Eurostar Train (London to Paris)',
      'Travel Insurance',
      'Visa Assistance',
      '24/7 Travel Support'
    ],
    excludes: [
      'Lunch and Dinner (except breakfast)',
      'Personal Expenses',
      'Optional Tours',
      'Tips for Guides and Drivers',
      'International Flights (if not from Mumbai)'
    ],
    itinerary: [
      {
        day: 1,
        title: 'Arrive London',
        description: 'Arrive at London Heathrow Airport. Transfer to your hotel in central London. Evening at leisure to explore the vibrant city.',
        activities: ['Airport Transfer', 'Hotel Check-in', 'Evening at Leisure'],
        accommodation: '4-Star Hotel in London',
        meals: 'Dinner on own'
      },
      {
        day: 2,
        title: 'London Sightseeing',
        description: 'Full-day guided tour of London\'s iconic landmarks including Big Ben, Houses of Parliament, Buckingham Palace, and Westminster Abbey.',
        activities: ['Big Ben', 'Houses of Parliament', 'Buckingham Palace', 'Westminster Abbey', 'Tower Bridge'],
        accommodation: '4-Star Hotel in London',
        meals: 'Breakfast included'
      },
      {
        day: 3,
        title: 'London Free Day',
        description: 'Day at leisure to explore London on your own. Visit museums, go shopping, or take optional tours.',
        activities: ['Optional: British Museum', 'Optional: Shopping at Oxford Street', 'Optional: West End Show'],
        accommodation: '4-Star Hotel in London',
        meals: 'Breakfast included'
      },
      {
        day: 4,
        title: 'Travel to Paris',
        description: 'Morning transfer to St. Pancras Station. Take the Eurostar to Paris. Afternoon arrival and hotel check-in.',
        activities: ['Eurostar Journey', 'Hotel Check-in', 'Evening at Leisure'],
        accommodation: '4-Star Hotel in Paris',
        meals: 'Breakfast included'
      },
      {
        day: 5,
        title: 'Paris Sightseeing',
        description: 'Full-day guided tour of Paris including Eiffel Tower, Louvre Museum, Notre-Dame Cathedral, and Champs-Élysées.',
        activities: ['Eiffel Tower', 'Louvre Museum', 'Notre-Dame Cathedral', 'Champs-Élysées', 'Arc de Triomphe'],
        accommodation: '4-Star Hotel in Paris',
        meals: 'Breakfast included'
      },
      {
        day: 6,
        title: 'Paris Free Day',
        description: 'Day at leisure to explore Paris on your own. Visit art galleries, go shopping, or take optional tours.',
        activities: ['Optional: Musée d\'Orsay', 'Optional: Shopping at Champs-Élysées', 'Optional: Seine River Cruise'],
        accommodation: '4-Star Hotel in Paris',
        meals: 'Breakfast included'
      },
      {
        day: 7,
        title: 'Departure',
        description: 'Transfer to Charles de Gaulle Airport for your return flight to Mumbai.',
        activities: ['Airport Transfer', 'Return Flight'],
        accommodation: 'Flight',
        meals: 'Breakfast included'
      }
    ],
    hotels: [
      {
        name: 'The Londoner Hotel',
        location: 'Leicester Square, London',
        rating: 4.5,
        description: 'Located in the heart of London\'s entertainment district, this modern 4-star hotel offers comfortable rooms and easy access to major attractions.',
        amenities: ['Free WiFi', 'Restaurant', 'Bar', 'Fitness Center', '24-hour Front Desk']
      },
      {
        name: 'Hotel du Louvre',
        location: '1st Arrondissement, Paris',
        rating: 4.6,
        description: 'Historic hotel located opposite the Louvre Museum, offering elegant rooms with classic French décor and excellent service.',
        amenities: ['Free WiFi', 'Restaurant', 'Bar', 'Concierge', 'Room Service']
      }
    ],
    terms: {
      cancellation: 'Free cancellation up to 30 days before departure',
      payment: '50% payment required at booking, balance 30 days before departure',
      groupSize: 'Minimum 2 passengers, maximum 20 passengers',
      age: 'Suitable for all ages, children under 12 get 20% discount',
      insurance: 'Travel insurance included, covers medical and trip cancellation'
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setBookingData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleBooking = (e) => {
    e.preventDefault();
    console.log('Package booking data:', bookingData);
    // TODO: Integrate with booking API
    alert('Package booking submitted successfully!');
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
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <button
                onClick={() => navigate('/packages')}
                className="text-blue-600 hover:text-blue-700 mb-2 flex items-center"
              >
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Back to Packages
              </button>
              <h1 className="text-3xl font-bold text-gray-900">{packageData.title}</h1>
              <p className="text-gray-600">{packageData.destination} • {packageData.duration}</p>
            </div>
            <div className="text-right">
              <div className="flex items-center mb-2">
                {[...Array(5)].map((_, i) => (
                  <svg
                    key={i}
                    className={`w-5 h-5 ${i < Math.floor(packageData.rating) ? 'text-yellow-400' : 'text-gray-300'}`}
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
                <span className="ml-2 text-lg font-semibold text-gray-900">{packageData.rating}</span>
                <span className="ml-1 text-gray-500">({packageData.reviews} reviews)</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Package Images */}
            <div className="mb-8">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <img
                    src={packageData.gallery[0]}
                    alt={packageData.title}
                    className="w-full h-80 object-cover rounded-xl"
                  />
                </div>
                {packageData.gallery.slice(1, 4).map((image, index) => (
                  <div key={index}>
                    <img
                      src={image}
                      alt={`${packageData.title} ${index + 2}`}
                      className="w-full h-40 object-cover rounded-xl"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Package Description */}
            <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">About This Package</h2>
              <p className="text-gray-700 mb-6">{packageData.description}</p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Highlights</h3>
                  <div className="grid grid-cols-1 gap-2">
                    {packageData.highlights.map((highlight, index) => (
                      <div key={index} className="flex items-center text-gray-700">
                        <svg className="w-4 h-4 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        {highlight}
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Package Type</h3>
                  <div className="space-y-2 text-gray-700">
                    <p><span className="font-medium">Category:</span> {packageData.packageType}</p>
                    <p><span className="font-medium">Duration:</span> {packageData.duration}</p>
                    <p><span className="font-medium">Departure:</span> {packageData.departureCity}</p>
                    <p><span className="font-medium">Group Size:</span> 2-20 passengers</p>
                  </div>
                </div>
              </div>
            </div>

            {/* What's Included/Excluded */}
            <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3 text-green-600">What's Included</h3>
                  <ul className="space-y-2">
                    {packageData.includes.map((item, index) => (
                      <li key={index} className="flex items-start text-gray-700">
                        <svg className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3 text-red-600">What's Not Included</h3>
                  <ul className="space-y-2">
                    {packageData.excludes.map((item, index) => (
                      <li key={index} className="flex items-start text-gray-700">
                        <svg className="w-4 h-4 text-red-500 mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* Detailed Itinerary */}
            <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Detailed Itinerary</h2>
              <div className="space-y-6">
                {packageData.itinerary.map((day) => (
                  <div key={day.day} className="border-l-4 border-orange-500 pl-6">
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="text-xl font-bold text-gray-900">Day {day.day}: {day.title}</h3>
                      <span className="bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full">
                        {day.accommodation}
                      </span>
                    </div>

                    <p className="text-gray-700 mb-3">{day.description}</p>

                    <div className="mb-3">
                      <h4 className="text-sm font-semibold text-gray-900 mb-2">Activities:</h4>
                      <div className="flex flex-wrap gap-2">
                        {day.activities.map((activity, index) => (
                          <span key={index} className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded-full">
                            {activity}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="text-sm text-gray-600">
                      <span className="font-medium">Meals:</span> {day.meals}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Hotels Information */}
            <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Accommodations</h2>
              <div className="space-y-6">
                {packageData.hotels.map((hotel, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="text-lg font-bold text-gray-900">{hotel.name}</h3>
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <svg
                            key={i}
                            className={`w-4 h-4 ${i < Math.floor(hotel.rating) ? 'text-yellow-400' : 'text-gray-300'}`}
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        ))}
                        <span className="ml-2 text-sm font-medium text-gray-900">{hotel.rating}</span>
                      </div>
                    </div>

                    <p className="text-gray-600 mb-3">{hotel.location}</p>
                    <p className="text-gray-700 mb-3">{hotel.description}</p>

                    <div>
                      <h4 className="text-sm font-semibold text-gray-900 mb-2">Amenities:</h4>
                      <div className="flex flex-wrap gap-2">
                        {hotel.amenities.map((amenity, index) => (
                          <span key={index} className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded-full">
                            {amenity}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Terms & Conditions */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Terms & Conditions</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Booking & Payment</h3>
                  <div className="space-y-2 text-gray-700">
                    <p><span className="font-medium">Payment:</span> {packageData.terms.payment}</p>
                    <p><span className="font-medium">Group Size:</span> {packageData.terms.groupSize}</p>
                    <p><span className="font-medium">Age:</span> {packageData.terms.age}</p>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Cancellation & Insurance</h3>
                  <div className="space-y-2 text-gray-700">
                    <p><span className="font-medium">Cancellation:</span> {packageData.terms.cancellation}</p>
                    <p><span className="font-medium">Insurance:</span> {packageData.terms.insurance}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Booking Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-lg p-6 sticky top-8">
              <div className="text-center mb-6">
                <div className="text-3xl font-bold text-blue-600 mb-2">{packageData.price}</div>
                <div className="text-lg text-gray-500 line-through mb-2">{packageData.originalPrice}</div>
                <div className="bg-red-500 text-white text-sm font-bold px-3 py-1 rounded-full inline-block">
                  {packageData.discount}
                </div>
              </div>

              <h3 className="text-xl font-bold text-gray-900 mb-4">Book This Package</h3>

              <form onSubmit={handleBooking} className="space-y-4">
                {/* Departure Date */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Departure Date</label>
                  <input
                    type="date"
                    name="departureDate"
                    value={bookingData.departureDate}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                {/* Number of Guests */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Number of Guests</label>
                  <select
                    name="guests"
                    value={bookingData.guests}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    {[1, 2, 3, 4, 5, 6].map(num => (
                      <option key={num} value={num}>{num} Guest{num > 1 ? 's' : ''}</option>
                    ))}
                  </select>
                </div>

                {/* Number of Rooms */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Number of Rooms</label>
                  <select
                    name="rooms"
                    value={bookingData.rooms}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    {[1, 2, 3, 4, 5].map(num => (
                      <option key={num} value={num}>{num} Room{num > 1 ? 's' : ''}</option>
                    ))}
                  </select>
                </div>

                {/* Special Requests */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Special Requests</label>
                  <textarea
                    name="specialRequests"
                    value={bookingData.specialRequests}
                    onChange={handleInputChange}
                    rows={3}
                    placeholder="Any special requirements or requests..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                {/* Package Summary */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 mb-3">Package Summary</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Package Price:</span>
                      <span>{packageData.price}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Duration:</span>
                      <span>{packageData.duration}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Type:</span>
                      <span>{packageData.packageType}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Departure:</span>
                      <span>{packageData.departureCity}</span>
                    </div>
                  </div>
                </div>

                {/* Book Button */}
                <button
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors duration-200"
                >
                  Book Package Now
                </button>
              </form>

              {/* Contact Support */}
              <div className="mt-6 pt-6 border-t border-gray-200 text-center">
                <p className="text-sm text-gray-600 mb-3">Need help? Contact our travel experts</p>
                <button className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-2 px-4 rounded-lg transition-colors duration-200">
                  Contact Support
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PackageDetail;
