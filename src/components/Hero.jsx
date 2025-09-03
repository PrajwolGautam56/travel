

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
      <div className="relative z-10 flex flex-col justify-center min-h-screen px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Main Headline Section */}
          <div className="mb-8 text-left max-w-2xl">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-medium text-white mb-4 leading-relaxed tracking-wide">
              Travel with us this Dashian and Tihar
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 mb-8 leading-relaxed">
              Fly in comfort on our wide-body aircraft, departing from 19 Sep to 28 Nov 2025.
            </p>
            <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-8 rounded-lg text-lg transition-all duration-300 transform hover:scale-105 shadow-lg">
              BOOK NOW
            </button>
          </div>

          {/* KrisFlyer Login Banner */}
          <div className="bg-gray-100 rounded-lg p-4 mb-6 max-w-4xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <svg className="w-5 h-5 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                </svg>
                <div className="text-sm text-gray-700">
                  <span>Log in to your KrisFlyer account to unlock personalised fare deals, privileges and more. </span>
                  <span>Not a KrisFlyer member? </span>
                  <a href="#" className="text-blue-600 hover:text-blue-700 font-medium">Sign up now</a>
                </div>
              </div>
              <button className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-lg transition-colors">
                LOG IN
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
