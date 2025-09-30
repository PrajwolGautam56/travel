import React from 'react';

const ManageBookingTab = ({ formData, onChange }) => {
    return (
        <div className="space-y-4 sm:space-y-6">
            <h3 className="text-lg sm:text-xl font-semibold text-gray-800">Enter your booking details to manage your itinerary</h3>

            <div className="space-y-3 sm:space-y-4">
                <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
                    <label className="flex items-center space-x-2">
                        <input type="radio" name="manageType" value="booking" defaultChecked className="text-orange-500" />
                        <span className="text-xs sm:text-sm text-gray-700">Booking reference</span>
                    </label>
                    <label className="flex items-center space-x-2">
                        <input type="radio" name="manageType" value="eticket" className="text-orange-500" />
                        <span className="text-xs sm:text-sm text-gray-700">E-ticket number</span>
                    </label>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    <div>
                        <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">Booking reference (e.g. ABC123)</label>
                        <input
                            type="text"
                            name="bookingReference"
                            value={formData.bookingReference}
                            onChange={onChange}
                            className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent form-input text-sm sm:text-base"
                        />
                    </div>

                    <div>
                        <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">Last / Family name (As in passport)</label>
                        <input
                            type="text"
                            name="lastName"
                            value={formData.lastName}
                            onChange={onChange}
                            className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent form-input text-sm sm:text-base"
                        />
                    </div>
                </div>

                <div className="flex justify-end">
                    <button
                        type="submit"
                        className="bg-orange-500 text-white font-bold py-2.5 sm:py-3 px-4 sm:px-6 rounded-lg hover:bg-orange-600 transition-colors text-sm sm:text-base"
                    >
                        Manage Booking
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ManageBookingTab;


