import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
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
  const [isSeatSelectionOpen, setIsSeatSelectionOpen] = useState(false);
  const [selectedPassengerForSeat, setSelectedPassengerForSeat] = useState(null);
  const [currentFlightSegment, setCurrentFlightSegment] = useState(0); // For multicity flights
  const [isSeatPanelAnimating, setIsSeatPanelAnimating] = useState(false);
  const [isBaggageSelectionOpen, setIsBaggageSelectionOpen] = useState(false);
  const [selectedPassengerForBaggage, setSelectedPassengerForBaggage] = useState(null);
  const [isBaggagePanelAnimating, setIsBaggagePanelAnimating] = useState(false);

  // Blur Navbar and Footer and prevent background scroll when seat or baggage selection is open
  useEffect(() => {
    const isAnySliderOpen = isSeatSelectionOpen || isBaggageSelectionOpen;
    if (isAnySliderOpen) {
      document.body.classList.add('seat-selection-open');
      // Prevent background scroll
      document.body.style.overflow = 'hidden';
    } else {
      document.body.classList.remove('seat-selection-open');
      // Restore background scroll
      document.body.style.overflow = '';
    }
    
    // Cleanup on unmount
    return () => {
      document.body.classList.remove('seat-selection-open');
      document.body.style.overflow = '';
    };
  }, [isSeatSelectionOpen, isBaggageSelectionOpen]);

  useEffect(() => {
    // Initialize passengers array with per-passenger data
    const initialPassengers = Array.from({ length: passengerCount }, (_, index) => ({
      id: index + 1,
      type: 'Adult',
      title: '',
      firstName: '',
      lastName: '',
      dateOfBirth: '',
      passportNumber: '',
      passportExpiry: '',
      nationality: '',
      email: '',
      phone: '',
      frequentFlyerProgram: '',
      frequentFlyerNumber: '',
      ticketEmail: '',
      document: '',
      documentExpiry: '',
      placeOfIssue: '',
      gender: '',
      ktnId: '',
      ktnCountry: '',
      // Per-passenger add-ons
      selectedSeat: null,
      selectedMeals: [],
      selectedBaggage: [],
      carryOnBaggage: 'included', // 'included' or 'extra' for 7kg
      checkedBaggage: 'none', // 'none', '20kg', '25kg', '30kg', '40kg', '50kg', '60kg'
      sportsEquipment: 'none', // 'none', '20kg', '25kg', '30kg', '40kg'
      selectedAddOnBundle: null, // 'Value Pack' or 'Premium Flex'
      insurance: false,
      specialAssistance: false,
      specialAssistanceDetails: ''
    }));

    setBookingData(prev => ({
      ...prev,
      passengers: initialPassengers
    }));
  }, [passengerCount]);

  const calculateTotal = () => {
    let basePrice = flight.price * passengerCount;
    let extras = 0;

    // Calculate per-passenger add-ons
    bookingData.passengers.forEach(passenger => {
      // Seat selection cost
      if (passenger.selectedSeat) {
        extras += 1500;
      }

      // Meal costs (up to 2 meals per passenger per flight)
      extras += passenger.selectedMeals.length * 800;

      // Baggage costs
      // Carry-on baggage (extra 7kg costs NPR 3,515)
      if (passenger.carryOnBaggage === 'extra') {
        extras += 3515;
      }
      
      // Checked baggage pricing
      const checkedBaggagePrices = {
        'none': 0,
        '20kg': 8655,
        '25kg': 10442,
        '30kg': 14199,
        '40kg': 23180,
        '50kg': 30160,
        '60kg': 37567
      };
      extras += checkedBaggagePrices[passenger.checkedBaggage] || 0;
      
      // Sports equipment pricing
      const sportsEquipmentPrices = {
        'none': 0,
        '20kg': 10811,
        '25kg': 12862,
        '30kg': 16863,
        '40kg': 26745
      };
      extras += sportsEquipmentPrices[passenger.sportsEquipment] || 0;
      
      // Legacy baggage array (for backward compatibility)
      extras += passenger.selectedBaggage.length * 2000;

      // Add-on bundle (Value Pack or Premium Flex may reduce costs)
      if (passenger.selectedAddOnBundle) {
        // Bundle pricing logic can be added here
        // For now, assuming bundles are included in base or have separate pricing
      }

      // Insurance per passenger
      if (passenger.insurance) {
        extras += 376.90; // NPR 376.90 per passenger as shown in UI
      }
    });

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
    if (currentStep < 3) {
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
    { number: 2, title: 'Add Ons', icon: CheckCircleIcon },
    { number: 3, title: 'Payment', icon: CreditCardIcon }
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

  // Sections always shown, not collapsible
  const renderPassengerDetails = () => (
    <div className="space-y-8">
      {bookingData.passengers.map((passenger, index) => (
      <div key={passenger.id} className="bg-white rounded-xl border p-6 sm:p-8 mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
          <h3 className="text-lg sm:text-xl font-semibold text-gray-900">Adult {index + 1} <span className="font-normal">| Adult must be 12 years and above</span></h3>
          <div className="flex items-center gap-6 mt-2 sm:mt-0">
            <label className="inline-flex items-center text-sm sm:text-base font-medium cursor-pointer">
              <input type="checkbox" className="accent-orange-500 mr-2" /> Save Passenger
            </label>
            <label className="inline-flex items-center text-sm sm:text-base font-medium cursor-pointer">
              <input type="checkbox" className="accent-orange-500 mr-2" /> I do not have a first/given name in my passport
            </label>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
            <select value={passenger.title} onChange={e => handlePassengerChange(index, 'title', e.target.value)} className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-orange-500">
              <option value="">Select</option>
              <option value="Mr">Mr</option>
              <option value="Mrs">Mrs</option>
              <option value="Ms">Ms</option>
              <option value="Dr">Dr</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">First/Given Name<span className="text-orange-500">*</span></label>
            <input type="text" value={passenger.firstName} onChange={e => handlePassengerChange(index, 'firstName', e.target.value)} className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-orange-500" placeholder="First/Given Name" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Last/Family Name<span className="text-orange-500">*</span></label>
            <input type="text" value={passenger.lastName} onChange={e => handlePassengerChange(index, 'lastName', e.target.value)} className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-orange-500" placeholder="Last/Family Name" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Date of Birth</label>
            <input type="date" value={passenger.dateOfBirth} onChange={e => handlePassengerChange(index, 'dateOfBirth', e.target.value)} className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-orange-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Frequent Flyer Programme (Optional)</label>
            <input type="text" value={passenger.frequentFlyerProgram || ''} onChange={e => handlePassengerChange(index, 'frequentFlyerProgram', e.target.value)} className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-orange-500" placeholder="Programme Name" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Frequent Flyer Number (Optional)</label>
            <input type="text" value={passenger.frequentFlyerNumber || ''} onChange={e => handlePassengerChange(index, 'frequentFlyerNumber', e.target.value)} className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-orange-500" placeholder="Number" />
          </div>
          <div className="col-span-3 grid grid-cols-6 gap-4 items-end mt-4">
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Primary Contact Number<span className="text-orange-500">*</span></label>
              <div className="flex gap-3">
                <select className="w-2/5 border border-gray-300 rounded-lg px-3 py-3 text-sm bg-white"><option>AGENCY</option></select>
                <input type="text" value={passenger.phone} onChange={e => handlePassengerChange(index, 'phone', e.target.value)} className="w-3/5 border border-gray-300 rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-orange-500" placeholder="Mobile No." />
              </div>
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Passenger Email Address</label>
              <input type="email" value={passenger.email} onChange={e => handlePassengerChange(index, 'email', e.target.value)} className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-orange-500" placeholder="For schedule change notice" />
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">E-ticket/Refund/Notices Email</label>
              <input type="email" value={passenger.ticketEmail || ''} onChange={e => handlePassengerChange(index, 'ticketEmail', e.target.value)} className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-orange-500" placeholder="For receipt/Refund/Notices" />
            </div>
          </div>
        </div>
        {/* Document Information (Optional) */}
        <div className="mt-10">
          <div className="text-lg font-bold mb-4 text-orange-600 border-l-4 border-orange-400 pl-3">Document Information (Optional)</div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Document</label>
              <input type="text" value={passenger.document || ''} onChange={e => handlePassengerChange(index, 'document', e.target.value)} className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Document Expiry Date</label>
              <input type="date" value={passenger.documentExpiry || ''} onChange={e => handlePassengerChange(index, 'documentExpiry', e.target.value)} className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Nationality</label>
              <input type="text" value={passenger.nationality} onChange={e => handlePassengerChange(index, 'nationality', e.target.value)} className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Place of Issue</label>
              <input type="text" value={passenger.placeOfIssue || ''} onChange={e => handlePassengerChange(index, 'placeOfIssue', e.target.value)} className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Gender</label>
              <select value={passenger.gender || ''} onChange={e => handlePassengerChange(index, 'gender', e.target.value)} className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm">
                <option value="">Select</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>
        </div>
        {/* KTN Information (Optional) */}
        <div className="mt-10">
          <div className="text-lg font-bold mb-4 text-orange-600 border-l-4 border-orange-400 pl-3">KTN Information (Optional)</div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">KTN ID</label>
              <input type="text" value={passenger.ktnId || ''} onChange={e => handlePassengerChange(index, 'ktnId', e.target.value)} className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm" placeholder="KTN ID" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Country</label>
              <input type="text" value={passenger.ktnCountry || ''} onChange={e => handlePassengerChange(index, 'ktnCountry', e.target.value)} className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm" placeholder="Country" />
            </div>
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

  const handlePassengerAddOnChange = (passengerIndex, addOnType, value) => {
    const updatedPassengers = [...bookingData.passengers];
    
    switch(addOnType) {
      case 'addOnBundle':
        updatedPassengers[passengerIndex].selectedAddOnBundle = value;
        break;
      case 'seat':
        updatedPassengers[passengerIndex].selectedSeat = value;
        break;
      case 'meal':
        const mealIndex = updatedPassengers[passengerIndex].selectedMeals.indexOf(value);
        if (mealIndex > -1) {
          updatedPassengers[passengerIndex].selectedMeals.splice(mealIndex, 1);
        } else if (updatedPassengers[passengerIndex].selectedMeals.length < 2) {
          updatedPassengers[passengerIndex].selectedMeals.push(value);
        }
        break;
      case 'baggage':
        const baggageIndex = updatedPassengers[passengerIndex].selectedBaggage.indexOf(value);
        if (baggageIndex > -1) {
          updatedPassengers[passengerIndex].selectedBaggage.splice(baggageIndex, 1);
        } else {
          updatedPassengers[passengerIndex].selectedBaggage.push(value);
        }
        break;
      case 'carryOnBaggage':
        updatedPassengers[passengerIndex].carryOnBaggage = value;
        break;
      case 'checkedBaggage':
        updatedPassengers[passengerIndex].checkedBaggage = value;
        break;
      case 'sportsEquipment':
        updatedPassengers[passengerIndex].sportsEquipment = value;
        break;
      case 'insurance':
        updatedPassengers[passengerIndex].insurance = value;
        break;
      case 'specialAssistance':
        updatedPassengers[passengerIndex].specialAssistance = value;
        break;
    }
    
    setBookingData(prev => ({
      ...prev,
      passengers: updatedPassengers
    }));
  };

  const renderExtras = () => (
    <div className="space-y-4 sm:space-y-6">
      <h3 className="text-base sm:text-lg font-semibold text-gray-900">Add-ons</h3>
      
      {bookingData.passengers.map((passenger, passengerIndex) => (
        <div key={passenger.id} className="space-y-4 sm:space-y-6 border-b border-gray-200 pb-6 last:border-b-0">
          <h4 className="text-base font-semibold text-gray-700">Passenger {passengerIndex + 1}: {passenger.firstName || `Adult ${passengerIndex + 1}`}</h4>

          {/* Add-on Bundles */}
          <div className="bg-white rounded-xl border p-4 sm:p-6">
            <h4 className="text-base sm:text-lg font-medium text-gray-900 mb-2 sm:mb-3">Add-on bundles</h4>
            <p className="text-xs sm:text-sm text-gray-600 mb-4">Save more on add-on bundles than buying them individually.</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              {/* Value Pack */}
              <div 
                onClick={() => handlePassengerAddOnChange(passengerIndex, 'addOnBundle', passenger.selectedAddOnBundle === 'Value Pack' ? null : 'Value Pack')}
                className={`border rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer relative overflow-hidden ${passenger.selectedAddOnBundle === 'Value Pack' ? 'border-orange-500 ring-2 ring-orange-500' : 'border-gray-200'}`}
              >
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-orange-500"></div>
                <div className="flex-1 pl-3">
                  <div className="flex items-center justify-between mb-2">
                    <h5 className="font-semibold text-gray-900 text-sm sm:text-base">Value Pack</h5>
                    {passenger.selectedAddOnBundle === 'Value Pack' && (
                      <svg className="w-5 h-5 text-orange-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    )}
                  </div>
                  <p className="text-xs sm:text-sm text-orange-500 font-medium mb-2">Save up to 30%</p>
                  <div className="flex items-center space-x-2 text-xs sm:text-sm text-gray-600">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                    </svg>
                    <span>Each guest gets: 7kg carry-on baggage</span>
                  </div>
                </div>
              </div>

              {/* Premium Flex */}
              <div 
                onClick={() => handlePassengerAddOnChange(passengerIndex, 'addOnBundle', passenger.selectedAddOnBundle === 'Premium Flex' ? null : 'Premium Flex')}
                className={`border rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer relative overflow-hidden ${passenger.selectedAddOnBundle === 'Premium Flex' ? 'border-pink-500 ring-2 ring-pink-500' : 'border-gray-200'}`}
              >
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-pink-500"></div>
                <div className="flex-1 pl-3">
                  <div className="flex items-center justify-between mb-2">
                    <h5 className="font-semibold text-gray-900 text-sm sm:text-base">Premium Flex</h5>
                    {passenger.selectedAddOnBundle === 'Premium Flex' && (
                      <svg className="w-5 h-5 text-pink-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    )}
                  </div>
                  <p className="text-xs sm:text-sm text-pink-500 font-medium mb-2">Save up to 20%</p>
                  <div className="flex items-center space-x-2 text-xs sm:text-sm text-gray-600">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                    </svg>
                    <span>Each guest gets: 7kg carry-on baggage</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Baggage */}
          <div className="bg-white rounded-xl border p-4 sm:p-6">
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-4 flex-1">
                <div className="flex items-center space-x-2 mt-1">
                  <svg className="w-6 h-6 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                    <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" />
                  </svg>
                  <svg className="w-6 h-6 text-amber-700" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M4 3a2 2 0 100 4h12a2 2 0 100-4H4z" />
                    <path fillRule="evenodd" d="M3 8h14v7a2 2 0 01-2 2H5a2 2 0 01-2-2V8zm5 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="flex-1">
                  <h4 className="text-base sm:text-lg font-medium text-gray-900 mb-1">Baggage</h4>
                  <p className="text-xs sm:text-sm text-gray-600 mb-3">Pre-book for the lowest price. Prices shown are for all flights in your trip.</p>
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-gray-900">Total: NPR {(passenger.selectedBaggage.length * 2000).toFixed(2)}</p>
                    <p className="text-xs text-gray-600">Kathmandu - Tokyo - Narita</p>
                    {passenger.selectedBaggage.length > 0 ? (
                      passenger.selectedBaggage.map((bag, idx) => (
                        <p key={idx} className="text-xs text-gray-600">{bag}</p>
                      ))
                    ) : (
                      <p className="text-xs text-gray-600">1 x 7 kg Carry-on baggage (included)</p>
                    )}
                  </div>
                </div>
              </div>
              <button 
                onClick={() => {
                  setSelectedPassengerForBaggage(passengerIndex);
                  setIsBaggageSelectionOpen(true);
                  // Trigger animation after a brief delay to ensure the panel is rendered
                  requestAnimationFrame(() => {
                    requestAnimationFrame(() => {
                      setIsBaggagePanelAnimating(true);
                    });
                  });
                }}
                className="text-orange-500 hover:text-orange-600 font-medium text-sm sm:text-base ml-4"
              >
                Modify
              </button>
            </div>
          </div>

          {/* Pick a Seat */}
          <div className="bg-white rounded-xl border p-4 sm:p-6">
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-4 flex-1">
                <svg className="w-6 h-6 text-gray-600 mt-1" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2 5a2 2 0 012-2h12a2 2 0 012 2v10a2 2 0 01-2 2H4a2 2 0 01-2-2V5zm3 1h10v8H5V6zm0 10h10v1H5v-1z" />
                </svg>
                <div className="flex-1">
                  <h4 className="text-base sm:text-lg font-medium text-gray-900 mb-1">Pick a seat</h4>
                  <p className="text-xs sm:text-sm text-gray-600">Choose your seat or we'll assign one to you at random.</p>
                  {passenger.selectedSeat && (
                    <p className="text-xs text-orange-500 mt-1">Selected: {passenger.selectedSeat}</p>
                  )}
                </div>
              </div>
              <button 
                onClick={() => {
                  setSelectedPassengerForSeat(passengerIndex);
                  setIsSeatSelectionOpen(true);
                  // Trigger animation after a brief delay to ensure the panel is rendered
                  requestAnimationFrame(() => {
                    requestAnimationFrame(() => {
                      setIsSeatPanelAnimating(true);
                    });
                  });
                }}
                className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg font-medium text-sm sm:text-base ml-4 transition-colors"
              >
                Pick a seat
              </button>
            </div>
          </div>

          {/* Santan Value Meal */}
          <div className="bg-white rounded-xl border p-4 sm:p-6">
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-4 flex-1">
                <svg className="w-6 h-6 text-gray-600 mt-1" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M3 1a1 1 0 011 1v1a1 1 0 001 1h12a1 1 0 001-1V2a1 1 0 011-1h2a1 1 0 011 1v2.576l-.64.533A4.486 4.486 0 0017 7.5V13a2 2 0 01-2 2h-2a2 2 0 01-2-2v-1h-2v1a2 2 0 01-2 2H5a2 2 0 01-2-2V7.5c0-.648.225-1.277.64-1.891L3 5.576V2a1 1 0 011-1h2z" />
                  <path d="M4 6.5a1 1 0 011-1h10a1 1 0 011 1v1a1 1 0 01-1 1H5a1 1 0 01-1-1v-1z" />
                </svg>
                <div className="flex-1">
                  <h4 className="text-base sm:text-lg font-medium text-gray-900 mb-1">Santan Value Meal</h4>
                  <p className="text-xs sm:text-sm text-gray-600 mb-2">Each guest can pre-book up to 2 meals per flight.</p>
                  {passenger.selectedMeals.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {passenger.selectedMeals.map((meal, idx) => (
                        <span key={idx} className="text-xs bg-orange-100 text-orange-700 px-2 py-1 rounded">{meal}</span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              <button 
                onClick={() => {
                  // In a real app, this would open a meal selection modal
                  const meals = ['Vegetarian Meal', 'Non-Vegetarian Meal', 'Kids Meal', 'Celebration Cake'];
                  const randomMeal = meals[Math.floor(Math.random() * meals.length)];
                  handlePassengerAddOnChange(passengerIndex, 'meal', randomMeal);
                }}
                className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg font-medium text-sm sm:text-base ml-4 transition-colors"
              >
                Add meal
              </button>
            </div>
          </div>

          {/* Insurance */}
          <div className="bg-white rounded-xl border p-4 sm:p-6">
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-4 flex-1">
                <div className="flex items-center space-x-1 mt-1">
                  <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                  </svg>
                  <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                </div>
                <div className="flex-1">
                  <h4 className="text-base sm:text-lg font-medium text-gray-900 mb-1">Insurance</h4>
                  <p className="text-xs sm:text-sm text-gray-600 mb-3">Protect your trip with one click, add travel insurance now.</p>
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={passenger.insurance}
                      onChange={(e) => handlePassengerAddOnChange(passengerIndex, 'insurance', e.target.checked)}
                      className="rounded border-gray-300 text-orange-500 focus:ring-orange-500"
                    />
                    <span className="text-sm text-gray-700">Flight Delay Cover</span>
                    <span className="text-xs text-gray-500">Select to view benefits</span>
                  </label>
                </div>
              </div>
              <div className="text-right ml-4">
                <p className="text-sm font-semibold text-gray-900">NPR 376.90</p>
                <p className="text-xs text-gray-500">per guest</p>
              </div>
            </div>
          </div>

          {/* Special Assistance */}
          <div className="bg-white rounded-xl border p-4 sm:p-6">
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-4 flex-1">
                <svg className="w-6 h-6 text-red-500 mt-1" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.5 6c-2.61.7-5.67 1-8.5 1s-5.89-.3-8.5-1L3 8c1.86.5 4 .83 6 1v13h2v-6h2v6h2V9c2-.17 4.14-.5 6-1l-.5-2zM12 6c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2z"/>
                </svg>
                <div className="flex-1">
                  <h4 className="text-base sm:text-lg font-medium text-gray-900 mb-1">Special assistance</h4>
                  <p className="text-xs sm:text-sm text-gray-600">Additional support and for individuals with specific needs. <a href="#" className="text-orange-500 hover:underline">Read more</a></p>
                </div>
              </div>
              <button 
                onClick={() => handlePassengerAddOnChange(passengerIndex, 'specialAssistance', !passenger.specialAssistance)}
                className={`px-4 py-2 rounded-lg font-medium text-sm sm:text-base ml-4 transition-colors ${
                  passenger.specialAssistance 
                    ? 'bg-orange-500 hover:bg-orange-600 text-white' 
                    : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                }`}
              >
                {passenger.specialAssistance ? 'Requested' : 'Request'}
              </button>
            </div>
          </div>
        </div>
      ))}
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
        return renderExtras();
      case 3:
        return renderPayment();
      default:
        return renderPassengerDetails();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Main Content */}
      <div>
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

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {renderStepIndicator()}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
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
                {bookingData.passengers.some(p => p.selectedSeat) && (
                  <div className="flex justify-between text-xs sm:text-sm">
                    <span className="text-gray-600">Seat Selection</span>
                    <span className="text-gray-900">Rs.{(bookingData.passengers.filter(p => p.selectedSeat).length * 1500).toLocaleString()}</span>
                  </div>
                )}
                {bookingData.passengers.some(p => p.selectedMeals.length > 0) && (
                  <div className="flex justify-between text-xs sm:text-sm">
                    <span className="text-gray-600">Meals</span>
                    <span className="text-gray-900">Rs.{(bookingData.passengers.reduce((sum, p) => sum + p.selectedMeals.length, 0) * 800).toLocaleString()}</span>
                  </div>
                )}
                {bookingData.passengers.some(p => p.selectedBaggage.length > 0) && (
                  <div className="flex justify-between text-xs sm:text-sm">
                    <span className="text-gray-600">Baggage</span>
                    <span className="text-gray-900">Rs.{(bookingData.passengers.reduce((sum, p) => sum + p.selectedBaggage.length, 0) * 2000).toLocaleString()}</span>
                  </div>
                )}
                {bookingData.passengers.some(p => p.insurance) && (
                  <div className="flex justify-between text-xs sm:text-sm">
                    <span className="text-gray-600">Insurance</span>
                    <span className="text-gray-900">Rs.{(bookingData.passengers.filter(p => p.insurance).length * 376.90).toFixed(2)}</span>
                  </div>
                )}
                <div className="border-t border-gray-200 pt-2 sm:pt-3">
                  <div className="flex justify-between font-semibold text-base sm:text-lg">
                    <span>Total</span>
                    <span className="text-orange-500">Rs.{totalPrice.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
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

                {currentStep < 3 ? (
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

      {/* Seat Selection Slide-out Panel */}
      {isSeatSelectionOpen && selectedPassengerForSeat !== null && (
        <>
          {/* Transparent dark overlay backdrop */}
          <div 
            className="fixed inset-0 z-[50] transition-opacity duration-300"
            style={{ backgroundColor: 'rgba(0, 0, 0, 0.6)' }}
            onClick={() => {
              setIsSeatPanelAnimating(false);
              setTimeout(() => {
                setIsSeatSelectionOpen(false);
                setSelectedPassengerForSeat(null);
              }, 300);
            }}
          ></div>
          <div 
            className={`fixed top-0 right-0 h-full w-full sm:w-[480px] lg:w-[520px] bg-white shadow-2xl z-[51] transform transition-transform duration-300 ease-out overflow-y-auto translate-x-full ${
              isSeatPanelAnimating ? '!translate-x-0' : ''
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            {(() => {
              const passenger = bookingData.passengers[selectedPassengerForSeat];
              const selectedSeatPrice = passenger?.selectedSeat ? 2610 : 0;
              
              return (
                <div className="flex flex-col h-full">
                  {/* Header */}
                  <div className="sticky top-0 bg-white border-b border-gray-200 z-10 p-3 sm:p-4">
                    <div className="flex items-center justify-between mb-4">
                      <button
                        onClick={() => {
                          setIsSeatPanelAnimating(false);
                          setTimeout(() => {
                            setIsSeatSelectionOpen(false);
                            setSelectedPassengerForSeat(null);
                          }, 300);
                        }}
                        className="text-gray-500 hover:text-gray-700"
                      >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                    
                    {/* Flight Segments */}
                    <div className="flex items-center space-x-4 mb-4">
                      <div className="flex items-center space-x-2">
                        <svg className="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
                        </svg>
                        <span className="text-sm text-gray-400">KTM - DMK</span>
                      </div>
                      <div className="flex items-center space-x-2 border-b-2 border-green-500 pb-1">
                        <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
                        </svg>
                        <span className="text-sm font-medium text-green-600">DMK - NRT</span>
                      </div>
                    </div>

                    {/* Passenger Selector */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <button className="bg-green-600 text-white px-4 py-2 rounded-full text-sm font-medium flex items-center space-x-2">
                          <span>Adult {selectedPassengerForSeat + 1} (1)</span>
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </button>
                        <h2 className="text-xl font-semibold text-gray-900">
                          Select a seat for Adult {selectedPassengerForSeat + 1}
                        </h2>
                      </div>
                    </div>

                    {/* Legend */}
                    <div className="flex items-center space-x-4 mb-4 flex-wrap">
                      <div className="flex items-center space-x-2">
                        <div className="w-6 h-6 rounded border-2 border-gray-900 bg-white"></div>
                        <span className="text-xs text-gray-600">Your selection</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-6 h-6 rounded bg-gray-400 relative">
                          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </div>
                        <span className="text-xs text-gray-600">Unavailable</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-6 h-6 rounded bg-gray-300"></div>
                        <span className="text-xs text-gray-600">Blocked</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <svg className="w-6 h-6 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M3 1a1 1 0 011 1v1a1 1 0 001 1h12a1 1 0 001-1V2a1 1 0 011-1h2a1 1 0 011 1v2.576l-.64.533A4.486 4.486 0 0017 7.5V13a2 2 0 01-2 2h-2a2 2 0 01-2-2v-1h-2v1a2 2 0 01-2 2H5a2 2 0 01-2-2V7.5c0-.648.225-1.277.64-1.891L3 5.576V2a1 1 0 011-1h2z" />
                        </svg>
                        <span className="text-xs text-gray-600">Baby bassinet</span>
                      </div>
                    </div>
                  </div>

                  {/* Seat Map */}
                  <div className="flex-1 p-4 sm:p-5">
                    {/* Quiet Zone Banner */}
                    <div className="mb-4 text-center">
                      <div className="inline-block text-xs sm:text-sm font-medium text-gray-700 bg-yellow-50 px-3 py-1.5 rounded">
                        Quiet zone - Minimal noise, less disturbance
                      </div>
                    </div>

                    {/* Seat Map Grid */}
                    <div className="space-y-3">
                      {/* Row Numbers and Column Headers */}
                      <div className="flex items-start">
                        <div className="w-10 sm:w-12 flex-shrink-0"></div>
                        {/* Left Section (A-B) */}
                        <div className="flex flex-col items-center space-y-1 mr-1">
                          <div className="flex items-center justify-center space-x-1 text-[10px] text-gray-600">
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                            </svg>
                            <span>← Exit</span>
                          </div>
                          <div className="flex gap-1.5">
                            <div className="w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center text-xs font-semibold text-gray-500">A</div>
                            <div className="w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center text-xs font-semibold text-gray-500">B</div>
                          </div>
                        </div>
                        {/* Aisle Indicator */}
                        <div className="flex flex-col items-center justify-center mx-1">
                          <div className="text-[8px] text-gray-400 mb-1">Aisle</div>
                          <div className="w-0.5 h-8 bg-gray-300 rounded"></div>
                        </div>
                        {/* Middle Section (D-G) */}
                        <div className="flex flex-col items-center space-y-1">
                          <div className="h-4"></div>
                          <div className="flex gap-1.5">
                            <div className="w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center text-xs font-semibold text-gray-500">D</div>
                            <div className="w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center text-xs font-semibold text-gray-500">E</div>
                            <div className="w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center text-xs font-semibold text-gray-500">F</div>
                            <div className="w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center text-xs font-semibold text-gray-500">G</div>
                          </div>
                        </div>
                        {/* Aisle Indicator */}
                        <div className="flex flex-col items-center justify-center mx-1">
                          <div className="text-[8px] text-gray-400 mb-1">Aisle</div>
                          <div className="w-0.5 h-8 bg-gray-300 rounded"></div>
                        </div>
                        {/* Right Section (J-K) */}
                        <div className="flex flex-col items-center space-y-1 ml-1">
                          <div className="flex items-center justify-center space-x-1 text-[10px] text-gray-600">
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                            </svg>
                            <span>Exit →</span>
                          </div>
                          <div className="flex gap-1.5">
                            <div className="w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center text-xs font-semibold text-gray-500">J</div>
                            <div className="w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center text-xs font-semibold text-gray-500">K</div>
                          </div>
                        </div>
                        <div className="w-10 sm:w-12 flex-shrink-0"></div>
                      </div>

                      {/* Generate seat rows (20-28) */}
                      {[20, 21, 22, 23, 24, 25, 26, 27, 28].map((rowNum) => (
                        <div key={rowNum} className="flex items-center">
                          <div className="w-10 sm:w-12 flex-shrink-0 text-center text-xs sm:text-sm font-semibold text-gray-700 py-1">{rowNum}</div>
                          
                          {/* Left Section: A-B */}
                          <div className="flex gap-1.5 mr-2">
                            {['A', 'B'].map((col) => {
                              const seatId = `${rowNum}${col}`;
                              const isSelected = passenger?.selectedSeat === seatId;
                              const isUnavailable = ['20A', '20B', '21A', '21B', '22A', '22B'].includes(seatId);
                              
                              return (
                                <button
                                  key={seatId}
                                  onClick={() => !isUnavailable && handlePassengerAddOnChange(selectedPassengerForSeat, 'seat', isSelected ? null : seatId)}
                                  disabled={isUnavailable}
                                  className={`w-10 h-10 sm:w-11 sm:h-11 rounded-md text-xs font-semibold transition-all flex items-center justify-center border ${
                                    isSelected
                                      ? 'bg-green-500 text-white border-gray-900 shadow-lg scale-105'
                                      : isUnavailable
                                      ? 'bg-gray-400 text-white cursor-not-allowed border-gray-400'
                                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300 hover:border-gray-400 border-gray-300 shadow-sm'
                                  }`}
                                  title={seatId}
                                >
                                  {isUnavailable ? (
                                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                  ) : (
                                    <span className="text-xs sm:text-sm">{col}</span>
                                  )}
                                </button>
                              );
                            })}
                          </div>
                          
                          {/* Aisle Indicator */}
                          <div className="w-4 flex items-center justify-center">
                            <div className="w-1 h-10 bg-gray-400 rounded"></div>
                          </div>
                          
                          {/* Middle Section: D-G */}
                          <div className="flex gap-1.5">
                            {['D', 'E', 'F', 'G'].map((col) => {
                              const seatId = `${rowNum}${col}`;
                              const isSelected = passenger?.selectedSeat === seatId;
                              const isUnavailable = ['20D', '22D', '22E', '22F', '22G'].includes(seatId) && rowNum === 22;
                              const isHotSeat = ['20D', '20E', '20F', '20G'].includes(seatId);
                              const isBlocked = ['21D', '21E', '21F', '21G'].includes(seatId) && rowNum === 21;
                              
                              return (
                                <button
                                  key={seatId}
                                  onClick={() => !isUnavailable && !isBlocked && handlePassengerAddOnChange(selectedPassengerForSeat, 'seat', isSelected ? null : seatId)}
                                  disabled={isUnavailable || isBlocked}
                                  className={`w-10 h-10 sm:w-11 sm:h-11 rounded-md text-xs font-semibold transition-all relative flex items-center justify-center border ${
                                    isSelected
                                      ? 'bg-green-500 text-white border-gray-900 shadow-lg scale-105'
                                      : isUnavailable
                                      ? 'bg-gray-400 text-white cursor-not-allowed border-gray-400'
                                      : isBlocked
                                      ? 'bg-gray-300 cursor-not-allowed border-gray-300'
                                      : isHotSeat
                                      ? 'bg-red-500 text-white hover:bg-red-600 border-red-600 shadow-md'
                                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300 hover:border-gray-400 border-gray-300 shadow-sm'
                                  }`}
                                  title={seatId}
                                >
                                  {isUnavailable ? (
                                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                  ) : isSelected ? (
                                    <span className="text-[10px] sm:text-xs font-bold">A{selectedPassengerForSeat + 1}</span>
                                  ) : (
                                    <span className="text-xs sm:text-sm">{col}</span>
                                  )}
                                  {isHotSeat && !isSelected && !isUnavailable && !isBlocked && (
                                    <svg className="absolute -top-1 -right-1 w-4 h-4 text-red-700 bg-white rounded-full p-0.5" fill="currentColor" viewBox="0 0 20 20">
                                      <path d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" />
                                    </svg>
                                  )}
                                </button>
                              );
                            })}
                          </div>
                          
                          {/* Aisle Indicator */}
                          <div className="w-4 flex items-center justify-center">
                            <div className="w-1 h-10 bg-gray-400 rounded"></div>
                          </div>
                          
                          {/* Right Section: J-K */}
                          <div className="flex gap-1.5 ml-2">
                            {['J', 'K'].map((col) => {
                              const seatId = `${rowNum}${col}`;
                              const isSelected = passenger?.selectedSeat === seatId;
                              const isUnavailable = ['20J', '20K', '21J', '21K', '22J', '22K'].includes(seatId);
                              const isHotSeat = ['20J', '20K'].includes(seatId);
                              
                              return (
                                <button
                                  key={seatId}
                                  onClick={() => !isUnavailable && handlePassengerAddOnChange(selectedPassengerForSeat, 'seat', isSelected ? null : seatId)}
                                  disabled={isUnavailable}
                                  className={`w-10 h-10 sm:w-11 sm:h-11 rounded-md text-xs font-semibold transition-all relative flex items-center justify-center border ${
                                      isSelected
                                      ? 'bg-green-500 text-white border-gray-900 shadow-lg scale-105'
                                      : isUnavailable
                                      ? 'bg-gray-400 text-white cursor-not-allowed border-gray-400'
                                      : isHotSeat
                                      ? 'bg-red-500 text-white hover:bg-red-600 border-red-600 shadow-md'
                                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300 hover:border-gray-400 border-gray-300 shadow-sm'
                                  }`}
                                  title={seatId}
                                >
                                    {isUnavailable ? (
                                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                      </svg>
                                    ) : (
                                      <span className="text-xs sm:text-sm">{col}</span>
                                    )}
                                    {isHotSeat && !isSelected && !isUnavailable && (
                                      <svg className="absolute -top-1 -right-1 w-4 h-4 text-red-700 bg-white rounded-full p-0.5" fill="currentColor" viewBox="0 0 20 20">
                                        <path d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" />
                                      </svg>
                                    )}
                                </button>
                              );
                            })}
                          </div>
                          
                          <div className="w-10 sm:w-12 flex-shrink-0"></div>
                        </div>
                      ))}
                    </div>

                    {/* Price Legend */}
                    <div className="mt-5 flex items-center justify-center space-x-3 flex-wrap gap-2">
                      <div className="flex items-center space-x-2 bg-red-100 px-2.5 py-1 rounded-full">
                        <div className="w-3 h-3 sm:w-4 sm:h-4 bg-red-500 rounded"></div>
                        <span className="text-[10px] sm:text-xs text-gray-700">NPR 2,486 - 7,550</span>
                      </div>
                      <div className="flex items-center space-x-2 bg-gray-100 px-2.5 py-1 rounded-full">
                        <div className="w-3 h-3 sm:w-4 sm:h-4 bg-gray-400 rounded"></div>
                        <span className="text-[10px] sm:text-xs text-gray-700">NPR 622 - 1,040</span>
                      </div>
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="sticky bottom-0 bg-white border-t border-gray-200 p-4">
                    {passenger?.selectedSeat && (
                      <div className="flex items-start space-x-4 mb-4">
                        <div className="flex flex-col items-center space-y-2">
                          <div className="w-16 h-16 bg-red-500 rounded flex items-center justify-center">
                            <div className="w-12 h-12 bg-white rounded flex flex-col items-center justify-center">
                              <div className="w-8 h-8 border-2 border-red-500 rounded"></div>
                            </div>
                          </div>
                        </div>
                        <div className="flex-1">
                          <p className="font-semibold text-gray-900">Adult {selectedPassengerForSeat + 1} - {passenger.selectedSeat}</p>
                          <p className="text-sm text-gray-600 mt-1">
                            Hot Seat at the front of the cabin. Priority boarding included.
                          </p>
                          <p className="text-lg font-bold text-gray-900 mt-2">
                            NPR {['20D', '20E', '20F', '20G', '20J', '20K'].includes(passenger.selectedSeat) ? '7,550.00' : '2,610.00'}
                          </p>
                        </div>
                      </div>
                    )}
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-2xl font-bold text-gray-900">NPR {totalPrice.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                        <p className="text-sm text-gray-600 mt-1">
                          {passenger?.selectedSeat ? '1 of 1 seats selected' : '0 of 1 seats selected'}
                        </p>
                      </div>
                      <button
                        onClick={() => {
                          setIsSeatPanelAnimating(false);
                          setTimeout(() => {
                            setIsSeatSelectionOpen(false);
                            setSelectedPassengerForSeat(null);
                          }, 300);
                        }}
                        className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-medium text-base transition-colors"
                      >
                        Done
                      </button>
                    </div>
                  </div>
                </div>
              );
            })()}
          </div>
        </>
      )}

      {/* Baggage Selection Slide-out Panel */}
      {isBaggageSelectionOpen && selectedPassengerForBaggage !== null && (
        <>
          {/* Transparent dark overlay backdrop */}
          <div 
            className="fixed inset-0 z-[50] transition-opacity duration-300"
            style={{ backgroundColor: 'rgba(0, 0, 0, 0.6)' }}
            onClick={() => {
              setIsBaggagePanelAnimating(false);
              setTimeout(() => {
                setIsBaggageSelectionOpen(false);
                setSelectedPassengerForBaggage(null);
              }, 300);
            }}
          ></div>
          <div 
            className={`fixed top-0 right-0 h-full w-full sm:w-[480px] lg:w-[520px] bg-white shadow-2xl z-[51] transform transition-transform duration-300 ease-out overflow-y-auto translate-x-full ${
              isBaggagePanelAnimating ? '!translate-x-0' : ''
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            {(() => {
              const passenger = bookingData.passengers[selectedPassengerForBaggage];
              
              // Calculate total baggage fees
              const checkedBaggagePrices = {
                'none': 0,
                '20kg': 8655,
                '25kg': 10442,
                '30kg': 14199,
                '40kg': 23180,
                '50kg': 30160,
                '60kg': 37567
              };
              
              const sportsEquipmentPrices = {
                'none': 0,
                '20kg': 10811,
                '25kg': 12862,
                '30kg': 16863,
                '40kg': 26745
              };
              
              const carryOnExtraPrice = passenger?.carryOnBaggage === 'extra' ? 3515 : 0;
              const checkedBaggagePrice = checkedBaggagePrices[passenger?.checkedBaggage || 'none'] || 0;
              const sportsEquipmentPrice = sportsEquipmentPrices[passenger?.sportsEquipment || 'none'] || 0;
              const totalBaggageFees = carryOnExtraPrice + checkedBaggagePrice + sportsEquipmentPrice;
              
              return (
                <div className="flex flex-col h-full">
                  {/* Header */}
                  <div className="sticky top-0 bg-white border-b border-gray-200 z-10 p-3 sm:p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 12L3.269 3.125A59.769 59.769 0 0121.485 12 59.768 59.768 0 013.27 20.875L5.999 12zm0 0h7.5" />
                        </svg>
                        <span className="text-sm font-medium text-gray-700">KTM - NRT</span>
                      </div>
                      <button
                        onClick={() => {
                          setIsBaggagePanelAnimating(false);
                          setTimeout(() => {
                            setIsBaggageSelectionOpen(false);
                            setSelectedPassengerForBaggage(null);
                          }, 300);
                        }}
                        className="text-gray-500 hover:text-gray-700"
                      >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                    
                    {/* Passenger Selector */}
                    <div className="mt-4">
                      <button className="bg-teal-600 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center space-x-2">
                        <span>Adult {selectedPassengerForBaggage + 1}</span>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </button>
                    </div>
                  </div>

                  {/* Main Content */}
                  <div className="flex-1 p-4 sm:p-5">
                    {/* Passenger Indicator */}
                    <div className="flex items-center space-x-2 mb-6">
                      <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      <span className="text-sm font-medium text-gray-900">Adult {selectedPassengerForBaggage + 1}</span>
                    </div>

                    {/* Carry-on baggage section */}
                    <div className="mb-6">
                      <div className="flex items-center space-x-2 mb-2">
                        <h3 className="text-base font-semibold text-gray-900">Carry-on baggage</h3>
                        <svg className="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <p className="text-xs text-gray-600 mb-4">Baggage size must not exceed 56 x 36 x 23 cm per piece</p>
                      <div className="flex items-center space-x-3">
                        <button
                          onClick={() => handlePassengerAddOnChange(selectedPassengerForBaggage, 'carryOnBaggage', 'included')}
                          className={`flex-1 py-3 px-4 border-2 rounded-lg text-sm font-medium transition-all ${
                            passenger?.carryOnBaggage === 'included'
                              ? 'border-green-500 bg-green-50 text-green-700'
                              : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400'
                          }`}
                        >
                          <div className="font-semibold">7 kg</div>
                          <div className="text-xs mt-1">Included</div>
                        </button>
                        <span className="text-gray-400 text-2xl">+</span>
                        <button
                          onClick={() => handlePassengerAddOnChange(selectedPassengerForBaggage, 'carryOnBaggage', 'extra')}
                          className={`flex-1 py-3 px-4 border-2 rounded-lg text-sm font-medium transition-all ${
                            passenger?.carryOnBaggage === 'extra'
                              ? 'border-green-500 bg-green-50 text-green-700'
                              : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400'
                          }`}
                        >
                          <div className="font-semibold">7 kg</div>
                          <div className="text-xs mt-1">NPR 3,515.00</div>
                        </button>
                      </div>
                    </div>

                    {/* Checked baggage section */}
                    <div className="mb-6">
                      <div className="flex items-center space-x-2 mb-4">
                        <h3 className="text-base font-semibold text-gray-900">Checked baggage</h3>
                        <svg className="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                        {[
                          { value: 'none', label: 'None', price: 0 },
                          { value: '20kg', label: '20 kg', price: 8655 },
                          { value: '25kg', label: '25 kg', price: 10442 },
                          { value: '30kg', label: '30 kg', price: 14199 },
                          { value: '40kg', label: '40 kg', price: 23180 },
                          { value: '50kg', label: '50 kg', price: 30160 },
                          { value: '60kg', label: '60 kg', price: 37567 }
                        ].map((option) => (
                          <button
                            key={option.value}
                            onClick={() => handlePassengerAddOnChange(selectedPassengerForBaggage, 'checkedBaggage', option.value)}
                            className={`py-3 px-4 border-2 rounded-lg text-sm font-medium transition-all ${
                              passenger?.checkedBaggage === option.value
                                ? 'border-green-500 bg-green-50 text-green-700'
                                : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400'
                            }`}
                          >
                            <div className="font-semibold">{option.label}</div>
                            {option.price > 0 && (
                              <div className="text-xs mt-1">NPR {option.price.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
                            )}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Sports equipment section */}
                    <div className="mb-6">
                      <div className="flex items-center space-x-2 mb-4">
                        <h3 className="text-base font-semibold text-gray-900">Sports equipment</h3>
                        <svg className="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                        {[
                          { value: 'none', label: 'None', price: 0 },
                          { value: '20kg', label: '20 kg', price: 10811 },
                          { value: '25kg', label: '25 kg', price: 12862 },
                          { value: '30kg', label: '30 kg', price: 16863 },
                          { value: '40kg', label: '40 kg', price: 26745 }
                        ].map((option) => (
                          <button
                            key={option.value}
                            onClick={() => handlePassengerAddOnChange(selectedPassengerForBaggage, 'sportsEquipment', option.value)}
                            className={`py-3 px-4 border-2 rounded-lg text-sm font-medium transition-all ${
                              passenger?.sportsEquipment === option.value
                                ? 'border-green-500 bg-green-50 text-green-700'
                                : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400'
                            }`}
                          >
                            <div className="font-semibold">{option.label}</div>
                            {option.price > 0 && (
                              <div className="text-xs mt-1">NPR {option.price.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
                            )}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="sticky bottom-0 bg-white border-t border-gray-200 p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-2xl font-bold text-gray-900">NPR {totalBaggageFees.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                        <p className="text-xs text-gray-600 mt-1">Total baggage fees</p>
                      </div>
                      <button
                        onClick={() => {
                          setIsBaggagePanelAnimating(false);
                          setTimeout(() => {
                            setIsBaggageSelectionOpen(false);
                            setSelectedPassengerForBaggage(null);
                          }, 300);
                        }}
                        className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-medium text-base transition-colors"
                      >
                        Done
                      </button>
                    </div>
                  </div>
                </div>
              );
            })()}
          </div>
        </>
      )}
    </div>
  );
};

export default FlightBooking;
