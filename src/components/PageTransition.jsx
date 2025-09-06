import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const PageTransition = ({ children }) => {
    const location = useLocation();

    useEffect(() => {
        // Instant scroll to top on route change for fastest experience
        window.scrollTo(0, 0);
    }, [location.pathname]);

    return (
        <div className="animate-fadeIn">
            {children}
        </div>
    );
};

export default PageTransition;
