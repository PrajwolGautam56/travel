import React, { useState, useRef, useEffect } from 'react';

const HelicopterBookingTab = ({ formData, onChange }) => {
    const [serviceType, setServiceType] = useState('scenic');
    const [passengerCount, setPassengerCount] = useState(1);
    const [isPassengerDropdownOpen, setIsPassengerDropdownOpen] = useState(false);
    const [isCalendarOpen, setIsCalendarOpen] = useState(false);
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState('');
    const [selectedTime, setSelectedTime] = useState('');
    const calendarRef = useRef(null);
    const passengerDropdownRef = useRef(null);

    const serviceTypes = [
        { value: 'scenic', label: 'Scenic Tour' },
        { value: 'charter', label: 'Charter Flight' },
        { value: 'mountain', label: 'Mountain Landing' },
        { value: 'transfer', label: 'Airport Transfer' },
        { value: 'rescue', label: 'Rescue/Medical' }
    ];

    const timeSlots = [
        '06:00', '07:00', '08:00', '09:00', '10:00', '11:00',
        '12:00', '13:00', '14:00', '15:00', '16:00', '17:00'
    ];

    // Handle click outside to close dropdowns
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (isPassengerDropdownOpen && passengerDropdownRef.current && !passengerDropdownRef.current.contains(event.target)) {
                setIsPassengerDropdownOpen(false);
            }
            if (isCalendarOpen && calendarRef.current && !calendarRef.current.contains(event.target)) {
                setIsCalendarOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isPassengerDropdownOpen, isCalendarOpen]);

    const handleServiceTypeChange = (type) => {
        setServiceType(type);
        onChange({ target: { name: 'helicopterServiceType', value: type } });
    };

    const handlePassengerChange = (type, action) => {
        setPassengerCount(prev => {
            let newCount = prev;
            if (type === 'increase' && prev < 6) {
                newCount = prev + 1;
            } else if (type === 'decrease' && prev > 1) {
                newCount = prev - 1;
            }
            onChange({ target: { name: 'helicopterPassengers', value: newCount } });
            return newCount;
        });
    };

    const formatDate = (date) => {
        if (!date) return '';
        const d = new Date(date);
        return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
    };

    const getTodayDate = () => {
        return new Date();
    };

    const getDaysInMonth = (date) => {
        return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
    };

    const getFirstDayOfMonth = (date) => {
        return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
    };

    const handleDateSelect = (day) => {
        const selected = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
        const dateString = selected.toISOString().split('T')[0];
        setSelectedDate(dateString);
        onChange({ target: { name: 'helicopterDate', value: dateString } });
        setIsCalendarOpen(false);
    };

    const handlePrevMonth = () => {
        setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
    };

    const handleNextMonth = () => {
        setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
    };

    const handleTimeSelect = (time) => {
        setSelectedTime(time);
        onChange({ target: { name: 'helicopterTime', value: time } });
    };

    const isDateDisabled = (day) => {
        const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return date < today;
    };

    const renderCalendar = () => {
        const daysInMonth = getDaysInMonth(currentMonth);
        const firstDay = getFirstDayOfMonth(currentMonth);
        const days = [];
        const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
        const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

        // Add empty cells for days before the first day of the month
        for (let i = 0; i < firstDay; i++) {
            days.push(<div key={`empty-${i}`} className="w-10 h-10"></div>);
        }

        // Add cells for each day of the month
        for (let day = 1; day <= daysInMonth; day++) {
            const isDisabled = isDateDisabled(day);
            const dateString = `${currentMonth.getFullYear()}-${String(currentMonth.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
            const isSelected = selectedDate === dateString;
            
            days.push(
                <button
                    key={day}
                    type="button"
                    onClick={() => !isDisabled && handleDateSelect(day)}
                    disabled={isDisabled}
                    className={`w-10 h-10 rounded-lg text-sm transition-colors ${
                        isDisabled
                            ? 'text-gray-300 cursor-not-allowed'
                            : isSelected
                            ? 'bg-orange-500 text-white font-semibold'
                            : 'text-gray-700 hover:bg-orange-100'
                    }`}
                >
                    {day}
                </button>
            );
        }

        return (
            <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-4 absolute top-full left-0 mt-2 z-50 min-w-[300px]">
                <div className="flex items-center justify-between mb-4">
                    <button
                        type="button"
                        onClick={handlePrevMonth}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                    </button>
                    <h3 className="text-lg font-semibold text-gray-800">
                        {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
                    </h3>
                    <button
                        type="button"
                        onClick={handleNextMonth}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                    </button>
                </div>
                <div className="grid grid-cols-7 gap-1 mb-2">
                    {dayNames.map(day => (
                        <div key={day} className="text-center text-xs font-medium text-gray-500 py-2">
                            {day}
                        </div>
                    ))}
                </div>
                <div className="grid grid-cols-7 gap-1">
                    {days}
                </div>
            </div>
        );
    };

    return (
        <div className="space-y-4">
            <style>{`
                .form-input:focus + label,
                .form-input:not(:placeholder-shown) + label {
                    top: 0.7rem;
                    font-size: 0.75rem;
                    color: #f97316;
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
            {/* Service Type Selection */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Service Type</label>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
                    {serviceTypes.map((service) => (
                        <label
                            key={service.value}
                            className={`flex items-center justify-center p-3 border-2 rounded-lg cursor-pointer transition-all ${
                                serviceType === service.value
                                    ? 'border-orange-500 bg-orange-50 text-orange-700'
                                    : 'border-gray-300 hover:border-gray-400 text-gray-700'
                            }`}
                        >
                            <input
                                type="radio"
                                name="serviceType"
                                value={service.value}
                                checked={serviceType === service.value}
                                onChange={() => handleServiceTypeChange(service.value)}
                                className="sr-only"
                            />
                            <span className="text-xs sm:text-sm font-medium text-center">{service.label}</span>
                        </label>
                    ))}
                </div>
            </div>

            {/* Location and Date/Time Fields */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                {/* Pickup Location */}
                <div className="relative">
                    <input
                        type="text"
                        name="helicopterPickup"
                        value={formData.helicopterPickup || ''}
                        onChange={onChange}
                        placeholder=" "
                        className="w-full px-3 sm:px-4 h-12 pt-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent form-input text-sm sm:text-base peer"
                    />
                    <label className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm transition-all duration-200 pointer-events-none peer-placeholder-shown:translate-y-0 peer-placeholder-shown:text-sm peer-placeholder-shown:text-gray-500 peer-focus:-translate-y-1/2 peer-focus:text-xs peer-focus:text-orange-500">
                        Pickup Location
                    </label>
                    <div className="absolute right-2 top-1/2 transform -translate-y-1/2">
                        <svg className="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                        </svg>
                    </div>
                </div>

                {/* Drop-off Location */}
                <div className="relative">
                    <input
                        type="text"
                        name="helicopterDropoff"
                        value={formData.helicopterDropoff || ''}
                        onChange={onChange}
                        placeholder=" "
                        className="w-full px-3 sm:px-4 h-12 pt-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent form-input text-sm sm:text-base peer"
                    />
                    <label className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm transition-all duration-200 pointer-events-none peer-placeholder-shown:translate-y-0 peer-placeholder-shown:text-sm peer-placeholder-shown:text-gray-500 peer-focus:-translate-y-1/2 peer-focus:text-xs peer-focus:text-orange-500">
                        Drop-off Location
                    </label>
                    <div className="absolute right-2 top-1/2 transform -translate-y-1/2">
                        <svg className="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                        </svg>
                    </div>
                </div>

                {/* Date Selection */}
                <div className="relative" ref={calendarRef}>
                    <input
                        type="text"
                        value={selectedDate ? formatDate(selectedDate) : ''}
                        placeholder=" "
                        readOnly
                        onClick={() => setIsCalendarOpen(!isCalendarOpen)}
                        className="w-full px-3 sm:px-4 h-12 pt-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent form-input text-sm sm:text-base peer cursor-pointer"
                    />
                    <label className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm transition-all duration-200 pointer-events-none peer-placeholder-shown:translate-y-0 peer-placeholder-shown:text-sm peer-placeholder-shown:text-gray-500">
                        Select Date
                    </label>
                    <div className="absolute right-2 top-1/2 transform -translate-y-1/2">
                        <svg className="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                        </svg>
                    </div>
                    {isCalendarOpen && renderCalendar()}
                </div>

                {/* Time Selection */}
                <div className="relative">
                    <select
                        name="helicopterTime"
                        value={selectedTime}
                        onChange={(e) => handleTimeSelect(e.target.value)}
                        className="w-full px-3 sm:px-4 h-12 pt-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm sm:text-base bg-white appearance-none"
                    >
                        <option value="">Select Time</option>
                        {timeSlots.map(time => (
                            <option key={time} value={time}>{time}</option>
                        ))}
                    </select>
                    <div className="absolute right-2 top-1/2 transform -translate-y-1/2 pointer-events-none">
                        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                </div>
            </div>

            {/* Passengers and Additional Info */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                {/* Passengers */}
                <div className="relative" ref={passengerDropdownRef}>
                    <input
                        type="text"
                        value={`${passengerCount} ${passengerCount === 1 ? 'Passenger' : 'Passengers'}`}
                        placeholder=" "
                        readOnly
                        onClick={() => setIsPassengerDropdownOpen(!isPassengerDropdownOpen)}
                        className="w-full px-3 sm:px-4 h-12 pt-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent form-input text-sm sm:text-base peer cursor-pointer"
                    />
                    <label className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm transition-all duration-200 pointer-events-none">
                        Passengers
                    </label>
                    <div className="absolute right-2 top-1/2 transform -translate-y-1/2 pointer-events-none">
                        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                    </div>
                    {isPassengerDropdownOpen && (
                        <div className="absolute top-full left-0 mt-2 w-full bg-white border border-gray-200 rounded-lg shadow-lg p-4 z-50">
                            <div className="flex items-center justify-between mb-4">
                                <span className="text-sm font-medium text-gray-700">Number of Passengers</span>
                                <button
                                    type="button"
                                    onClick={() => setIsPassengerDropdownOpen(false)}
                                    className="text-gray-400 hover:text-gray-600"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-gray-700">Passengers</span>
                                <div className="flex items-center space-x-3">
                                    <button
                                        type="button"
                                        onClick={() => handlePassengerChange('decrease')}
                                        disabled={passengerCount <= 1}
                                        className={`w-8 h-8 rounded-full border flex items-center justify-center ${
                                            passengerCount <= 1
                                                ? 'border-gray-200 text-gray-300 cursor-not-allowed'
                                                : 'border-orange-500 text-orange-500 hover:bg-orange-50'
                                        }`}
                                    >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                                        </svg>
                                    </button>
                                    <span className="w-8 text-center font-medium text-gray-700">{passengerCount}</span>
                                    <button
                                        type="button"
                                        onClick={() => handlePassengerChange('increase')}
                                        disabled={passengerCount >= 6}
                                        className={`w-8 h-8 rounded-full border flex items-center justify-center ${
                                            passengerCount >= 6
                                                ? 'border-gray-200 text-gray-300 cursor-not-allowed'
                                                : 'border-orange-500 text-orange-500 hover:bg-orange-50'
                                        }`}
                                    >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                            <p className="text-xs text-gray-500 mt-2">Maximum 6 passengers per helicopter</p>
                        </div>
                    )}
                </div>

                {/* Special Requirements */}
                <div className="relative">
                    <input
                        type="text"
                        name="helicopterSpecialRequirements"
                        value={formData.helicopterSpecialRequirements || ''}
                        onChange={onChange}
                        placeholder=" "
                        className="w-full px-3 sm:px-4 h-12 pt-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent form-input text-sm sm:text-base peer"
                    />
                    <label className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm transition-all duration-200 pointer-events-none peer-placeholder-shown:translate-y-0 peer-placeholder-shown:text-sm peer-placeholder-shown:text-gray-500 peer-focus:-translate-y-1/2 peer-focus:text-xs peer-focus:text-orange-500">
                        Special Requirements (Optional)
                    </label>
                </div>
            </div>

            {/* Search Button */}
            <div className="flex justify-end pt-2">
                <button
                    type="submit"
                    className="bg-orange-500 text-white font-bold py-3 px-6 sm:px-8 rounded-lg hover:bg-orange-600 transition-all duration-200 text-sm sm:text-base shadow-md hover:shadow-lg"
                >
                    Search Helicopter
                </button>
            </div>
        </div>
    );
};

export default HelicopterBookingTab;

