import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const HotelDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [selectedRoom, setSelectedRoom] = useState(null);
  const [bookingData, setBookingData] = useState({
    checkIn: '',
    checkOut: '',
    guests: 1,
    rooms: 1
  });

  // Mock hotel data - in real app this would come from API
  const hotel = {
    id: 1,
    name: 'The Ritz London',
    location: 'London, UK',
    address: '150 Piccadilly, St. James\'s, London W1J 9BR, United Kingdom',
    phone: '+44 20 7493 8181',
    email: 'reservations@theritzlondon.com',
    website: 'www.theritzlondon.com',
    description: 'Experience luxury at its finest in the heart of London. The Ritz offers world-class service, elegant rooms, and Michelin-starred dining. This historic landmark has been welcoming guests since 1906, offering an unparalleled blend of classic British elegance and modern luxury.',
    image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1571896349842-33c89424de2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
    ],
    rating: 4.9,
    reviews: 2847,
    stars: 5,
    amenities: [
      'Free WiFi', 'Spa & Wellness Center', 'Fine Dining Restaurant', 'Fitness Center',
      'Concierge Service', 'Room Service 24/7', 'Business Center', 'Valet Parking',
      'Laundry Service', 'Airport Shuttle', 'Pet Friendly', 'Meeting Rooms'
    ],
    highlights: [
      'Historic landmark since 1906',
      'Michelin-starred restaurant',
      'Central location in Mayfair',
      'Butler service available',
      'Rooftop terrace with city views',
      'Traditional afternoon tea'
    ],
    rooms: [
      {
        id: 1,
        name: 'Deluxe Room',
        description: 'Elegant room with classic furnishings and modern amenities',
        size: '35 sqm',
        occupancy: '2 Adults + 1 Child',
        bedType: 'King Bed',
        price: '₹25,000',
        perNight: 'per night',
        features: ['City View', 'En-suite Bathroom', 'Mini Bar', 'Room Service', 'Free WiFi'],
        images: [
          'https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
          'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
        ]
      },
      {
        id: 2,
        name: 'Executive Suite',
        description: 'Spacious suite with separate living area and premium amenities',
        size: '55 sqm',
        occupancy: '2 Adults + 2 Children',
        bedType: 'King Bed + Sofa Bed',
        price: '₹45,000',
        perNight: 'per night',
        features: ['Park View', 'Separate Living Room', 'Premium Mini Bar', 'Butler Service', 'Free WiFi'],
        images: [
          'https://images.unsplash.com/photo-1571896349842-33c89424de2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
          'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
        ]
      },
      {
        id: 3,
        name: 'Presidential Suite',
        description: 'Ultimate luxury with panoramic views and exclusive services',
        size: '120 sqm',
        occupancy: '4 Adults',
        bedType: '2 King Beds',
        price: '₹85,000',
        perNight: 'per night',
        features: ['Panoramic City Views', 'Private Terrace', 'Dedicated Butler', 'Private Dining', 'Free WiFi'],
        images: [
          'https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
          'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
        ]
      }
    ],
    policies: {
      checkIn: '3:00 PM',
      checkOut: '12:00 PM',
      cancellation: 'Free cancellation up to 24 hours before check-in',
      children: 'Children of all ages are welcome',
      pets: 'Pets allowed with prior arrangement',
      smoking: 'Non-smoking property'
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setBookingData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleRoomSelection = (room) => {
    setSelectedRoom(room);
  };

  const handleBooking = (e) => {
    e.preventDefault();
    if (!selectedRoom) {
      alert('Please select a room first');
      return;
    }
    console.log('Booking data:', { ...bookingData, room: selectedRoom });
    // TODO: Integrate with booking API
    alert('Booking submitted successfully!');
  };

  const calculateNights = () => {
    if (bookingData.checkIn && bookingData.checkOut) {
      const checkIn = new Date(bookingData.checkIn);
      const checkOut = new Date(bookingData.checkOut);
      const diffTime = Math.abs(checkOut - checkIn);
      return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    }
    return 0;
  };

  const calculateTotalPrice = () => {
    if (selectedRoom && calculateNights() > 0) {
      const pricePerNight = parseInt(selectedRoom.price.replace(/[^\d]/g, ''));
      return pricePerNight * calculateNights() * bookingData.rooms;
    }
    return 0;
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
                onClick={() => navigate('/hotels')}
                className="text-orange-500 hover:text-blue-700 mb-2 flex items-center"
              >
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Back to Hotels
              </button>
              <h1 className="text-3xl font-bold text-gray-900">{hotel.name}</h1>
              <p className="text-gray-600">{hotel.location}</p>
            </div>
            <div className="text-right">
              <div className="flex items-center mb-2">
                {[...Array(hotel.stars)].map((_, i) => (
                  <svg key={i} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
                <span className="ml-2 text-lg font-semibold text-gray-900">{hotel.rating}</span>
                <span className="ml-1 text-gray-500">({hotel.reviews} reviews)</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Hotel Images */}
            <div className="mb-8">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <img
                    src={hotel.gallery[0]}
                    alt={hotel.name}
                    className="w-full h-80 object-cover rounded-xl"
                  />
                </div>
                {hotel.gallery.slice(1, 4).map((image, index) => (
                  <div key={index}>
                    <img
                      src={image}
                      alt={`${hotel.name} ${index + 2}`}
                      className="w-full h-40 object-cover rounded-xl"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Hotel Description */}
            <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">About {hotel.name}</h2>
              <p className="text-gray-700 mb-6">{hotel.description}</p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Highlights</h3>
                  <ul className="space-y-2">
                    {hotel.highlights.map((highlight, index) => (
                      <li key={index} className="flex items-center text-gray-700">
                        <svg className="w-4 h-4 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        {highlight}
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Amenities</h3>
                  <div className="grid grid-cols-2 gap-2">
                    {hotel.amenities.map((amenity, index) => (
                      <div key={index} className="flex items-center text-gray-700">
                        <svg className="w-4 h-4 text-orange-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        {amenity}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Room Selection */}
            <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Select Your Room</h2>
              <div className="space-y-6">
                {hotel.rooms.map((room) => (
                  <div
                    key={room.id}
                    className={`border-2 rounded-xl p-6 cursor-pointer transition-all duration-200 ${selectedRoom?.id === room.id
                      ? 'border-orange-500 bg-orange-50'
                      : 'border-gray-200 hover:border-gray-300'
                      }`}
                    onClick={() => handleRoomSelection(room)}
                  >
                    <div className="flex flex-col lg:flex-row gap-6">
                      <div className="lg:w-1/3">
                        <img
                          src={room.images[0]}
                          alt={room.name}
                          className="w-full h-48 object-cover rounded-lg"
                        />
                      </div>

                      <div className="lg:w-2/3">
                        <div className="flex justify-between items-start mb-3">
                          <h3 className="text-xl font-bold text-gray-900">{room.name}</h3>
                          <div className="text-right">
                            <div className="text-2xl font-bold text-orange-500">{room.price}</div>
                            <div className="text-sm text-gray-500">{room.perNight}</div>
                          </div>
                        </div>

                        <p className="text-gray-700 mb-4">{room.description}</p>

                        <div className="grid grid-cols-2 gap-4 mb-4">
                          <div>
                            <span className="text-sm font-medium text-gray-900">Size:</span>
                            <span className="text-sm text-gray-600 ml-2">{room.size}</span>
                          </div>
                          <div>
                            <span className="text-sm font-medium text-gray-900">Occupancy:</span>
                            <span className="text-sm text-gray-600 ml-2">{room.occupancy}</span>
                          </div>
                          <div>
                            <span className="text-sm font-medium text-gray-900">Bed Type:</span>
                            <span className="text-sm text-gray-600 ml-2">{room.bedType}</span>
                          </div>
                        </div>

                        <div className="flex flex-wrap gap-2">
                          {room.features.map((feature, index) => (
                            <span key={index} className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded-full">
                              {feature}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Hotel Policies */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Hotel Policies</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Check-in/Check-out</h3>
                  <div className="space-y-2 text-gray-700">
                    <p><span className="font-medium">Check-in:</span> {hotel.policies.checkIn}</p>
                    <p><span className="font-medium">Check-out:</span> {hotel.policies.checkOut}</p>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Other Policies</h3>
                  <div className="space-y-2 text-gray-700">
                    <p><span className="font-medium">Cancellation:</span> {hotel.policies.cancellation}</p>
                    <p><span className="font-medium">Children:</span> {hotel.policies.children}</p>
                    <p><span className="font-medium">Pets:</span> {hotel.policies.pets}</p>
                    <p><span className="font-medium">Smoking:</span> {hotel.policies.smoking}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Booking Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-lg p-6 sticky top-8">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Book Your Stay</h3>

              <form onSubmit={handleBooking} className="space-y-4">
                {/* Check-in Date */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Check-in Date</label>
                  <input
                    type="date"
                    name="checkIn"
                    value={bookingData.checkIn}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                {/* Check-out Date */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Check-out Date</label>
                  <input
                    type="date"
                    name="checkOut"
                    value={bookingData.checkOut}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                {/* Guests */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Guests</label>
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

                {/* Rooms */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Rooms</label>
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

                {/* Selected Room Info */}
                {selectedRoom && (
                  <div className="bg-blue-50 rounded-lg p-4">
                    <h4 className="font-semibold text-gray-900 mb-2">Selected Room</h4>
                    <p className="text-sm text-gray-700 mb-2">{selectedRoom.name}</p>
                    <p className="text-lg font-bold text-orange-500">{selectedRoom.price} per night</p>
                  </div>
                )}

                {/* Price Summary */}
                {selectedRoom && calculateNights() > 0 && (
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="font-semibold text-gray-900 mb-2">Price Summary</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Room rate per night:</span>
                        <span>{selectedRoom.price}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Number of nights:</span>
                        <span>{calculateNights()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Number of rooms:</span>
                        <span>{bookingData.rooms}</span>
                      </div>
                      <hr className="my-2" />
                      <div className="flex justify-between font-semibold text-lg">
                        <span>Total:</span>
                        <span>₹{calculateTotalPrice().toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Book Button */}
                <button
                  type="submit"
                  disabled={!selectedRoom}
                  className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold py-3 px-4 rounded-lg transition-colors duration-200 disabled:cursor-not-allowed"
                >
                  {selectedRoom ? 'Book Now' : 'Select a Room First'}
                </button>
              </form>

              {/* Contact Info */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <h4 className="font-semibold text-gray-900 mb-3">Contact Information</h4>
                <div className="space-y-2 text-sm text-gray-700">
                  <p><span className="font-medium">Address:</span> {hotel.address}</p>
                  <p><span className="font-medium">Phone:</span> {hotel.phone}</p>
                  <p><span className="font-medium">Email:</span> {hotel.email}</p>
                  <p><span className="font-medium">Website:</span> {hotel.website}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HotelDetail;
