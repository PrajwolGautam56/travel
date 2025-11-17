import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';

const PopularPackages = () => {
  const originalPackages = [
    {
      id: 1,
      title: 'London & Paris Adventure',
      destination: 'Nepal & India',
      image: 'https://images.unsplash.com/photo-1513634489774-f96762e6f3b6?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      price: 'Rs.89,999',
      originalPrice: 'Rs.1,25,000',
      discount: '28% OFF',
      duration: '7 Days / 6 Nights',
      highlights: ['Big Ben', 'Eiffel Tower', 'Louvre Museum', 'Buckingham Palace']
    },
    {
      id: 2,
      title: 'Dubai Luxury Escape',
      destination: 'Nepal',
      image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      price: 'Rs.65,500',
      originalPrice: 'Rs.89,000',
      discount: '26% OFF',
      duration: '5 Days / 4 Nights',
      highlights: ['Burj Khalifa', 'Desert Safari', 'Palm Jumeirah', 'Dubai Mall']
    },
    {
      id: 3,
      title: 'Singapore & Malaysia',
      destination: 'Nepal',
      image: 'https://images.unsplash.com/photo-1525625293386-3f8f99389edd?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      price: 'Rs.52,800',
      originalPrice: 'Rs.72,000',
      discount: '27% OFF',
      duration: '6 Days / 5 Nights',
      highlights: ['Marina Bay Sands', 'Sentosa Island', 'Petronas Towers', 'Singapore Flyer']
    },
    {
      id: 4,
      title: 'Bali Paradise',
      destination: 'Indonesia',
      image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      price: 'Rs.45,000',
      originalPrice: 'Rs.65,000',
      discount: '31% OFF',
      duration: '6 Days / 5 Nights',
      highlights: ['Ubud Rice Terraces', 'Tanah Lot Temple', 'Seminyak Beach', 'Monkey Forest']
    },
    {
      id: 5,
      title: 'Swiss Alps Adventure',
      destination: 'Switzerland',
      image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      price: 'Rs.1,25,000',
      originalPrice: 'Rs.1,75,000',
      discount: '29% OFF',
      duration: '8 Days / 7 Nights',
      highlights: ['Matterhorn', 'Jungfraujoch', 'Interlaken', 'Lucerne']
    },
    {
      id: 6,
      title: 'Tokyo & Kyoto Experience',
      destination: 'Japan',
      image: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      price: 'Rs.95,000',
      originalPrice: 'Rs.1,30,000',
      discount: '27% OFF',
      duration: '7 Days / 6 Nights',
      highlights: ['Tokyo Tower', 'Mount Fuji', 'Fushimi Inari', 'Shibuya Crossing']
    }
  ];

  // Create infinite loop by duplicating packages
  const packages = [...originalPackages, ...originalPackages, ...originalPackages];
  
  // Start from the middle set (second copy) for infinite loop
  const startIndex = originalPackages.length;
  
  // Always show 3 cards
  const cardsToShow = 3;

  const [currentIndex, setCurrentIndex] = useState(startIndex);
  const [isPaused, setIsPaused] = useState(false);
  const [cardWidth, setCardWidth] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(true);
  const autoSlideRef = useRef(null);
  const containerRef = useRef(null);
  const cardRef = useRef(null);

  // Measure card width after initial render and on resize
  useEffect(() => {
    const updateCardWidth = () => {
      if (cardRef.current) {
        setCardWidth(cardRef.current.offsetWidth);
      }
    };

    // Initial measurement with delay to ensure DOM is ready
    const timer = setTimeout(updateCardWidth, 100);
    
    // Also measure on resize
    const handleResize = () => {
      setTimeout(updateCardWidth, 50);
    };

    window.addEventListener('resize', handleResize);
    
    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // Calculate max index - we can go through all packages since we have duplicates
  const maxIndex = originalPackages.length * 2;

  // Auto-slide functionality - slides every 2.5 seconds smoothly
  useEffect(() => {
    // Clear any existing interval first
    if (autoSlideRef.current) {
      clearInterval(autoSlideRef.current);
      autoSlideRef.current = null;
    }

    if (isPaused) {
      return;
    }

    // Start auto-slide immediately
    const startAutoSlide = () => {
      autoSlideRef.current = setInterval(() => {
        setCurrentIndex((prevIndex) => {
          const nextIndex = prevIndex + 1;
          // If we've reached the end of the second set, jump back to start of second set (seamlessly)
          if (nextIndex >= maxIndex) {
            // Reset to start of second set without animation after transition completes
            setTimeout(() => {
              setIsTransitioning(false);
              setCurrentIndex(startIndex);
              setTimeout(() => {
                setIsTransitioning(true);
              }, 10);
            }, 1000); // Wait for transition to complete (matches transition duration)
            return nextIndex; // Continue to next index first
          }
          return nextIndex;
        });
      }, 2500); // 2.5 seconds for smooth continuous sliding
    };

    // Start immediately
    startAutoSlide();

    return () => {
      if (autoSlideRef.current) {
        clearInterval(autoSlideRef.current);
        autoSlideRef.current = null;
      }
    };
  }, [isPaused, maxIndex, startIndex]);

  // Navigation handlers
  const goToPrevious = () => {
    // Reset auto-slide timer
    if (autoSlideRef.current) {
      clearInterval(autoSlideRef.current);
      autoSlideRef.current = null;
    }
    
    setCurrentIndex((prevIndex) => {
      const newIndex = prevIndex - 1;
      // If we go before the start of second set, jump to end of second set
      if (newIndex < startIndex) {
        setTimeout(() => {
          setIsTransitioning(false);
          setCurrentIndex(maxIndex - 1);
          setTimeout(() => setIsTransitioning(true), 10);
        }, 1000);
        return newIndex; // Go to new index first
      }
      return newIndex;
    });
    
    // Restart auto-slide after a delay
    setTimeout(() => {
      if (!isPaused) {
        // Auto-slide will restart via useEffect
      }
    }, 100);
  };

  const goToNext = () => {
    // Reset auto-slide timer
    if (autoSlideRef.current) {
      clearInterval(autoSlideRef.current);
      autoSlideRef.current = null;
    }
    
    setCurrentIndex((prevIndex) => {
      const newIndex = prevIndex + 1;
      // If we've reached the end, jump back to start of second set
      if (newIndex >= maxIndex) {
        setTimeout(() => {
          setIsTransitioning(false);
          setCurrentIndex(startIndex);
          setTimeout(() => setIsTransitioning(true), 10);
        }, 1000);
        return newIndex; // Go to new index first
      }
      return newIndex;
    });
    
    // Restart auto-slide after a delay
    setTimeout(() => {
      if (!isPaused) {
        // Auto-slide will restart via useEffect
      }
    }, 100);
  };

  // Calculate transform value based on actual card width
  const getTransform = () => {
    if (!containerRef.current) return 'translateX(0)';
    
    const gap = 24; // 24px gap (gap-6)
    // Calculate exact card width: (containerWidth - 2*gaps) / 3 cards
    // For 3 cards, we have 2 gaps between them
    const containerWidth = containerRef.current.offsetWidth;
    if (containerWidth === 0) {
      // If container width is not ready, use a fallback calculation
      // This ensures sliding works even before measurements are complete
      const fallbackWidth = typeof window !== 'undefined' ? window.innerWidth * 0.8 : 1200;
      const totalGaps = gap * 2;
      const cardWidthExact = (fallbackWidth - totalGaps) / 3;
      const cardWidthWithGap = cardWidthExact + gap;
      const translateX = -(currentIndex * cardWidthWithGap);
      return `translateX(${translateX}px)`;
    }
    
    const totalGaps = gap * 2; // 2 gaps for 3 cards
    const cardWidthExact = (containerWidth - totalGaps) / 3;
    const cardWidthWithGap = cardWidthExact + gap;
    const translateX = -(currentIndex * cardWidthWithGap);
    
    return `translateX(${translateX}px)`;
  };

  return (
    <section className="py-12 sm:py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-8 sm:mb-12">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-3 sm:mb-4">
            Popular Holiday Packages
          </h2>
          <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto px-4">
            Discover our handpicked travel experiences with flights, hotels, and guided tours included
          </p>
        </div>

        {/* Packages Carousel */}
        <div 
          className="relative mb-8 sm:mb-12"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          {/* Navigation Arrows */}
          <button
            onClick={goToPrevious}
            className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 z-10 bg-white rounded-full shadow-lg p-2 sm:p-3 hover:bg-orange-500 hover:text-white transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
            aria-label="Previous packages"
          >
            <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          <button
            onClick={goToNext}
            className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 z-10 bg-white rounded-full shadow-lg p-2 sm:p-3 hover:bg-orange-500 hover:text-white transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
            aria-label="Next packages"
          >
            <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>

          {/* Carousel Container */}
          <div className="overflow-hidden px-10 sm:px-12 md:px-16">
            <div
              ref={containerRef}
              className="flex gap-6"
              style={{
                transform: getTransform(),
                transition: isTransitioning ? 'transform 1000ms cubic-bezier(0.4, 0, 0.2, 1)' : 'none',
                willChange: 'transform'
              }}
            >
                {packages.map((pkg, index) => {
                  // Calculate exact width for 3 cards: (100% - 2*gaps) / 3
                  // gap-6 = 24px, so 2 gaps = 48px
                  const cardWidthStyle = { width: 'calc((100% - 48px) / 3)' };
                  
                  return (
                    <div
                      key={`${pkg.id}-${index}`}
                      ref={index === startIndex ? cardRef : null}
                      className="flex-shrink-0 bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
                      style={cardWidthStyle}
                    >
                {/* Package Image */}
                <div className="relative h-40 sm:h-48">
                  <img
                    src={pkg.image}
                    alt={pkg.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-3 sm:top-4 right-3 sm:right-4">
                    <span className="bg-orange-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                      {pkg.discount}
                    </span>
                  </div>
                </div>

                {/* Package Content */}
                <div className="p-4 sm:p-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs sm:text-sm text-orange-500 font-medium">{pkg.destination}</span>
                    <span className="text-xs sm:text-sm text-gray-500">{pkg.duration}</span>
                  </div>

                  <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-3">{pkg.title}</h3>

                  <div className="mb-4">
                    <h4 className="text-xs sm:text-sm font-semibold text-gray-900 mb-2">Highlights:</h4>
                    <div className="flex gap-1 sm:gap-2 overflow-hidden">
                      {pkg.highlights.slice(0, 3).map((highlight, index) => (
                        <span 
                          key={index} 
                          className="bg-orange-100 text-orange-800 text-xs px-2 py-1 rounded-full whitespace-nowrap flex-shrink-0"
                        >
                          {highlight}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <div className="text-xl sm:text-2xl font-bold text-orange-500">{pkg.price}</div>
                      <div className="text-xs sm:text-sm text-gray-500 line-through">{pkg.originalPrice}</div>
                    </div>
                    <Link
                      to="/packages"
                      className="bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2 px-3 sm:px-4 rounded-lg transition-colors duration-300 cursor-pointer text-sm sm:text-base"
                      onClick={(e) => e.stopPropagation()}
                    >
                      Book Now
                    </Link>
                  </div>
                </div>
              </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* View All Button */}
        <div className="text-center">
          <Link
            to="/packages"
            className="inline-flex items-center px-4 sm:px-6 py-2.5 sm:py-3 bg-green-500 text-white font-semibold rounded-lg hover:bg-green-600 transition-colors duration-300 text-sm sm:text-base"
          >
            View All Packages
            <svg className="ml-2 w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default PopularPackages;
