import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SearchForm from './SearchForm';

const Hero = () => {
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
    <section className="relative h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src="images\white-clouds-blue-sky-daytime.jpg"
          alt="Airplane flying over clouds"
          className="w-full h-full object-cover opacity-100"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-blue-900/50 to-blue-900"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col justify-center h-full px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          {/* Main Headline */}
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-medium text-white mb-4 leading-relaxed tracking-wide">
              <span className="font-light text-blue-100">Book Your Flights</span>
              <br />
              <span className="font-normal text-white">In Affordable Price</span>
            </h1>
            {/* <div className="inline-flex items-center bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-full shadow-lg">
              <span className="text-lg font-semibold">Fares starting from ₹55,300</span>
            </div> */}
          </div>

          {/* Search Form */}
          
          <SearchForm />
        </div>
      </div>
    </section>
  );
};

export default Hero;
