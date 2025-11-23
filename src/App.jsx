import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AuthModalProvider } from './contexts/AuthModalContext';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import PopularFlights from './components/PopularFlights';
import PopularPackages from './components/PopularPackages';
import Hotels from './components/Hotels';
import WhyChooseUs from './components/WhyChooseUs';
import Footer from './components/Footer';
import Login from './components/Login';
import Signup from './components/Signup';
import LoginModal from './components/LoginModal';
import SignupModal from './components/SignupModal';
import HotelsPage from './components/HotelsPage';
import PackagesPage from './components/PackagesPage';
import HotelDetail from './components/HotelDetail';
import HotelBooking from './components/HotelBooking';
import PackageDetail from './components/PackageDetail';
import AdminLogin from './components/AdminLogin';
import AdminDashboard from './components/AdminDashboard';
import ProtectedRoute from './components/ProtectedRoute';
import FlightSearchResults from './components/FlightSearchResults';
import FlightBooking from './components/FlightBooking';
import BlogPage from './components/BlogPage';
import AboutPage from './components/AboutPage';
import ContactUs from './components/ContactUs';
import RentalsPage from './components/RentalsPage';
import FlightsPage from './components/FlightsPage';
import UserProfile from './components/UserProfile';
import ScrollToTop from './components/ScrollToTop';
import PageTransition from './components/PageTransition';

function App() {
  return (
    <AuthModalProvider>
      <Router>
        <div className="App">
          <ScrollToTop />
          {/* Auth Modals */}
          <LoginModal />
          <SignupModal />
        <Routes>
          {/* Homepage Route */}
          <Route path="/" element={
            <PageTransition>
              <Navbar />
              <main>
                <Hero />
                <PopularPackages />
                <PopularFlights />
                <Hotels />
                <WhyChooseUs />
              </main>
              <Footer />
            </PageTransition>
          } />

          {/* Login Route */}
          <Route path="/login" element={
            <PageTransition>
              <Login />
            </PageTransition>
          } />

          {/* Signup Route */}
          <Route path="/signup" element={
            <PageTransition>
              <Signup />
            </PageTransition>
          } />

          {/* Hotels Page Route */}
          <Route path="/hotels" element={
            <PageTransition>
              <Navbar />
              <HotelsPage />
              <Footer />
            </PageTransition>
          } />

          {/* Single Hotel Detail Route */}
          <Route path="/hotels/:id" element={
            <PageTransition>
              <Navbar />
              <HotelDetail />
              <Footer />
            </PageTransition>
          } />

          {/* Hotel Booking Route */}
          <Route path="/hotel-booking/:id" element={
            <PageTransition>
              <Navbar />
              <HotelBooking />
              <Footer />
            </PageTransition>
          } />

          {/* Packages Page Route */}
          <Route path="/packages" element={
            <PageTransition>
              <Navbar />
              <PackagesPage />
              <Footer />
            </PageTransition>
          } />

          {/* Single Package Detail Route */}
          <Route path="/packages/:id" element={
            <PageTransition>
              <Navbar />
              <PackageDetail />
              <Footer />
            </PageTransition>
          } />

          {/* Admin Routes */}
          <Route path="/admin/login" element={
            <PageTransition>
              <AdminLogin />
            </PageTransition>
          } />

          {/* Protected Admin Dashboard Route */}
          <Route path="/admin/dashboard" element={
            <PageTransition>
              <ProtectedRoute requireAdmin={true}>
                <AdminDashboard />
              </ProtectedRoute>
            </PageTransition>
          } />

          {/* Flight Search Routes */}
          <Route path="/flight-search" element={
            <PageTransition>
              <Navbar />
              <FlightSearchResults />
              <Footer />
            </PageTransition>
          } />

          {/* Flight Booking Route */}
          <Route path="/flight-booking/:id" element={
            <PageTransition>
              <Navbar />
              <FlightBooking />
              <Footer />
            </PageTransition>
          } />

          {/* Blog Route */}
          <Route path="/blog" element={
            <PageTransition>
              <Navbar />
              <BlogPage />
              <Footer />
            </PageTransition>
          } />

          {/* About Route */}
          <Route path="/about" element={
            <PageTransition>
              <Navbar />
              <AboutPage />
              <Footer />
            </PageTransition>
          } />

          {/* Contact Us Route */}
          <Route path="/contact" element={
            <PageTransition>
              <Navbar />
              <ContactUs />
              <Footer />
            </PageTransition>
          } />

          {/* Rentals Route */}
          <Route path="/rentals" element={
            <PageTransition>
              <Navbar />
              <RentalsPage />
              <Footer />
            </PageTransition>
          } />

          {/* Flights Route */}
          <Route path="/flights" element={
            <PageTransition>
              <Navbar />
              <FlightsPage />
              <Footer />
            </PageTransition>
          } />

          {/* User Profile Route */}
          <Route path="/profile" element={
            <PageTransition>
              <Navbar />
              <UserProfile />
              <Footer />
            </PageTransition>
          } />
        </Routes>
        </div>
      </Router>
    </AuthModalProvider>
  );
}

export default App;
