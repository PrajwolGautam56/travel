import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import BookTripTab from './BookTripTab';
import ManageBookingTab from './ManageBookingTab';
import FlightStatusTab from './FlightStatusTab';
import HelicopterBookingTab from './HelicopterBookingTab';

const SubNavigation = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('Book Trip');
    const subNavRef = useRef(null);
    const [formData, setFormData] = useState({
        from: '',
        to: '',
        departureDate: '',
        returnDate: '',
        class: 'Economy',
        passengers: '1 Adult',
        passengerCounts: { adults: 1, children: 0, infants: 0 },
        tripType: 'oneway',
        currency: 'USD',
        bookingReference: '',
        eTicketNumber: '',
        lastName: '',
        flightNumber: '',
        departureCity: '',
        arrivalCity: '',
        date: '',
        // Helicopter booking fields
        helicopterServiceType: '',
        helicopterPickup: '',
        helicopterDropoff: '',
        helicopterDate: '',
        helicopterTime: '',
        helicopterPassengers: 1,
        helicopterSpecialRequirements: ''
    });

    // Handle scroll to subnavigation when inputs are focused
    useEffect(() => {
        const handleInputFocus = (event) => {
            // Check if the focused element is an input, select, or textarea within the subnavigation
            if (subNavRef.current && subNavRef.current.contains(event.target)) {
                console.log('Input focused, scrolling to subnavigation');

                // Use a small delay to ensure the element is properly focused
                setTimeout(() => {
                    if (subNavRef.current) {
                        // Get the current scroll position
                        const currentScrollTop = window.pageYOffset || document.documentElement.scrollTop;
                        const subNavTop = subNavRef.current.offsetTop;

                        // Try different approaches to position subnavigation properly
                        // Approach 1: Try to find main navigation and calculate gap
                        const mainNav = document.querySelector('nav') || document.querySelector('header') || document.querySelector('.navbar');
                        const mainNavHeight = mainNav ? mainNav.offsetHeight : 80;

                        // Approach 2: Position subnavigation at a fixed distance from top of viewport
                        const targetScrollPosition = subNavTop - 0; // No gap - positioned at the very top

                        console.log('Debug scroll values:', {
                            currentScrollTop,
                            subNavTop,
                            mainNavHeight,
                            mainNavElement: mainNav,
                            targetScrollPosition,
                            gap: subNavTop - currentScrollTop - 100
                        });

                        // Always scroll to ensure visibility
                        window.scrollTo({
                            top: targetScrollPosition,
                            behavior: 'smooth'
                        });
                    }
                }, 100);
            }
        };

        // Add event listener for focus events
        document.addEventListener('focusin', handleInputFocus);
        document.addEventListener('click', handleInputFocus); // Also listen for clicks

        return () => {
            document.removeEventListener('focusin', handleInputFocus);
            document.removeEventListener('click', handleInputFocus);
        };
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleTabClick = (tabName) => {
        console.log('Tab clicked:', tabName);
        setActiveTab(tabName);
        // Close any open dropdowns when switching tabs
        const event = new CustomEvent('closeDropdowns');
        document.dispatchEvent(event);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Form data:', formData);

        switch (activeTab) {
            case 'Book Trip':
                // Extract airport code from input (format: "KTM - Kathmandu" or just "KTM")
                const extractAirportCode = (input) => {
                    if (!input) return '';
                    // If input contains " - ", extract the code before it
                    if (typeof input === 'string' && input.includes(' - ')) {
                        return input.split(' - ')[0].trim().toUpperCase();
                    }
                    // Otherwise, assume it's already a code or extract first 3 uppercase letters
                    const match = input.toString().match(/^([A-Z]{3})/);
                    return match ? match[1] : input.toString().trim().toUpperCase();
                };

                // Validate required fields
                if (!formData.from || !formData.to || !formData.departureDate) {
                    alert('Please fill in From, To, and Departure Date fields');
                    return;
                }

                // Get passenger counts from BookTripTab if available
                const passengerCounts = formData.passengerCounts || { adults: 1, children: 0, infants: 0 };
                const searchData = {
                    from: extractAirportCode(formData.from),
                    to: extractAirportCode(formData.to),
                    departureDate: formData.departureDate,
                    returnDate: formData.returnDate || null,
                    tripType: formData.returnDate ? 'return' : 'oneway',
                    passengers: passengerCounts,
                    class: formData.class || 'economy',
                    currency: formData.currency || 'USD',
                    region: 'US'
                };
                console.log('Navigating with searchData:', searchData);
                // Navigate to flight search page with form data
                navigate('/flight-search', { state: { searchData } });
                break;
            case 'Helicopter Booking':
                // Navigate to helicopter search page with form data
                navigate('/helicopter-search', { state: { searchData: formData } });
                break;
            case 'Manage Booking':
                // Handle manage booking
                console.log('Managing booking...');
                break;
            case 'Flight Status':
                // Handle flight status
                console.log('Checking flight status...');
                break;
            default:
                break;
        }
    };

    const navigationItems = [
        'Book Trip',
        'Helicopter Booking',
        'Manage Booking',
        'Flight Status'
    ];

    const renderContentSlim = () => {
        switch (activeTab) {
            case 'Book Trip':
                return <BookTripTab formData={formData} onChange={handleInputChange} />;
            case 'Helicopter Booking':
                return <HelicopterBookingTab formData={formData} onChange={handleInputChange} />;
            case 'Manage Booking':
                return <ManageBookingTab formData={formData} onChange={handleInputChange} />;
            case 'Flight Status':
                return <FlightStatusTab formData={formData} onChange={handleInputChange} />;
            default:
                return null;
        }
    };

    return (
        <div ref={subNavRef} className="bg-white/95 backdrop-blur-lg rounded-2xl sm:rounded-3xl shadow-2xl border border-white/20 p-4 sm:p-5 md:p-6 w-full max-w-6xl mx-auto">

            {/* Main Navigation Tabs */}
            <div className="flex flex-wrap gap-2 mb-4 sm:mb-5 overflow-x-auto scrollbar-hide relative z-10 justify-center">
                {navigationItems.map((item) => (
                    <button
                        key={item}
                        onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            handleTabClick(item);
                        }}
                        onMouseEnter={() => console.log('Mouse enter:', item)}
                        className={`sub-nav-tab flex-1 px-2 sm:px-3 md:px-5 py-2 sm:py-2.5 text-xs sm:text-sm font-medium rounded-t-lg transition-all duration-300 whitespace-nowrap cursor-pointer relative z-20 ${activeTab === item
                            ? 'active bg-gradient-to-b from-white to-gray-50 text-gray-800 border-b-4 border-orange-500 shadow-sm font-semibold'
                            : 'bg-gradient-to-b from-gray-100 to-gray-200 text-gray-700 hover:from-gray-200 hover:to-gray-300 hover:shadow-md'
                            }`}
                    >
                        {item}
                    </button>
                ))}
            </div>

            {/* Dynamic Content Area */}
            <div className="min-h-[200px] sm:min-h-[240px]">
                <form onSubmit={handleSubmit}>
                    <div className="sub-nav-content">
                        {renderContentSlim()}
                    </div>
                </form>
            </div>
        </div>
    );
};

export default SubNavigation;
