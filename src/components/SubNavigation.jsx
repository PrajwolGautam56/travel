import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import BookTripTab from './BookTripTab';
import ManageBookingTab from './ManageBookingTab';
import StopoverTab from './StopoverTab';
import FlightStatusTab from './FlightStatusTab';
import FlightScheduleTab from './FlightScheduleTab';

const SubNavigation = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('Book Trip');
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
            case 'Stopover':
                // Handle stopover search
                console.log('Searching stopover flights...');
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
        'Stopover',
        'Manage Booking',
        'Flight Status',
        'Flight Schedule'
    ];

    const renderContentSlim = () => {
        switch (activeTab) {
            case 'Book Trip':
                return <BookTripTab formData={formData} onChange={handleInputChange} />;
            case 'Stopover':
                return <StopoverTab formData={formData} onChange={handleInputChange} />;
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
        <div className="bg-white rounded-xl sm:rounded-2xl shadow-2xl p-3 sm:p-4 md:p-6 w-full max-w-7xl mx-auto">

            {/* Main Navigation Tabs */}
            <div className="flex flex-wrap gap-1 mb-3 sm:mb-4 overflow-x-auto scrollbar-hide relative z-10">
                {navigationItems.map((item) => (
                    <button
                        key={item}
                        onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            handleTabClick(item);
                        }}
                        onMouseEnter={() => console.log('Mouse enter:', item)}
                        className={`sub-nav-tab px-2 sm:px-3 md:px-5 py-2 sm:py-2.5 text-xs sm:text-sm font-medium rounded-t-lg transition-all duration-200 whitespace-nowrap flex-shrink-0 cursor-pointer relative z-20 ${activeTab === item
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
