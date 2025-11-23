import React, { useState, useEffect, useRef } from 'react';

// Popular airports database with IATA codes
const POPULAR_AIRPORTS = [
    // Nepal
    { code: 'KTM', name: 'Tribhuvan International Airport', city: 'Kathmandu', country: 'Nepal' },
    { code: 'PKR', name: 'Pokhara Airport', city: 'Pokhara', country: 'Nepal' },
    { code: 'BWA', name: 'Gautam Buddha Airport', city: 'Bhairahawa', country: 'Nepal' },
    { code: 'BIR', name: 'Biratnagar Airport', city: 'Biratnagar', country: 'Nepal' },
    
    // India
    { code: 'DEL', name: 'Indira Gandhi International Airport', city: 'New Delhi', country: 'India' },
    { code: 'BOM', name: 'Chhatrapati Shivaji Maharaj International Airport', city: 'Mumbai', country: 'India' },
    { code: 'BLR', name: 'Kempegowda International Airport', city: 'Bangalore', country: 'India' },
    { code: 'CCU', name: 'Netaji Subhas Chandra Bose International Airport', city: 'Kolkata', country: 'India' },
    { code: 'MAA', name: 'Chennai International Airport', city: 'Chennai', country: 'India' },
    { code: 'HYD', name: 'Rajiv Gandhi International Airport', city: 'Hyderabad', country: 'India' },
    { code: 'AMD', name: 'Sardar Vallabhbhai Patel International Airport', city: 'Ahmedabad', country: 'India' },
    { code: 'PNQ', name: 'Pune Airport', city: 'Pune', country: 'India' },
    
    // Asia
    { code: 'DXB', name: 'Dubai International Airport', city: 'Dubai', country: 'UAE' },
    { code: 'BKK', name: 'Suvarnabhumi Airport', city: 'Bangkok', country: 'Thailand' },
    { code: 'SIN', name: 'Changi Airport', city: 'Singapore', country: 'Singapore' },
    { code: 'KUL', name: 'Kuala Lumpur International Airport', city: 'Kuala Lumpur', country: 'Malaysia' },
    { code: 'HKG', name: 'Hong Kong International Airport', city: 'Hong Kong', country: 'Hong Kong' },
    { code: 'ICN', name: 'Incheon International Airport', city: 'Seoul', country: 'South Korea' },
    { code: 'NRT', name: 'Narita International Airport', city: 'Tokyo', country: 'Japan' },
    { code: 'PEK', name: 'Beijing Capital International Airport', city: 'Beijing', country: 'China' },
    { code: 'PVG', name: 'Shanghai Pudong International Airport', city: 'Shanghai', country: 'China' },
    { code: 'DOH', name: 'Hamad International Airport', city: 'Doha', country: 'Qatar' },
    { code: 'AUH', name: 'Abu Dhabi International Airport', city: 'Abu Dhabi', country: 'UAE' },
    
    // Europe
    { code: 'LHR', name: 'Heathrow Airport', city: 'London', country: 'United Kingdom' },
    { code: 'CDG', name: 'Charles de Gaulle Airport', city: 'Paris', country: 'France' },
    { code: 'FRA', name: 'Frankfurt Airport', city: 'Frankfurt', country: 'Germany' },
    { code: 'AMS', name: 'Schiphol Airport', city: 'Amsterdam', country: 'Netherlands' },
    { code: 'IST', name: 'Istanbul Airport', city: 'Istanbul', country: 'Turkey' },
    { code: 'FCO', name: 'Leonardo da Vinci Airport', city: 'Rome', country: 'Italy' },
    { code: 'MAD', name: 'Adolfo Suárez Madrid–Barajas Airport', city: 'Madrid', country: 'Spain' },
    { code: 'MUC', name: 'Munich Airport', city: 'Munich', country: 'Germany' },
    
    // North America
    { code: 'JFK', name: 'John F. Kennedy International Airport', city: 'New York', country: 'USA' },
    { code: 'LAX', name: 'Los Angeles International Airport', city: 'Los Angeles', country: 'USA' },
    { code: 'ORD', name: "O'Hare International Airport", city: 'Chicago', country: 'USA' },
    { code: 'MIA', name: 'Miami International Airport', city: 'Miami', country: 'USA' },
    { code: 'SFO', name: 'San Francisco International Airport', city: 'San Francisco', country: 'USA' },
    { code: 'YYZ', name: 'Toronto Pearson International Airport', city: 'Toronto', country: 'Canada' },
    
    // Australia/Oceania
    { code: 'SYD', name: 'Sydney Kingsford Smith Airport', city: 'Sydney', country: 'Australia' },
    { code: 'MEL', name: 'Melbourne Airport', city: 'Melbourne', country: 'Australia' },
];

const AirportAutocomplete = ({ value, onChange, placeholder, id, name }) => {
    const [inputValue, setInputValue] = useState(value || '');
    const [suggestions, setSuggestions] = useState([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [selectedIndex, setSelectedIndex] = useState(-1);
    const inputRef = useRef(null);
    const suggestionsRef = useRef(null);

    useEffect(() => {
        if (value !== inputValue) {
            setInputValue(value || '');
        }
    }, [value]);

    const filterAirports = (query) => {
        if (!query || query.length < 1) {
            return POPULAR_AIRPORTS.slice(0, 10); // Show top 10 by default
        }

        const lowerQuery = query.toLowerCase();
        return POPULAR_AIRPORTS.filter(airport => {
            return (
                airport.code.toLowerCase().includes(lowerQuery) ||
                airport.name.toLowerCase().includes(lowerQuery) ||
                airport.city.toLowerCase().includes(lowerQuery) ||
                airport.country.toLowerCase().includes(lowerQuery)
            );
        }).slice(0, 10); // Limit to 10 results
    };

    const handleInputChange = (e) => {
        const newValue = e.target.value;
        setInputValue(newValue);
        setSelectedIndex(-1);

        if (newValue.length > 0) {
            const filtered = filterAirports(newValue);
            setSuggestions(filtered);
            setShowSuggestions(true);
        } else {
            setSuggestions([]);
            setShowSuggestions(false);
        }

        // Update parent component
        onChange({
            target: {
                name: name,
                value: newValue
            }
        });
    };

    const handleSelect = (airport) => {
        const displayValue = `${airport.code} - ${airport.city}`;
        setInputValue(displayValue);
        setShowSuggestions(false);
        setSuggestions([]);
        
        // Update parent with airport code
        onChange({
            target: {
                name: name,
                value: airport.code
            }
        });
    };

    const handleKeyDown = (e) => {
        if (!showSuggestions || suggestions.length === 0) return;

        switch (e.key) {
            case 'ArrowDown':
                e.preventDefault();
                setSelectedIndex(prev => 
                    prev < suggestions.length - 1 ? prev + 1 : prev
                );
                break;
            case 'ArrowUp':
                e.preventDefault();
                setSelectedIndex(prev => prev > 0 ? prev - 1 : -1);
                break;
            case 'Enter':
                e.preventDefault();
                if (selectedIndex >= 0 && selectedIndex < suggestions.length) {
                    handleSelect(suggestions[selectedIndex]);
                }
                break;
            case 'Escape':
                setShowSuggestions(false);
                break;
            default:
                break;
        }
    };

    const handleFocus = () => {
        if (inputValue.length > 0) {
            const filtered = filterAirports(inputValue);
            setSuggestions(filtered);
            setShowSuggestions(true);
        } else {
            setSuggestions(POPULAR_AIRPORTS.slice(0, 10));
            setShowSuggestions(true);
        }
    };

    const handleBlur = (e) => {
        // Delay to allow click events on suggestions
        setTimeout(() => {
            setShowSuggestions(false);
        }, 200);
    };

    return (
        <div className="relative">
            <input
                ref={inputRef}
                type="text"
                id={id}
                name={name}
                value={inputValue}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                onFocus={handleFocus}
                onBlur={handleBlur}
                placeholder={placeholder || "City or Airport"}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                autoComplete="off"
            />
            
            {showSuggestions && suggestions.length > 0 && (
                <div
                    ref={suggestionsRef}
                    className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto"
                >
                    {suggestions.map((airport, index) => (
                        <div
                            key={`${airport.code}-${index}`}
                            onClick={() => handleSelect(airport)}
                            className={`px-4 py-3 cursor-pointer hover:bg-orange-50 transition-colors ${
                                index === selectedIndex ? 'bg-orange-50' : ''
                            } ${index !== suggestions.length - 1 ? 'border-b border-gray-200' : ''}`}
                        >
                            <div className="flex items-center justify-between">
                                <div className="flex-1">
                                    <div className="flex items-center gap-2">
                                        <span className="font-semibold text-gray-900">{airport.code}</span>
                                        <span className="text-sm text-gray-600">{airport.city}</span>
                                    </div>
                                    <div className="text-xs text-gray-500 mt-1">
                                        {airport.name}, {airport.country}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default AirportAutocomplete;

