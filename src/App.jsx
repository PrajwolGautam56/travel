import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import PopularFlights from './components/PopularFlights';
import PopularPackages from './components/PopularPackages';
import Hotels from './components/Hotels';
import WhyChooseUs from './components/WhyChooseUs';
import Footer from './components/Footer';
import Login from './components/Login';
import Signup from './components/Signup';
import HotelsPage from './components/HotelsPage';
import PackagesPage from './components/PackagesPage';
import HotelDetail from './components/HotelDetail';
import PackageDetail from './components/PackageDetail';
import AdminLogin from './components/AdminLogin';
import AdminDashboard from './components/AdminDashboard';
import ProtectedRoute from './components/ProtectedRoute';
import FlightSearchResults from './components/FlightSearchResults';
import FlightBooking from './components/FlightBooking';
import BlogPage from './components/BlogPage';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          {/* Homepage Route */}
          <Route path="/" element={
            <>
              <Navbar />
              <main>
                <Hero />
                <PopularFlights />
                <PopularPackages />
                <Hotels />
                <WhyChooseUs />
              </main>
              <Footer />
            </>
          } />
          
          {/* Login Route */}
          <Route path="/login" element={<Login />} />
          
          {/* Signup Route */}
          <Route path="/signup" element={<Signup />} />
          
          {/* Hotels Page Route */}
          <Route path="/hotels" element={
            <>
              <Navbar />
              <HotelsPage />
              <Footer />
            </>
          } />
          
          {/* Single Hotel Detail Route */}
          <Route path="/hotels/:id" element={
            <>
              <Navbar />
              <HotelDetail />
              <Footer />
            </>
          } />
          
          {/* Packages Page Route */}
          <Route path="/packages" element={
            <>
              <Navbar />
              <PackagesPage />
              <Footer />
            </>
          } />
          
          {/* Single Package Detail Route */}
          <Route path="/packages/:id" element={
            <>
              <Navbar />
              <PackageDetail />
              <Footer />
            </>
          } />
          
          {/* Admin Routes */}
          <Route path="/admin/login" element={<AdminLogin />} />
          
          {/* Protected Admin Dashboard Route */}
          <Route path="/admin/dashboard" element={
            <ProtectedRoute requireAdmin={true}>
              <AdminDashboard />
            </ProtectedRoute>
          } />
          
          {/* Flight Search Routes */}
          <Route path="/flight-search" element={
            <>
              <Navbar />
              <FlightSearchResults />
              <Footer />
            </>
          } />
          
          {/* Flight Booking Route */}
          <Route path="/flight-booking/:id" element={
            <>
              <Navbar />
              <FlightBooking />
              <Footer />
            </>
          } />
          
          {/* Blog Route */}
          <Route path="/blog" element={
            <>
              <Navbar />
              <BlogPage />
              <Footer />
            </>
          } />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
