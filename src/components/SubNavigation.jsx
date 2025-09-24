import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import BookTripTab from './BookTripTab';
import ManageBookingTab from './ManageBookingTab';
import StopoverTab from './StopoverTab';
import FlightStatusTab from './FlightStatusTab';
import FlightScheduleTab from './FlightScheduleTab';

const SubNavigation = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('BOOK TRIP');
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

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Form data:', formData);

        switch (activeTab) {
            case 'BOOK TRIP':
                navigate('/flight-search', { state: { searchData: formData } });
                break;
            case 'STOPOVER':
                // Handle stopover search
                console.log('Searching stopover flights...');
                break;
            case 'MANAGE BOOKING':
                // Handle manage booking
                console.log('Managing booking...');
                break;
            case 'FLIGHT STATUS':
                // Handle flight status
                console.log('Checking flight status...');
                break;
            case 'FLIGHT SCHEDULE':
                // Handle flight schedule
                console.log('Viewing flight schedule...');
                break;
            default:
                break;
        }
    };

    const navigationItems = [
        'BOOK TRIP',
        'STOPOVER',
        'MANAGE BOOKING',
        'FLIGHT STATUS',
        'FLIGHT SCHEDULE'
    ];

    const renderContentSlim = () => {
        switch (activeTab) {
            case 'BOOK TRIP':
                return <BookTripTab formData={formData} onChange={handleInputChange} />;
            case 'STOPOVER':
                return <StopoverTab formData={formData} onChange={handleInputChange} />;
            case 'MANAGE BOOKING':
                return <ManageBookingTab formData={formData} onChange={handleInputChange} />;
            case 'FLIGHT STATUS':
                return <FlightStatusTab formData={formData} onChange={handleInputChange} />;
            case 'FLIGHT SCHEDULE':
                return <FlightScheduleTab formData={formData} onChange={handleInputChange} />;
            default:
                return null;
        }
    };

    return (
        <div className="bg-white rounded-xl sm:rounded-2xl shadow-2xl p-3 sm:p-4 md:p-6 w-full max-w-7xl mx-auto">

            {/* Main Navigation Tabs */}
            <div className="flex flex-wrap gap-1 mb-3 sm:mb-4 overflow-x-auto scrollbar-hide">
                {navigationItems.map((item) => (
                    <button
                        key={item}
                        onClick={() => setActiveTab(item)}
                        className={`sub-nav-tab px-2 sm:px-3 md:px-5 py-2 sm:py-2.5 text-xs sm:text-sm font-medium rounded-t-lg transition-all duration-200 whitespace-nowrap flex-shrink-0 ${activeTab === item
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
                    <div key={activeTab} className="sub-nav-content">
                        {renderContentSlim()}
                    </div>
                </form>
            </div>
        </div>
    );
};

export default SubNavigation;
