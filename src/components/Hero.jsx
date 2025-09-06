

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SubNavigation from './SubNavigation';

const Hero = () => {
  const navigate = useNavigate();

  return (
    <section className="relative min-h-screen bg-orange-500 overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src="images/white-clouds-blue-sky-daytime.jpg"
          alt="Airplane flying over clouds"
          className="w-full h-full object-cover opacity-100"
        />
        <div className="absolute inset-0 bg-orange-600/80 opacity-40"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col justify-start pt-4 sm:pt-6 md:pt-10 min-h-screen px-3 sm:px-4 md:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto w-full">
          {/* Main Headline Section */}
          <div className="mb-4 sm:mb-6 md:mb-8">
            <div className="text-left max-w-2xl mb-3 sm:mb-4">
              <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-medium text-white mb-2 leading-tight tracking-wide">
                Travel with us this
                <br />
                <span className="block mt-1">Dashian and Tihar</span>
              </h1>
            </div>
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 sm:gap-4 mb-4 sm:mb-6 md:mb-8 w-full">
              <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-orange-100 leading-relaxed max-w-2xl">
                Fly in comfort on our wide-body aircraft, departing from 19 Sep to 28 Nov 2025.
              </p>
              <button className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-2.5 sm:py-3 md:py-4 px-4 sm:px-6 md:px-8 rounded-lg text-sm sm:text-base md:text-lg transition-all duration-300 ease-in-out transform hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl flex-shrink-0 w-full sm:w-auto">
                BOOK NOW
              </button>
            </div>
          </div>

          {/* Sub Navigation */}
          <div className="px-2 sm:px-0">
            <SubNavigation />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
