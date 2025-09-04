

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SubNavigation from './SubNavigation';

const Hero = () => {
  const navigate = useNavigate();

  return (
    <section className="relative min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-blue-700 overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src="images/white-clouds-blue-sky-daytime.jpg"
          alt="Airplane flying over clouds"
          className="w-full h-full object-cover opacity-100"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900 via-blue-900/80 to-transparent"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col justify-start pt-10 min-h-screen px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Main Headline Section */}
          <div className="mb-8">
            <div className="text-left max-w-2xl mb-4">
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-medium text-white mb-2 leading-tight tracking-wide">
                Travel with us this
                <br />
                <span className="block mt-1">Dashian and Tihar</span>
              </h1>
            </div>
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8 w-full">
              <p className="text-xl md:text-2xl text-blue-100 leading-relaxed max-w-2xl">
                Fly in comfort on our wide-body aircraft, departing from 19 Sep to 28 Nov 2025.
              </p>
              <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-8 rounded-lg text-lg transition-all duration-300 transform hover:scale-105 shadow-lg flex-shrink-0">
                BOOK NOW
              </button>
            </div>
          </div>



          {/* Sub Navigation */}
          <SubNavigation />
        </div>
      </div>
    </section>
  );
};

export default Hero;
