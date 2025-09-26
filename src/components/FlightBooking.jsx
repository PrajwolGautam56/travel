import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  UserIcon,
  CreditCardIcon,
  MapPinIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';

const FlightBooking = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [bookingData, setBookingData] = useState({
    passengers: [],
    seats: [],
    meals: [],
    baggage: [],
    insurance: false,
    payment: {}
  });

  // Mock flight data
  const flight = {
    id: id,
    airline: 'Qatar Airways',
    airlineCode: 'QR',
    departure: 'DEL',
    arrival: 'LHR',
    departureTime: '02:30',
    arrivalTime: '07:45',
    duration: '8h 15m',
    departureDate: '2024-01-15',
    returnDate: '2024-01-22',
    price: 55300,
    cabin: 'Economy',
    aircraft: 'Boeing 777'
  };

  const [passengerCount, setPassengerCount] = useState(1);
  const [totalPrice, setTotalPrice] = useState(flight.price);

  useEffect(() => {
    // Initialize passengers array
    const initialPassengers = Array.from({ length: passengerCount }, (_, index) => ({
      id: index + 1,
      type: index === 0 ? 'Adult' : 'Adult',
      title: '',
      firstName: '',
      lastName: '',
      dateOfBirth: '',
      passportNumber: '',
      passportExpiry: '',
      nationality: '',
      email: '',
      phone: '',
      frequentFlyer: '',
      specialAssistance: false,
      mealPreference: 'Standard',
      seatPreference: 'Window'
    }));

    setBookingData(prev => ({
      ...prev,
      passengers: initialPassengers
    }));
  }, [passengerCount]);

  const calculateTotal = () => {
    let basePrice = flight.price * passengerCount;
    let extras = 0;

    // Add seat selection costs
    extras += bookingData.seats.length * 1500;

    // Add meal costs
    extras += bookingData.meals.length * 800;

    // Add baggage costs
    extras += bookingData.baggage.length * 2000;

    // Add insurance
    if (bookingData.insurance) {
      extras += passengerCount * 1200;
    }

    setTotalPrice(basePrice + extras);
  };

  useEffect(() => {
    calculateTotal();
  }, [bookingData, passengerCount]);

  const handlePassengerChange = (index, field, value) => {
    const updatedPassengers = [...bookingData.passengers];
    updatedPassengers[index] = {
      ...updatedPassengers[index],
      [field]: value
    };

    setBookingData(prev => ({
      ...prev,
      passengers: updatedPassengers
    }));
  };

  const handleNext = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = () => {
    // Here you would typically send the booking data to your backend
    console.log('Booking submitted:', bookingData);
    alert('Booking submitted successfully!');
    navigate('/');
  };

  const steps = [
    { number: 1, title: 'Passenger Details', icon: UserIcon },
    { number: 2, title: 'Seat Selection', icon: MapPinIcon },
    { number: 3, title: 'Extras & Preferences', icon: CheckCircleIcon },
    { number: 4, title: 'Payment', icon: CreditCardIcon }
  ];

  const renderStepIndicator = () => (
    <div className="mb-6 sm:mb-8">
      <div className="flex items-center justify-center space-x-2 sm:space-x-4 overflow-x-auto">
        {steps.map((step, index) => (
          <div key={step.number} className="flex items-center flex-shrink-0">
            <div className={`flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-full border-2 ${currentStep >= step.number
              ? 'bg-orange-500 border-orange-500 text-white'
              : 'bg-white border-gray-300 text-gray-500'
              }`}>
              {currentStep > step.number ? (
                <CheckCircleIcon className="w-4 h-4 sm:w-6 sm:h-6" />
              ) : (
                <step.icon className="w-3 h-3 sm:w-5 sm:h-5" />
              )}
            </div>
            <span className={`ml-1 sm:ml-2 text-xs sm:text-sm font-medium ${currentStep >= step.number ? 'text-orange-500' : 'text-gray-500'
              }`}>
              <span className="hidden sm:inline">{step.title}</span>
              <span className="sm:hidden">{step.number}</span>
            </span>
            {index < steps.length - 1 && (
              <div className={`w-8 sm:w-16 h-0.5 mx-2 sm:mx-4 ${currentStep > step.number ? 'bg-orange-500' : 'bg-gray-300'
                }`} />
            )}
          </div>
        ))}
      </div>
    </div>
  );

  const renderPassengerDetails = () => (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
        <h3 className="text-base sm:text-lg font-semibold text-gray-900">Passenger Information</h3>
        <div className="flex items-center space-x-2 sm:space-x-4">
          <label className="text-xs sm:text-sm text-gray-600">Number of Passengers:</label>
          <select
            value={passengerCount}
            onChange={(e) => setPassengerCount(parseInt(e.target.value))}
            className="border border-gray-300 rounded-lg px-2 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
          >
            {[1, 2, 3, 4, 5, 6].map(num => (
              <option key={num} value={num}>{num}</option>
            ))}
          </select>
        </div>
      </div>

      {bookingData.passengers.map((passenger, index) => (
        <div key={passenger.id} className="bg-white rounded-xl border p-4 sm:p-6">
          <h4 className="text-base sm:text-lg font-medium text-gray-900 mb-3 sm:mb-4">
            Passenger {index + 1} - {passenger.type}
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Title</label>
              <select
                value={passenger.title}
                onChange={(e) => handlePassengerChange(index, 'title', e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-2 sm:px-3 py-2 text-xs sm:text-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              >
                <option value="">Select Title</option>
                <option value="Mr">Mr</option>
                <option value="Mrs">Mrs</option>
                <option value="Ms">Ms</option>
                <option value="Dr">Dr</option>
              </select>
            </div>

            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">First Name</label>
              <input
                type="text"
                value={passenger.firstName}
                onChange={(e) => handlePassengerChange(index, 'firstName', e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-2 sm:px-3 py-2 text-xs sm:text-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                placeholder="First Name"
              />
            </div>

            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Last Name</label>
              <input
                type="text"
                value={passenger.lastName}
                onChange={(e) => handlePassengerChange(index, 'lastName', e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-2 sm:px-3 py-2 text-xs sm:text-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                placeholder="Last Name"
              />
            </div>

            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Date of Birth</label>
              <input
                type="date"
                value={passenger.dateOfBirth}
                onChange={(e) => handlePassengerChange(index, 'dateOfBirth', e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-2 sm:px-3 py-2 text-xs sm:text-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              />
            </div>

            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Passport Number</label>
              <input
                type="text"
                value={passenger.passportNumber}
                onChange={(e) => handlePassengerChange(index, 'passportNumber', e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-2 sm:px-3 py-2 text-xs sm:text-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                placeholder="Passport Number"
              />
            </div>

            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Passport Expiry</label>
              <input
                type="date"
                value={passenger.passportExpiry}
                onChange={(e) => handlePassengerChange(index, 'passportExpiry', e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-2 sm:px-3 py-2 text-xs sm:text-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              />
            </div>

            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Nationality</label>
              <input
                type="text"
                value={passenger.nationality}
                onChange={(e) => handlePassengerChange(index, 'nationality', e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-2 sm:px-3 py-2 text-xs sm:text-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                placeholder="Nationality"
              />
            </div>

            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                value={passenger.email}
                onChange={(e) => handlePassengerChange(index, 'email', e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-2 sm:px-3 py-2 text-xs sm:text-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                placeholder="Email"
              />
            </div>

            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Phone</label>
              <input
                type="tel"
                value={passenger.phone}
                onChange={(e) => handlePassengerChange(index, 'phone', e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-2 sm:px-3 py-2 text-xs sm:text-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                placeholder="Phone"
              />
            </div>
          </div>

          <div className="mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-gray-200">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Frequent Flyer Number</label>
                <input
                  type="text"
                  value={passenger.frequentFlyer}
                  onChange={(e) => handlePassengerChange(index, 'frequentFlyer', e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-2 sm:px-3 py-2 text-xs sm:text-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  placeholder="Frequent Flyer Number"
                />
              </div>

              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Meal Preference</label>
                <select
                  value={passenger.mealPreference}
                  onChange={(e) => handlePassengerChange(index, 'mealPreference', e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-2 sm:px-3 py-2 text-xs sm:text-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                >
                  <option value="Standard">Standard</option>
                  <option value="Vegetarian">Vegetarian</option>
                  <option value="Vegan">Vegan</option>
                  <option value="Halal">Halal</option>
                  <option value="Kosher">Kosher</option>
                  <option value="Gluten-Free">Gluten-Free</option>
                </select>
              </div>

              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Seat Preference</label>
                <select
                  value={passenger.seatPreference}
                  onChange={(e) => handlePassengerChange(index, 'seatPreference', e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-2 sm:px-3 py-2 text-xs sm:text-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                >
                  <option value="Window">Window</option>
                  <option value="Aisle">Aisle</option>
                  <option value="Middle">Middle</option>
                </select>
              </div>
            </div>

            <div className="mt-3 sm:mt-4">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={passenger.specialAssistance}
                  onChange={(e) => handlePassengerChange(index, 'specialAssistance', e.target.checked)}
                  className="rounded border-gray-300 text-orange-500 focus:ring-orange-500"
                />
                <span className="ml-2 text-xs sm:text-sm text-gray-700">Require special assistance</span>
              </label>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  const renderSeatSelection = () => (
    <div className="space-y-4 sm:space-y-6">
      <h3 className="text-base sm:text-lg font-semibold text-gray-900">Seat Selection</h3>
      <div className="bg-white rounded-xl border p-4 sm:p-6">
        <div className="text-center mb-4 sm:mb-6">
          <h4 className="text-base sm:text-lg font-medium text-gray-900 mb-2">Boeing 777 - Economy Class</h4>
          <p className="text-xs sm:text-sm text-gray-600">Select your preferred seats for Rs.1,500 per seat</p>
        </div>

        {/* Simplified seat map */}
        <div className="flex justify-center overflow-x-auto">
          <div className="space-y-2 min-w-max">
            {/* First class section */}
            <div className="text-center">
              <div className="text-xs text-gray-500 mb-2">First Class</div>
              <div className="flex space-x-1">
                {['1A', '1B', '1C', '1D', '1E', '1F'].map(seat => (
                  <button
                    key={seat}
                    className="w-6 h-6 sm:w-8 sm:h-8 bg-gray-200 text-xs rounded hover:bg-gray-300"
                  >
                    {seat}
                  </button>
                ))}
              </div>
            </div>

            {/* Business class section */}
            <div className="text-center">
              <div className="text-xs text-gray-500 mb-2">Business Class</div>
              <div className="flex space-x-1">
                {['2A', '2B', '2C', '2D', '2E', '2F'].map(seat => (
                  <button
                    key={seat}
                    className="w-6 h-6 sm:w-8 sm:h-8 bg-gray-200 text-xs rounded hover:bg-gray-300"
                  >
                    {seat}
                  </button>
                ))}
              </div>
            </div>

            {/* Economy class section */}
            <div className="text-center">
              <div className="text-xs text-gray-500 mb-2">Economy Class</div>
              <div className="grid grid-cols-6 gap-1">
                {Array.from({ length: 30 }, (_, i) => {
                  const row = Math.floor(i / 6) + 3;
                  const col = String.fromCharCode(65 + (i % 6));
                  const seat = `${row}${col}`;
                  return (
                    <button
                      key={seat}
                      className="w-6 h-6 sm:w-8 sm:h-8 bg-gray-200 text-xs rounded hover:bg-gray-300"
                    >
                      {seat}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-4 sm:mt-6 text-center">
          <p className="text-xs sm:text-sm text-gray-600">
            Seat selection will be available 24 hours before departure
          </p>
        </div>
      </div>
    </div>
  );

  const renderExtras = () => (
    <div className="space-y-4 sm:space-y-6">
      <h3 className="text-base sm:text-lg font-semibold text-gray-900">Extras & Preferences</h3>

      {/* Meal Options */}
      <div className="bg-white rounded-xl border p-4 sm:p-6">
        <h4 className="text-base sm:text-lg font-medium text-gray-900 mb-3 sm:mb-4">Meal Options</h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
          {[
            { name: 'Premium Meal', price: 800, description: 'Gourmet meal with wine pairing' },
            { name: 'Special Dietary Meal', price: 600, description: 'Customized dietary requirements' },
            { name: 'Kids Meal', price: 500, description: 'Child-friendly meal options' },
            { name: 'Celebration Cake', price: 300, description: 'Birthday or anniversary cake' }
          ].map((meal, index) => (
            <label key={index} className="flex items-start space-x-2 sm:space-x-3 p-2 sm:p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
              <input
                type="checkbox"
                className="mt-1 rounded border-gray-300 text-orange-500 focus:ring-orange-500"
              />
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-gray-900 text-sm sm:text-base">{meal.name}</span>
                  <span className="text-orange-500 font-semibold text-sm sm:text-base">Rs.{meal.price}</span>
                </div>
                <p className="text-xs sm:text-sm text-gray-600 mt-1">{meal.description}</p>
              </div>
            </label>
          ))}
        </div>
      </div>

      {/* Baggage Options */}
      <div className="bg-white rounded-xl border p-4 sm:p-6">
        <h4 className="text-base sm:text-lg font-medium text-gray-900 mb-3 sm:mb-4">Baggage Options</h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
          {[
            { name: 'Extra Checked Baggage', price: 2000, description: '+15kg additional checked baggage' },
            { name: 'Sports Equipment', price: 2500, description: 'Golf clubs, skis, bicycles' },
            { name: 'Musical Instruments', price: 3000, description: 'Fragile instrument handling' },
            { name: 'Pet Travel', price: 5000, description: 'Pet in cabin or cargo hold' }
          ].map((baggage, index) => (
            <label key={index} className="flex items-start space-x-2 sm:space-x-3 p-2 sm:p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
              <input
                type="checkbox"
                className="mt-1 rounded border-gray-300 text-orange-500 focus:ring-orange-500"
              />
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-gray-900 text-sm sm:text-base">{baggage.name}</span>
                  <span className="text-orange-500 font-semibold text-sm sm:text-base">Rs.{baggage.price}</span>
                </div>
                <p className="text-xs sm:text-sm text-gray-600 mt-1">{baggage.description}</p>
              </div>
            </label>
          ))}
        </div>
      </div>

      {/* Travel Insurance */}
      <div className="bg-white rounded-xl border p-4 sm:p-6">
        <h4 className="text-base sm:text-lg font-medium text-gray-900 mb-3 sm:mb-4">Travel Insurance</h4>
        <label className="flex items-start space-x-2 sm:space-x-3 cursor-pointer">
          <input
            type="checkbox"
            checked={bookingData.insurance}
            onChange={(e) => setBookingData(prev => ({ ...prev, insurance: e.target.checked }))}
            className="mt-1 rounded border-gray-300 text-orange-500 focus:ring-orange-500"
          />
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <span className="font-medium text-gray-900 text-sm sm:text-base">Comprehensive Travel Insurance</span>
              <span className="text-orange-500 font-semibold text-sm sm:text-base">Rs.1,200 per passenger</span>
            </div>
            <p className="text-xs sm:text-sm text-gray-600 mt-1">
              Covers trip cancellation, medical expenses, lost baggage, and flight delays
            </p>
          </div>
        </label>
      </div>
    </div>
  );

  const renderPayment = () => (
    <div className="space-y-4 sm:space-y-6">
      <h3 className="text-base sm:text-lg font-semibold text-gray-900">Payment Details</h3>

      {/* Payment Methods */}
      <div className="bg-white rounded-xl border p-4 sm:p-6">
        <h4 className="text-base sm:text-lg font-medium text-gray-900 mb-3 sm:mb-4">Payment Method</h4>
        <div className="space-y-3 sm:space-y-4">
          <label className="flex items-center space-x-2 sm:space-x-3 p-2 sm:p-3 border border-gray-200 rounded-lg cursor-pointer">
            <input
              type="radio"
              name="paymentMethod"
              value="credit"
              className="text-orange-500 focus:ring-orange-500"
            />
            <span className="font-medium text-gray-900 text-sm sm:text-base">Credit/Debit Card</span>
          </label>

          <label className="flex items-center space-x-2 sm:space-x-3 p-2 sm:p-3 border border-gray-200 rounded-lg cursor-pointer">
            <input
              type="radio"
              name="paymentMethod"
              value="netbanking"
              className="text-orange-500 focus:ring-orange-500"
            />
            <span className="font-medium text-gray-900 text-sm sm:text-base">Net Banking</span>
          </label>

          <label className="flex items-center space-x-2 sm:space-x-3 p-2 sm:p-3 border border-gray-200 rounded-lg cursor-pointer">
            <input
              type="radio"
              name="paymentMethod"
              value="upi"
              className="text-orange-500 focus:ring-orange-500"
            />
            <span className="font-medium text-gray-900 text-sm sm:text-base">UPI</span>
          </label>

          <label className="flex items-center space-x-2 sm:space-x-3 p-2 sm:p-3 border border-gray-200 rounded-lg cursor-pointer">
            <input
              type="radio"
              name="paymentMethod"
              value="wallet"
              className="text-orange-500 focus:ring-orange-500"
            />
            <span className="font-medium text-gray-900 text-sm sm:text-base">Digital Wallet</span>
          </label>
        </div>
      </div>

      {/* Card Details */}
      <div className="bg-white rounded-xl border p-4 sm:p-6">
        <h4 className="text-base sm:text-lg font-medium text-gray-900 mb-3 sm:mb-4">Card Information</h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
          <div className="sm:col-span-2">
            <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Card Number</label>
            <input
              type="text"
              className="w-full border border-gray-300 rounded-lg px-2 sm:px-3 py-2 text-xs sm:text-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              placeholder="1234 5678 9012 3456"
            />
          </div>

          <div>
            <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Expiry Date</label>
            <input
              type="text"
              className="w-full border border-gray-300 rounded-lg px-2 sm:px-3 py-2 text-xs sm:text-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              placeholder="MM/YY"
            />
          </div>

          <div>
            <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">CVV</label>
            <input
              type="text"
              className="w-full border border-gray-300 rounded-lg px-2 sm:px-3 py-2 text-xs sm:text-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              placeholder="123"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Cardholder Name</label>
            <input
              type="text"
              className="w-full border border-gray-300 rounded-lg px-2 sm:px-3 py-2 text-xs sm:text-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              placeholder="Name on Card"
            />
          </div>
        </div>
      </div>

      {/* Billing Address */}
      <div className="bg-white rounded-xl border p-4 sm:p-6">
        <h4 className="text-base sm:text-lg font-medium text-gray-900 mb-3 sm:mb-4">Billing Address</h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
          <div className="sm:col-span-2">
            <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Address Line 1</label>
            <input
              type="text"
              className="w-full border border-gray-300 rounded-lg px-2 sm:px-3 py-2 text-xs sm:text-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              placeholder="Street Address"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Address Line 2</label>
            <input
              type="text"
              className="w-full border border-gray-300 rounded-lg px-2 sm:px-3 py-2 text-xs sm:text-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              placeholder="Apartment, suite, etc. (optional)"
            />
          </div>

          <div>
            <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">City</label>
            <input
              type="text"
              className="w-full border border-gray-300 rounded-lg px-2 sm:px-3 py-2 text-xs sm:text-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              placeholder="City"
            />
          </div>

          <div>
            <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">State</label>
            <input
              type="text"
              className="w-full border border-gray-300 rounded-lg px-2 sm:px-3 py-2 text-xs sm:text-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              placeholder="State"
            />
          </div>

          <div>
            <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">ZIP Code</label>
            <input
              type="text"
              className="w-full border border-gray-300 rounded-lg px-2 sm:px-3 py-2 text-xs sm:text-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              placeholder="ZIP Code"
            />
          </div>

          <div>
            <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Country</label>
            <input
              type="text"
              className="w-full border border-gray-300 rounded-lg px-2 sm:px-3 py-2 text-xs sm:text-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              placeholder="Country"
            />
          </div>
        </div>
      </div>
    </div>
  );

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return renderPassengerDetails();
      case 2:
        return renderSeatSelection();
      case 3:
        return renderExtras();
      case 4:
        return renderPayment();
      default:
        return renderPassengerDetails();
    }
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
        <div className="relative z-10 max-w-7xl mx-auto px-3 sm:px-4 py-4 sm:py-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-white">Flight Booking</h1>
              <div className="flex flex-col sm:flex-row sm:items-center space-y-1 sm:space-y-0 sm:space-x-4 mt-2 text-xs sm:text-sm text-orange-100">
                <span>{flight.airline}</span>
                <span className="hidden sm:inline">•</span>
                <span>{flight.departure} → {flight.arrival}</span>
                <span className="hidden sm:inline">•</span>
                <span>{flight.departureDate}</span>
              </div>
            </div>
            <Link
              to="/flight-search"
              className="text-orange-500 hover:text-orange-600 font-medium text-sm sm:text-base"
            >
              ← Back to Search
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-3 sm:px-4 py-4 sm:py-6">
        {renderStepIndicator()}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {renderCurrentStep()}
          </div>

          {/* Right Sidebar - Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm border p-4 sm:p-6 sticky top-6">
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">Booking Summary</h3>

              {/* Flight Details */}
              <div className="border-b border-gray-200 pb-3 sm:pb-4 mb-3 sm:mb-4">
                <div className="flex items-center space-x-2 sm:space-x-3 mb-2 sm:mb-3">
                  <span className="text-orange-500 text-lg sm:text-xl">✈️</span>
                  <span className="font-medium text-gray-900 text-sm sm:text-base">Flight Details</span>
                </div>
                <div className="text-xs sm:text-sm text-gray-600 space-y-1">
                  <p>{flight.airline} • {flight.aircraft}</p>
                  <p>{flight.departure} → {flight.arrival}</p>
                  <p>{flight.departureTime} - {flight.arrivalTime}</p>
                  <p>Duration: {flight.duration}</p>
                  <p>Class: {flight.cabin}</p>
                </div>
              </div>

              {/* Price Breakdown */}
              <div className="space-y-2 sm:space-y-3 mb-4 sm:mb-6">
                <div className="flex justify-between text-xs sm:text-sm">
                  <span className="text-gray-600">Base Fare ({passengerCount} passengers)</span>
                  <span className="text-gray-900">Rs.{(flight.price * passengerCount).toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-xs sm:text-sm">
                  <span className="text-gray-600">Seat Selection</span>
                  <span className="text-gray-900">Rs.{bookingData.seats.length * 1500}</span>
                </div>
                <div className="flex justify-between text-xs sm:text-sm">
                  <span className="text-gray-600">Meals</span>
                  <span className="text-gray-900">Rs.{bookingData.meals.length * 800}</span>
                </div>
                <div className="flex justify-between text-xs sm:text-sm">
                  <span className="text-gray-600">Baggage</span>
                  <span className="text-gray-900">Rs.{bookingData.baggage.length * 2000}</span>
                </div>
                {bookingData.insurance && (
                  <div className="flex justify-between text-xs sm:text-sm">
                    <span className="text-gray-600">Insurance</span>
                    <span className="text-gray-900">Rs.{passengerCount * 1200}</span>
                  </div>
                )}
                <div className="border-t border-gray-200 pt-2 sm:pt-3">
                  <div className="flex justify-between font-semibold text-base sm:text-lg">
                    <span>Total</span>
                    <span className="text-orange-500">Rs.{totalPrice.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              {/* Navigation Buttons */}
              <div className="space-y-2 sm:space-y-3">
                {currentStep > 1 && (
                  <button
                    onClick={handlePrevious}
                    className="w-full bg-gray-200 text-gray-700 px-3 sm:px-4 py-2 sm:py-3 rounded-lg hover:bg-gray-300 transition-colors text-sm sm:text-base font-medium"
                  >
                    Previous
                  </button>
                )}

                {currentStep < 4 ? (
                  <button
                    onClick={handleNext}
                    className="w-full bg-orange-500 text-white px-3 sm:px-4 py-2 sm:py-3 rounded-lg hover:bg-orange-600 transition-colors text-sm sm:text-base font-medium"
                  >
                    Next
                  </button>
                ) : (
                  <button
                    onClick={handleSubmit}
                    className="w-full bg-green-600 text-white px-3 sm:px-4 py-2 sm:py-3 rounded-lg hover:bg-green-700 transition-colors text-sm sm:text-base font-medium"
                  >
                    Confirm Booking
                  </button>
                )}
              </div>

              {/* Progress */}
              <div className="mt-3 sm:mt-4 text-center">
                <p className="text-xs sm:text-sm text-gray-500">
                  Step {currentStep} of {steps.length}
                </p>
                <div className="w-full bg-gray-200 rounded-full h-1.5 sm:h-2 mt-2">
                  <div
                    className="bg-orange-500 h-1.5 sm:h-2 rounded-full transition-all duration-300"
                    style={{ width: `${(currentStep / steps.length) * 100}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FlightBooking;
