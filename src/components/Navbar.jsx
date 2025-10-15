import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isServicesOpen, setIsServicesOpen] = useState(false);
  const [isMobileServicesOpen, setIsMobileServicesOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState('');
  const navigate = useNavigate();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // Check login status on component mount
  useEffect(() => {
    const loggedIn = localStorage.getItem('isLoggedIn') === 'true';
    const name = localStorage.getItem('userName') || '';
    setIsLoggedIn(loggedIn);
    setUserName(name);
  }, []);

  // Handle click outside to close profile dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isProfileOpen && !event.target.closest('.profile-dropdown')) {
        setIsProfileOpen(false);
      }
    };

    if (isProfileOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isProfileOpen]);

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userName');
    setIsLoggedIn(false);
    setUserName('');
    setIsProfileOpen(false);
    navigate('/');
  };

  const handleLogoClick = (e) => {
    e.preventDefault();
    // Refresh the page and navigate to home
    window.location.href = '/';
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
            <Link to="/" className="flex items-center space-x-2" onClick={handleLogoClick}>
              <img
                src="images/Logo_Transparent .png"
                alt="Recent and Rhythm Tours and Travels Logo"
                className="w-32 h-32 sm:w-40 sm:h-40 md:w-48 md:h-48 object-contain cursor-pointer"
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

              {/* Services Dropdown */}
              <div className="relative">
                <button
                  onMouseEnter={() => setIsServicesOpen(true)}
                  onMouseLeave={() => setIsServicesOpen(false)}
                  className="text-gray-700 hover:text-orange-500 hover:bg-orange-50 px-3 py-2 rounded-md text-sm font-medium transition-all duration-300 ease-in-out transform hover:scale-105 active:scale-95 flex items-center"
                >
                  Services
                  <svg className="ml-1 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {isServicesOpen && (
                  <div
                    className="absolute top-full left-0 mt-1 w-48 bg-white rounded-md shadow-lg py-1 z-50"
                    onMouseEnter={() => setIsServicesOpen(true)}
                    onMouseLeave={() => setIsServicesOpen(false)}
                  >
                    <Link
                      to="/hotels"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-orange-50 hover:text-orange-500 transition-colors"
                    >
                      Hotels
                    </Link>
                    <Link
                      to="/packages"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-orange-50 hover:text-orange-500 transition-colors"
                    >
                      Packages
                    </Link>
                    <Link
                      to="/rentals"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-orange-50 hover:text-orange-500 transition-colors"
                    >
                      Rentals
                    </Link>
                    <Link
                      to="/flights"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-orange-50 hover:text-orange-500 transition-colors"
                    >
                      Flights
                    </Link>
                  </div>
                )}
              </div>

              <Link to="/blog" className="text-gray-700 hover:text-orange-500 hover:bg-orange-50 px-3 py-2 rounded-md text-sm font-medium transition-all duration-300 ease-in-out transform hover:scale-105 active:scale-95">
                Blog
              </Link>
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
            {isLoggedIn ? (
              <>
                {/* Profile Dropdown */}
                <div className="relative profile-dropdown">
                  <button
                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                    className="flex items-center justify-center w-10 h-10 bg-orange-100 rounded-full hover:bg-orange-200 transition-all duration-300 ease-in-out transform hover:scale-105 active:scale-95"
                  >
                    <span className="text-orange-600 font-semibold text-sm">
                      {userName.split(' ').map(n => n[0]).join('')}
                    </span>
                  </button>

                  {isProfileOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 border border-gray-200">
                      <Link
                        to="/profile"
                        onClick={() => setIsProfileOpen(false)}
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-orange-50 hover:text-orange-500 transition-colors"
                      >
                        Profile
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 hover:text-red-700 transition-colors"
                      >
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
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
              </>
            )}
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

            {/* Mobile Services Dropdown */}
            <div>
              <button
                onClick={() => setIsMobileServicesOpen(!isMobileServicesOpen)}
                className="text-gray-700 hover:text-orange-500 hover:bg-orange-50 w-full text-left px-3 py-2 rounded-md text-base font-medium transition-all duration-300 ease-in-out transform hover:scale-105 active:scale-95 flex items-center justify-between"
              >
                Services
                <svg className={`h-4 w-4 transition-transform ${isMobileServicesOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {isMobileServicesOpen && (
                <div className="ml-4 mt-1 space-y-1">
                  <Link
                    to="/hotels"
                    className="text-gray-600 hover:text-orange-500 hover:bg-orange-50 block px-3 py-2 rounded-md text-sm font-medium transition-all duration-300 ease-in-out transform hover:scale-105 active:scale-95"
                    onClick={() => {
                      setIsMenuOpen(false);
                      setIsMobileServicesOpen(false);
                    }}
                  >
                    Hotels
                  </Link>
                  <Link
                    to="/packages"
                    className="text-gray-600 hover:text-orange-500 hover:bg-orange-50 block px-3 py-2 rounded-md text-sm font-medium transition-all duration-300 ease-in-out transform hover:scale-105 active:scale-95"
                    onClick={() => {
                      setIsMenuOpen(false);
                      setIsMobileServicesOpen(false);
                    }}
                  >
                    Packages
                  </Link>
                  <Link
                    to="/rentals"
                    className="text-gray-600 hover:text-orange-500 hover:bg-orange-50 block px-3 py-2 rounded-md text-sm font-medium transition-all duration-300 ease-in-out transform hover:scale-105 active:scale-95"
                    onClick={() => {
                      setIsMenuOpen(false);
                      setIsMobileServicesOpen(false);
                    }}
                  >
                    Rentals
                  </Link>
                  <Link
                    to="/flights"
                    className="text-gray-600 hover:text-orange-500 hover:bg-orange-50 block px-3 py-2 rounded-md text-sm font-medium transition-all duration-300 ease-in-out transform hover:scale-105 active:scale-95"
                    onClick={() => {
                      setIsMenuOpen(false);
                      setIsMobileServicesOpen(false);
                    }}
                  >
                    Flights
                  </Link>
                </div>
              )}
            </div>

            <Link
              to="/blog"
              className="text-gray-700 hover:text-orange-500 hover:bg-orange-50 block px-3 py-2 rounded-md text-base font-medium transition-all duration-300 ease-in-out transform hover:scale-105 active:scale-95"
              onClick={() => setIsMenuOpen(false)}
            >
              Blog
            </Link>
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
              {isLoggedIn ? (
                <>
                  <div className="flex items-center space-x-3 px-3 py-2 mb-3">
                    <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                      <span className="text-orange-600 font-semibold">
                        {userName.split(' ').map(n => n[0]).join('')}
                      </span>
                    </div>
                    <div>
                      <p className="text-gray-900 font-medium">Hi, {userName.split(' ')[0]}</p>
                      <p className="text-sm text-gray-600">{localStorage.getItem('userEmail')}</p>
                    </div>
                  </div>
                  <Link
                    to="/profile"
                    className="text-gray-700 hover:text-orange-500 hover:bg-orange-50 block px-3 py-2 rounded-md text-base font-medium transition-all duration-300 ease-in-out transform hover:scale-105 active:scale-95 w-full text-left"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Profile
                  </Link>
                  <button
                    onClick={() => {
                      handleLogout();
                      setIsMenuOpen(false);
                    }}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50 block px-3 py-2 rounded-md text-base font-medium transition-all duration-300 ease-in-out transform hover:scale-105 active:scale-95 w-full text-left mt-2"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
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
                </>
              )}
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
