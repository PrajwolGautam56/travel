import React from 'react';

const FlightStatusTab = ({ formData, onChange }) => {
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
                <div className="space-y-2 sm:space-y-3">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                        <div>
                            <div className="relative">
                                <input
                                    type="text"
                                    name="pnrNumber"
                                    value={formData.pnrNumber}
                                    onChange={onChange}
                                    placeholder=" "
                                    className="w-full px-3 sm:px-4 h-12 pt-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent form-input text-sm sm:text-base peer"
                                />
                                <label className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm transition-all duration-200 pointer-events-none peer-placeholder-shown:translate-y-0 peer-placeholder-shown:text-sm peer-placeholder-shown:text-gray-500">
                                    PNR number (e.g. ABC123)
                                </label>
                                <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center space-x-1">
                                    {formData.pnrNumber && (
                                        <button
                                            type="button"
                                            onClick={() => clearField('pnrNumber')}
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
                                    name="date"
                                    value={formData.date}
                                    onChange={onChange}
                                    placeholder=" "
                                    className="w-full px-3 sm:px-4 h-12 pt-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent form-input text-sm sm:text-base peer date-input"
                                    style={{ colorScheme: 'light' }}
                                    onClick={(e) => e.target.showPicker && e.target.showPicker()}
                                />
                                <label className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm transition-all duration-200 pointer-events-none peer-placeholder-shown:translate-y-0 peer-placeholder-shown:text-sm peer-placeholder-shown:text-gray-500">
                                    Date
                                </label>
                                <div className="absolute right-2 top-1/2 transform -translate-y-1/2">
                                    <svg className="w-3 h-3 sm:w-4 sm:h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                                    </svg>
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
                                Check Status
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default FlightStatusTab;


