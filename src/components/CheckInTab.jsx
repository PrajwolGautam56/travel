import React from 'react';

const CheckInTab = ({ formData, onChange }) => {
    return (
        <div className="space-y-4 sm:space-y-6">
            <div className="bg-orange-100 border border-orange-200 rounded-lg p-3 sm:p-4">
                <div className="flex items-start space-x-2 sm:space-x-3">
                    <svg className="w-4 h-4 sm:w-5 sm:h-5 text-orange-600 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                    <div className="text-xs sm:text-sm text-orange-800">
                        <p>If the first flight in your itinerary is operated by Scoot, you may be eligible to check in online or via the SingaporeAir mobile app using your SQ booking reference/ E-ticket number between 48 hours and 1.5 hours before your Scoot flight departure. <a href="#" className="text-orange-500 hover:underline">Find out more here.</a></p>
                    </div>
                </div>
            </div>

            <div className="space-y-3 sm:space-y-4">
                <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
                    <label className="flex items-center space-x-2">
                        <input type="radio" name="checkinType" value="booking" defaultChecked className="text-orange-500" />
                        <span className="text-xs sm:text-sm text-gray-700">Booking reference</span>
                    </label>
                    <label className="flex items-center space-x-2">
                        <input type="radio" name="checkinType" value="eticket" className="text-orange-500" />
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
                        className="bg-blue-600 text-white font-bold py-2.5 sm:py-3 px-4 sm:px-6 rounded-lg hover:bg-blue-700 transition-colors text-sm sm:text-base"
                    >
                        CHECK IN
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CheckInTab;


