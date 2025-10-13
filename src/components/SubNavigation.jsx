import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import BookTripTab from './BookTripTab';
import ManageBookingTab from './ManageBookingTab';
import FlightStatusTab from './FlightStatusTab';
import FlightScheduleTab from './FlightScheduleTab';

const SubNavigation = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('Book Trip');
    const subNavRef = useRef(null);
    const [formData, setFormData] = useState({
        from: 'Kathmandu',
        to: '',
        departureDate: '',
        returnDate: '',
        class: 'Economy',
        passengers: '1 Adult',
        bookingReference: '',
        eTicketNumber: '',
        lastName: '',
        flightNumber: '',
        departureCity: '',
        arrivalCity: '',
        date: ''
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
                // Navigate to flight search page with form data
                navigate('/flight-search', { state: { searchData: formData } });
                break;
            case 'Manage Booking':
                // Handle manage booking
                console.log('Managing booking...');
                break;
            case 'Flight Status':
                // Handle flight status
                console.log('Checking flight status...');
                break;
            case 'Flight Schedule':
                // Handle flight schedule
                console.log('Viewing flight schedule...');
                break;
            default:
                break;
        }
    };

    const navigationItems = [
        'Book Trip',
        'Manage Booking',
        'Flight Status',
        'Flight Schedule'
    ];

    const renderContentSlim = () => {
        switch (activeTab) {
            case 'Book Trip':
                return <BookTripTab formData={formData} onChange={handleInputChange} />;
            case 'Manage Booking':
                return <ManageBookingTab formData={formData} onChange={handleInputChange} />;
            case 'Flight Status':
                return <FlightStatusTab formData={formData} onChange={handleInputChange} />;
            case 'Flight Schedule':
                return <FlightScheduleTab formData={formData} onChange={handleInputChange} />;
            default:
                return null;
        }
    };

    return (
        <div ref={subNavRef} className="bg-white rounded-xl sm:rounded-2xl shadow-2xl p-3 sm:p-4 md:p-6 w-full max-w-6xl mx-auto">

            {/* Main Navigation Tabs */}
            <div className="flex flex-wrap gap-1 mb-3 sm:mb-4 overflow-x-auto scrollbar-hide relative z-10 justify-center">
                {navigationItems.map((item) => (
                    <button
                        key={item}
                        onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            handleTabClick(item);
                        }}
                        onMouseEnter={() => console.log('Mouse enter:', item)}
                        className={`sub-nav-tab flex-1 px-2 sm:px-3 md:px-5 py-2 sm:py-2.5 text-xs sm:text-sm font-medium rounded-t-lg transition-all duration-200 whitespace-nowrap cursor-pointer relative z-20 ${activeTab === item
                            ? 'active bg-white text-gray-800 border-b-2 border-orange-500'
                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
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
