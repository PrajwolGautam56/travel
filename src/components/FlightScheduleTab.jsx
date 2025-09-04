import React from 'react';

const FlightScheduleTab = ({ formData, onChange }) => {
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
                            onChange={onChange}
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
                            onChange={onChange}
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
                        VIEW SCHEDULE
                    </button>
                </div>
            </div>
        </div>
    );
};

export default FlightScheduleTab;


