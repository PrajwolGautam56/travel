import React, { useState } from 'react';

const ManageBookingTab = ({ formData, onChange }) => {
    const [manageType, setManageType] = useState('booking');

    const clearField = (fieldName) => {
        onChange({ target: { name: fieldName, value: '' } });
    };

    return (
        <>
            <style jsx>{`
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
                                name="manageType"
                                value="booking"
                                checked={manageType === 'booking'}
                                onChange={(e) => setManageType(e.target.value)}
                                className="text-orange-500"
                            />
                            <span className="text-xs sm:text-sm text-gray-700">Booking reference</span>
                        </label>
                        <label className="flex items-center space-x-2">
                            <input
                                type="radio"
                                name="manageType"
                                value="eticket"
                                checked={manageType === 'eticket'}
                                onChange={(e) => setManageType(e.target.value)}
                                className="text-orange-500"
                            />
                            <span className="text-xs sm:text-sm text-gray-700">E-ticket number</span>
                        </label>
                    </div>
                </div>

                <div className="space-y-2 sm:space-y-3">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                        <div>
                            <div className="relative">
                                <input
                                    type="text"
                                    name="bookingReference"
                                    value={formData.bookingReference}
                                    onChange={onChange}
                                    placeholder=" "
                                    className="w-full px-3 sm:px-4 h-12 pt-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent form-input text-sm sm:text-base peer"
                                />
                                <label className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm transition-all duration-200 pointer-events-none peer-placeholder-shown:translate-y-0 peer-placeholder-shown:text-sm peer-placeholder-shown:text-gray-500">
                                    {manageType === 'booking' ? 'Booking reference (e.g. ABC123)' : 'E-ticket number'}
                                </label>
                                <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center space-x-1">
                                    {formData.bookingReference && (
                                        <button
                                            type="button"
                                            onClick={() => clearField('bookingReference')}
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
                                    name="lastName"
                                    value={formData.lastName}
                                    onChange={onChange}
                                    placeholder=" "
                                    className="w-full px-3 sm:px-4 h-12 pt-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent form-input text-sm sm:text-base peer"
                                />
                                <label className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm transition-all duration-200 pointer-events-none peer-placeholder-shown:translate-y-0 peer-placeholder-shown:text-sm peer-placeholder-shown:text-gray-500">
                                    Last / Family name (As in passport)
                                </label>
                                <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center space-x-1">
                                    {formData.lastName && (
                                        <button
                                            type="button"
                                            onClick={() => clearField('lastName')}
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
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pt-2 sm:pt-3 gap-2">
                        <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
                            {/* Empty space for consistency with BookTripTab layout */}
                        </div>

                        <div className="flex justify-center sm:justify-end">
                            <button
                                type="submit"
                                className="bg-orange-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-orange-600 transition-colors text-sm"
                            >
                                Manage Booking
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default ManageBookingTab;


