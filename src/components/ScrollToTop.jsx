import React, { useState, useEffect } from 'react';

const ScrollToTop = () => {
    const [isVisible, setIsVisible] = useState(false);

    // Show button when page is scrolled down
    useEffect(() => {
        const toggleVisibility = () => {
            if (window.pageYOffset > 300) {
                setIsVisible(true);
            } else {
                setIsVisible(false);
            }
        };

        window.addEventListener('scroll', toggleVisibility);
        return () => window.removeEventListener('scroll', toggleVisibility);
    }, []);

    // Scroll to top very quickly
    const scrollToTop = () => {
        // Use native smooth scroll but with custom timing for speed
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });

        // Override with faster custom scroll if needed
        setTimeout(() => {
            const currentPosition = window.pageYOffset;
            if (currentPosition > 50) {
                // If still not at top, use instant scroll
                window.scrollTo(0, 0);
            }
        }, 200);
    };

    return (
        <>
            {isVisible && (
                <button
                    onClick={scrollToTop}
                    className="fixed bottom-6 right-6 z-50 bg-orange-500 hover:bg-orange-600 text-white p-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 ease-in-out transform hover:scale-110 active:scale-95 group"
                    aria-label="Scroll to top"
                >
                    <svg
                        className="w-6 h-6 transition-transform duration-300 group-hover:-translate-y-1"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 10l7-7m0 0l7 7m-7-7v18"
                        />
                    </svg>
                </button>
            )}
        </>
    );
};

export default ScrollToTop;
