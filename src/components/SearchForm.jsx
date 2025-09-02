import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const SearchForm = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        from: '',
        to: '',
        departureDate: '',
        returnDate: '',
        passengers: 1
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Search form data:', formData);
        // Navigate to flight search results page
        navigate('/flight-search', {
            state: { searchData: formData }
        });
    };

    const swapLocations = () => {
        setFormData(prev => ({
            ...prev,
            from: prev.to,
            to: prev.from
        }));
    };

    return (
        
        <>
            
            <div className="relative">
                <div className="bg-white rounded-2xl shadow-2xl p-6 md:p-8 max-w-8xl mx-auto">
                    {/* Flight Type Tabs */}
                    <div className="flex flex-wrap gap-4 mb-6 border-b border-gray-200">
                        <button className="flex items-center space-x-2 text-blue-600 border-b-2 border-blue-600 pb-2">
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
                            </svg>
                            <span className="text-sm font-medium">Return</span>
                        </button>
                        <button className="flex items-center space-x-2 text-gray-500 hover:text-gray-700 pb-2">
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
                            </svg>
                            <span className="text-sm">One Way</span>
                        </button>
                        <button className="flex items-center space-x-2 text-gray-500 hover:text-gray-700 pb-2">
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span className="text-sm">Multi-city</span>
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 items-end">
                            {/* From */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">From</label>
                                <input
                                    type="text"
                                    name="from"
                                    value={formData.from}
                                    onChange={handleInputChange}
                                    placeholder="Departure City"
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    required
                                />
                            </div>

                            {/* Swap Button */}
                            <div className="flex justify-center">
                                <button
                                    type="button"
                                    onClick={swapLocations}
                                    className="p-3 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors duration-200"
                                >
                                    <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
                                    </svg>
                                </button>
                            </div>

                            {/* To */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">To</label>
                                <input
                                    type="text"
                                    name="to"
                                    value={formData.to}
                                    onChange={handleInputChange}
                                    placeholder="Destination City"
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    required
                                />
                            </div>

                            {/* Departure Date */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Departure</label>
                                <input
                                    type="date"
                                    name="departureDate"
                                    value={formData.departureDate}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    required
                                />
                            </div>

                            {/* Return Date */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Return</label>
                                <input
                                    type="date"
                                    name="returnDate"
                                    value={formData.returnDate}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    required
                                />
                            </div>
                        </div>

                        {/* Second Row */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                            {/* Passengers */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Passengers</label>
                                <select
                                    name="passengers"
                                    value={formData.passengers}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                >
                                    {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => (
                                        <option key={num} value={num}>{num} Passenger{num > 1 ? 's' : ''}</option>
                                    ))}
                                </select>
                            </div>

                            {/* Cabin Class */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Cabin Class</label>
                                <select
                                    name="cabinClass"
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                >
                                    <option value="economy">Economy</option>
                                    <option value="premium-economy">Premium Economy</option>
                                    <option value="business">Business</option>
                                    <option value="first">First Class</option>
                                </select>
                            </div>

                            {/* Search Button */}
                            <div>
                                <button
                                    type="submit"
                                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold py-4 px-8 rounded-lg text-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
                                >
                                    Search Flights
                                </button>
                            </div>
                        </div>

                        {/* Additional Options */}
                        <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-gray-200">
                            <div className="flex items-center space-x-4">
                                <label className="flex items-center">
                                    <input type="checkbox" className="text-blue-600 rounded" />
                                    <span className="ml-2 text-sm text-gray-700">Book using Avios</span>
                                </label>
                                <label className="flex items-center">
                                    <input type="checkbox" className="text-blue-600 rounded" />
                                    <span className="ml-2 text-sm text-gray-700">Flexible dates</span>
                                </label>
                            </div>
                            <a href="#" className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                                + Add promo code
                            </a>
                        </div>
                    </form>
                </div>
            </div>

        </>
    )
};

export default SearchForm;
