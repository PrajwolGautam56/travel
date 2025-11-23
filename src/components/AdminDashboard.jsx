import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { adminAPI } from '../services/api';
import { downloadBookingTicket } from '../utils/ticketGenerator';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [adminUser, setAdminUser] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [stats, setStats] = useState({
    totalBookings: 0,
    totalRevenue: 'Rs.0',
    activeUsers: 0,
    pendingApprovals: 0,
    flightsToday: 0,
    hotelsOccupied: 0,
    packagesSold: 0
  });
  const [recentBookings, setRecentBookings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [packages, setPackages] = useState([]);
  const [hotels, setHotels] = useState([]);
  const [helicopters, setHelicopters] = useState([]);
  const [bookings, setBookings] = useState({
    flights: [],
    packages: [],
    helicopters: [],
    hotels: []
  });
  const [flightBookings, setFlightBookings] = useState([]);
  const [packageBookings, setPackageBookings] = useState([]);
  const [helicopterBookings, setHelicopterBookings] = useState([]);
  const [hotelBookings, setHotelBookings] = useState([]);
  const [users, setUsers] = useState([]);
  const [inquiries, setInquiries] = useState([]);
  const [loadingTab, setLoadingTab] = useState(false);
  const [bookingFilters, setBookingFilters] = useState({
    type: 'all',
    status: 'all',
    paymentStatus: 'all'
  });
  const [showPackageModal, setShowPackageModal] = useState(false);
  const [showHotelModal, setShowHotelModal] = useState(false);
  const [showHelicopterModal, setShowHelicopterModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [editingType, setEditingType] = useState(null); // 'package', 'hotel', 'helicopter'

  useEffect(() => {
    const user = localStorage.getItem('adminUser');
    if (user) {
      setAdminUser(JSON.parse(user));
    } else {
      navigate('/admin/login');
    }
  }, [navigate]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!adminUser) return;
      
      setIsLoading(true);
      try {
        const dashboardData = await adminAPI.getDashboard();
        
        // Backend returns: { stats: {...}, recentBookings: {...} }
        const statsData = dashboardData.stats || {};
        const recentData = dashboardData.recentBookings || {};
        
        setStats({
          totalBookings: statsData.totalBookings || 0,
          totalRevenue: `Rs.${(statsData.totalRevenue || 0).toLocaleString('en-IN')}`,
          activeUsers: statsData.totalUsers || 0,
          pendingApprovals: statsData.pendingBookings || 0,
          flightsToday: statsData.flightBookings || 0,
          hotelsOccupied: 0, // Will be added when hotel bookings are implemented
          packagesSold: statsData.packageBookings || 0
        });
        
        // Combine recent bookings from flights and packages
        const allRecentBookings = [
          ...(recentData.flights || []).map(booking => ({
            id: booking._id,
            customer: booking.user ? `${booking.user.firstName} ${booking.user.lastName}` : 'N/A',
            service: booking.flight ? `${booking.flight.airline} - ${booking.flight.from} to ${booking.flight.to}` : 'Flight Booking',
            amount: `Rs.${(booking.pricing?.totalAmount || 0).toLocaleString('en-IN')}`,
            status: booking.status || 'Pending',
            date: new Date(booking.createdAt).toLocaleDateString(),
            type: 'Flight'
          })),
          ...(recentData.packages || []).map(booking => ({
            id: booking._id,
            customer: booking.user ? `${booking.user.firstName} ${booking.user.lastName}` : 'N/A',
            service: booking.package ? booking.package.title : 'Package Booking',
            amount: `Rs.${(booking.pricing?.totalAmount || 0).toLocaleString('en-IN')}`,
            status: booking.status || 'Pending',
            date: new Date(booking.createdAt).toLocaleDateString(),
            type: 'Package'
          }))
        ].slice(0, 10); // Limit to 10 most recent
        
        setRecentBookings(allRecentBookings);
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        // Set error state or show error message
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, [adminUser]);

  // Fetch data when switching tabs
  useEffect(() => {
    const fetchTabData = async () => {
      if (!adminUser) return;
      
      setLoadingTab(true);
      try {
        switch (activeTab) {
          case 'packages':
            const packagesData = await adminAPI.getAllPackages();
            setPackages(packagesData.packages || packagesData || []);
            break;
          case 'hotels':
            const hotelsData = await adminAPI.getAllHotels();
            setHotels(hotelsData.hotels || hotelsData || []);
            break;
          case 'helicopters':
            const helicoptersData = await adminAPI.getAllHelicopters();
            setHelicopters(helicoptersData.helicopters || helicoptersData || []);
            break;
          case 'flight-bookings':
            const flightBookingsData = await adminAPI.getFlightBookings();
            setFlightBookings(flightBookingsData.bookings || flightBookingsData || []);
            break;
          case 'package-bookings':
            const packageBookingsData = await adminAPI.getPackageBookings();
            setPackageBookings(packageBookingsData.bookings || packageBookingsData || []);
            break;
          case 'hotel-bookings':
            const hotelBookingsData = await adminAPI.getHotelBookings();
            setHotelBookings(hotelBookingsData.bookings || hotelBookingsData || []);
            break;
          case 'helicopter-bookings':
            const helicopterBookingsData = await adminAPI.getHelicopterBookings();
            setHelicopterBookings(helicopterBookingsData.bookings || helicopterBookingsData || []);
            break;
          case 'users':
            const usersData = await adminAPI.getUsers();
            setUsers(usersData.users || usersData || []);
            break;
          case 'inquiries':
            const inquiriesData = await adminAPI.getInquiries();
            setInquiries(inquiriesData.inquiries || inquiriesData || []);
            break;
        }
      } catch (err) {
        console.error('Error fetching tab data:', err);
      } finally {
        setLoadingTab(false);
      }
    };

    if (activeTab !== 'overview' && activeTab !== 'settings') {
      fetchTabData();
    }
  }, [activeTab, adminUser]);

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
    navigate('/admin/login');
  };

  // Package handlers
  const handleAddPackage = () => {
    setEditingItem(null);
    setEditingType('package');
    setShowPackageModal(true);
  };

  const handleEditPackage = (pkg) => {
    setEditingItem(pkg);
    setEditingType('package');
    setShowPackageModal(true);
  };

  const handleDeletePackage = async (packageId) => {
    if (!window.confirm('Are you sure you want to delete this package?')) return;
    
    try {
      await adminAPI.deletePackage(packageId);
      setPackages(packages.filter(p => (p._id || p.id) !== packageId));
      alert('Package deleted successfully');
    } catch (err) {
      alert('Error deleting package: ' + err.message);
    }
  };

  const handleSavePackage = async (packageData) => {
    try {
      if (editingItem) {
        await adminAPI.updatePackage(editingItem._id || editingItem.id, packageData);
        alert('Package updated successfully');
      } else {
        await adminAPI.createPackage(packageData);
        alert('Package created successfully');
      }
      // Refresh packages list
      const packagesData = await adminAPI.getAllPackages();
      setPackages(packagesData.packages || packagesData || []);
      setShowPackageModal(false);
      setEditingItem(null);
    } catch (err) {
      alert('Error saving package: ' + err.message);
    }
  };

  // Hotel handlers
  const handleAddHotel = () => {
    setEditingItem(null);
    setEditingType('hotel');
    setShowHotelModal(true);
  };

  const handleEditHotel = (hotel) => {
    setEditingItem(hotel);
    setEditingType('hotel');
    setShowHotelModal(true);
  };

  const handleDeleteHotel = async (hotelId) => {
    if (!window.confirm('Are you sure you want to delete this hotel?')) return;
    
    try {
      await adminAPI.deleteHotel(hotelId);
      setHotels(hotels.filter(h => (h._id || h.id) !== hotelId));
      alert('Hotel deleted successfully');
    } catch (err) {
      alert('Error deleting hotel: ' + err.message);
    }
  };

  const handleSaveHotel = async (hotelData) => {
    try {
      if (editingItem) {
        await adminAPI.updateHotel(editingItem._id || editingItem.id, hotelData);
        alert('Hotel updated successfully');
      } else {
        await adminAPI.createHotel(hotelData);
        alert('Hotel created successfully');
      }
      // Refresh hotels list
      const hotelsData = await adminAPI.getAllHotels();
      setHotels(hotelsData.hotels || hotelsData || []);
      setShowHotelModal(false);
      setEditingItem(null);
    } catch (err) {
      alert('Error saving hotel: ' + err.message);
    }
  };

  // Helicopter handlers
  const handleAddHelicopter = () => {
    setEditingItem(null);
    setEditingType('helicopter');
    setShowHelicopterModal(true);
  };

  const handleEditHelicopter = (helicopter) => {
    setEditingItem(helicopter);
    setEditingType('helicopter');
    setShowHelicopterModal(true);
  };

  const handleDeleteHelicopter = async (helicopterId) => {
    if (!window.confirm('Are you sure you want to delete this helicopter?')) return;
    
    try {
      await adminAPI.deleteHelicopter(helicopterId);
      setHelicopters(helicopters.filter(h => (h._id || h.id) !== helicopterId));
      alert('Helicopter deleted successfully');
    } catch (err) {
      alert('Error deleting helicopter: ' + err.message);
    }
  };

  const handleSaveHelicopter = async (helicopterData) => {
    try {
      if (editingItem) {
        await adminAPI.updateHelicopter(editingItem._id || editingItem.id, helicopterData);
        alert('Helicopter updated successfully');
      } else {
        await adminAPI.createHelicopter(helicopterData);
        alert('Helicopter created successfully');
      }
      // Refresh helicopters list
      const helicoptersData = await adminAPI.getAllHelicopters();
      setHelicopters(helicoptersData.helicopters || helicoptersData || []);
      setShowHelicopterModal(false);
      setEditingItem(null);
    } catch (err) {
      alert('Error saving helicopter: ' + err.message);
    }
  };

  // Booking handlers
  const handleUpdateBookingStatus = async (bookingType, bookingId, status) => {
    try {
      // The API expects bookingType and bookingId in the URL
      await adminAPI.updateBookingStatus(bookingType, bookingId, status);
      // Refresh the specific booking type
      switch (bookingType) {
        case 'flight':
        case 'flights':
          const flightBookings = await adminAPI.getFlightBookings();
          setFlightBookings(flightBookings.bookings || flightBookings || []);
          break;
        case 'package':
        case 'packages':
          const packageBookings = await adminAPI.getPackageBookings();
          setPackageBookings(packageBookings.bookings || packageBookings || []);
          break;
        case 'helicopter':
        case 'helicopters':
          const helicopterBookings = await adminAPI.getHelicopterBookings();
          setHelicopterBookings(helicopterBookings.bookings || helicopterBookings || []);
          break;
        case 'hotel':
        case 'hotels':
          const hotelBookings = await adminAPI.getHotelBookings();
          setHotelBookings(hotelBookings.bookings || hotelBookings || []);
          break;
      }
      alert('Booking status updated successfully');
    } catch (err) {
      alert('Error updating booking status: ' + err.message);
    }
  };

  // Helper function to render bookings table
  const renderBookingsTable = (bookingsList, bookingType, title, description) => {
    if (loadingTab) {
      return (
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
            <p className="text-gray-600">Loading {title.toLowerCase()}...</p>
          </div>
        </div>
      );
    }

    const sortedBookings = [...(bookingsList || [])].sort((a, b) => 
      new Date(b.createdAt || b.created_at) - new Date(a.createdAt || a.created_at)
    );

    // Apply filters
    let filteredBookings = sortedBookings;
    if (bookingFilters.status !== 'all') {
      filteredBookings = filteredBookings.filter(b => (b.status || 'pending') === bookingFilters.status);
    }
    if (bookingFilters.paymentStatus !== 'all') {
      filteredBookings = filteredBookings.filter(b => (b.paymentStatus || 'pending') === bookingFilters.paymentStatus);
    }

    return (
      <div className="bg-white rounded-2xl shadow-xl p-4 sm:p-8">
        <div className="mb-6 sm:mb-8">
          <h3 className="text-xl sm:text-2xl font-bold text-gray-900">{title}</h3>
          <p className="text-gray-600 mt-1 text-sm sm:text-base">{description}</p>
        </div>

        {/* Filters */}
        <div className="mb-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
            <select
              value={bookingFilters.status}
              onChange={(e) => setBookingFilters({ ...bookingFilters, status: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="confirmed">Confirmed</option>
              <option value="cancelled">Cancelled</option>
              <option value="completed">Completed</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Payment Status</label>
            <select
              value={bookingFilters.paymentStatus}
              onChange={(e) => setBookingFilters({ ...bookingFilters, paymentStatus: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Payments</option>
              <option value="pending">Pending</option>
              <option value="paid">Paid</option>
              <option value="refunded">Refunded</option>
              <option value="failed">Failed</option>
            </select>
          </div>
        </div>
        
        {filteredBookings.length === 0 ? (
          <div className="text-center py-12">
            <svg className="mx-auto h-16 w-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            <h3 className="mt-4 text-lg font-medium text-gray-900">No {title.toLowerCase()} yet</h3>
            <p className="mt-2 text-gray-500">Bookings will appear here once customers start making reservations.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reference</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Details</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Payment</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredBookings.map((booking) => {
                  const bookingId = booking._id || booking.id;
                  const customerName = booking.user 
                    ? `${booking.user.firstName || ''} ${booking.user.lastName || ''}`.trim() || booking.user.email || 'N/A'
                    : (booking.guestName || booking.guestEmail || (booking.guestDetails?.[0] ? `${booking.guestDetails[0].firstName || ''} ${booking.guestDetails[0].lastName || ''}`.trim() : '') || 'Guest');
                  const customerEmail = booking.user?.email || booking.guestEmail || booking.guestDetails?.[0]?.email || 'N/A';
                  const amount = booking.pricing?.totalAmount || booking.totalAmount || 0;
                  
                  return (
                    <tr key={bookingId} className="hover:bg-gray-50">
                      <td className="px-4 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{booking.bookingReference || 'N/A'}</div>
                      </td>
                      <td className="px-4 py-4">
                        <div className="text-sm text-gray-900">{customerName}</div>
                        <div className="text-xs text-gray-500">{customerEmail}</div>
                      </td>
                      <td className="px-4 py-4">
                        {bookingType === 'flight' && booking.flight && (
                          <div className="text-sm text-gray-900">
                            {typeof booking.flight === 'object' 
                              ? `${booking.flight.from || 'N/A'} → ${booking.flight.to || 'N/A'}`
                              : booking.flight}
                          </div>
                        )}
                        {bookingType === 'package' && booking.package && (
                          <div className="text-sm text-gray-900">
                            {typeof booking.package === 'object' ? booking.package.title || 'N/A' : booking.package}
                          </div>
                        )}
                        {bookingType === 'hotel' && booking.hotel && (
                          <>
                            <div className="text-sm text-gray-900">
                              {typeof booking.hotel === 'object' ? booking.hotel.name || 'N/A' : booking.hotel}
                            </div>
                            {booking.checkIn && (
                              <div className="text-xs text-gray-500 mt-1">
                                {new Date(booking.checkIn).toLocaleDateString()} - {new Date(booking.checkOut).toLocaleDateString()}
                              </div>
                            )}
                            {booking.guests && (
                              <div className="text-xs text-gray-500">
                                {typeof booking.guests === 'object' 
                                  ? `${booking.guests.adults || 0} adults, ${booking.guests.children || 0} children`
                                  : `${booking.guests} guests`}, {Array.isArray(booking.rooms) ? booking.rooms.length : booking.rooms || 1} room(s)
                              </div>
                            )}
                          </>
                        )}
                        {bookingType === 'helicopter' && booking.helicopter && (
                          <div className="text-sm text-gray-900">
                            {typeof booking.helicopter === 'object' 
                              ? `${booking.helicopter.name || booking.helicopter.model || 'N/A'} - ${booking.serviceType || 'N/A'}`
                              : booking.helicopter}
                          </div>
                        )}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <div className="text-sm font-semibold text-gray-900">Rs.{amount.toLocaleString('en-IN')}</div>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <select
                          value={booking.status || 'pending'}
                          onChange={(e) => handleUpdateBookingStatus(bookingType, bookingId, e.target.value)}
                          className={`text-xs font-semibold rounded-full px-2 py-1 border-0 ${
                            booking.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                            booking.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                            booking.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                            'bg-gray-100 text-gray-800'
                          }`}
                        >
                          <option value="pending">Pending</option>
                          <option value="confirmed">Confirmed</option>
                          <option value="cancelled">Cancelled</option>
                          <option value="completed">Completed</option>
                        </select>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                          booking.paymentStatus === 'paid' ? 'bg-green-100 text-green-800' :
                          booking.paymentStatus === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {booking.paymentStatus || 'pending'}
                        </span>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">
                          {new Date(booking.createdAt || booking.created_at).toLocaleDateString()}
                        </div>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex items-center space-x-4">
                          <button
                            onClick={() => handleUpdateBookingStatus(bookingType, bookingId, booking.status === 'confirmed' ? 'cancelled' : 'confirmed')}
                            className={`${
                              booking.status === 'confirmed' ? 'text-red-600 hover:text-red-900' : 'text-green-600 hover:text-green-900'
                            }`}
                          >
                            {booking.status === 'confirmed' ? 'Cancel' : 'Confirm'}
                          </button>
                          <button
                            onClick={() =>
                              downloadBookingTicket(booking, {
                                customerName,
                                customerEmail,
                                amount,
                                type: bookingType === 'flight' ? 'Flight' : bookingType === 'package' ? 'Package' : bookingType === 'hotel' ? 'Hotel' : 'Helicopter'
                              })
                            }
                            className="text-blue-600 hover:text-blue-900"
                          >
                            Ticket
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    );
  };

  const renderOverview = () => {
    if (isLoading) {
      return (
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
            <p className="text-gray-600">Loading dashboard data...</p>
          </div>
        </div>
      );
    }

    return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-800 rounded-xl sm:rounded-2xl p-4 sm:p-8 text-white">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold mb-2">Welcome back, {adminUser?.name}!</h1>
            <p className="text-blue-100 text-sm sm:text-lg">Here's what's happening with Recent and Rhythm Tours and Travels today</p>
          </div>
          <div className="hidden sm:block">
            <div className="text-right">
              <p className="text-blue-100 text-xs sm:text-sm">Current Time</p>
              <p className="text-lg sm:text-2xl font-bold">{new Date().toLocaleTimeString()}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Statistics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <div className="bg-white rounded-xl sm:rounded-2xl shadow-xl p-4 sm:p-6 border-l-4 border-blue-500 hover:shadow-2xl transition-all duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs sm:text-sm font-medium text-gray-600 mb-1">Total Bookings</p>
              <p className="text-2xl sm:text-3xl font-bold text-gray-900">{stats.totalBookings.toLocaleString()}</p>
              <p className="text-xs sm:text-sm text-green-600 font-medium">+12% from last month</p>
            </div>
            <div className="p-3 sm:p-4 bg-blue-100 rounded-xl sm:rounded-2xl">
              <svg className="w-6 h-6 sm:w-8 sm:h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl sm:rounded-2xl shadow-xl p-4 sm:p-6 border-l-4 border-green-500 hover:shadow-2xl transition-all duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs sm:text-sm font-medium text-gray-600 mb-1">Total Revenue</p>
              <p className="text-2xl sm:text-3xl font-bold text-gray-900">{stats.totalRevenue}</p>
              <p className="text-xs sm:text-sm text-green-600 font-medium">+8% from last month</p>
            </div>
            <div className="p-3 sm:p-4 bg-green-100 rounded-xl sm:rounded-2xl">
              <svg className="w-6 h-6 sm:w-8 sm:h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl sm:rounded-2xl shadow-xl p-4 sm:p-6 border-l-4 border-purple-500 hover:shadow-2xl transition-all duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs sm:text-sm font-medium text-gray-600 mb-1">Active Users</p>
              <p className="text-2xl sm:text-3xl font-bold text-gray-900">{stats.activeUsers.toLocaleString()}</p>
              <p className="text-xs sm:text-sm text-purple-600 font-medium">+15% from last month</p>
            </div>
            <div className="p-3 sm:p-4 bg-purple-100 rounded-xl sm:rounded-2xl">
              <svg className="w-6 h-6 sm:w-8 sm:h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl sm:rounded-2xl shadow-xl p-4 sm:p-6 border-l-4 border-yellow-500 hover:shadow-2xl transition-all duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs sm:text-sm font-medium text-gray-600 mb-1">Pending Approvals</p>
              <p className="text-2xl sm:text-3xl font-bold text-gray-900">{stats.pendingApprovals}</p>
              <p className="text-xs sm:text-sm text-yellow-600 font-medium">Requires attention</p>
            </div>
            <div className="p-3 sm:p-4 bg-yellow-100 rounded-xl sm:rounded-2xl">
              <svg className="w-6 h-6 sm:w-8 sm:h-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs sm:text-sm font-medium text-blue-700 mb-1">Flights Today</p>
              <p className="text-xl sm:text-2xl font-bold text-blue-900">{stats.flightsToday}</p>
            </div>
            <svg className="w-6 h-6 sm:w-8 sm:h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4V2a1 1 0 011-1h8a1 1 0 011 1v2m-9 0h10m-10 0a2 2 0 00-2 2v14a2 2 0 002 2h10a2 2 0 002-2V6a2 2 0 00-2-2" />
            </svg>
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-green-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs sm:text-sm font-medium text-green-700 mb-1">Hotels Occupied</p>
              <p className="text-xl sm:text-2xl font-bold text-green-900">{stats.hotelsOccupied}</p>
            </div>
            <svg className="w-6 h-6 sm:w-8 sm:h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-purple-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs sm:text-sm font-medium text-purple-700 mb-1">Packages Sold</p>
              <p className="text-xl sm:text-2xl font-bold text-purple-900">{stats.packagesSold}</p>
            </div>
            <svg className="w-6 h-6 sm:w-8 sm:h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
          </div>
        </div>
      </div>

      {/* Recent Bookings Table */}
      <div className="bg-white rounded-xl sm:rounded-2xl shadow-xl overflow-hidden">
        <div className="px-4 sm:px-6 py-3 sm:py-4 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-gray-100">
          <div className="flex items-center justify-between">
            <h3 className="text-base sm:text-lg font-semibold text-gray-900">Recent Bookings</h3>
            <button className="text-blue-600 hover:text-blue-700 font-medium text-xs sm:text-sm">View All</button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-3 sm:px-6 py-3 sm:py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Customer</th>
                <th className="px-3 sm:px-6 py-3 sm:py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Service</th>
                <th className="px-3 sm:px-6 py-3 sm:py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Type</th>
                <th className="px-3 sm:px-6 py-3 sm:py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Amount</th>
                <th className="px-3 sm:px-6 py-3 sm:py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
                <th className="px-3 sm:px-6 py-3 sm:py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Date</th>
                <th className="px-3 sm:px-6 py-3 sm:py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {recentBookings.length === 0 ? (
                <tr>
                  <td colSpan="7" className="px-6 py-12 text-center">
                    <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                    <h3 className="mt-4 text-sm font-medium text-gray-900">No bookings yet</h3>
                    <p className="mt-2 text-sm text-gray-500">Bookings will appear here once customers start making reservations.</p>
                  </td>
                </tr>
              ) : (
                recentBookings.map((booking) => (
                <tr key={booking.id} className="hover:bg-gray-50 transition-colors duration-200">
                  <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-6 w-6 sm:h-8 sm:w-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                        <span className="text-white text-xs sm:text-sm font-medium">
                          {booking.customer.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                      <div className="ml-2 sm:ml-3">
                        <p className="text-xs sm:text-sm font-medium text-gray-900">{booking.customer}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-xs sm:text-sm text-gray-900">{booking.service}</td>
                  <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${booking.type === 'Package' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'
                      }`}>
                      {booking.type}
                    </span>
                  </td>
                  <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-xs sm:text-sm font-semibold text-gray-900">{booking.amount}</td>
                  <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 sm:px-3 py-1 text-xs font-semibold rounded-full ${booking.status === 'Confirmed' ? 'bg-green-100 text-green-800' :
                      booking.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                      {booking.status}
                    </span>
                  </td>
                  <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-xs sm:text-sm text-gray-500">{booking.date}</td>
                  <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-xs sm:text-sm font-medium">
                    <div className="flex space-x-1 sm:space-x-2">
                      <button className="text-blue-600 hover:text-blue-900">Edit</button>
                      <button className="text-red-600 hover:text-red-900">Delete</button>
                    </div>
                  </td>
                </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
  };

  const renderHotels = () => {
    if (loadingTab) {
      return (
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
            <p className="text-gray-600">Loading hotels...</p>
          </div>
        </div>
      );
    }

    return (
      <div className="bg-white rounded-2xl shadow-xl p-4 sm:p-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 sm:mb-8 gap-4">
        <div>
            <h3 className="text-xl sm:text-2xl font-bold text-gray-900">Hotel Management</h3>
            <p className="text-gray-600 mt-1 text-sm sm:text-base">Manage all hotel properties</p>
        </div>
          <button 
            onClick={handleAddHotel}
            className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-xl font-semibold transition-all duration-200 shadow-lg hover:shadow-xl text-sm sm:text-base w-full sm:w-auto"
          >
          + Add New Hotel
        </button>
      </div>
        
        {hotels.length === 0 ? (
      <div className="text-center py-12">
        <svg className="mx-auto h-16 w-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
            <h3 className="mt-4 text-lg font-medium text-gray-900">No hotels yet</h3>
            <p className="mt-2 text-gray-500">Get started by adding your first hotel property.</p>
      </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stars</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price/Night</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {hotels.map((hotel) => (
                  <tr key={hotel._id || hotel.id} className="hover:bg-gray-50">
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{hotel.name}</div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">{hotel.location}</div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {[...Array(hotel.stars || 0)].map((_, i) => (
                          <svg key={i} className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        ))}
                      </div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="text-sm font-semibold text-gray-900">
                        Rs.{(hotel.pricing?.basePrice || hotel.pricePerNight || 0).toLocaleString('en-IN')}
                      </div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                        hotel.isActive !== false ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {hotel.isActive !== false ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEditHotel(hotel)}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteHotel(hotel._id || hotel.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
    </div>
  );
  };

  const renderPackages = () => {
    if (loadingTab) {
      return (
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
            <p className="text-gray-600">Loading packages...</p>
          </div>
        </div>
      );
    }

    return (
      <div className="bg-white rounded-2xl shadow-xl p-4 sm:p-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 sm:mb-8 gap-4">
        <div>
            <h3 className="text-xl sm:text-2xl font-bold text-gray-900">Package Management</h3>
            <p className="text-gray-600 mt-1 text-sm sm:text-base">Create and manage travel packages</p>
        </div>
          <button 
            onClick={handleAddPackage}
            className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-xl font-semibold transition-all duration-200 shadow-lg hover:shadow-xl text-sm sm:text-base w-full sm:w-auto"
          >
          + Add New Package
        </button>
      </div>
        
        {packages.length === 0 ? (
      <div className="text-center py-12">
        <svg className="mx-auto h-16 w-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
        </svg>
            <h3 className="mt-4 text-lg font-medium text-gray-900">No packages yet</h3>
            <p className="mt-2 text-gray-500">Get started by creating your first travel package.</p>
      </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Destination</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Duration</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {packages.map((pkg) => (
                  <tr key={pkg._id || pkg.id} className="hover:bg-gray-50">
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{pkg.title}</div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">{pkg.destination}</div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">
                        {pkg.duration?.days || 0} Days / {pkg.duration?.nights || 0} Nights
                      </div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="text-sm font-semibold text-gray-900">
                        Rs.{(pkg.pricing?.discountedPrice || pkg.pricing?.originalPrice || 0).toLocaleString('en-IN')}
                      </div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                        pkg.isActive !== false ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {pkg.isActive !== false ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEditPackage(pkg)}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeletePackage(pkg._id || pkg.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
    </div>
  );
  };

  // Individual booking type render functions
  const renderFlightBookings = () => {
    return renderBookingsTable(
      flightBookings,
      'flight',
      'Flight Bookings',
      'Monitor and manage all flight bookings'
    );
  };

  const renderPackageBookings = () => {
    return renderBookingsTable(
      packageBookings,
      'package',
      'Package Bookings',
      'Monitor and manage all package bookings'
    );
  };

  const renderHotelBookings = () => {
    return renderBookingsTable(
      hotelBookings,
      'hotel',
      'Hotel Bookings',
      'Monitor and manage all hotel bookings'
    );
  };

  const renderHelicopterBookings = () => {
    return renderBookingsTable(
      helicopterBookings,
      'helicopter',
      'Helicopter Bookings',
      'Monitor and manage all helicopter bookings'
    );
  };

  // Legacy combined bookings view (kept for backward compatibility)
  const renderBookings = () => {
    if (loadingTab) {
      return (
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
            <p className="text-gray-600">Loading bookings...</p>
          </div>
        </div>
      );
    }

    const allBookings = [
      ...(bookings.flights || []).map(b => ({ ...b, type: 'Flight' })),
      ...(bookings.packages || []).map(b => ({ ...b, type: 'Package' })),
      ...(bookings.helicopters || []).map(b => ({ ...b, type: 'Helicopter' })),
      ...(bookings.hotels || []).map(b => ({ ...b, type: 'Hotel' }))
    ].sort((a, b) => new Date(b.createdAt || b.created_at) - new Date(a.createdAt || a.created_at));

    // Apply filters
    let filteredBookings = allBookings;
    if (bookingFilters.type !== 'all') {
      filteredBookings = filteredBookings.filter(b => b.type.toLowerCase() === bookingFilters.type);
    }
    if (bookingFilters.status !== 'all') {
      filteredBookings = filteredBookings.filter(b => (b.status || 'pending') === bookingFilters.status);
    }
    if (bookingFilters.paymentStatus !== 'all') {
      filteredBookings = filteredBookings.filter(b => (b.paymentStatus || 'pending') === bookingFilters.paymentStatus);
    }

    return (
      <div className="bg-white rounded-2xl shadow-xl p-4 sm:p-8">
        <div className="mb-6 sm:mb-8">
          <h3 className="text-xl sm:text-2xl font-bold text-gray-900">Booking Management</h3>
          <p className="text-gray-600 mt-1 text-sm sm:text-base">Monitor and manage all bookings</p>
        </div>

        {/* Filters */}
        <div className="mb-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Booking Type</label>
            <select
              value={bookingFilters.type}
              onChange={(e) => setBookingFilters({ ...bookingFilters, type: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Types</option>
              <option value="flight">Flights</option>
              <option value="package">Packages</option>
              <option value="helicopter">Helicopters</option>
              <option value="hotel">Hotels</option>
            </select>
        </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
            <select
              value={bookingFilters.status}
              onChange={(e) => setBookingFilters({ ...bookingFilters, status: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="confirmed">Confirmed</option>
              <option value="cancelled">Cancelled</option>
              <option value="completed">Completed</option>
            </select>
      </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Payment Status</label>
            <select
              value={bookingFilters.paymentStatus}
              onChange={(e) => setBookingFilters({ ...bookingFilters, paymentStatus: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Payments</option>
              <option value="pending">Pending</option>
              <option value="paid">Paid</option>
              <option value="refunded">Refunded</option>
              <option value="failed">Failed</option>
            </select>
          </div>
        </div>
        
        {filteredBookings.length === 0 ? (
      <div className="text-center py-12">
        <svg className="mx-auto h-16 w-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
            <h3 className="mt-4 text-lg font-medium text-gray-900">No bookings yet</h3>
            <p className="mt-2 text-gray-500">Bookings will appear here once customers start making reservations.</p>
      </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reference</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Payment</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredBookings.map((booking) => {
                  const bookingType = booking.type?.toLowerCase() || 'flights';
                  const bookingId = booking._id || booking.id;
                  const customerName = booking.user 
                    ? `${booking.user.firstName || ''} ${booking.user.lastName || ''}`.trim() || booking.user.email
                    : 'N/A';
                  const amount = booking.pricing?.totalAmount || booking.totalAmount || 0;
                  
                  return (
                    <tr key={bookingId} className="hover:bg-gray-50">
                      <td className="px-4 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{booking.bookingReference || 'N/A'}</div>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                          booking.type === 'Flight' ? 'bg-blue-100 text-blue-800' :
                          booking.type === 'Package' ? 'bg-purple-100 text-purple-800' :
                          booking.type === 'Helicopter' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-green-100 text-green-800'
                        }`}>
                          {booking.type}
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        <div className="text-sm text-gray-900">{customerName}</div>
                        {/* Show booking-specific details */}
                        {booking.type === 'Hotel' && booking.hotel && (
                          <div className="text-xs text-gray-500 mt-1">
                            {typeof booking.hotel === 'object' ? `${booking.hotel.name || 'N/A'} - ${booking.hotel.location || 'N/A'}` : booking.hotel}
    </div>
                        )}
                        {booking.type === 'Hotel' && booking.checkIn && (
                          <div className="text-xs text-gray-500 mt-1">
                            {new Date(booking.checkIn).toLocaleDateString()} - {new Date(booking.checkOut).toLocaleDateString()}
                          </div>
                        )}
                        {booking.type === 'Flight' && booking.flight && (
                          <div className="text-xs text-gray-500 mt-1">
                            {typeof booking.flight === 'object' ? `${booking.flight.from || 'N/A'} → ${booking.flight.to || 'N/A'}` : booking.flight}
                          </div>
                        )}
                        {booking.type === 'Package' && booking.package && (
                          <div className="text-xs text-gray-500 mt-1">
                            {typeof booking.package === 'object' ? booking.package.title || 'N/A' : booking.package}
                          </div>
                        )}
                      </td>
                      <td className="px-4 py-4">
                        <div className="text-sm font-semibold text-gray-900">Rs.{amount.toLocaleString('en-IN')}</div>
                        {booking.type === 'Hotel' && booking.guests && (
                          <div className="text-xs text-gray-500 mt-1">
                            {typeof booking.guests === 'object' 
                              ? `${booking.guests.adults || 0} adults, ${booking.guests.children || 0} children`
                              : `${booking.guests} guests`}, {Array.isArray(booking.rooms) ? booking.rooms.length : booking.rooms || 1} room(s)
                          </div>
                        )}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <select
                          value={booking.status || 'pending'}
                          onChange={(e) => handleUpdateBookingStatus(bookingType, bookingId, e.target.value)}
                          className={`text-xs font-semibold rounded-full px-2 py-1 border-0 ${
                            booking.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                            booking.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                            booking.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                            'bg-gray-100 text-gray-800'
                          }`}
                        >
                          <option value="pending">Pending</option>
                          <option value="confirmed">Confirmed</option>
                          <option value="cancelled">Cancelled</option>
                          <option value="completed">Completed</option>
                        </select>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                          booking.paymentStatus === 'paid' ? 'bg-green-100 text-green-800' :
                          booking.paymentStatus === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {booking.paymentStatus || 'pending'}
                        </span>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">
                          {new Date(booking.createdAt || booking.created_at).toLocaleDateString()}
                        </div>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex items-center space-x-4">
                          <button
                            onClick={() => handleUpdateBookingStatus(bookingType, bookingId, booking.status === 'confirmed' ? 'cancelled' : 'confirmed')}
                            className={`${
                              booking.status === 'confirmed' ? 'text-red-600 hover:text-red-900' : 'text-green-600 hover:text-green-900'
                            }`}
                          >
                            {booking.status === 'confirmed' ? 'Cancel' : 'Confirm'}
                          </button>
                          <button
                            onClick={() =>
                              downloadBookingTicket(booking, {
                                customerName,
                                customerEmail: booking.user?.email,
                                amount,
                                type: booking.type
                              })
                            }
                            className="text-blue-600 hover:text-blue-900"
                          >
                            Ticket
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    );
  };

  const renderHelicopters = () => {
    if (loadingTab) {
      return (
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
            <p className="text-gray-600">Loading helicopters...</p>
          </div>
        </div>
      );
    }

    return (
      <div className="bg-white rounded-2xl shadow-xl p-4 sm:p-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 sm:mb-8 gap-4">
        <div>
            <h3 className="text-xl sm:text-2xl font-bold text-gray-900">Helicopter Management</h3>
            <p className="text-gray-600 mt-1 text-sm sm:text-base">Manage helicopter services</p>
        </div>
          <button 
            onClick={handleAddHelicopter}
            className="bg-gradient-to-r from-yellow-600 to-yellow-700 hover:from-yellow-700 hover:to-yellow-800 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-xl font-semibold transition-all duration-200 shadow-lg hover:shadow-xl text-sm sm:text-base w-full sm:w-auto"
          >
            + Add New Helicopter
        </button>
      </div>
        
        {helicopters.length === 0 ? (
          <div className="text-center py-12">
            <svg className="mx-auto h-16 w-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
            <h3 className="mt-4 text-lg font-medium text-gray-900">No helicopters yet</h3>
            <p className="mt-2 text-gray-500">Get started by adding your first helicopter service.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Model</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Operator</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Capacity</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price/Hour</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {helicopters.map((helicopter) => (
                  <tr key={helicopter._id || helicopter.id} className="hover:bg-gray-50">
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{helicopter.model}</div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">{helicopter.operator}</div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">{helicopter.capacity} passengers</div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="text-sm font-semibold text-gray-900">
                        Rs.{(helicopter.pricing?.basePricePerHour || 0).toLocaleString('en-IN')}
                      </div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                        helicopter.status === 'available' && helicopter.isActive !== false 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {helicopter.status === 'available' && helicopter.isActive !== false ? 'Available' : 'Unavailable'}
                      </span>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEditHelicopter(helicopter)}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteHelicopter(helicopter._id || helicopter.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    );
  };

  const renderUsers = () => {
    if (loadingTab) {
      return (
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
            <p className="text-gray-600">Loading users...</p>
          </div>
        </div>
      );
    }

    return (
      <div className="bg-white rounded-2xl shadow-xl p-4 sm:p-8">
        <div className="mb-6 sm:mb-8">
          <h3 className="text-xl sm:text-2xl font-bold text-gray-900">User Management</h3>
          <p className="text-gray-600 mt-1 text-sm sm:text-base">Manage customer accounts and permissions</p>
        </div>
        
        {users.length === 0 ? (
      <div className="text-center py-12">
        <svg className="mx-auto h-16 w-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
            <h3 className="mt-4 text-lg font-medium text-gray-900">No users found</h3>
            <p className="mt-2 text-gray-500">Users will appear here once they register.</p>
      </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Joined</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {users.map((user) => (
                  <tr key={user._id || user.id} className="hover:bg-gray-50">
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {user.firstName} {user.lastName}
                      </div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">{user.email}</div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">{user.phone || 'N/A'}</div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                        user.isActive !== false ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {user.isActive !== false ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">
                        {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
    </div>
  );
  };

  const renderInquiries = () => {
    if (loadingTab) {
      return (
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
            <p className="text-gray-600">Loading inquiries...</p>
          </div>
        </div>
      );
    }

    const handleUpdateInquiryStatus = async (inquiryId, status) => {
      try {
        await adminAPI.updateInquiryStatus(inquiryId, status);
        const updatedInquiries = inquiries.map(inq => 
          (inq._id || inq.id) === inquiryId ? { ...inq, status } : inq
        );
        setInquiries(updatedInquiries);
        alert('Inquiry status updated successfully');
      } catch (err) {
        alert('Error updating inquiry: ' + err.message);
      }
    };

    return (
      <div className="bg-white rounded-2xl shadow-xl p-4 sm:p-8">
        <div className="mb-6 sm:mb-8">
          <h3 className="text-xl sm:text-2xl font-bold text-gray-900">Inquiry Management</h3>
          <p className="text-gray-600 mt-1 text-sm sm:text-base">Manage customer inquiries and responses</p>
        </div>
        
        {inquiries.length === 0 ? (
          <div className="text-center py-12">
            <svg className="mx-auto h-16 w-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
            </svg>
            <h3 className="mt-4 text-lg font-medium text-gray-900">No inquiries yet</h3>
            <p className="mt-2 text-gray-500">Customer inquiries will appear here.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Subject</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Message</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {inquiries.map((inquiry) => (
                  <tr key={inquiry._id || inquiry.id} className="hover:bg-gray-50">
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{inquiry.name || 'N/A'}</div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">{inquiry.email}</div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="text-sm text-gray-900">{inquiry.subject || inquiry.inquiryType || 'General'}</div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="text-sm text-gray-500 max-w-xs truncate">{inquiry.message}</div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                        inquiry.status === 'resolved' ? 'bg-green-100 text-green-800' :
                        inquiry.status === 'in_progress' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-blue-100 text-blue-800'
                      }`}>
                        {inquiry.status || 'new'}
                      </span>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">
                        {inquiry.createdAt ? new Date(inquiry.createdAt).toLocaleDateString() : 'N/A'}
                      </div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm font-medium">
                      <select
                        value={inquiry.status || 'new'}
                        onChange={(e) => handleUpdateInquiryStatus(inquiry._id || inquiry.id, e.target.value)}
                        className="text-xs border rounded px-2 py-1"
                      >
                        <option value="new">New</option>
                        <option value="in_progress">In Progress</option>
                        <option value="resolved">Resolved</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    );
  };

  const renderSettings = () => (
    <div className="bg-white rounded-2xl shadow-xl p-8">
      <h3 className="text-2xl font-bold text-gray-900 mb-8">Admin Settings</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Admin Email</label>
            <input
              type="email"
              defaultValue="rhythmtours@gmail.com"
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Website Name</label>
            <input
              type="text"
              defaultValue="Recent and Rhythm Tours and Travels"
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Support Phone</label>
            <input
              type="tel"
              defaultValue="+977 01 4001078"
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200"
            />
          </div>
        </div>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Currency</label>
            <select className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200">
              <option>Indian Rupee (Rs.)</option>
              <option>US Dollar ($)</option>
              <option>Euro (€)</option>
              <option>British Pound (£)</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Timezone</label>
            <select className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200">
              <option>Asia/Kolkata (UTC+5:30)</option>
              <option>UTC</option>
              <option>America/New_York</option>
              <option>Europe/London</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Maintenance Mode</label>
            <div className="flex items-center space-x-3">
              <input type="checkbox" className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded" />
              <span className="text-sm text-gray-600">Enable maintenance mode</span>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8 pt-6 border-t border-gray-200">
        <button className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-8 py-3 rounded-xl font-semibold transition-all duration-200 shadow-lg hover:shadow-xl">
          Save Settings
        </button>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return renderOverview();
      case 'hotels':
        return renderHotels();
      case 'packages':
        return renderPackages();
      case 'helicopters':
        return renderHelicopters();
      case 'flight-bookings':
        return renderFlightBookings();
      case 'package-bookings':
        return renderPackageBookings();
      case 'hotel-bookings':
        return renderHotelBookings();
      case 'helicopter-bookings':
        return renderHelicopterBookings();
      case 'users':
        return renderUsers();
      case 'inquiries':
        return renderInquiries();
      case 'settings':
        return renderSettings();
      default:
        return renderOverview();
    }
  };

  if (!adminUser) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Top Navigation */}
      <div className="bg-white shadow-lg border-b border-gray-200">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center">
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="text-gray-500 hover:text-gray-700 lg:hidden p-2 rounded-lg hover:bg-gray-100"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <div className="ml-4 flex items-center">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center mr-3">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Recent and Rhythm Tours and Travels Admin</h1>
                <p className="text-sm text-gray-500">Travel Management System</p>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="text-right">
              <p className="text-sm font-medium text-gray-900">{adminUser.name}</p>
              <p className="text-xs text-gray-500 capitalize">{adminUser.role}</p>
            </div>
            <button
              onClick={handleLogout}
              className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white px-4 py-2 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              Logout
            </button>
          </div>
        </div>
      </div>

      <div className="flex">
        {/* Sidebar */}
        <div className={`${isSidebarOpen ? 'block' : 'hidden'} lg:block w-64 bg-white shadow-xl min-h-screen`}>
          <nav className="mt-8">
            <div className="px-4 space-y-2">
              {[
                { id: 'overview', name: 'Overview', icon: 'M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z' },
                { id: 'hotels', name: 'Hotels', icon: 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4' },
                { id: 'packages', name: 'Packages', icon: 'M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4' },
                { id: 'helicopters', name: 'Helicopters', icon: 'M12 19l9 2-9-18-9 18 9-2zm0 0v-8' },
                { id: 'flight-bookings', name: 'Flight Bookings', icon: 'M12 19l9 2-9-18-9 18 9-2zm0 0v-8' },
                { id: 'package-bookings', name: 'Package Bookings', icon: 'M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4' },
                { id: 'hotel-bookings', name: 'Hotel Bookings', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
                { id: 'helicopter-bookings', name: 'Helicopter Bookings', icon: 'M12 19l9 2-9-18-9 18 9-2zm0 0v-8' },
                { id: 'users', name: 'Users', icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z' },
                { id: 'inquiries', name: 'Inquiries', icon: 'M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z' },
                { id: 'settings', name: 'Settings', icon: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z' }
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 ${activeTab === item.id
                    ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg'
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                    }`}
                >
                  <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} />
                  </svg>
                  {item.name}
                </button>
              ))}
            </div>
          </nav>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-8">
          {renderContent()}
        </div>
      </div>

      {/* Package Modal */}
      {showPackageModal && (
        <PackageModal
          package={editingItem}
          onClose={() => {
            setShowPackageModal(false);
            setEditingItem(null);
          }}
          onSave={handleSavePackage}
        />
      )}

      {/* Hotel Modal */}
      {showHotelModal && (
        <HotelModal
          hotel={editingItem}
          onClose={() => {
            setShowHotelModal(false);
            setEditingItem(null);
          }}
          onSave={handleSaveHotel}
        />
      )}

      {/* Helicopter Modal */}
      {showHelicopterModal && (
        <HelicopterModal
          helicopter={editingItem}
          onClose={() => {
            setShowHelicopterModal(false);
            setEditingItem(null);
          }}
          onSave={handleSaveHelicopter}
        />
      )}
    </div>
  );
};

// Package Modal Component
const PackageModal = ({ package: pkg, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    title: pkg?.title || '',
    destination: pkg?.destination || '',
    description: pkg?.description || '',
    days: pkg?.duration?.days || 1,
    nights: pkg?.duration?.nights || 0,
    originalPrice: pkg?.pricing?.originalPrice || 0,
    discountedPrice: pkg?.pricing?.discountedPrice || 0,
    discountPercentage: pkg?.pricing?.discountPercentage || 0,
    highlights: pkg?.highlights?.join('\n') || '',
    includes: pkg?.includes?.join('\n') || '',
    excludes: pkg?.excludes?.join('\n') || '',
    images: pkg?.images?.join('\n') || '',
    isActive: pkg?.isActive !== false
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const packageData = {
        title: formData.title,
        destination: formData.destination,
        description: formData.description,
        duration: {
          days: parseInt(formData.days),
          nights: parseInt(formData.nights)
        },
        pricing: {
          originalPrice: parseFloat(formData.originalPrice),
          discountedPrice: parseFloat(formData.discountedPrice) || 0,
          discountPercentage: parseFloat(formData.discountPercentage) || 0,
          currency: 'NPR'
        },
        highlights: formData.highlights.split('\n').filter(h => h.trim()),
        includes: formData.includes.split('\n').filter(i => i.trim()),
        excludes: formData.excludes.split('\n').filter(e => e.trim()),
        images: formData.images.split('\n').filter(img => img.trim()),
        isActive: formData.isActive
      };

      await onSave(packageData);
    } catch (err) {
      console.error('Error saving package:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b p-6 flex justify-between items-center">
          <h2 className="text-2xl font-bold">{pkg ? 'Edit Package' : 'Add New Package'}</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Title *</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                className="w-full border rounded-lg px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Destination *</label>
              <input
                type="text"
                name="destination"
                value={formData.destination}
                onChange={handleChange}
                required
                className="w-full border rounded-lg px-3 py-2"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Description *</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              rows="3"
              className="w-full border rounded-lg px-3 py-2"
            />
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Days *</label>
              <input
                type="number"
                name="days"
                value={formData.days}
                onChange={handleChange}
                required
                min="1"
                className="w-full border rounded-lg px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Nights *</label>
              <input
                type="number"
                name="nights"
                value={formData.nights}
                onChange={handleChange}
                required
                min="0"
                className="w-full border rounded-lg px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Active</label>
              <div className="mt-2">
                <input
                  type="checkbox"
                  name="isActive"
                  checked={formData.isActive}
                  onChange={handleChange}
                  className="w-5 h-5"
                />
              </div>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Original Price (NPR) *</label>
              <input
                type="number"
                name="originalPrice"
                value={formData.originalPrice}
                onChange={handleChange}
                required
                min="0"
                className="w-full border rounded-lg px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Discounted Price (NPR)</label>
              <input
                type="number"
                name="discountedPrice"
                value={formData.discountedPrice}
                onChange={handleChange}
                min="0"
                className="w-full border rounded-lg px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Discount %</label>
              <input
                type="number"
                name="discountPercentage"
                value={formData.discountPercentage}
                onChange={handleChange}
                min="0"
                max="100"
                className="w-full border rounded-lg px-3 py-2"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Highlights (one per line)</label>
            <textarea
              name="highlights"
              value={formData.highlights}
              onChange={handleChange}
              rows="3"
              className="w-full border rounded-lg px-3 py-2"
              placeholder="Feature 1&#10;Feature 2&#10;Feature 3"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Includes (one per line)</label>
              <textarea
                name="includes"
                value={formData.includes}
                onChange={handleChange}
                rows="3"
                className="w-full border rounded-lg px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Excludes (one per line)</label>
              <textarea
                name="excludes"
                value={formData.excludes}
                onChange={handleChange}
                rows="3"
                className="w-full border rounded-lg px-3 py-2"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Images (URLs, one per line)</label>
            <textarea
              name="images"
              value={formData.images}
              onChange={handleChange}
              rows="2"
              className="w-full border rounded-lg px-3 py-2"
              placeholder="https://example.com/image1.jpg&#10;https://example.com/image2.jpg"
            />
          </div>
          <div className="flex justify-end space-x-3 pt-4 border-t">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 border rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
            >
              {isSubmitting ? 'Saving...' : 'Save Package'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Hotel Modal Component
const HotelModal = ({ hotel, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    name: hotel?.name || '',
    location: hotel?.location || '',
    city: hotel?.city || '',
    country: hotel?.country || '',
    description: hotel?.description || '',
    rating: hotel?.rating || 0,
    starRating: hotel?.starRating || hotel?.stars || 3,
    basePricePerNight: hotel?.pricing?.basePricePerNight || hotel?.pricing?.basePrice || hotel?.pricePerNight || 0,
    amenities: hotel?.amenities?.join('\n') || '',
    images: hotel?.images?.join('\n') || '',
    isActive: hotel?.isActive !== false
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const hotelData = {
        name: formData.name,
        location: formData.location,
        city: formData.city,
        country: formData.country,
        description: formData.description,
        rating: parseFloat(formData.rating) || 0,
        starRating: parseInt(formData.starRating) || 3,
        pricing: {
          basePricePerNight: parseFloat(formData.basePricePerNight),
          currency: 'NPR'
        },
        amenities: formData.amenities.split('\n').filter(a => a.trim()),
        images: formData.images.split('\n').filter(img => img.trim()),
        isActive: formData.isActive
      };

      await onSave(hotelData);
    } catch (err) {
      console.error('Error saving hotel:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b p-6 flex justify-between items-center">
          <h2 className="text-2xl font-bold">{hotel ? 'Edit Hotel' : 'Add New Hotel'}</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Hotel Name *</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full border rounded-lg px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Location *</label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                required
                className="w-full border rounded-lg px-3 py-2"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">City *</label>
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleChange}
                required
                className="w-full border rounded-lg px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Country *</label>
              <input
                type="text"
                name="country"
                value={formData.country}
                onChange={handleChange}
                required
                className="w-full border rounded-lg px-3 py-2"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Description *</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              rows="3"
              className="w-full border rounded-lg px-3 py-2"
            />
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Rating (0-5)</label>
              <input
                type="number"
                name="rating"
                value={formData.rating}
                onChange={handleChange}
                min="0"
                max="5"
                step="0.1"
                className="w-full border rounded-lg px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Star Rating (1-5) *</label>
              <input
                type="number"
                name="starRating"
                value={formData.starRating}
                onChange={handleChange}
                required
                min="1"
                max="5"
                className="w-full border rounded-lg px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Price/Night (NPR) *</label>
              <input
                type="number"
                name="basePricePerNight"
                value={formData.basePricePerNight}
                onChange={handleChange}
                required
                min="0"
                className="w-full border rounded-lg px-3 py-2"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Amenities (one per line)</label>
            <textarea
              name="amenities"
              value={formData.amenities}
              onChange={handleChange}
              rows="3"
              className="w-full border rounded-lg px-3 py-2"
              placeholder="Free WiFi&#10;Swimming Pool&#10;Gym"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Images (URLs, one per line)</label>
            <textarea
              name="images"
              value={formData.images}
              onChange={handleChange}
              rows="2"
              className="w-full border rounded-lg px-3 py-2"
            />
          </div>
          <div>
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                name="isActive"
                checked={formData.isActive}
                onChange={handleChange}
                className="w-5 h-5"
              />
              <span className="text-sm font-medium">Active</span>
            </label>
          </div>
          <div className="flex justify-end space-x-3 pt-4 border-t">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 border rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              {isSubmitting ? 'Saving...' : 'Save Hotel'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Helicopter Modal Component
const HelicopterModal = ({ helicopter, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    helicopterNumber: helicopter?.helicopterNumber || '',
    model: helicopter?.model || '',
    capacity: helicopter?.capacity || 4,
    operator: helicopter?.operator || '',
    baseLocation: helicopter?.baseLocation || '',
    availableLocations: helicopter?.availableLocations?.join('\n') || '',
    basePricePerHour: helicopter?.pricing?.basePricePerHour || 0,
    scenicTour: helicopter?.pricing?.scenicTour || 0,
    charter: helicopter?.pricing?.charter || 0,
    mountainLanding: helicopter?.pricing?.mountainLanding || 0,
    airportTransfer: helicopter?.pricing?.airportTransfer || 0,
    rescue: helicopter?.pricing?.rescue || 0,
    status: helicopter?.status || 'available',
    images: helicopter?.images?.join('\n') || '',
    isActive: helicopter?.isActive !== false
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const helicopterData = {
        helicopterNumber: formData.helicopterNumber.toUpperCase(),
        model: formData.model,
        capacity: parseInt(formData.capacity),
        operator: formData.operator,
        baseLocation: formData.baseLocation,
        availableLocations: formData.availableLocations.split('\n').filter(l => l.trim()),
        pricing: {
          basePricePerHour: parseFloat(formData.basePricePerHour),
          scenicTour: parseFloat(formData.scenicTour) || 0,
          charter: parseFloat(formData.charter) || 0,
          mountainLanding: parseFloat(formData.mountainLanding) || 0,
          airportTransfer: parseFloat(formData.airportTransfer) || 0,
          rescue: parseFloat(formData.rescue) || 0
        },
        status: formData.status,
        images: formData.images.split('\n').filter(img => img.trim()),
        isActive: formData.isActive
      };

      await onSave(helicopterData);
    } catch (err) {
      console.error('Error saving helicopter:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b p-6 flex justify-between items-center">
          <h2 className="text-2xl font-bold">{helicopter ? 'Edit Helicopter' : 'Add New Helicopter'}</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Helicopter Number *</label>
              <input
                type="text"
                name="helicopterNumber"
                value={formData.helicopterNumber}
                onChange={handleChange}
                required
                className="w-full border rounded-lg px-3 py-2"
                placeholder="HEL-001"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Model *</label>
              <input
                type="text"
                name="model"
                value={formData.model}
                onChange={handleChange}
                required
                className="w-full border rounded-lg px-3 py-2"
                placeholder="Robinson R44"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Capacity (1-6) *</label>
              <input
                type="number"
                name="capacity"
                value={formData.capacity}
                onChange={handleChange}
                required
                min="1"
                max="6"
                className="w-full border rounded-lg px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Operator *</label>
              <input
                type="text"
                name="operator"
                value={formData.operator}
                onChange={handleChange}
                required
                className="w-full border rounded-lg px-3 py-2"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Base Location *</label>
            <input
              type="text"
              name="baseLocation"
              value={formData.baseLocation}
              onChange={handleChange}
              required
              className="w-full border rounded-lg px-3 py-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Available Locations (one per line)</label>
            <textarea
              name="availableLocations"
              value={formData.availableLocations}
              onChange={handleChange}
              rows="2"
              className="w-full border rounded-lg px-3 py-2"
            />
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Base Price/Hour (NPR) *</label>
              <input
                type="number"
                name="basePricePerHour"
                value={formData.basePricePerHour}
                onChange={handleChange}
                required
                min="0"
                className="w-full border rounded-lg px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Scenic Tour (NPR)</label>
              <input
                type="number"
                name="scenicTour"
                value={formData.scenicTour}
                onChange={handleChange}
                min="0"
                className="w-full border rounded-lg px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Charter (NPR)</label>
              <input
                type="number"
                name="charter"
                value={formData.charter}
                onChange={handleChange}
                min="0"
                className="w-full border rounded-lg px-3 py-2"
              />
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Mountain Landing (NPR)</label>
              <input
                type="number"
                name="mountainLanding"
                value={formData.mountainLanding}
                onChange={handleChange}
                min="0"
                className="w-full border rounded-lg px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Airport Transfer (NPR)</label>
              <input
                type="number"
                name="airportTransfer"
                value={formData.airportTransfer}
                onChange={handleChange}
                min="0"
                className="w-full border rounded-lg px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Rescue (NPR)</label>
              <input
                type="number"
                name="rescue"
                value={formData.rescue}
                onChange={handleChange}
                min="0"
                className="w-full border rounded-lg px-3 py-2"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Status *</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                required
                className="w-full border rounded-lg px-3 py-2"
              >
                <option value="available">Available</option>
                <option value="booked">Booked</option>
                <option value="maintenance">Maintenance</option>
              </select>
            </div>
            <div>
              <label className="flex items-center space-x-2 mt-6">
                <input
                  type="checkbox"
                  name="isActive"
                  checked={formData.isActive}
                  onChange={handleChange}
                  className="w-5 h-5"
                />
                <span className="text-sm font-medium">Active</span>
              </label>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Images (URLs, one per line)</label>
            <textarea
              name="images"
              value={formData.images}
              onChange={handleChange}
              rows="2"
              className="w-full border rounded-lg px-3 py-2"
            />
          </div>
          <div className="flex justify-end space-x-3 pt-4 border-t">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 border rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 disabled:opacity-50"
            >
              {isSubmitting ? 'Saving...' : 'Save Helicopter'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminDashboard;
