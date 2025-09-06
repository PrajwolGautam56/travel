import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const navigate = useNavigate();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // Handle navbar visibility on scroll
  useEffect(() => {
    let timeoutId;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const scrollDifference = Math.abs(currentScrollY - lastScrollY);

      // Clear any existing timeout
      if (timeoutId) {
        clearTimeout(timeoutId);
      }

      if (currentScrollY < 10) {
        // Always show at the very top
        setIsVisible(true);
      } else if (currentScrollY > lastScrollY && currentScrollY > 100 && scrollDifference > 5) {
        // Scrolling down - hide navbar with a small delay for smoother effect
        timeoutId = setTimeout(() => {
          setIsVisible(false);
        }, 150);
      } else if (currentScrollY < lastScrollY && scrollDifference > 10) {
        // Scrolling up - show navbar immediately but smoothly
        setIsVisible(true);
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [lastScrollY]);

  return (
    <nav className={`bg-white shadow-lg sticky top-0 z-50 transition-transform duration-500 ease-out ${isVisible ? 'translate-y-0' : '-translate-y-full'
      }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link to="/" className="flex items-center space-x-2">
              <img
                src="images/Logo_Transparent .png"
                alt="Recent and Rhythm Tours and Travels Logo"
                className="w-32 h-32 sm:w-40 sm:h-40 md:w-48 md:h-48 object-contain"
              />
              {/* <span className="text-xl font-bold text-gray-900">Recent and Rhythm Tours and Travels</span> */}
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-8">
              <Link to="/" className="text-gray-700 hover:text-orange-500 hover:bg-orange-50 px-3 py-2 rounded-md text-sm font-medium transition-all duration-300 ease-in-out transform hover:scale-105 active:scale-95">
                Home
              </Link>
              <Link to="/packages" className="text-gray-700 hover:text-orange-500 hover:bg-orange-50 px-3 py-2 rounded-md text-sm font-medium transition-all duration-300 ease-in-out transform hover:scale-105 active:scale-95">
                Packages
              </Link>
              <Link to="/hotels" className="text-gray-700 hover:text-orange-500 hover:bg-orange-50 px-3 py-2 rounded-md text-sm font-medium transition-all duration-300 ease-in-out transform hover:scale-105 active:scale-95">
                Hotels
              </Link>
              <Link to="/blog" className="text-gray-700 hover:text-orange-500 hover:bg-orange-50 px-3 py-2 rounded-md text-sm font-medium transition-all duration-300 ease-in-out transform hover:scale-105 active:scale-95">
                Blog
              </Link>
              <a href="#flights" className="text-gray-700 hover:text-orange-500 hover:bg-orange-50 px-3 py-2 rounded-md text-sm font-medium transition-all duration-300 ease-in-out transform hover:scale-105 active:scale-95">
                Flights
              </a>
              <Link to="/about" className="text-gray-700 hover:text-orange-500 hover:bg-orange-50 px-3 py-2 rounded-md text-sm font-medium transition-all duration-300 ease-in-out transform hover:scale-105 active:scale-95">
                About
              </Link>
              <Link to="/contact" className="text-gray-700 hover:text-orange-500 hover:bg-orange-50 px-3 py-2 rounded-md text-sm font-medium transition-all duration-300 ease-in-out transform hover:scale-105 active:scale-95">
                Contact Us
              </Link>
            </div>
          </div>

          {/* Desktop Auth Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            <button
              onClick={() => navigate('/login')}
              className="text-gray-700 hover:text-orange-500 hover:bg-orange-50 px-3 py-2 rounded-md text-sm font-medium transition-all duration-300 ease-in-out transform hover:scale-105 active:scale-95"
            >
              Login
            </button>
            <button
              onClick={() => navigate('/signup')}
              className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-md text-sm font-medium transition-all duration-300 ease-in-out transform hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl"
            >
              Sign Up
            </button>
            <Link
              to="/admin/login"
              className="text-gray-500 hover:text-green-600 hover:bg-green-50 px-3 py-2 rounded-md text-sm font-medium transition-all duration-300 ease-in-out transform hover:scale-105 active:scale-95 border border-gray-300 hover:border-green-300"
            >
              Admin
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={toggleMenu}
              className="text-gray-700 hover:text-orange-500 focus:outline-none focus:text-orange-500"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      {isMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white border-t">
            <Link
              to="/"
              className="text-gray-700 hover:text-orange-500 hover:bg-orange-50 block px-3 py-2 rounded-md text-base font-medium transition-all duration-300 ease-in-out transform hover:scale-105 active:scale-95"
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </Link>
            <Link
              to="/packages"
              className="text-gray-700 hover:text-orange-500 hover:bg-orange-50 block px-3 py-2 rounded-md text-base font-medium transition-all duration-300 ease-in-out transform hover:scale-105 active:scale-95"
              onClick={() => setIsMenuOpen(false)}
            >
              Packages
            </Link>
            <Link
              to="/hotels"
              className="text-gray-700 hover:text-orange-500 hover:bg-orange-50 block px-3 py-2 rounded-md text-base font-medium transition-all duration-300 ease-in-out transform hover:scale-105 active:scale-95"
              onClick={() => setIsMenuOpen(false)}
            >
              Hotels
            </Link>
            <Link
              to="/blog"
              className="text-gray-700 hover:text-orange-500 hover:bg-orange-50 block px-3 py-2 rounded-md text-base font-medium transition-all duration-300 ease-in-out transform hover:scale-105 active:scale-95"
              onClick={() => setIsMenuOpen(false)}
            >
              Blog
            </Link>
            <a
              href="#flights"
              className="text-gray-700 hover:text-orange-500 hover:bg-orange-50 block px-3 py-2 rounded-md text-base font-medium transition-all duration-300 ease-in-out transform hover:scale-105 active:scale-95"
              onClick={() => setIsMenuOpen(false)}
            >
              Flights
            </a>
            <Link
              to="/about"
              className="text-gray-700 hover:text-orange-500 hover:bg-orange-50 block px-3 py-2 rounded-md text-base font-medium transition-all duration-300 ease-in-out transform hover:scale-105 active:scale-95"
              onClick={() => setIsMenuOpen(false)}
            >
              About
            </Link>
            <Link
              to="/contact"
              className="text-gray-700 hover:text-orange-500 hover:bg-orange-50 block px-3 py-2 rounded-md text-base font-medium transition-all duration-300 ease-in-out transform hover:scale-105 active:scale-95"
              onClick={() => setIsMenuOpen(false)}
            >
              Contact Us
            </Link>

            {/* Mobile Auth Buttons */}
            <div className="pt-4 pb-3 border-t border-gray-200">
              <button
                onClick={() => {
                  navigate('/login');
                  setIsMenuOpen(false);
                }}
                className="text-gray-700 hover:text-orange-500 hover:bg-orange-50 block px-3 py-2 rounded-md text-base font-medium transition-all duration-300 ease-in-out transform hover:scale-105 active:scale-95 w-full text-left"
              >
                Login
              </button>
              <button
                onClick={() => {
                  navigate('/signup');
                  setIsMenuOpen(false);
                }}
                className="bg-orange-500 hover:bg-orange-600 text-white block px-3 py-2 rounded-lg text-base font-medium transition-all duration-300 ease-in-out transform hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl w-full text-center mt-2"
              >
                Sign Up
              </button>
              <Link
                to="/admin/login"
                className="text-gray-500 hover:text-green-600 hover:bg-green-50 block px-3 py-2 rounded-md text-base font-medium transition-all duration-300 ease-in-out transform hover:scale-105 active:scale-95 w-full text-center mt-2 border border-gray-300 hover:border-green-300"
                onClick={() => setIsMenuOpen(false)}
              >
                Admin Panel
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
