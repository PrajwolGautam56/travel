import React, { useState, useEffect, useRef } from 'react';

const StopoverTab = ({ formData, onChange }) => {
    const [tripType, setTripType] = useState('multi-city');
    const [passengerCounts, setPassengerCounts] = useState({
        adults: 1,
        children: 0,
        infants: 0
    });
    const [isPassengerDropdownOpen, setIsPassengerDropdownOpen] = useState(false);
    const [isPromoModalOpen, setIsPromoModalOpen] = useState(false);
    const [promoCode, setPromoCode] = useState('');
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

    // Reset passenger counts and promo code state when trip type changes
    useEffect(() => {
        setPassengerCounts({
            adults: 1,
            children: 0,
            infants: 0
        });
        // Reset promo code state when trip type changes
        setIsPromoModalOpen(false);
        setPromoCode('');
    }, [tripType]);

    const handleTripTypeChange = (e) => {
        const newTripType = e.target.value;
        setTripType(newTripType);
        // Reset promo code state when trip type changes
        setIsPromoModalOpen(false);
        setPromoCode('');
    };


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

    const handlePromoCodeChange = (e) => {
        setPromoCode(e.target.value);
    };

    const handleApplyPromoCode = () => {
        if (promoCode.trim()) {
            console.log('Applied promo code:', promoCode);
            // Here you would typically validate and apply the promo code
            alert(`Promo code "${promoCode}" applied successfully!`);
            setPromoCode('');
            setIsPromoModalOpen(false);
        }
    };

    const handlePromoModalToggle = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsPromoModalOpen(!isPromoModalOpen);
    };

    return (
        <div className="space-y-4 sm:space-y-6">
            {/* Trip Type Selection */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
                <div className="flex flex-col sm:flex-row sm:space-x-6 space-y-2 sm:space-y-0">
                    <label className="flex items-center space-x-2">
                        <input
                            type="radio"
                            name="tripType"
                            value="return"
                            checked={tripType === 'return'}
                            onChange={handleTripTypeChange}
                            className="text-orange-500"
                        />
                        <span className="text-xs sm:text-sm text-gray-700">Return</span>
                    </label>
                    <label className="flex items-center space-x-2">
                        <input
                            type="radio"
                            name="tripType"
                            value="one-way"
                            checked={tripType === 'one-way'}
                            onChange={handleTripTypeChange}
                            className="text-orange-500"
                        />
                        <span className="text-xs sm:text-sm text-gray-700">One way</span>
                    </label>
                    <label className="flex items-center space-x-2">
                        <input
                            type="radio"
                            name="tripType"
                            value="multi-city"
                            checked={tripType === 'multi-city'}
                            onChange={handleTripTypeChange}
                            className="text-orange-500"
                        />
                        <span className="text-xs sm:text-sm text-gray-700">Multi-city</span>
                    </label>
                </div>
            </div>

            {/* Description */}
            <div className="text-sm text-gray-600 mb-4">
                Explore Qatar during your journey with amazing stopover packages starting from USD 14 pp at 4-star and 5-star hotels.
            </div>

            {/* Flight Details */}
            <div className="space-y-3 sm:space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                    <div>
                        <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">From</label>
                        <input
                            type="text"
                            name="from"
                            value={formData.from}
                            onChange={onChange}
                            placeholder="City or airport"
                            className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent form-input text-sm sm:text-base"
                        />
                    </div>
                    <div>
                        <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">To</label>
                        <input
                            type="text"
                            name="to"
                            value={formData.to}
                            onChange={onChange}
                            placeholder="City or airport"
                            className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent form-input text-sm sm:text-base"
                        />
                    </div>
                    <div>
                        <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">Departure</label>
                        <input
                            type="date"
                            name="departureDate"
                            value={formData.departureDate}
                            onChange={onChange}
                            className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent form-input text-sm sm:text-base"
                        />
                    </div>
                    <div className="relative" ref={passengerDropdownRef}>
                        <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">PASSENGERS</label>
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
                </div>

                {/* Return Date for return trips */}
                {tripType === 'return' && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                        <div>
                            <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">Return Date</label>
                            <input
                                type="date"
                                name="returnDate"
                                value={formData.returnDate}
                                onChange={onChange}
                                className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent form-input text-sm sm:text-base"
                            />
                        </div>
                        <div>
                            <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">Class</label>
                            <select
                                name="class"
                                value={formData.class}
                                onChange={onChange}
                                className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent form-select text-sm sm:text-base"
                            >
                                <option value="Economy">Economy</option>
                                <option value="Business">Business</option>
                                <option value="First">First</option>
                            </select>
                        </div>
                    </div>
                )}

                {/* Multi-city flights */}
                {tripType === 'multi-city' && (
                    <div className="space-y-3">
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                            <div>
                                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">From</label>
                                <input
                                    type="text"
                                    name="from2"
                                    placeholder="City or airport"
                                    className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent form-input text-sm sm:text-base"
                                />
                            </div>
                            <div>
                                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">To</label>
                                <input
                                    type="text"
                                    name="to2"
                                    placeholder="City or airport"
                                    className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent form-input text-sm sm:text-base"
                                />
                            </div>
                            <div>
                                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">Departure</label>
                                <input
                                    type="date"
                                    name="departureDate2"
                                    className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent form-input text-sm sm:text-base"
                                />
                            </div>
                            <div>
                                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">Class</label>
                                <select
                                    name="class"
                                    value={formData.class}
                                    onChange={onChange}
                                    className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent form-select text-sm sm:text-base"
                                >
                                    <option value="Economy">Economy</option>
                                    <option value="Business">Business</option>
                                    <option value="First">First</option>
                                </select>
                            </div>
                        </div>
                    </div>
                )}
            </div>


            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
                <div className="flex flex-col sm:flex-row sm:space-x-4 space-y-1 sm:space-y-0">
                    {!isPromoModalOpen ? (
                        <button
                            type="button"
                            onClick={handlePromoModalToggle}
                            className="text-orange-500 hover:text-orange-600 text-xs sm:text-sm cursor-pointer font-bold"
                        >
                            + Add promo code
                        </button>
                    ) : (
                        <div className="flex items-center space-x-2">
                            <input
                                type="text"
                                value={promoCode}
                                onChange={handlePromoCodeChange}
                                placeholder="Enter promo code"
                                className="px-3 py-1 border border-gray-300 rounded text-xs sm:text-sm focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                autoFocus
                            />
                            <button
                                type="button"
                                onClick={handleApplyPromoCode}
                                disabled={!promoCode.trim()}
                                className="bg-orange-500 text-white px-3 py-1 rounded text-xs sm:text-sm hover:bg-orange-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                            >
                                Apply
                            </button>
                            <button
                                type="button"
                                onClick={() => {
                                    setIsPromoModalOpen(false);
                                    setPromoCode('');
                                }}
                                className="text-gray-500 hover:text-gray-700 text-xs sm:text-sm"
                            >
                                Cancel
                            </button>
                        </div>
                    )}
                </div>
                <button
                    type="submit"
                    className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200 w-full sm:w-auto"
                >
                    Search flights
                </button>
            </div>
        </div>
    );
};

export default StopoverTab;
