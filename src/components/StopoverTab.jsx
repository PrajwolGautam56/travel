import React, { useState, useEffect, useRef } from 'react';

const StopoverTab = ({ formData, onChange }) => {
    const [tripType, setTripType] = useState('return');
    const [passengerCounts, setPassengerCounts] = useState({
        adults: 1,
        children: 0,
        infants: 0
    });
    const [isPassengerDropdownOpen, setIsPassengerDropdownOpen] = useState(false);
    const [isPromoModalOpen, setIsPromoModalOpen] = useState(false);
    const [promoCode, setPromoCode] = useState('');
    const [multicityFlights, setMulticityFlights] = useState([
        { from: '', to: '', date: '' },
        { from: '', to: '', date: '' }
    ]);
    const passengerDropdownRef = useRef(null);

    const getTodayDate = () => {
        return new Date();
    };

    const getReturnDate = () => {
        const today = new Date();
        const returnDate = new Date(today);
        returnDate.setDate(today.getDate() + 7);
        return returnDate;
    };

    // Set default dates when component mounts
    useEffect(() => {
        if (!formData.departureDate) {
            onChange({ target: { name: 'departureDate', value: getTodayDate().toISOString().split('T')[0] } });
        }
        if (!formData.returnDate && tripType === 'return') {
            onChange({ target: { name: 'returnDate', value: getReturnDate().toISOString().split('T')[0] } });
        }
    }, [tripType]);

    // Handle click outside to close passenger dropdown
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (isPassengerDropdownOpen && passengerDropdownRef.current && !passengerDropdownRef.current.contains(event.target)) {
                setIsPassengerDropdownOpen(false);
            }
        };

        const handleCloseDropdowns = () => {
            setIsPassengerDropdownOpen(false);
            setIsPromoModalOpen(false);
        };

        // Add event listeners
        if (isPassengerDropdownOpen) {
            document.addEventListener('mousedown', handleClickOutside);
            document.addEventListener('click', handleClickOutside);
        }
        document.addEventListener('closeDropdowns', handleCloseDropdowns);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            document.removeEventListener('click', handleClickOutside);
            document.removeEventListener('closeDropdowns', handleCloseDropdowns);
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

    const handleTripTypeChange = (type) => {
        setTripType(type);
    };

    const handleMulticityChange = (index, field, value) => {
        const newFlights = [...multicityFlights];
        newFlights[index][field] = value;
        setMulticityFlights(newFlights);
    };

    const addMulticityFlight = () => {
        setMulticityFlights([...multicityFlights, { from: '', to: '', date: '' }]);
    };

    const removeMulticityFlight = (index) => {
        if (multicityFlights.length > 2) {
            const newFlights = multicityFlights.filter((_, i) => i !== index);
            setMulticityFlights(newFlights);
        }
    };

    const clearField = (fieldName) => {
        onChange({ target: { name: fieldName, value: '' } });
    };

    return (
        <>
            <style jsx>{`
                .date-input::-webkit-datetime-edit-text {
                    color: transparent;
                }
                .date-input::-webkit-datetime-edit-month-field {
                    color: transparent;
                }
                .date-input::-webkit-datetime-edit-day-field {
                    color: transparent;
                }
                .date-input::-webkit-datetime-edit-year-field {
                    color: transparent;
                }
                .date-input:focus::-webkit-datetime-edit-text {
                    color: #000;
                }
                .date-input:focus::-webkit-datetime-edit-month-field {
                    color: #000;
                }
                .date-input:focus::-webkit-datetime-edit-day-field {
                    color: #000;
                }
                .date-input:focus::-webkit-datetime-edit-year-field {
                    color: #000;
                }
                .date-input:not(:placeholder-shown)::-webkit-datetime-edit-text {
                    color: #000;
                }
                .date-input:not(:placeholder-shown)::-webkit-datetime-edit-month-field {
                    color: #000;
                }
                .date-input:not(:placeholder-shown)::-webkit-datetime-edit-day-field {
                    color: #000;
                }
                .date-input:not(:placeholder-shown)::-webkit-datetime-edit-year-field {
                    color: #000;
                }
                .peer:not(:placeholder-shown) + label,
                .peer:focus + label {
                    position: absolute;
                    left: 0.75rem;
                    top: 0.7rem;
                    transform: none;
                    font-size: 0.75rem;
                    padding: 0 0.25rem;
                    z-index: 10;
                }
            `}</style>
            <div className="space-y-3 sm:space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
                    <div className="flex flex-col sm:flex-row sm:space-x-6 space-y-2 sm:space-y-0">
                        <label className="flex items-center space-x-2">
                            <input
                                type="radio"
                                name="tripType"
                                value="return"
                                checked={tripType === 'return'}
                                onChange={() => handleTripTypeChange('return')}
                                className="text-orange-500"
                            />
                            <span className="text-xs sm:text-sm text-gray-700">Return</span>
                        </label>
                        <label className="flex items-center space-x-2">
                            <input
                                type="radio"
                                name="tripType"
                                value="oneway"
                                checked={tripType === 'oneway'}
                                onChange={() => handleTripTypeChange('oneway')}
                                className="text-orange-500"
                            />
                            <span className="text-xs sm:text-sm text-gray-700">One Way</span>
                        </label>
                        <label className="flex items-center space-x-2">
                            <input
                                type="radio"
                                name="tripType"
                                value="multicity"
                                checked={tripType === 'multicity'}
                                onChange={() => handleTripTypeChange('multicity')}
                                className="text-orange-500"
                            />
                            <span className="text-xs sm:text-sm text-gray-700">Multicity</span>
                        </label>
                    </div>
                </div>

                <div className="space-y-2 sm:space-y-3">
                    {/* Return Trip Form */}
                    {tripType === 'return' && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                            <div>
                                <div className="relative">
                                    <input
                                        type="text"
                                        name="from"
                                        value={formData.from}
                                        onChange={onChange}
                                        placeholder=" "
                                        className="w-full px-3 sm:px-4 h-12 pt-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent form-input text-sm sm:text-base peer"
                                    />
                                    <label className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm transition-all duration-200 pointer-events-none peer-placeholder-shown:translate-y-0 peer-placeholder-shown:text-sm peer-placeholder-shown:text-gray-500">
                                        From
                                    </label>
                                    <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center space-x-1">
                                        {formData.from && (
                                            <button
                                                type="button"
                                                onClick={() => clearField('from')}
                                                className="text-gray-400 hover:text-gray-600 transition-colors"
                                            >
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
                                                </svg>
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div>
                                <div className="relative">
                                    <input
                                        type="text"
                                        name="to"
                                        value={formData.to}
                                        onChange={onChange}
                                        placeholder=" "
                                        className="w-full px-3 sm:px-4 h-12 pt-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent form-input text-sm sm:text-base peer"
                                    />
                                    <label className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm transition-all duration-200 pointer-events-none peer-placeholder-shown:translate-y-0 peer-placeholder-shown:text-sm peer-placeholder-shown:text-gray-500">
                                        To
                                    </label>
                                    <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center space-x-1">
                                        {formData.to && (
                                            <button
                                                type="button"
                                                onClick={() => clearField('to')}
                                                className="text-gray-400 hover:text-gray-600 transition-colors"
                                            >
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
                                                </svg>
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div>
                                <div className="relative">
                                    <input
                                        type="date"
                                        name="departureDate"
                                        value={formData.departureDate}
                                        onChange={onChange}
                                        placeholder=" "
                                        className="w-full px-3 sm:px-4 h-12 pt-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent form-input text-sm sm:text-base peer date-input"
                                        style={{ colorScheme: 'light' }}
                                        onClick={(e) => e.target.showPicker && e.target.showPicker()}
                                    />
                                    <label className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm transition-all duration-200 pointer-events-none peer-placeholder-shown:translate-y-0 peer-placeholder-shown:text-sm peer-placeholder-shown:text-gray-500">
                                        Depart Date
                                    </label>
                                    <div className="absolute right-2 top-1/2 transform -translate-y-1/2">
                                        <svg className="w-3 h-3 sm:w-4 sm:h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                                        </svg>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <div className="relative">
                                    <input
                                        type="date"
                                        name="returnDate"
                                        value={formData.returnDate}
                                        onChange={onChange}
                                        placeholder=" "
                                        className="w-full px-3 sm:px-4 h-12 pt-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent form-input text-sm sm:text-base peer date-input"
                                        style={{ colorScheme: 'light' }}
                                        onClick={(e) => e.target.showPicker && e.target.showPicker()}
                                    />
                                    <label className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm transition-all duration-200 pointer-events-none peer-placeholder-shown:translate-y-0 peer-placeholder-shown:text-sm peer-placeholder-shown:text-gray-500">
                                        Return Date
                                    </label>
                                    <div className="absolute right-2 top-1/2 transform -translate-y-1/2">
                                        <svg className="w-3 h-3 sm:w-4 sm:h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                                        </svg>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* One Way Trip Form */}
                    {tripType === 'oneway' && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                            <div>
                                <div className="relative">
                                    <input
                                        type="text"
                                        name="from"
                                        value={formData.from}
                                        onChange={onChange}
                                        placeholder=" "
                                        className="w-full px-3 sm:px-4 h-12 pt-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent form-input text-sm sm:text-base peer"
                                    />
                                    <label className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm transition-all duration-200 pointer-events-none peer-placeholder-shown:translate-y-0 peer-placeholder-shown:text-sm peer-placeholder-shown:text-gray-500">
                                        From
                                    </label>
                                    <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center space-x-1">
                                        {formData.from && (
                                            <button
                                                type="button"
                                                onClick={() => clearField('from')}
                                                className="text-gray-400 hover:text-gray-600 transition-colors"
                                            >
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
                                                </svg>
                                            </button>
                                        )}
                                        <span className="bg-black text-white text-xs px-1.5 sm:px-2 py-0.5 sm:py-1 rounded">KTM</span>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <div className="relative">
                                    <input
                                        type="text"
                                        name="to"
                                        value={formData.to}
                                        onChange={onChange}
                                        placeholder=" "
                                        className="w-full px-3 sm:px-4 h-12 pt-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent form-input text-sm sm:text-base peer"
                                    />
                                    <label className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm transition-all duration-200 pointer-events-none peer-placeholder-shown:translate-y-0 peer-placeholder-shown:text-sm peer-placeholder-shown:text-gray-500">
                                        To
                                    </label>
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
                                <div className="relative">
                                    <input
                                        type="date"
                                        name="departureDate"
                                        value={formData.departureDate}
                                        onChange={onChange}
                                        placeholder=" "
                                        className="w-full px-3 sm:px-4 h-12 pt-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent form-input text-sm sm:text-base peer date-input"
                                        style={{ colorScheme: 'light' }}
                                        onClick={(e) => e.target.showPicker && e.target.showPicker()}
                                    />
                                    <label className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm transition-all duration-200 pointer-events-none peer-placeholder-shown:translate-y-0 peer-placeholder-shown:text-sm peer-placeholder-shown:text-gray-500">
                                        Depart Date
                                    </label>
                                    <div className="absolute right-2 top-1/2 transform -translate-y-1/2">
                                        <svg className="w-3 h-3 sm:w-4 sm:h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                                        </svg>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Multicity Trip Form */}
                    {tripType === 'multicity' && (
                        <div className="space-y-3">
                            {multicityFlights.map((flight, index) => (
                                <div key={index} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                                    <div>
                                        <div className="relative">
                                            <input
                                                type="text"
                                                value={flight.from}
                                                onChange={(e) => handleMulticityChange(index, 'from', e.target.value)}
                                                placeholder=" "
                                                className="w-full px-3 sm:px-4 h-12 pt-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent form-input text-sm sm:text-base peer"
                                            />
                                            <label className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm transition-all duration-200 pointer-events-none peer-placeholder-shown:translate-y-0 peer-placeholder-shown:text-sm peer-placeholder-shown:text-gray-500">
                                                From {index + 1}
                                            </label>
                                            <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center space-x-1">
                                                {flight.from && (
                                                    <button
                                                        type="button"
                                                        onClick={() => handleMulticityChange(index, 'from', '')}
                                                        className="text-gray-400 hover:text-gray-600 transition-colors"
                                                    >
                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
                                                        </svg>
                                                    </button>
                                                )}
                                                <span className="bg-black text-white text-xs px-1.5 sm:px-2 py-0.5 sm:py-1 rounded">KTM</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div>
                                        <div className="relative">
                                            <input
                                                type="text"
                                                value={flight.to}
                                                onChange={(e) => handleMulticityChange(index, 'to', e.target.value)}
                                                placeholder=" "
                                                className="w-full px-3 sm:px-4 h-12 pt-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent form-input text-sm sm:text-base peer"
                                            />
                                            <label className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm transition-all duration-200 pointer-events-none peer-placeholder-shown:translate-y-0 peer-placeholder-shown:text-sm peer-placeholder-shown:text-gray-500">
                                                To {index + 1}
                                            </label>
                                            <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center space-x-1">
                                                {flight.to && (
                                                    <button
                                                        type="button"
                                                        onClick={() => handleMulticityChange(index, 'to', '')}
                                                        className="text-gray-400 hover:text-gray-600 transition-colors"
                                                    >
                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
                                                        </svg>
                                                    </button>
                                                )}
                                                <svg className="w-3 h-3 sm:w-4 sm:h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                                                    <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                                                </svg>
                                                <svg className="w-3 h-3 sm:w-4 sm:h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM7 9a1 1 0 000 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
                                                </svg>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-end">
                                        <div className="flex-1">
                                            <div className="relative">
                                                <input
                                                    type="date"
                                                    value={flight.date}
                                                    onChange={(e) => handleMulticityChange(index, 'date', e.target.value)}
                                                    placeholder=" "
                                                    className="w-full px-3 sm:px-4 h-12 pt-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent form-input text-sm sm:text-base peer date-input"
                                                />
                                                <label className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm transition-all duration-200 pointer-events-none peer-placeholder-shown:translate-y-0 peer-placeholder-shown:text-sm peer-placeholder-shown:text-gray-500">
                                                    Depart Date {index + 1}
                                                </label>
                                                <div className="absolute right-2 top-1/2 transform -translate-y-1/2">
                                                    <svg className="w-3 h-3 sm:w-4 sm:h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                                                        <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                                                    </svg>
                                                </div>
                                            </div>
                                        </div>
                                        {/* Cross icon for delete - only show from third row */}
                                        {index >= 2 && (
                                            <button
                                                type="button"
                                                onClick={() => removeMulticityFlight(index)}
                                                className="ml-2 text-red-500 hover:text-red-600 transition-colors p-1"
                                            >
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                </svg>
                                            </button>
                                        )}
                                    </div>

                                    <div className="flex items-end justify-end">
                                        {index === multicityFlights.length - 1 && (
                                            <button
                                                type="button"
                                                onClick={addMulticityFlight}
                                                className="flex items-center space-x-2 text-blue-500 hover:text-blue-600 font-medium text-sm transition-colors"
                                            >
                                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                                </svg>
                                                <span>Add a Flight</span>
                                            </button>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pt-2 sm:pt-3 gap-2">
                        <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
                            {/* Class and Passenger Boxes - Leftmost */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 w-full sm:w-auto">
                                <div className="w-68">
                                    <div className="relative">
                                        <select
                                            name="class"
                                            value={formData.class}
                                            onChange={onChange}
                                            className="w-full px-3 sm:px-4 h-12 pt-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent form-input text-sm sm:text-base peer appearance-none"
                                        >
                                            <option value="Economy">Economy</option>
                                            <option value="Premium Economy">Premium Economy</option>
                                            <option value="Business">Business</option>
                                            <option value="First">First Class</option>
                                        </select>
                                        <label className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm transition-all duration-200 pointer-events-none peer-placeholder-shown:translate-y-0 peer-placeholder-shown:text-sm peer-placeholder-shown:text-gray-500">
                                            Class
                                        </label>
                                        <div className="absolute right-2 top-1/2 transform -translate-y-1/2 pointer-events-none">
                                            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                            </svg>
                                        </div>
                                    </div>
                                </div>

                                <div className="relative w-68" ref={passengerDropdownRef}>
                                    <button
                                        type="button"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setIsPassengerDropdownOpen(!isPassengerDropdownOpen);
                                        }}
                                        className="w-full px-3 sm:px-4 h-12 pt-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-left text-sm sm:text-base bg-white flex items-center justify-between peer"
                                    >
                                        <span className="peer-placeholder-shown:text-gray-500">{getPassengerDisplayText()}</span>
                                        <svg
                                            className={`w-4 h-4 transition-transform ${isPassengerDropdownOpen ? 'rotate-180' : ''}`}
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                        </svg>
                                    </button>
                                    <label className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm transition-all duration-200 pointer-events-none peer-placeholder-shown:translate-y-0 peer-placeholder-shown:text-sm peer-placeholder-shown:text-gray-500">
                                        Passengers
                                    </label>

                                    {isPassengerDropdownOpen && (
                                        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg z-20 p-4">
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
                        </div>

                        {/* Promo Code Section - Next Row */}
                        <div className="flex items-center justify-center sm:justify-start pt-2">
                            {!isPromoModalOpen ? (
                                <button
                                    type="button"
                                    onClick={handlePromoModalToggle}
                                    className="flex items-center space-x-2 text-orange-500 hover:text-orange-600 text-xs sm:text-sm cursor-pointer font-bold transition-colors"
                                >
                                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                    </svg>
                                    <span>Add promo code</span>
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

                        <div className="flex justify-center sm:justify-end">
                            <button
                                type="submit"
                                className="bg-orange-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-orange-600 transition-colors text-sm"
                            >
                                Search Flights
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default StopoverTab;