import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

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
            case 'MANAGE BOOKING':
                // Handle manage booking
                console.log('Managing booking...');
                break;
            case 'CHECK IN':
                // Handle check in
                console.log('Checking in...');
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
        'MANAGE BOOKING',
        'CHECK IN',
        'FLIGHT STATUS',
        'FLIGHT SCHEDULE'
    ];

    const renderContent = () => {
        switch (activeTab) {
            case 'BOOK TRIP':
                return (
                    <div className="space-y-6">
                        <div className="flex items-center justify-between">
                            <h3 className="text-xl font-semibold text-gray-800">Hi, where would you like to go?</h3>
                            <button className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
                                </svg>
                                <span>Discover with AI</span>
                            </button>
                        </div>

                        <div className="flex items-center justify-end">
                            <label className="flex items-center space-x-2">
                                <input type="checkbox" className="text-blue-600 rounded" />
                                <span className="text-sm text-gray-700">Express Booking - quicker, easier</span>
                            </label>
                        </div>

                        <div className="space-y-4">
                            <div className="flex space-x-4">
                                <label className="flex items-center space-x-2">
                                    <input type="radio" name="bookingType" value="book" defaultChecked className="text-orange-500" />
                                    <span className="text-sm text-gray-700">Book flights</span>
                                </label>
                                <label className="flex items-center space-x-2">
                                    <input type="radio" name="bookingType" value="redeem" className="text-orange-500" />
                                    <span className="text-sm text-gray-700">Redeem flights</span>
                                </label>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">FROM</label>
                                    <div className="relative">
                                        <input
                                            type="text"
                                            name="from"
                                            value={formData.from}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent form-input"
                                        />
                                        <div className="absolute right-2 top-1/2 transform -translate-y-1/2">
                                            <span className="bg-black text-white text-xs px-2 py-1 rounded">KTM</span>
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">TO</label>
                                    <div className="relative">
                                        <input
                                            type="text"
                                            name="to"
                                            value={formData.to}
                                            onChange={handleInputChange}
                                            placeholder="Where to?"
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent form-input"
                                        />
                                        <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex space-x-1">
                                            <svg className="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                                            </svg>
                                            <svg className="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM7 9a1 1 0 000 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
                                            </svg>
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">DEPART DATE</label>
                                    <div className="relative">
                                        <input
                                            type="date"
                                            name="departureDate"
                                            value={formData.departureDate}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent form-input"
                                        />
                                        <div className="absolute right-2 top-1/2 transform -translate-y-1/2">
                                            <svg className="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                                            </svg>
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">RETURN DATE</label>
                                    <div className="relative">
                                        <input
                                            type="date"
                                            name="returnDate"
                                            value={formData.returnDate}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent form-input"
                                        />
                                        <div className="absolute right-2 top-1/2 transform -translate-y-1/2">
                                            <svg className="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                                            </svg>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">CLASS</label>
                                    <select
                                        name="class"
                                        value={formData.class}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent form-input"
                                    >
                                        <option value="Economy">Economy</option>
                                        <option value="Premium Economy">Premium Economy</option>
                                        <option value="Business">Business</option>
                                        <option value="First">First Class</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">PASSENGERS</label>
                                    <select
                                        name="passengers"
                                        value={formData.passengers}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent form-input"
                                    >
                                        <option value="1 Adult">1 Adult</option>
                                        <option value="2 Adults">2 Adults</option>
                                        <option value="3 Adults">3 Adults</option>
                                        <option value="4 Adults">4 Adults</option>
                                        <option value="1 Adult, 1 Child">1 Adult, 1 Child</option>
                                        <option value="2 Adults, 1 Child">2 Adults, 1 Child</option>
                                    </select>
                                </div>

                                <div className="flex items-end">
                                    <button
                                        type="submit"
                                        className="w-full bg-blue-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors"
                                    >
                                        SEARCH
                                    </button>
                                </div>
                            </div>

                            <div className="flex items-center justify-between pt-4">
                                <div className="flex space-x-4">
                                    <a href="#" className="text-blue-600 hover:text-blue-700 text-sm">Apply promo code</a>
                                    <a href="#" className="text-blue-600 hover:text-blue-700 text-sm">Multi-city / Stopovers</a>
                                </div>
                            </div>
                        </div>

                        <div className="pt-6 border-t border-gray-200">
                            <h4 className="text-orange-500 font-medium mb-3">RECENT SEARCHES</h4>
                            <div className="flex items-center space-x-2">
                                <span className="text-sm text-gray-600">KTM - KRK - 17 Sep - 26 Sep 2025</span>
                                <button className="text-gray-400 hover:text-gray-600">
                                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    </div>
                );

            case 'MANAGE BOOKING':
                return (
                    <div className="space-y-6">
                        <h3 className="text-xl font-semibold text-gray-800">Enter your booking details to manage your itinerary</h3>

                        <div className="space-y-4">
                            <div className="flex space-x-4">
                                <label className="flex items-center space-x-2">
                                    <input type="radio" name="manageType" value="booking" defaultChecked className="text-orange-500" />
                                    <span className="text-sm text-gray-700">Booking reference</span>
                                </label>
                                <label className="flex items-center space-x-2">
                                    <input type="radio" name="manageType" value="eticket" className="text-orange-500" />
                                    <span className="text-sm text-gray-700">E-ticket number</span>
                                </label>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Booking reference (e.g. ABC123)</label>
                                    <input
                                        type="text"
                                        name="bookingReference"
                                        value={formData.bookingReference}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent form-input"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Last / Family name (As in passport)</label>
                                    <input
                                        type="text"
                                        name="lastName"
                                        value={formData.lastName}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent form-input"
                                    />
                                </div>
                            </div>

                            <div className="flex justify-end">
                                <button
                                    type="submit"
                                    className="bg-blue-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors"
                                >
                                    MANAGE BOOKING
                                </button>
                            </div>
                        </div>
                    </div>
                );

            case 'CHECK IN':
                return (
                    <div className="space-y-6">
                        <div className="bg-orange-100 border border-orange-200 rounded-lg p-4">
                            <div className="flex items-start space-x-3">
                                <svg className="w-5 h-5 text-orange-600 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                                </svg>
                                <div className="text-sm text-orange-800">
                                    <p>If the first flight in your itinerary is operated by Scoot, you may be eligible to check in online or via the SingaporeAir mobile app using your SQ booking reference/ E-ticket number between 48 hours and 1.5 hours before your Scoot flight departure. <a href="#" className="text-blue-600 hover:underline">Find out more here.</a></p>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div className="flex space-x-4">
                                <label className="flex items-center space-x-2">
                                    <input type="radio" name="checkinType" value="booking" defaultChecked className="text-orange-500" />
                                    <span className="text-sm text-gray-700">Booking reference</span>
                                </label>
                                <label className="flex items-center space-x-2">
                                    <input type="radio" name="checkinType" value="eticket" className="text-orange-500" />
                                    <span className="text-sm text-gray-700">E-ticket number</span>
                                </label>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Booking reference (e.g. ABC123)</label>
                                    <input
                                        type="text"
                                        name="bookingReference"
                                        value={formData.bookingReference}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent form-input"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Last / Family name (As in passport)</label>
                                    <input
                                        type="text"
                                        name="lastName"
                                        value={formData.lastName}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent form-input"
                                    />
                                </div>
                            </div>

                            <div className="flex justify-end">
                                <button
                                    type="submit"
                                    className="bg-blue-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors"
                                >
                                    CHECK IN
                                </button>
                            </div>
                        </div>
                    </div>
                );

            case 'FLIGHT STATUS':
                return (
                    <div className="space-y-6">
                        <h3 className="text-xl font-semibold text-gray-800">Check your flight status</h3>

                        <div className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Flight number</label>
                                    <input
                                        type="text"
                                        name="flightNumber"
                                        value={formData.flightNumber}
                                        onChange={handleInputChange}
                                        placeholder="e.g. SQ123"
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent form-input"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
                                    <input
                                        type="date"
                                        name="date"
                                        value={formData.date}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent form-input"
                                    />
                                </div>
                            </div>

                            <div className="flex justify-end">
                                <button
                                    type="submit"
                                    className="bg-blue-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors"
                                >
                                    CHECK STATUS
                                </button>
                            </div>
                        </div>
                    </div>
                );

            case 'FLIGHT SCHEDULE':
                return (
                    <div className="space-y-6">
                        <h3 className="text-xl font-semibold text-gray-800">View flight schedules</h3>

                        <div className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Departure city</label>
                                    <input
                                        type="text"
                                        name="departureCity"
                                        value={formData.departureCity}
                                        onChange={handleInputChange}
                                        placeholder="e.g. Kathmandu"
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent form-input"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Arrival city</label>
                                    <input
                                        type="text"
                                        name="arrivalCity"
                                        value={formData.arrivalCity}
                                        onChange={handleInputChange}
                                        placeholder="e.g. Singapore"
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent form-input"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
                                    <input
                                        type="date"
                                        name="date"
                                        value={formData.date}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent form-input"
                                    />
                                </div>
                            </div>

                            <div className="flex justify-end">
                                <button
                                    type="submit"
                                    className="bg-blue-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors"
                                >
                                    VIEW SCHEDULE
                                </button>
                            </div>
                        </div>
                    </div>
                );

            default:
                return null;
        }
    };

    return (
        <div className="bg-white rounded-2xl shadow-2xl p-6 md:p-8 max-w-8xl mx-auto">
            {/* Main Navigation Tabs */}
            <div className="flex flex-wrap gap-1 mb-6">
                {navigationItems.map((item) => (
                    <button
                        key={item}
                        onClick={() => setActiveTab(item)}
                        className={`sub-nav-tab px-6 py-3 text-sm font-medium rounded-t-lg transition-all duration-200 ${activeTab === item
                                ? 'active bg-white text-gray-800 border-b-2 border-orange-500'
                                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                            }`}
                    >
                        {item}
                    </button>
                ))}
            </div>

            {/* Dynamic Content Area */}
            <div className="min-h-[400px]">
                <form onSubmit={handleSubmit}>
                    <div key={activeTab} className="sub-nav-content">
                        {renderContent()}
                    </div>
                </form>
            </div>
        </div>
    );
};

export default SubNavigation;
