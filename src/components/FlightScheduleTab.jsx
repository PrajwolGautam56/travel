import React from 'react';

const FlightScheduleTab = ({ formData, onChange }) => {
    return (
        <div className="space-y-4 sm:space-y-6">
            <h3 className="text-lg sm:text-xl font-semibold text-gray-800">View flight schedules</h3>

            <div className="space-y-3 sm:space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                    <div>
                        <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">Departure city</label>
                        <input
                            type="text"
                            name="departureCity"
                            value={formData.departureCity}
                            onChange={onChange}
                            placeholder="e.g. Kathmandu"
                            className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent form-input text-sm sm:text-base"
                        />
                    </div>

                    <div>
                        <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">Arrival city</label>
                        <input
                            type="text"
                            name="arrivalCity"
                            value={formData.arrivalCity}
                            onChange={onChange}
                            placeholder="e.g. Singapore"
                            className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent form-input text-sm sm:text-base"
                        />
                    </div>

                    <div>
                        <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">Date</label>
                        <input
                            type="date"
                            name="date"
                            value={formData.date}
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
                        VIEW SCHEDULE
                    </button>
                </div>
            </div>
        </div>
    );
};

export default FlightScheduleTab;


