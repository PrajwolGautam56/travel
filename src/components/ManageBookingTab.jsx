import React from 'react';

const ManageBookingTab = ({ formData, onChange }) => {
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
                            onChange={onChange}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent form-input"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Last / Family name (As in passport)</label>
                        <input
                            type="text"
                            name="lastName"
                            value={formData.lastName}
                            onChange={onChange}
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
};

export default ManageBookingTab;


