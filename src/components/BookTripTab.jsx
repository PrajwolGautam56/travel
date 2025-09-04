import React from 'react';

const BookTripTab = ({ formData, onChange }) => {
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div className="flex space-x-6">
                    <label className="flex items-center space-x-2">
                        <input type="radio" name="bookingType" value="book" defaultChecked className="text-orange-500" />
                        <span className="text-sm text-gray-700">Book flights</span>
                    </label>
                    <label className="flex items-center space-x-2">
                        <input type="radio" name="bookingType" value="redeem" className="text-orange-500" />
                        <span className="text-sm text-gray-700">Redeem flights</span>
                    </label>
                </div>
                <label className="flex items-center space-x-2">
                    <input type="checkbox" className="text-blue-600 rounded" />
                    <span className="text-sm text-gray-700">Express Booking - quicker, easier</span>
                </label>
            </div>

            <div className="space-y-4">

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">FROM</label>
                        <div className="relative">
                            <input
                                type="text"
                                name="from"
                                value={formData.from}
                                onChange={onChange}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent form-input"
                            />
                            <div className="absolute right-2 top-1/2 transform -translate-y-1/2">
                                <span className="bg-black text-white text-xs px-2 py-1 rounded">KTM</span>
                            </div>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">TO</label>
                        <div className="relative">
                            <input
                                type="text"
                                name="to"
                                value={formData.to}
                                onChange={onChange}
                                placeholder="Where to?"
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent form-input"
                            />
                            <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex space-x-1">
                                <svg className="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                                </svg>
                                <svg className="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM7 9a1 1 0 000 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
                                </svg>
                            </div>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">DEPART DATE</label>
                        <div className="relative">
                            <input
                                type="date"
                                name="departureDate"
                                value={formData.departureDate}
                                onChange={onChange}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent form-input"
                            />
                            <div className="absolute right-2 top-1/2 transform -translate-y-1/2">
                                <svg className="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                                </svg>
                            </div>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">RETURN DATE</label>
                        <div className="relative">
                            <input
                                type="date"
                                name="returnDate"
                                value={formData.returnDate}
                                onChange={onChange}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent form-input"
                            />
                            <div className="absolute right-2 top-1/2 transform -translate-y-1/2">
                                <svg className="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                                </svg>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">CLASS</label>
                        <select
                            name="class"
                            value={formData.class}
                            onChange={onChange}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent form-input"
                        >
                            <option value="Economy">Economy</option>
                            <option value="Premium Economy">Premium Economy</option>
                            <option value="Business">Business</option>
                            <option value="First">First Class</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">PASSENGERS</label>
                        <select
                            name="passengers"
                            value={formData.passengers}
                            onChange={onChange}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent form-input"
                        >
                            <option value="1 Adult">1 Adult</option>
                            <option value="2 Adults">2 Adults</option>
                            <option value="3 Adults">3 Adults</option>
                            <option value="4 Adults">4 Adults</option>
                            <option value="1 Adult, 1 Child">1 Adult, 1 Child</option>
                            <option value="2 Adults, 1 Child">2 Adults, 1 Child</option>
                        </select>
                    </div>

                    <div className="flex items-end">
                        <button
                            type="submit"
                            className="w-full bg-blue-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors"
                        >
                            SEARCH
                        </button>
                    </div>
                </div>

                <div className="flex items-center justify-between pt-4">
                    <div className="flex space-x-4">
                        <a href="#" className="text-blue-600 hover:text-blue-700 text-sm">Apply promo code</a>
                        <a href="#" className="text-blue-600 hover:text-blue-700 text-sm">Multi-city / Stopovers</a>
                    </div>
                </div>
            </div>

        </div>
    );
};

export default BookTripTab;


