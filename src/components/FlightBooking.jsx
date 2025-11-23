import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link, useLocation } from 'react-router-dom';
import {
  UserIcon,
  CreditCardIcon,
  MapPinIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';
import { flightsAPI, bookingsAPI } from '../services/api';

const FlightBooking = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [bookingData, setBookingData] = useState({
    passengers: [],
    payment: {}
  });
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('');
  const [flight, setFlight] = useState(null);
  const [isLoadingFlight, setIsLoadingFlight] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [selectedClass, setSelectedClass] = useState('economy');
  const [tripType, setTripType] = useState('oneway');

  const [passengerCount, setPassengerCount] = useState(1);
  const [totalPrice, setTotalPrice] = useState(0);
  const [isSeatSelectionOpen, setIsSeatSelectionOpen] = useState(false);
  const [selectedPassengerForSeat, setSelectedPassengerForSeat] = useState(null);
  const [currentFlightSegment, setCurrentFlightSegment] = useState(0); // For multicity flights
  const [isSeatPanelAnimating, setIsSeatPanelAnimating] = useState(false);
  const [isBaggageSelectionOpen, setIsBaggageSelectionOpen] = useState(false);
  const [selectedPassengerForBaggage, setSelectedPassengerForBaggage] = useState(null);
  const [isBaggagePanelAnimating, setIsBaggagePanelAnimating] = useState(false);
  const [isMealSelectionOpen, setIsMealSelectionOpen] = useState(false);
  const [selectedPassengerForMeal, setSelectedPassengerForMeal] = useState(null);
  const [isMealPanelAnimating, setIsMealPanelAnimating] = useState(false);
  const [isSpecialAssistanceOpen, setIsSpecialAssistanceOpen] = useState(false);
  const [selectedPassengerForAssistance, setSelectedPassengerForAssistance] = useState(null);
  const [isSpecialAssistanceAnimating, setIsSpecialAssistanceAnimating] = useState(false);

  // Fetch flight data from backend
  useEffect(() => {
    const fetchFlight = async () => {
      if (!id) return;
      
      setIsLoadingFlight(true);
      setError(null);
      try {
        // Check if flight data is passed from search results
        const flightFromState = location.state?.flight;
        if (flightFromState) {
          setFlight(flightFromState);
          setSelectedClass(flightFromState.class || 'economy');
          setTripType(flightFromState.tripType || 'oneway');
          setTotalPrice(flightFromState.price || 0);
        } else {
          // Fetch from backend
          const response = await flightsAPI.getById(id);
          const flightData = response.flight || response;
          
          // Transform backend data to match frontend format
          const transformedFlight = {
            id: flightData.id || flightData._id,
            flightNumber: flightData.flightNumber,
            airline: flightData.airline,
            airlineCode: flightData.airline?.substring(0, 2).toUpperCase() || 'XX',
            departure: flightData.from,
            arrival: flightData.to,
            departureTime: flightData.departureTime,
            arrivalTime: flightData.arrivalTime,
            duration: flightData.duration,
            departureDate: flightData.departureDate,
            arrivalDate: flightData.arrivalDate,
            price: flightData.pricing?.economy || flightData.price || 0,
            pricing: flightData.pricing,
            cabin: selectedClass,
            aircraft: flightData.aircraftType,
            seats: flightData.seats,
            stops: flightData.stops,
            stopLocations: flightData.stopLocations || []
          };
          
          setFlight(transformedFlight);
          setTotalPrice(transformedFlight.pricing?.economy || transformedFlight.price || 0);
        }
      } catch (err) {
        console.error('Error fetching flight:', err);
        setError(err.message || 'Failed to load flight details');
      } finally {
        setIsLoadingFlight(false);
      }
    };

    fetchFlight();
  }, [id, location.state]);

  // Blur Navbar and Footer and prevent background scroll when seat, baggage, meal, or special assistance selection is open
  useEffect(() => {
    const isAnySliderOpen = isSeatSelectionOpen || isBaggageSelectionOpen || isMealSelectionOpen || isSpecialAssistanceOpen;
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
  }, [isSeatSelectionOpen, isBaggageSelectionOpen, isMealSelectionOpen, isSpecialAssistanceOpen]);

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
      specialAssistance: false,
      specialAssistanceDetails: '',
      needWheelchair: false,
      hasOwnWheelchair: false,
      wheelchairType: '', // 'unable-ascend-descend', 'unable-walk-long', 'paralysed-upper-lower', 'paralysed-lower'
      pwdId: ''
    }));

    setBookingData(prev => ({
      ...prev,
      passengers: initialPassengers
    }));
  }, [passengerCount]);

  const calculateTotal = () => {
    if (!flight) return;
    
    // Get price based on selected class
    let basePrice = 0;
    if (selectedClass === 'economy' && flight.pricing?.economy) {
      basePrice = flight.pricing.economy;
    } else if (selectedClass === 'business' && flight.pricing?.business) {
      basePrice = flight.pricing.business;
    } else if (selectedClass === 'first' && flight.pricing?.firstClass) {
      basePrice = flight.pricing.firstClass;
    } else {
      basePrice = flight.price || 0;
    }
    
    basePrice = basePrice * passengerCount;
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

  const handleSubmit = async () => {
    const token = localStorage.getItem('userToken');
    if (!token) {
      alert('Please login to book a flight');
      navigate('/');
      return;
    }

    if (!flight) {
      alert('Flight data not loaded. Please try again.');
      return;
    }

    // Validate passenger data
    const invalidPassengers = bookingData.passengers.filter(p => 
      !p.firstName || !p.lastName || !p.email || !p.phone
    );
    
    if (invalidPassengers.length > 0) {
      alert('Please fill in all required passenger details');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      // Prepare booking payload - match backend expectations
      // Get departure date from flight or search params
      const departureDate = flight.departureDate || 
                           location.state?.departureDate || 
                           new Date().toISOString();
      
      // Get price from flight data (from FlightAPI.io or database)
      const flightPrice = flight.price || 
                         flight.pricing?.economy || 
                         flight.pricing?.business || 
                         flight.pricing?.firstClass || 
                         totalPrice / passengerCount;
      
      const bookingPayload = {
        flightId: flight.id || flight._id,
        returnFlightId: tripType === 'return' && flight.returnFlightId ? flight.returnFlightId : null,
        tripType: tripType || 'oneway',
        class: selectedClass || 'economy',
        departureDate: departureDate,
        basePrice: flightPrice, // Pass the base price from FlightAPI.io
        passengers: bookingData.passengers.map(p => ({
          title: p.title || 'Mr',
          firstName: p.firstName,
          lastName: p.lastName,
          dateOfBirth: p.dateOfBirth ? new Date(p.dateOfBirth).toISOString() : null,
          gender: p.gender || 'Male',
          passportNumber: p.passportNumber || '',
          passportExpiry: p.passportExpiry ? new Date(p.passportExpiry).toISOString() : null,
          nationality: p.nationality || '',
          email: p.email,
          phone: p.phone,
          baggage: {
            carryOn: p.carryOnBaggage === 'extra' ? '14kg' : '7kg',
            checked: p.checkedBaggage || 'none'
          },
          addOns: {
            seatSelection: !!p.selectedSeat,
            meals: p.selectedMeals || [],
            extraBaggage: {
              checked: p.checkedBaggage || 'none',
              sportsEquipment: p.sportsEquipment || 'none'
            }
          },
          seatNumber: p.selectedSeat || null,
          mealPreference: p.selectedMeals?.[0] || null,
          specialAssistance: p.specialAssistance || false
        })),
        addOns: {
          seatSelection: bookingData.passengers.some(p => p.selectedSeat),
          meals: bookingData.passengers.flatMap(p => p.selectedMeals || [])
        },
        specialRequirements: bookingData.passengers.some(p => p.specialAssistance) 
          ? 'Special assistance requested' 
          : null
      };

      const response = await bookingsAPI.createFlightBooking(bookingPayload);
      
      // Extract booking reference from response
      const bookingRef = response.bookingReference || 
                        response.booking?.bookingReference || 
                        response.data?.booking?.bookingReference || 
                        'N/A';
      
      alert(`Booking successful! Booking Reference: ${bookingRef}`);
      navigate('/profile?tab=bookings');
    } catch (err) {
      console.error('Booking error:', err);
      setError(err.message || 'Booking failed. Please try again.');
      alert(`Booking failed: ${err.message || 'Please try again'}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePaymentMethodChange = (method) => {
    setSelectedPaymentMethod(method);
    setBookingData(prev => ({
      ...prev,
      payment: {
        ...prev.payment,
        method
      }
    }));
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
              <label className="block text-sm font-medium text-gray-700 mb-2">Frequent Flyer Number (Optional)</label>
              <input type="text" value={passenger.frequentFlyerNumber || ''} onChange={e => handlePassengerChange(index, 'frequentFlyerNumber', e.target.value)} className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-orange-500" placeholder="Number" />
            </div>
            <div className="col-span-3 grid grid-cols-6 gap-4 items-end mt-4">
              <div className="col-span-3">
                <label className="block text-sm font-medium text-gray-700 mb-2">Primary Contact Number<span className="text-orange-500">*</span></label>
                <div className="flex gap-3">
                  <select className="w-1/4 border border-gray-300 rounded-lg px-3 py-3 text-sm bg-white">
                    <option value="+977">🇳🇵 +977</option>
                    <option value="+1">🇺🇸 +1</option>
                    <option value="+44">🇬🇧 +44</option>
                    <option value="+91">🇮🇳 +91</option>
                    <option value="+86">🇨🇳 +86</option>
                    <option value="+81">🇯🇵 +81</option>
                    <option value="+82">🇰🇷 +82</option>
                    <option value="+65">🇸🇬 +65</option>
                    <option value="+971">🇦🇪 +971</option>
                    <option value="+66">🇹🇭 +66</option>
                    <option value="+60">🇲🇾 +60</option>
                    <option value="+63">🇵🇭 +63</option>
                    <option value="+62">🇮🇩 +62</option>
                    <option value="+61">🇦🇺 +61</option>
                    <option value="+64">🇳🇿 +64</option>
                    <option value="+95">🇲🇲 +95</option>
                    <option value="+84">🇻🇳 +84</option>
                    <option value="+880">🇧🇩 +880</option>
                    <option value="+94">🇱🇰 +94</option>
                    <option value="+92">🇵🇰 +92</option>
                  </select>
                  <input type="text" value={passenger.phone} onChange={e => handlePassengerChange(index, 'phone', e.target.value)} className="flex-1 border border-gray-300 rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-orange-500" placeholder="Mobile No." />
                </div>
              </div>
              <div className="col-span-3">
                <label className="block text-sm font-medium text-gray-700 mb-2">Passenger Email Address</label>
                <input type="email" value={passenger.email} onChange={e => handlePassengerChange(index, 'email', e.target.value)} className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-orange-500" placeholder="For schedule change notice" />
              </div>
            </div>
            <div className="col-span-3 grid grid-cols-6 gap-4 mt-4">
              <div className="col-span-3">
                <label className="block text-sm font-medium text-gray-700 mb-2">Notice Email</label>
                <input type="email" value={passenger.ticketEmail || ''} onChange={e => handlePassengerChange(index, 'ticketEmail', e.target.value)} className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-orange-500" placeholder="For receipt/Refund/Notices" />
              </div>
            </div>
          </div>
          {/* Document Information */}
          <div className="mt-10">
            <div className="text-lg font-bold mb-4 text-orange-600 border-l-4 border-orange-400 pl-3">Document Information</div>
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
                <select value={passenger.nationality} onChange={e => handlePassengerChange(index, 'nationality', e.target.value)} className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-orange-500">
                  <option value="">Select Nationality</option>
                  <option value="Afghanistan">Afghanistan</option>
                  <option value="Albania">Albania</option>
                  <option value="Algeria">Algeria</option>
                  <option value="Andorra">Andorra</option>
                  <option value="Angola">Angola</option>
                  <option value="Antigua and Barbuda">Antigua and Barbuda</option>
                  <option value="Argentina">Argentina</option>
                  <option value="Armenia">Armenia</option>
                  <option value="Australia">Australia</option>
                  <option value="Austria">Austria</option>
                  <option value="Azerbaijan">Azerbaijan</option>
                  <option value="Bahamas">Bahamas</option>
                  <option value="Bahrain">Bahrain</option>
                  <option value="Bangladesh">Bangladesh</option>
                  <option value="Barbados">Barbados</option>
                  <option value="Belarus">Belarus</option>
                  <option value="Belgium">Belgium</option>
                  <option value="Belize">Belize</option>
                  <option value="Benin">Benin</option>
                  <option value="Bhutan">Bhutan</option>
                  <option value="Bolivia">Bolivia</option>
                  <option value="Bosnia and Herzegovina">Bosnia and Herzegovina</option>
                  <option value="Botswana">Botswana</option>
                  <option value="Brazil">Brazil</option>
                  <option value="Brunei">Brunei</option>
                  <option value="Bulgaria">Bulgaria</option>
                  <option value="Burkina Faso">Burkina Faso</option>
                  <option value="Burundi">Burundi</option>
                  <option value="Cambodia">Cambodia</option>
                  <option value="Cameroon">Cameroon</option>
                  <option value="Canada">Canada</option>
                  <option value="Cape Verde">Cape Verde</option>
                  <option value="Central African Republic">Central African Republic</option>
                  <option value="Chad">Chad</option>
                  <option value="Chile">Chile</option>
                  <option value="China">China</option>
                  <option value="Colombia">Colombia</option>
                  <option value="Comoros">Comoros</option>
                  <option value="Congo">Congo</option>
                  <option value="Costa Rica">Costa Rica</option>
                  <option value="Croatia">Croatia</option>
                  <option value="Cuba">Cuba</option>
                  <option value="Cyprus">Cyprus</option>
                  <option value="Czech Republic">Czech Republic</option>
                  <option value="Denmark">Denmark</option>
                  <option value="Djibouti">Djibouti</option>
                  <option value="Dominica">Dominica</option>
                  <option value="Dominican Republic">Dominican Republic</option>
                  <option value="Ecuador">Ecuador</option>
                  <option value="Egypt">Egypt</option>
                  <option value="El Salvador">El Salvador</option>
                  <option value="Equatorial Guinea">Equatorial Guinea</option>
                  <option value="Eritrea">Eritrea</option>
                  <option value="Estonia">Estonia</option>
                  <option value="Eswatini">Eswatini</option>
                  <option value="Ethiopia">Ethiopia</option>
                  <option value="Fiji">Fiji</option>
                  <option value="Finland">Finland</option>
                  <option value="France">France</option>
                  <option value="Gabon">Gabon</option>
                  <option value="Gambia">Gambia</option>
                  <option value="Georgia">Georgia</option>
                  <option value="Germany">Germany</option>
                  <option value="Ghana">Ghana</option>
                  <option value="Greece">Greece</option>
                  <option value="Grenada">Grenada</option>
                  <option value="Guatemala">Guatemala</option>
                  <option value="Guinea">Guinea</option>
                  <option value="Guinea-Bissau">Guinea-Bissau</option>
                  <option value="Guyana">Guyana</option>
                  <option value="Haiti">Haiti</option>
                  <option value="Honduras">Honduras</option>
                  <option value="Hungary">Hungary</option>
                  <option value="Iceland">Iceland</option>
                  <option value="India">India</option>
                  <option value="Indonesia">Indonesia</option>
                  <option value="Iran">Iran</option>
                  <option value="Iraq">Iraq</option>
                  <option value="Ireland">Ireland</option>
                  <option value="Israel">Israel</option>
                  <option value="Italy">Italy</option>
                  <option value="Jamaica">Jamaica</option>
                  <option value="Japan">Japan</option>
                  <option value="Jordan">Jordan</option>
                  <option value="Kazakhstan">Kazakhstan</option>
                  <option value="Kenya">Kenya</option>
                  <option value="Kiribati">Kiribati</option>
                  <option value="Kosovo">Kosovo</option>
                  <option value="Kuwait">Kuwait</option>
                  <option value="Kyrgyzstan">Kyrgyzstan</option>
                  <option value="Laos">Laos</option>
                  <option value="Latvia">Latvia</option>
                  <option value="Lebanon">Lebanon</option>
                  <option value="Lesotho">Lesotho</option>
                  <option value="Liberia">Liberia</option>
                  <option value="Libya">Libya</option>
                  <option value="Liechtenstein">Liechtenstein</option>
                  <option value="Lithuania">Lithuania</option>
                  <option value="Luxembourg">Luxembourg</option>
                  <option value="Madagascar">Madagascar</option>
                  <option value="Malawi">Malawi</option>
                  <option value="Malaysia">Malaysia</option>
                  <option value="Maldives">Maldives</option>
                  <option value="Mali">Mali</option>
                  <option value="Malta">Malta</option>
                  <option value="Marshall Islands">Marshall Islands</option>
                  <option value="Mauritania">Mauritania</option>
                  <option value="Mauritius">Mauritius</option>
                  <option value="Mexico">Mexico</option>
                  <option value="Micronesia">Micronesia</option>
                  <option value="Moldova">Moldova</option>
                  <option value="Monaco">Monaco</option>
                  <option value="Mongolia">Mongolia</option>
                  <option value="Montenegro">Montenegro</option>
                  <option value="Morocco">Morocco</option>
                  <option value="Mozambique">Mozambique</option>
                  <option value="Myanmar">Myanmar</option>
                  <option value="Namibia">Namibia</option>
                  <option value="Nauru">Nauru</option>
                  <option value="Nepal">Nepal</option>
                  <option value="Netherlands">Netherlands</option>
                  <option value="New Zealand">New Zealand</option>
                  <option value="Nicaragua">Nicaragua</option>
                  <option value="Niger">Niger</option>
                  <option value="Nigeria">Nigeria</option>
                  <option value="North Korea">North Korea</option>
                  <option value="North Macedonia">North Macedonia</option>
                  <option value="Norway">Norway</option>
                  <option value="Oman">Oman</option>
                  <option value="Pakistan">Pakistan</option>
                  <option value="Palau">Palau</option>
                  <option value="Palestine">Palestine</option>
                  <option value="Panama">Panama</option>
                  <option value="Papua New Guinea">Papua New Guinea</option>
                  <option value="Paraguay">Paraguay</option>
                  <option value="Peru">Peru</option>
                  <option value="Philippines">Philippines</option>
                  <option value="Poland">Poland</option>
                  <option value="Portugal">Portugal</option>
                  <option value="Qatar">Qatar</option>
                  <option value="Romania">Romania</option>
                  <option value="Russia">Russia</option>
                  <option value="Rwanda">Rwanda</option>
                  <option value="Saint Kitts and Nevis">Saint Kitts and Nevis</option>
                  <option value="Saint Lucia">Saint Lucia</option>
                  <option value="Saint Vincent and the Grenadines">Saint Vincent and the Grenadines</option>
                  <option value="Samoa">Samoa</option>
                  <option value="San Marino">San Marino</option>
                  <option value="Sao Tome and Principe">Sao Tome and Principe</option>
                  <option value="Saudi Arabia">Saudi Arabia</option>
                  <option value="Senegal">Senegal</option>
                  <option value="Serbia">Serbia</option>
                  <option value="Seychelles">Seychelles</option>
                  <option value="Sierra Leone">Sierra Leone</option>
                  <option value="Singapore">Singapore</option>
                  <option value="Slovakia">Slovakia</option>
                  <option value="Slovenia">Slovenia</option>
                  <option value="Solomon Islands">Solomon Islands</option>
                  <option value="Somalia">Somalia</option>
                  <option value="South Africa">South Africa</option>
                  <option value="South Korea">South Korea</option>
                  <option value="South Sudan">South Sudan</option>
                  <option value="Spain">Spain</option>
                  <option value="Sri Lanka">Sri Lanka</option>
                  <option value="Sudan">Sudan</option>
                  <option value="Suriname">Suriname</option>
                  <option value="Sweden">Sweden</option>
                  <option value="Switzerland">Switzerland</option>
                  <option value="Syria">Syria</option>
                  <option value="Taiwan">Taiwan</option>
                  <option value="Tajikistan">Tajikistan</option>
                  <option value="Tanzania">Tanzania</option>
                  <option value="Thailand">Thailand</option>
                  <option value="Timor-Leste">Timor-Leste</option>
                  <option value="Togo">Togo</option>
                  <option value="Tonga">Tonga</option>
                  <option value="Trinidad and Tobago">Trinidad and Tobago</option>
                  <option value="Tunisia">Tunisia</option>
                  <option value="Turkey">Turkey</option>
                  <option value="Turkmenistan">Turkmenistan</option>
                  <option value="Tuvalu">Tuvalu</option>
                  <option value="Uganda">Uganda</option>
                  <option value="Ukraine">Ukraine</option>
                  <option value="United Arab Emirates">United Arab Emirates</option>
                  <option value="United Kingdom">United Kingdom</option>
                  <option value="United States">United States</option>
                  <option value="Uruguay">Uruguay</option>
                  <option value="Uzbekistan">Uzbekistan</option>
                  <option value="Vanuatu">Vanuatu</option>
                  <option value="Vatican City">Vatican City</option>
                  <option value="Venezuela">Venezuela</option>
                  <option value="Vietnam">Vietnam</option>
                  <option value="Yemen">Yemen</option>
                  <option value="Zambia">Zambia</option>
                  <option value="Zimbabwe">Zimbabwe</option>
                </select>
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
          {/* Agency Information */}
          <div className="mt-10">
            <div className="text-lg font-bold mb-4 text-orange-600 border-l-4 border-orange-400 pl-3">Agency Information</div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Contact Number</label>
                <div className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm bg-gray-100 text-gray-700">+977-9841000000</div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                <div className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm bg-gray-100 text-gray-700">agency@example.com</div>
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

    switch (addOnType) {
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
      case 'specialAssistance':
        updatedPassengers[passengerIndex].specialAssistance = value;
        break;
      case 'needWheelchair':
        updatedPassengers[passengerIndex].needWheelchair = value;
        updatedPassengers[passengerIndex].specialAssistance = value;
        break;
      case 'hasOwnWheelchair':
        updatedPassengers[passengerIndex].hasOwnWheelchair = value;
        break;
      case 'wheelchairType':
        updatedPassengers[passengerIndex].wheelchairType = value;
        break;
      case 'pwdId':
        updatedPassengers[passengerIndex].pwdId = value;
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

          {/* Premium Meals */}
          <div className="bg-white rounded-xl border p-4 sm:p-6">
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-4 flex-1">
                <svg className="w-6 h-6 text-gray-600 mt-1" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M3 1a1 1 0 011 1v1a1 1 0 001 1h12a1 1 0 001-1V2a1 1 0 011-1h2a1 1 0 011 1v2.576l-.64.533A4.486 4.486 0 0017 7.5V13a2 2 0 01-2 2h-2a2 2 0 01-2-2v-1h-2v1a2 2 0 01-2 2H5a2 2 0 01-2-2V7.5c0-.648.225-1.277.64-1.891L3 5.576V2a1 1 0 011-1h2z" />
                  <path d="M4 6.5a1 1 0 011-1h10a1 1 0 011 1v1a1 1 0 01-1 1H5a1 1 0 01-1-1v-1z" />
                </svg>
                <div className="flex-1">
                  <h4 className="text-base sm:text-lg font-medium text-gray-900 mb-1">Premium Meals</h4>
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
                  setSelectedPassengerForMeal(passengerIndex);
                  setIsMealSelectionOpen(true);
                  // Trigger animation after a brief delay to ensure the panel is rendered
                  requestAnimationFrame(() => {
                    requestAnimationFrame(() => {
                      setIsMealPanelAnimating(true);
                    });
                  });
                }}
                className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg font-medium text-sm sm:text-base ml-4 transition-colors"
              >
                Request Meal
              </button>
            </div>
          </div>

          {/* Special Assistance */}
          <div className="bg-white rounded-xl border p-4 sm:p-6">
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-4 flex-1">
                <svg className="w-6 h-6 text-red-500 mt-1" fill="currentColor" viewBox="0 0 24 24">
                  <circle cx="12" cy="5" r="2" />
                  <rect x="10" y="8" width="4" height="5" rx="0.5" />
                  <path d="M10 13h4v4h-4z" />
                  <rect x="7.5" y="17" width="9" height="1.5" />
                  <circle cx="8" cy="19" r="2" />
                  <circle cx="16" cy="19" r="2" />
                  <circle cx="8" cy="19" r="1" fill="white" opacity="0.3" />
                  <circle cx="16" cy="19" r="1" fill="white" opacity="0.3" />
                </svg>
                <div className="flex-1">
                  <h4 className="text-base sm:text-lg font-medium text-gray-900 mb-1">Special assistance</h4>
                  <p className="text-xs sm:text-sm text-gray-600">Additional support and for individuals with specific needs. <a href="#" className="text-orange-500 hover:underline">Read more</a></p>
                </div>
              </div>
              <button
                onClick={() => {
                  setSelectedPassengerForAssistance(passengerIndex);
                  setIsSpecialAssistanceOpen(true);
                  // Trigger animation after a brief delay to ensure the panel is rendered
                  requestAnimationFrame(() => {
                    requestAnimationFrame(() => {
                      setIsSpecialAssistanceAnimating(true);
                    });
                  });
                }}
                className={`px-4 py-2 rounded-lg font-medium text-sm sm:text-base ml-4 transition-colors ${passenger.specialAssistance || passenger.needWheelchair
                  ? 'bg-orange-500 hover:bg-orange-600 text-white'
                  : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                  }`}
              >
                {(passenger.specialAssistance || passenger.needWheelchair) ? 'Requested' : 'Request'}
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
              value="mobileBanking"
              className="text-orange-500 focus:ring-orange-500"
              checked={selectedPaymentMethod === 'mobileBanking'}
              onChange={() => handlePaymentMethodChange('mobileBanking')}
            />
            <span className="font-medium text-gray-900 text-sm sm:text-base">Mobile Banking</span>
          </label>

          {selectedPaymentMethod === 'mobileBanking' && (
            <div className="ml-6 sm:ml-8 mt-2 grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
              {[
                { name: 'Nabil Smart', initials: 'NS', bg: 'bg-blue-100', text: 'text-blue-700' },
                { name: 'NIC Asia', initials: 'NA', bg: 'bg-red-100', text: 'text-red-700' },
                { name: 'Global IME', initials: 'GI', bg: 'bg-indigo-100', text: 'text-indigo-700' },
                { name: 'Sanima Sajilo', initials: 'SS', bg: 'bg-green-100', text: 'text-green-700' }
              ].map(bank => (
                <div key={bank.name} className="flex items-center space-x-2 bg-gray-50 border border-gray-200 rounded-lg px-2 py-1.5 sm:px-3 sm:py-2">
                  <div className={`flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-full font-semibold ${bank.bg} ${bank.text}`}>
                    {bank.initials}
                  </div>
                  <span className="text-xs sm:text-sm font-medium text-gray-700">{bank.name}</span>
                </div>
              ))}
            </div>
          )}

          <label className="flex items-center space-x-2 sm:space-x-3 p-2 sm:p-3 border border-gray-200 rounded-lg cursor-pointer">
            <input
              type="radio"
              name="paymentMethod"
              value="wallet"
              className="text-orange-500 focus:ring-orange-500"
              checked={selectedPaymentMethod === 'wallet'}
              onChange={() => handlePaymentMethodChange('wallet')}
            />
            <span className="font-medium text-gray-900 text-sm sm:text-base">Digital Wallet</span>
          </label>

          {selectedPaymentMethod === 'wallet' && (
            <div className="ml-6 sm:ml-8 mt-2 grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3">
              {[
                { name: 'eSewa', initials: 'eS', bg: 'bg-green-100', text: 'text-green-700' },
                { name: 'Khalti', initials: 'Kh', bg: 'bg-purple-100', text: 'text-purple-700' }
              ].map(wallet => (
                <div key={wallet.name} className="flex items-center space-x-2 bg-gray-50 border border-gray-200 rounded-lg px-2 py-1.5 sm:px-3 sm:py-2">
                  <div className={`flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-full font-semibold ${wallet.bg} ${wallet.text}`}>
                    {wallet.initials}
                  </div>
                  <span className="text-xs sm:text-sm font-medium text-gray-700">{wallet.name}</span>
                </div>
              ))}
            </div>
          )}

          <label className="flex items-center space-x-2 sm:space-x-3 p-2 sm:p-3 border border-gray-200 rounded-lg cursor-pointer">
            <input
              type="radio"
              name="paymentMethod"
              value="credit"
              className="text-orange-500 focus:ring-orange-500"
              checked={selectedPaymentMethod === 'credit'}
              onChange={() => handlePaymentMethodChange('credit')}
            />
            <span className="font-medium text-gray-900 text-sm sm:text-base">Credit/Debit Card</span>
          </label>
        </div>
      </div>

      {/* Card Details */}
      {selectedPaymentMethod === 'credit' && (
        <>
          <div className="bg-white rounded-xl border p-4 sm:p-6 space-y-4">
            <div>
              <h4 className="text-base sm:text-lg font-medium text-gray-900 mb-3 sm:mb-4">Supported Cards</h4>
              <div className="flex items-center space-x-3 sm:space-x-4">
                {[
                  { name: 'Visa', initials: 'V', bg: 'bg-blue-100', text: 'text-blue-700' },
                  { name: 'Mastercard', initials: 'M', bg: 'bg-red-100', text: 'text-red-700' },
                  { name: 'American Express', initials: 'AmEx', bg: 'bg-indigo-100', text: 'text-indigo-700' },
                  { name: 'UnionPay', initials: 'UP', bg: 'bg-green-100', text: 'text-green-700' }
                ].map(card => (
                  <div key={card.name} className="flex items-center space-x-2 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2">
                    <div className={`flex h-9 w-9 items-center justify-center rounded-full font-semibold text-sm ${card.bg} ${card.text}`}>
                      {card.initials}
                    </div>
                    <span className="text-xs sm:text-sm font-medium text-gray-700">{card.name}</span>
                  </div>
                ))}
              </div>
            </div>

            <div>
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
        </>
      )}
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

  // Loading state
  if (isLoadingFlight) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mb-4"></div>
          <p className="text-gray-600">Loading flight details...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !flight) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error || 'Flight not found'}</p>
          <button
            onClick={() => navigate('/flight-search')}
            className="bg-orange-500 text-white px-6 py-2 rounded-lg hover:bg-orange-600"
          >
            Back to Search
          </button>
        </div>
      </div>
    );
  }

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
                      disabled={isSubmitting}
                      className="w-full bg-green-600 text-white px-3 sm:px-4 py-2 sm:py-3 rounded-lg hover:bg-green-700 transition-colors text-sm sm:text-base font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isSubmitting ? 'Processing...' : 'Confirm Booking'}
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
            className={`fixed top-0 right-0 h-full w-full sm:w-[480px] lg:w-[520px] bg-white shadow-2xl z-[51] transform transition-transform duration-300 ease-out overflow-y-auto translate-x-full ${isSeatPanelAnimating ? '!translate-x-0' : ''
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
                                  className={`w-10 h-10 sm:w-11 sm:h-11 rounded-md text-xs font-semibold transition-all flex items-center justify-center border ${isSelected
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
                                  className={`w-10 h-10 sm:w-11 sm:h-11 rounded-md text-xs font-semibold transition-all relative flex items-center justify-center border ${isSelected
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
                                  className={`w-10 h-10 sm:w-11 sm:h-11 rounded-md text-xs font-semibold transition-all relative flex items-center justify-center border ${isSelected
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
            className={`fixed top-0 right-0 h-full w-full sm:w-[480px] lg:w-[520px] bg-white shadow-2xl z-[51] transform transition-transform duration-300 ease-out overflow-y-auto translate-x-full ${isBaggagePanelAnimating ? '!translate-x-0' : ''
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
                        <div className="flex-1 py-3 px-4 border-2 border-green-500 bg-green-50 rounded-lg text-sm font-medium">
                          <div className="font-semibold text-green-700">7 kg</div>
                          <div className="text-xs mt-1 text-green-700">Included</div>
                        </div>
                        <span className="text-gray-400 text-2xl">+</span>
                        <div className="flex-1 py-3 px-4 border-2 border-green-500 bg-green-50 rounded-lg text-sm font-medium">
                          <div className="font-semibold text-green-700">7 kg</div>
                          <div className="text-xs mt-1 text-green-700">NPR 3,515.00</div>
                        </div>
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
                            className={`py-3 px-4 border-2 rounded-lg text-sm font-medium transition-all ${passenger?.checkedBaggage === option.value
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

      {/* Meal Selection Slide-out Panel */}
      {isMealSelectionOpen && selectedPassengerForMeal !== null && (
        <>
          {/* Transparent dark overlay backdrop */}
          <div
            className="fixed inset-0 z-[50] transition-opacity duration-300"
            style={{ backgroundColor: 'rgba(0, 0, 0, 0.6)' }}
            onClick={() => {
              setIsMealPanelAnimating(false);
              setTimeout(() => {
                setIsMealSelectionOpen(false);
                setSelectedPassengerForMeal(null);
              }, 300);
            }}
          ></div>
          <div
            className={`fixed top-0 right-0 h-full w-full sm:w-[480px] lg:w-[520px] bg-white shadow-2xl z-[51] transform transition-transform duration-300 ease-out overflow-y-auto translate-x-full ${isMealPanelAnimating ? '!translate-x-0' : ''
              }`}
            onClick={(e) => e.stopPropagation()}
          >
            {(() => {
              const passenger = bookingData.passengers[selectedPassengerForMeal];

              const meals = [
                { id: 'vegetarian', name: 'Vegetarian Meal', description: 'Delicious vegetarian options', price: 800 },
                { id: 'non-vegetarian', name: 'Non-Vegetarian Meal', description: 'Premium meat options', price: 800 },
                { id: 'kids', name: 'Kids Meal', description: 'Kid-friendly meals', price: 800 },
                { id: 'celebration', name: 'Celebration Cake', description: 'Special celebration cake', price: 1500 },
                { id: 'halal', name: 'Halal Meal', description: 'Halal-certified meals', price: 800 },
                { id: 'kosher', name: 'Kosher Meal', description: 'Kosher-certified meals', price: 800 },
                { id: 'vegan', name: 'Vegan Meal', description: 'Plant-based meals', price: 800 },
                { id: 'diabetic', name: 'Diabetic Meal', description: 'Low-sugar meal options', price: 800 }
              ];

              const totalMealPrice = passenger?.selectedMeals.reduce((sum, mealName) => {
                const meal = meals.find(m => m.name === mealName);
                return sum + (meal ? meal.price : 800);
              }, 0) || 0;

              return (
                <div className="flex flex-col h-full">
                  {/* Header */}
                  <div className="sticky top-0 bg-white border-b border-gray-200 z-10 p-4 sm:p-5">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-2">
                        <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 12L3.269 3.125A59.769 59.769 0 0121.485 12 59.768 59.768 0 013.27 20.875L5.999 12zm0 0h7.5" />
                        </svg>
                        <span className="text-sm font-medium text-gray-700">KTM - NRT</span>
                      </div>
                      <button
                        onClick={() => {
                          setIsMealPanelAnimating(false);
                          setTimeout(() => {
                            setIsMealSelectionOpen(false);
                            setSelectedPassengerForMeal(null);
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
                        <span>Adult {selectedPassengerForMeal + 1}</span>
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
                      <span className="text-sm font-medium text-gray-900">Adult {selectedPassengerForMeal + 1}</span>
                    </div>

                    {/* Info Message */}
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-6">
                      <p className="text-xs text-blue-800">
                        Each guest can pre-book up to 2 meals per flight. Select your preferred meals below.
                      </p>
                    </div>

                    {/* Selected Meals Display */}
                    {passenger?.selectedMeals.length > 0 && (
                      <div className="mb-6">
                        <h3 className="text-sm font-semibold text-gray-900 mb-3">Selected Meals ({passenger.selectedMeals.length}/2)</h3>
                        <div className="flex flex-wrap gap-2">
                          {passenger.selectedMeals.map((mealName, idx) => {
                            const meal = meals.find(m => m.name === mealName);
                            return (
                              <div key={idx} className="bg-green-100 border border-green-300 rounded-lg px-3 py-2 flex items-center justify-between">
                                <span className="text-sm font-medium text-green-800">{mealName}</span>
                                <button
                                  onClick={() => handlePassengerAddOnChange(selectedPassengerForMeal, 'meal', mealName)}
                                  className="ml-2 text-green-600 hover:text-green-800"
                                >
                                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                  </svg>
                                </button>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {/* Available Meals */}
                    <div>
                      <h3 className="text-base font-semibold text-gray-900 mb-4">Available Meals</h3>
                      <div className="space-y-3">
                        {meals.map((meal) => {
                          const isSelected = passenger?.selectedMeals.includes(meal.name);
                          const isDisabled = !isSelected && passenger?.selectedMeals.length >= 2;

                          return (
                            <button
                              key={meal.id}
                              onClick={() => !isDisabled && handlePassengerAddOnChange(selectedPassengerForMeal, 'meal', meal.name)}
                              disabled={isDisabled}
                              className={`w-full p-4 border-2 rounded-lg text-left transition-all ${isSelected
                                ? 'border-green-500 bg-green-50'
                                : isDisabled
                                  ? 'border-gray-200 bg-gray-50 opacity-50 cursor-not-allowed'
                                  : 'border-gray-300 bg-white hover:border-orange-400 hover:bg-orange-50'
                                }`}
                            >
                              <div className="flex items-start justify-between">
                                <div className="flex-1">
                                  <div className="flex items-center space-x-2">
                                    <h4 className="text-sm font-semibold text-gray-900">{meal.name}</h4>
                                    {isSelected && (
                                      <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                      </svg>
                                    )}
                                  </div>
                                  <p className="text-xs text-gray-600 mt-1">{meal.description}</p>
                                </div>
                                <div className="ml-4 text-right">
                                  <div className="text-sm font-semibold text-gray-900">NPR {meal.price.toLocaleString('en-IN')}</div>
                                </div>
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="sticky bottom-0 bg-white border-t border-gray-200 p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-2xl font-bold text-gray-900">NPR {totalMealPrice.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                        <p className="text-xs text-gray-600 mt-1">
                          {passenger?.selectedMeals.length || 0} of 2 meals selected
                        </p>
                      </div>
                      <button
                        onClick={() => {
                          setIsMealPanelAnimating(false);
                          setTimeout(() => {
                            setIsMealSelectionOpen(false);
                            setSelectedPassengerForMeal(null);
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

      {/* Special Assistance Slide-out Panel */}
      {isSpecialAssistanceOpen && selectedPassengerForAssistance !== null && (
        <>
          {/* Transparent dark overlay backdrop */}
          <div
            className="fixed inset-0 z-[50] transition-opacity duration-300"
            style={{ backgroundColor: 'rgba(0, 0, 0, 0.6)' }}
            onClick={() => {
              setIsSpecialAssistanceAnimating(false);
              setTimeout(() => {
                setIsSpecialAssistanceOpen(false);
                setSelectedPassengerForAssistance(null);
              }, 300);
            }}
          ></div>
          <div
            className={`fixed top-0 right-0 h-full w-full sm:w-[480px] lg:w-[520px] bg-white shadow-2xl z-[51] transform transition-transform duration-300 ease-out overflow-y-auto translate-x-full ${isSpecialAssistanceAnimating ? '!translate-x-0' : ''
              }`}
            onClick={(e) => e.stopPropagation()}
          >
            {(() => {
              const passenger = bookingData.passengers[selectedPassengerForAssistance];

              const wheelchairOptions = [
                {
                  id: 'unable-ascend-descend',
                  label: 'Unable to ascend and descend steps',
                  price: 0,
                  available: null
                },
                {
                  id: 'unable-walk-long',
                  label: 'Unable to walk long distance',
                  price: 0,
                  available: null
                },
                {
                  id: 'paralysed-upper-lower',
                  label: 'Paralysed on lower and upper limbs',
                  price: 0,
                  available: 2
                },
                {
                  id: 'paralysed-lower',
                  label: 'Paralysed on lower limbs',
                  price: 0,
                  available: 2
                }
              ];

              return (
                <div className="flex flex-col h-full">
                  {/* Header */}
                  <div className="sticky top-0 bg-white border-b border-gray-200 z-10 p-4 sm:p-5">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-2">
                        <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 12L3.269 3.125A59.769 59.769 0 0121.485 12 59.768 59.768 0 013.27 20.875L5.999 12zm0 0h7.5" />
                        </svg>
                        <span className="text-sm font-medium text-gray-700">KTM - NRT</span>
                      </div>
                      <button
                        onClick={() => {
                          setIsSpecialAssistanceAnimating(false);
                          setTimeout(() => {
                            setIsSpecialAssistanceOpen(false);
                            setSelectedPassengerForAssistance(null);
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
                        <span>Adult {selectedPassengerForAssistance + 1}</span>
                        <svg className="w-4 h-4 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
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
                      <span className="text-sm font-medium text-gray-900">Adult {selectedPassengerForAssistance + 1}</span>
                    </div>

                    {/* I have my own wheelchair dropdown */}
                    <div className="mb-6">
                      <label className="block text-sm font-medium text-gray-700 mb-2">I have my own wheelchair</label>
                      <select
                        value={passenger?.hasOwnWheelchair ? 'yes' : 'no'}
                        onChange={(e) => handlePassengerAddOnChange(selectedPassengerForAssistance, 'hasOwnWheelchair', e.target.value === 'yes')}
                        className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                      >
                        <option value="no">No</option>
                        <option value="yes">Yes</option>
                      </select>
                    </div>

                    {/* Need a wheelchair checkbox */}
                    <div className="mb-6">
                      <label className="flex items-center justify-between p-4 border-2 rounded-lg cursor-pointer transition-all hover:bg-gray-50"
                        style={{ borderColor: passenger?.needWheelchair ? '#10b981' : '#e5e7eb' }}
                      >
                        <span className="text-sm font-medium text-gray-900">need a wheelchair</span>
                        {passenger?.needWheelchair && (
                          <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                        )}
                        <input
                          type="checkbox"
                          checked={passenger?.needWheelchair || false}
                          onChange={(e) => handlePassengerAddOnChange(selectedPassengerForAssistance, 'needWheelchair', e.target.checked)}
                          className="sr-only"
                        />
                      </label>
                    </div>

                    {/* Wheelchair type options - only show if needWheelchair is true */}
                    {passenger?.needWheelchair && (
                      <div className="mb-6">
                        <div className="space-y-3">
                          {wheelchairOptions.map((option) => {
                            const isSelected = passenger?.wheelchairType === option.id;
                            return (
                              <label
                                key={option.id}
                                className={`flex items-start p-4 border-2 rounded-lg cursor-pointer transition-all ${isSelected
                                    ? 'border-blue-500 bg-blue-50'
                                    : 'border-gray-300 hover:border-gray-400'
                                  }`}
                              >
                                <input
                                  type="radio"
                                  name={`wheelchairType-${selectedPassengerForAssistance}`}
                                  value={option.id}
                                  checked={isSelected}
                                  onChange={(e) => handlePassengerAddOnChange(selectedPassengerForAssistance, 'wheelchairType', e.target.value)}
                                  className="mt-1 mr-3 text-blue-500 focus:ring-blue-500"
                                />
                                <div className="flex-1">
                                  <div className="flex items-center justify-between mb-1">
                                    <span className="text-sm font-medium text-gray-900">{option.label}</span>
                                    {option.available !== null && (
                                      <span className="bg-green-100 text-green-700 text-xs font-medium px-2 py-1 rounded">
                                        {option.available} available
                                      </span>
                                    )}
                                  </div>
                                  <div className="text-xs text-gray-600">NPR {option.price.toFixed(2)}</div>
                                </div>
                              </label>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {/* PWD ID Section */}
                    <div className="mb-6">
                      <div className="flex items-center space-x-2 mb-2">
                        <h3 className="text-sm font-medium text-gray-900">Enter your PWD ID (Optional)</h3>
                        <div className="relative group">
                          <svg className="w-4 h-4 text-gray-400 cursor-help" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                          </svg>
                          <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 hidden group-hover:block w-48 p-2 bg-gray-800 text-white text-xs rounded shadow-lg z-10">
                            We'll waive the wheelchair fee if you have a PWD ID.
                          </div>
                        </div>
                      </div>
                      <p className="text-xs text-gray-600 mb-3">We'll waive the wheelchair fee if you have a PWD ID.</p>
                      <input
                        type="text"
                        value={passenger?.pwdId || ''}
                        onChange={(e) => handlePassengerAddOnChange(selectedPassengerForAssistance, 'pwdId', e.target.value)}
                        placeholder="Identification number"
                        className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                      />
                    </div>

                    {/* Disclaimer */}
                    <div className="mb-6">
                      <p className="text-xs text-gray-500">
                        Our wheelchairs are limited and is based on first come, first serve basis in the airport.
                      </p>
                      <p className="text-xs text-gray-500 mt-2">
                        For additional needs, contact agency.
                      </p>
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="sticky bottom-0 bg-white border-t border-gray-200 p-4">
                    <button
                      onClick={() => {
                        setIsSpecialAssistanceAnimating(false);
                        setTimeout(() => {
                          setIsSpecialAssistanceOpen(false);
                          setSelectedPassengerForAssistance(null);
                        }, 300);
                      }}
                      className="w-full bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-medium text-base transition-colors"
                    >
                      Done
                    </button>
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
