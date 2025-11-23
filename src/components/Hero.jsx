

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SubNavigation from './SubNavigation';

const Hero = () => {
  const navigate = useNavigate();

  return (
    <section className="hero-section relative min-h-screen bg-gradient-to-br from-orange-500 via-orange-600 to-orange-700 overflow-hidden">
      {/* Background Image with Enhanced Overlay */}
      <div className="absolute inset-0">
        <img
          src="images/white-clouds-blue-sky-daytime.jpg"
          alt="Airplane flying over clouds"
          className="w-full h-full object-cover opacity-100"
        />
        {/* Enhanced Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-orange-600/90 via-orange-700/80 to-orange-800/70"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent"></div>
      </div>

      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-72 h-72 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-orange-300/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col justify-start pt-20 sm:pt-24 md:pt-28 min-h-screen px-3 sm:px-4 md:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto w-full">
          {/* Main Headline Section */}
          <div className="mb-6 sm:mb-8 md:mb-10 animate-fade-in">
            <div className="text-left mb-4 sm:mb-5">
              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-white mb-3 leading-tight tracking-wide drop-shadow-lg">
                Travel with us this
                <br />
                <span className="block mt-2 bg-gradient-to-r from-white via-orange-50 to-white bg-clip-text text-transparent">
                  Dashian and Tihar
                </span>
              </h1>
            </div>
            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 sm:gap-5 mb-6 sm:mb-8 md:mb-10">
              <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-white/95 leading-relaxed max-w-2xl flex-1 drop-shadow-md">
                Fly in comfort on our wide-body aircraft, departing from 19 Sep to 28 Nov 2025.
              </p>
              <button
                onClick={() => navigate('/packages')}
                className="group relative bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-bold py-3 sm:py-4 md:py-5 px-6 sm:px-8 md:px-10 rounded-xl text-sm sm:text-base md:text-lg transition-all duration-300 ease-in-out transform hover:scale-105 active:scale-95 shadow-2xl hover:shadow-orange-500/50 flex-shrink-0 w-full sm:w-auto md:mt-0 overflow-hidden"
              >
                <span className="relative z-10">BOOK NOW</span>
                <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
              </button>
            </div>
          </div>

          {/* Sub Navigation */}
          <div className="w-full">
            <SubNavigation />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
