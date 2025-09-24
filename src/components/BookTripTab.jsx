import React, { useState, useEffect, useRef } from 'react';

const BookTripTab = ({ formData, onChange }) => {
    const [passengerCounts, setPassengerCounts] = useState({
        adults: 1,
        children: 0,
        infants: 0
    });
    const [isPassengerDropdownOpen, setIsPassengerDropdownOpen] = useState(false);
    const passengerDropdownRef = useRef(null);

    // Handle click outside to close passenger dropdown
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (passengerDropdownRef.current && !passengerDropdownRef.current.contains(event.target)) {
                setIsPassengerDropdownOpen(false);
            }
        };

        if (isPassengerDropdownOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isPassengerDropdownOpen]);

    const handlePassengerChange = (type, action) => {
        setPassengerCounts(prev => {
            const newCounts = { ...prev };
            if (action === 'increase') {
                if (type === 'adults' && newCounts.adults < 9) {
                    newCounts.adults += 1;
                } else if (type === 'children' && newCounts.children < 8) {
                    newCounts.children += 1;
                } else if (type === 'infants' && newCounts.infants < 8) {
                    newCounts.infants += 1;
                }
            } else if (action === 'decrease') {
                if (type === 'adults' && newCounts.adults > 1) {
                    newCounts.adults -= 1;
                } else if (type === 'children' && newCounts.children > 0) {
                    newCounts.children -= 1;
                } else if (type === 'infants' && newCounts.infants > 0) {
                    newCounts.infants -= 1;
                }
            }
            return newCounts;
        });
    };

    const getPassengerDisplayText = () => {
        const { adults, children, infants } = passengerCounts;
        let text = `${adults} Adult${adults > 1 ? 's' : ''}`;
        if (children > 0) {
            text += `, ${children} Child${children > 1 ? 'ren' : ''}`;
        }
        if (infants > 0) {
            text += `, ${infants} Infant${infants > 1 ? 's' : ''}`;
        }
        return text;
    };

    return (
        <div className="space-y-4 sm:space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
                <div className="flex flex-col sm:flex-row sm:space-x-6 space-y-2 sm:space-y-0">
                    <label className="flex items-center space-x-2">
                        <input type="radio" name="bookingType" value="book" defaultChecked className="text-orange-500" />
                        <span className="text-xs sm:text-sm text-gray-700">Book flights</span>
                    </label>
                    <label className="flex items-center space-x-2">
                        <input type="radio" name="bookingType" value="redeem" className="text-orange-500" />
                        <span className="text-xs sm:text-sm text-gray-700">Redeem flights</span>
                    </label>
                </div>
                <label className="flex items-center space-x-2">
                    <input type="checkbox" className="text-orange-500 rounded" />
                    <span className="text-xs sm:text-sm text-gray-700">Express Booking - quicker, easier</span>
                </label>
            </div>

            <div className="space-y-3 sm:space-y-4">

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                    <div>
                        <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">FROM</label>
                        <div className="relative">
                            <input
                                type="text"
                                name="from"
                                value={formData.from}
                                onChange={onChange}
                                className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent form-input text-sm sm:text-base"
                            />
                            <div className="absolute right-2 top-1/2 transform -translate-y-1/2">
                                <span className="bg-black text-white text-xs px-1.5 sm:px-2 py-0.5 sm:py-1 rounded">KTM</span>
                            </div>
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">TO</label>
                        <div className="relative">
                            <input
                                type="text"
                                name="to"
                                value={formData.to}
                                onChange={onChange}
                                placeholder="Where to?"
                                className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent form-input text-sm sm:text-base"
                            />
                            <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex space-x-1">
                                <svg className="w-3 h-3 sm:w-4 sm:h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                                </svg>
                                <svg className="w-3 h-3 sm:w-4 sm:h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM7 9a1 1 0 000 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
                                </svg>
                            </div>
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">DEPART DATE</label>
                        <div className="relative">
                            <input
                                type="date"
                                name="departureDate"
                                value={formData.departureDate}
                                onChange={onChange}
                                className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent form-input text-sm sm:text-base"
                            />
                            <div className="absolute right-2 top-1/2 transform -translate-y-1/2">
                                <svg className="w-3 h-3 sm:w-4 sm:h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                                </svg>
                            </div>
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">RETURN DATE</label>
                        <div className="relative">
                            <input
                                type="date"
                                name="returnDate"
                                value={formData.returnDate}
                                onChange={onChange}
                                className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent form-input text-sm sm:text-base"
                            />
                            <div className="absolute right-2 top-1/2 transform -translate-y-1/2">
                                <svg className="w-3 h-3 sm:w-4 sm:h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                                </svg>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                    <div>
                        <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">CLASS</label>
                        <select
                            name="class"
                            value={formData.class}
                            onChange={onChange}
                            className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent form-input text-sm sm:text-base"
                        >
                            <option value="Economy">Economy</option>
                            <option value="Premium Economy">Premium Economy</option>
                            <option value="Business">Business</option>
                            <option value="First">First Class</option>
                        </select>
                    </div>

                    <div className="relative" ref={passengerDropdownRef}>
                        <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">PASSENGERS</label>
                        <button
                            type="button"
                            onClick={() => setIsPassengerDropdownOpen(!isPassengerDropdownOpen)}
                            className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-left text-sm sm:text-base bg-white flex items-center justify-between"
                        >
                            <span>{getPassengerDisplayText()}</span>
                            <svg
                                className={`w-4 h-4 transition-transform ${isPassengerDropdownOpen ? 'rotate-180' : ''}`}
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                        </button>

                        {isPassengerDropdownOpen && (
                            <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg z-10 p-4">
                                {/* Adults */}
                                <div className="flex items-center justify-between mb-4">
                                    <div>
                                        <div className="font-medium text-sm">Adults</div>
                                        <div className="text-xs text-gray-500">12 years and above</div>
                                    </div>
                                    <div className="flex items-center space-x-3">
                                        <button
                                            type="button"
                                            onClick={() => handlePassengerChange('adults', 'decrease')}
                                            disabled={passengerCounts.adults <= 1}
                                            className={`w-8 h-8 rounded-full border flex items-center justify-center ${passengerCounts.adults <= 1
                                                ? 'border-gray-200 text-gray-300 cursor-not-allowed'
                                                : 'border-gray-300 text-gray-600 hover:bg-gray-50'
                                                }`}
                                        >
                                            <span className="text-sm">-</span>
                                        </button>
                                        <span className="w-8 text-center text-sm font-medium">{passengerCounts.adults}</span>
                                        <button
                                            type="button"
                                            onClick={() => handlePassengerChange('adults', 'increase')}
                                            disabled={passengerCounts.adults >= 9}
                                            className={`w-8 h-8 rounded-full border flex items-center justify-center ${passengerCounts.adults >= 9
                                                ? 'border-gray-200 text-gray-300 cursor-not-allowed'
                                                : 'border-blue-500 text-blue-500 hover:bg-blue-50'
                                                }`}
                                        >
                                            <span className="text-sm">+</span>
                                        </button>
                                    </div>
                                </div>

                                {/* Children */}
                                <div className="flex items-center justify-between mb-4">
                                    <div>
                                        <div className="font-medium text-sm">Children</div>
                                        <div className="text-xs text-gray-500">2-11 years at time of travel</div>
                                    </div>
                                    <div className="flex items-center space-x-3">
                                        <button
                                            type="button"
                                            onClick={() => handlePassengerChange('children', 'decrease')}
                                            disabled={passengerCounts.children <= 0}
                                            className={`w-8 h-8 rounded-full border flex items-center justify-center ${passengerCounts.children <= 0
                                                ? 'border-gray-200 text-gray-300 cursor-not-allowed'
                                                : 'border-blue-500 text-blue-500 hover:bg-blue-50'
                                                }`}
                                        >
                                            <span className="text-sm">-</span>
                                        </button>
                                        <span className="w-8 text-center text-sm font-medium">{passengerCounts.children}</span>
                                        <button
                                            type="button"
                                            onClick={() => handlePassengerChange('children', 'increase')}
                                            disabled={passengerCounts.children >= 8}
                                            className={`w-8 h-8 rounded-full border flex items-center justify-center ${passengerCounts.children >= 8
                                                ? 'border-gray-200 text-gray-300 cursor-not-allowed'
                                                : 'border-blue-500 text-blue-500 hover:bg-blue-50'
                                                }`}
                                        >
                                            <span className="text-sm">+</span>
                                        </button>
                                    </div>
                                </div>

                                {/* Infants */}
                                <div className="flex items-center justify-between">
                                    <div>
                                        <div className="font-medium text-sm">Infants</div>
                                        <div className="text-xs text-gray-500">0-23 months at time of travel</div>
                                    </div>
                                    <div className="flex items-center space-x-3">
                                        <button
                                            type="button"
                                            onClick={() => handlePassengerChange('infants', 'decrease')}
                                            disabled={passengerCounts.infants <= 0}
                                            className={`w-8 h-8 rounded-full border flex items-center justify-center ${passengerCounts.infants <= 0
                                                ? 'border-gray-200 text-gray-300 cursor-not-allowed'
                                                : 'border-blue-500 text-blue-500 hover:bg-blue-50'
                                                }`}
                                        >
                                            <span className="text-sm">-</span>
                                        </button>
                                        <span className="w-8 text-center text-sm font-medium">{passengerCounts.infants}</span>
                                        <button
                                            type="button"
                                            onClick={() => handlePassengerChange('infants', 'increase')}
                                            disabled={passengerCounts.infants >= 8}
                                            className={`w-8 h-8 rounded-full border flex items-center justify-center ${passengerCounts.infants >= 8
                                                ? 'border-gray-200 text-gray-300 cursor-not-allowed'
                                                : 'border-blue-500 text-blue-500 hover:bg-blue-50'
                                                }`}
                                        >
                                            <span className="text-sm">+</span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="flex items-end">
                        <button
                            type="submit"
                            className="w-full bg-orange-500 text-white font-bold py-2.5 sm:py-3 px-4 sm:px-6 rounded-lg hover:bg-orange-600 transition-colors text-sm sm:text-base"
                        >
                            SEARCH
                        </button>
                    </div>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pt-3 sm:pt-4 gap-2">
                    <div className="flex flex-col sm:flex-row sm:space-x-4 space-y-1 sm:space-y-0">
                        <a href="#" className="text-orange-500 hover:text-orange-600 text-xs sm:text-sm">Apply promo code</a>
                        <a href="#" className="text-orange-500 hover:text-orange-600 text-xs sm:text-sm">Multi-city / Stopovers</a>
                    </div>
                </div>
            </div>

        </div>
    );
};

export default BookTripTab;


