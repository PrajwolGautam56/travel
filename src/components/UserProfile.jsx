import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { userAPI, bookingsAPI, authAPI } from '../services/api';
import { downloadBookingTicket } from '../utils/ticketGenerator';

const UserProfile = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('overview');
    const [isEditing, setIsEditing] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [userData, setUserData] = useState(null);
    const [allBookings, setAllBookings] = useState([]);
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        dateOfBirth: '',
        address: ''
    });
    const [processingBookingId, setProcessingBookingId] = useState(null);

    useEffect(() => {
        const fetchUserData = async () => {
            setIsLoading(true);
            try {
                // Get current user
                const currentUser = await authAPI.getCurrentUser();
                const user = currentUser.user || currentUser;
                
                // Get user profile with booking counts
                const profileData = await userAPI.getProfile();
                const profile = profileData.user || profileData;
                
                // Get all bookings
                const flightBookings = await bookingsAPI.getUserFlightBookings();
                const packageBookings = await bookingsAPI.getUserPackageBookings();
                const helicopterBookings = await bookingsAPI.getUserHelicopterBookings();
                const hotelBookings = await bookingsAPI.getUserHotelBookings();
                
                const bookings = [
                    ...(flightBookings.bookings || flightBookings || []).map(b => ({ ...b, type: 'Flight' })),
                    ...(packageBookings.bookings || packageBookings || []).map(b => ({ ...b, type: 'Package' })),
                    ...(helicopterBookings.bookings || helicopterBookings || []).map(b => ({ ...b, type: 'Helicopter' })),
                    ...(hotelBookings.bookings || hotelBookings || []).map(b => ({ ...b, type: 'Hotel' }))
                ].sort((a, b) => new Date(b.createdAt || b.created_at) - new Date(a.createdAt || a.created_at));

                setAllBookings(bookings);
                
                const userInfo = {
                    firstName: profile.firstName || user.firstName || '',
                    lastName: profile.lastName || user.lastName || '',
                    name: `${profile.firstName || user.firstName || ''} ${profile.lastName || user.lastName || ''}`.trim() || user.name || 'User',
                    email: profile.email || user.email || '',
                    phone: profile.phone || user.phone || '',
                    dateOfBirth: profile.dateOfBirth || user.dateOfBirth || '',
                    address: profile.address || user.address || '',
                    memberSince: profile.createdAt || user.createdAt || new Date().toISOString(),
                    totalBookings: profile.bookings?.total || bookings.length || 0,
                    loyaltyPoints: 0, // Can be calculated from bookings
                    profileImage: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80'
                };

                setUserData(userInfo);
                setFormData({
                    firstName: userInfo.firstName,
                    lastName: userInfo.lastName,
                    email: userInfo.email,
                    phone: userInfo.phone,
                    dateOfBirth: userInfo.dateOfBirth,
                    address: userInfo.address
                });
            } catch (error) {
                console.error('Error fetching user data:', error);
                // If not logged in, redirect to login
                if (error.message.includes('401') || error.message.includes('Unauthorized')) {
                    navigate('/login');
                }
            } finally {
                setIsLoading(false);
            }
        };

        fetchUserData();
    }, [navigate]);

    const handleInputChange = (field, value) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleSave = async () => {
        try {
            await userAPI.updateProfile(formData);
            // Update userData with new values
            setUserData(prev => ({
                ...prev,
                firstName: formData.firstName,
                lastName: formData.lastName,
                name: `${formData.firstName} ${formData.lastName}`.trim(),
                email: formData.email,
                phone: formData.phone,
                dateOfBirth: formData.dateOfBirth,
                address: formData.address
            }));
            setIsEditing(false);
            alert('Profile updated successfully');
        } catch (error) {
            console.error('Error updating profile:', error);
            alert('Error updating profile: ' + error.message);
        }
    };

    const handleDownloadTicket = (booking) => {
        const meta = {
            customerName: userData?.name,
            customerEmail: userData?.email,
            amount: booking.pricing?.totalAmount || booking.totalAmount || 0,
            type: booking.type
        };
        downloadBookingTicket(booking, meta);
    };

    const handleCancelBooking = async (booking) => {
        const bookingId = booking._id || booking.id;
        const bookingType = (booking.type || '').toLowerCase();

        if (!bookingId || !bookingType) {
            alert('Unable to cancel this booking. Please contact support.');
            return;
        }

        if (!window.confirm('Are you sure you want to cancel this booking?')) {
            return;
        }

        setProcessingBookingId(bookingId);
        try {
            await bookingsAPI.cancelBooking(bookingType, bookingId, 'Cancelled from user dashboard');
            setAllBookings(prev =>
                prev.map(b =>
                    (b._id || b.id) === bookingId
                        ? { ...b, status: 'cancelled', cancellationReason: 'Cancelled from user dashboard' }
                        : b
                )
            );
            alert('Your booking has been cancelled.');
        } catch (error) {
            console.error('Cancel booking error:', error);
            alert('Error cancelling booking: ' + error.message);
        } finally {
            setProcessingBookingId(null);
        }
    };

    // Transform bookings for display
    const transformBooking = (booking) => {
        let destination = 'N/A';
        if (booking.type === 'Flight') {
            // Backend returns flight as an object with from/to
            if (booking.flight && booking.flight.from && booking.flight.to) {
                destination = `${booking.flight.from} to ${booking.flight.to}`;
            } else if (booking.from && booking.to) {
                destination = `${booking.from} to ${booking.to}`;
            } else {
                destination = 'Flight Booking';
            }
        } else if (booking.type === 'Package') {
            if (booking.package) {
                destination = booking.package.title || booking.package.destination || 'Package Booking';
            } else if (booking.packageTitle) {
                destination = booking.packageTitle;
            } else {
                destination = 'Package Booking';
            }
        } else if (booking.type === 'Hotel') {
            if (booking.hotel) {
                destination = booking.hotel.name || booking.hotel.location || 'Hotel Booking';
            } else if (booking.hotelName) {
                destination = booking.hotelName;
            } else {
                destination = 'Hotel Booking';
            }
        } else if (booking.type === 'Helicopter') {
            if (booking.helicopter) {
                destination = booking.helicopter.baseLocation || booking.helicopter.model || 'Helicopter Booking';
            } else if (booking.pickupLocation) {
                destination = `${booking.pickupLocation}${booking.dropoffLocation ? ` to ${booking.dropoffLocation}` : ''}`;
            } else {
                destination = 'Helicopter Booking';
            }
        }

        const travelDate = booking.travelDate || booking.bookingDate || booking.checkInDate || booking.createdAt;
        const dateStr = travelDate ? new Date(travelDate).toLocaleDateString() : 'N/A';

        // Get amount from various possible fields
        const amount = booking.pricing?.totalAmount ||
            booking.totalAmount ||
            booking.pricing?.baseAmount ||
            0;
        const bookingId = booking._id || booking.id;
        const bookingReference = booking.bookingReference || bookingId;
        const normalizedStatus = (booking.status || 'pending').toLowerCase();
        const statusLabel = normalizedStatus.charAt(0).toUpperCase() + normalizedStatus.slice(1);

        return {
            id: bookingReference,
            bookingId,
            type: booking.type,
            destination: destination,
            date: dateStr,
            status: normalizedStatus,
            statusLabel,
            amountDisplay: `Rs.${amount.toLocaleString('en-IN')}`,
            amountValue: amount,
            booking: booking
        };
    };

    const recentBookings = allBookings.slice(0, 10).map(transformBooking);

    const tabs = [
        { id: 'overview', label: 'Overview', icon: '📊' },
        { id: 'bookings', label: 'My Bookings', icon: '✈️' },
        { id: 'profile', label: 'Profile Settings', icon: '👤' },
        { id: 'preferences', label: 'Preferences', icon: '⚙️' },
        { id: 'loyalty', label: 'Loyalty Points', icon: '⭐' }
    ];

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mb-4"></div>
                    <p className="text-gray-600">Loading profile...</p>
                </div>
            </div>
        );
    }

    if (!userData) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <p className="text-red-600 text-lg">Error loading profile. Please try again.</p>
                    <button onClick={() => navigate('/login')} className="mt-4 text-orange-500 hover:text-orange-600">
                        Go to Login
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white shadow-sm border-b">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>
                            <p className="text-gray-600 mt-1">Manage your account and travel preferences</p>
                        </div>
                        <div className="flex items-center space-x-4">
                            <div className="text-right">
                                <p className="text-sm text-gray-600">Loyalty Points</p>
                                <p className="text-2xl font-bold text-orange-500">{userData.loyaltyPoints.toLocaleString()}</p>
                            </div>
                            <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                                <span className="text-2xl">⭐</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Sidebar */}
                    <div className="lg:w-1/4">
                        <div className="bg-white rounded-lg shadow-sm p-6 sticky top-8">
                            {/* Profile Card */}
                            <div className="text-center mb-6">
                                <div className="w-20 h-20 mx-auto mb-4 rounded-full overflow-hidden">
                                    <img
                                        src={userData.profileImage}
                                        alt="Profile"
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                <h3 className="text-xl font-semibold text-gray-900">{userData.name}</h3>
                                <p className="text-gray-600">{userData.email}</p>
                                <p className="text-sm text-gray-500 mt-1">Member since {new Date(userData.memberSince).toLocaleDateString()}</p>
                            </div>

                            {/* Navigation Tabs */}
                            <nav className="space-y-2">
                                {tabs.map((tab) => (
                                    <button
                                        key={tab.id}
                                        onClick={() => setActiveTab(tab.id)}
                                        className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors ${activeTab === tab.id
                                            ? 'bg-orange-100 text-orange-700 border-l-4 border-orange-500'
                                            : 'text-gray-600 hover:bg-gray-100'
                                            }`}
                                    >
                                        <span className="text-lg">{tab.icon}</span>
                                        <span className="font-medium">{tab.label}</span>
                                    </button>
                                ))}
                            </nav>
                        </div>
                    </div>

                    {/* Main Content */}
                    <div className="lg:w-3/4">
                        <div className="bg-white rounded-lg shadow-sm">
                            {/* Overview Tab */}
                            {activeTab === 'overview' && (
                                <div className="p-6">
                                    <h2 className="text-2xl font-bold text-gray-900 mb-6">Account Overview</h2>

                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                                        <div className="bg-orange-50 rounded-lg p-6 text-center">
                                            <div className="text-3xl font-bold text-orange-600">{userData.totalBookings}</div>
                                            <div className="text-gray-600 mt-1">Total Bookings</div>
                                        </div>
                                        <div className="bg-blue-50 rounded-lg p-6 text-center">
                                            <div className="text-3xl font-bold text-blue-600">{userData.loyaltyPoints.toLocaleString()}</div>
                                            <div className="text-gray-600 mt-1">Loyalty Points</div>
                                        </div>
                                        <div className="bg-green-50 rounded-lg p-6 text-center">
                                            <div className="text-3xl font-bold text-green-600">
                                                Rs.{allBookings.reduce((sum, b) => {
                                                    const amt = b.pricing?.totalAmount || b.totalAmount || b.pricing?.baseAmount || 0;
                                                    return sum + amt;
                                                }, 0).toLocaleString('en-IN')}
                                            </div>
                                            <div className="text-gray-600 mt-1">Total Spent</div>
                                        </div>
                                    </div>

                                    <div className="mb-8">
                                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Bookings</h3>
                                        <div className="space-y-4">
                                            {recentBookings.slice(0, 3).map((booking) => (
                                                <div key={booking.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                                                    <div className="flex items-center space-x-4">
                                                        <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                                                            <span className="text-orange-600">✈️</span>
                                                        </div>
                                                        <div>
                                                            <div className="font-medium text-gray-900">{booking.destination}</div>
                                                            <div className="text-sm text-gray-600">{booking.date} • {booking.type}</div>
                                                        </div>
                                                    </div>
                                                    <div className="text-right">
                                                        <div className="font-semibold text-gray-900">{booking.amountDisplay}</div>
                                                        <div className={`text-sm px-2 py-1 rounded-full ${booking.status === 'confirmed'
                                                            ? 'bg-green-100 text-green-800'
                                                            : booking.status === 'cancelled'
                                                            ? 'bg-red-100 text-red-800'
                                                            : 'bg-blue-100 text-blue-800'
                                                            }`}>
                                                            {booking.statusLabel}
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                        <div className="mt-4">
                                            <Link
                                                to="/profile?tab=bookings"
                                                className="text-orange-600 hover:text-orange-700 font-medium"
                                                onClick={() => setActiveTab('bookings')}
                                            >
                                                View all bookings →
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Bookings Tab */}
                            {activeTab === 'bookings' && (
                                <div className="p-6">
                                    <h2 className="text-2xl font-bold text-gray-900 mb-6">My Bookings</h2>

                                    {allBookings.length === 0 ? (
                                        <div className="text-center py-12">
                                            <svg className="mx-auto h-16 w-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                            </svg>
                                            <h3 className="mt-4 text-lg font-medium text-gray-900">No bookings yet</h3>
                                            <p className="mt-2 text-gray-500">Your bookings will appear here once you make a reservation.</p>
                                        </div>
                                    ) : (
                                        <div className="space-y-4">
                                            {allBookings.map((booking) => {
                                                const transformed = transformBooking(booking);
                                                return (
                                                    <div key={transformed.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                                                        <div className="flex items-center justify-between mb-4">
                                                            <div className="flex items-center space-x-4">
                                                                <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                                                                    <span className="text-orange-600 text-xl">✈️</span>
                                                                </div>
                                                                <div>
                                                                    <h3 className="text-lg font-semibold text-gray-900">{transformed.destination}</h3>
                                                                    <p className="text-gray-600">Booking ID: {transformed.id}</p>
                                                                </div>
                                                            </div>
                                                        <div className="text-right">
                                                                <div className="text-2xl font-bold text-gray-900">{transformed.amountDisplay}</div>
                                                                <div className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                                                                    transformed.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                                                                    transformed.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                                                    transformed.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                                                                    'bg-blue-100 text-blue-800'
                                                                }`}>
                                                                    {transformed.statusLabel}
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="flex items-center justify-between text-sm text-gray-600">
                                                            <span>Date: {transformed.date}</span>
                                                            <span>Type: {transformed.type}</span>
                                                        </div>
                                                        <div className="mt-4 flex flex-wrap gap-3">
                                                            <button
                                                                onClick={() => handleDownloadTicket(booking)}
                                                                className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
                                                            >
                                                                Download Ticket
                                                            </button>
                                                            {transformed.status !== 'cancelled' && transformed.status !== 'completed' && (
                                                                <button
                                                                    onClick={() => handleCancelBooking(booking)}
                                                                    disabled={processingBookingId === (booking._id || booking.id)}
                                                                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                                                                >
                                                                    {processingBookingId === (booking._id || booking.id) ? 'Cancelling...' : 'Cancel Booking'}
                                                                </button>
                                                            )}
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Profile Settings Tab */}
                            {activeTab === 'profile' && (
                                <div className="p-6">
                                    <div className="flex items-center justify-between mb-6">
                                        <h2 className="text-2xl font-bold text-gray-900">Profile Settings</h2>
                                        <button
                                            onClick={() => setIsEditing(!isEditing)}
                                            className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
                                        >
                                            {isEditing ? 'Cancel' : 'Edit Profile'}
                                        </button>
                                    </div>

                                    <div className="space-y-6">
                                        <div className="flex items-center space-x-6">
                                            <div className="w-20 h-20 rounded-full overflow-hidden">
                                                <img
                                                    src={formData.profileImage}
                                                    alt="Profile"
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>
                                            <div>
                                                <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                                                    Change Photo
                                                </button>
                                                <p className="text-sm text-gray-500 mt-1">JPG, PNG up to 2MB</p>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">First Name</label>
                                                <input
                                                    type="text"
                                                    value={formData.firstName}
                                                    onChange={(e) => handleInputChange('firstName', e.target.value)}
                                                    disabled={!isEditing}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent disabled:bg-gray-100"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
                                                <input
                                                    type="text"
                                                    value={formData.lastName}
                                                    onChange={(e) => handleInputChange('lastName', e.target.value)}
                                                    disabled={!isEditing}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent disabled:bg-gray-100"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                                                <input
                                                    type="email"
                                                    value={formData.email}
                                                    onChange={(e) => handleInputChange('email', e.target.value)}
                                                    disabled={!isEditing}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent disabled:bg-gray-100"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                                                <input
                                                    type="tel"
                                                    value={formData.phone}
                                                    onChange={(e) => handleInputChange('phone', e.target.value)}
                                                    disabled={!isEditing}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent disabled:bg-gray-100"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">Date of Birth</label>
                                                <input
                                                    type="date"
                                                    value={formData.dateOfBirth}
                                                    onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
                                                    disabled={!isEditing}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent disabled:bg-gray-100"
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
                                            <textarea
                                                value={formData.address}
                                                onChange={(e) => handleInputChange('address', e.target.value)}
                                                disabled={!isEditing}
                                                rows={3}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent disabled:bg-gray-100"
                                            />
                                        </div>

                                        {isEditing && (
                                            <div className="flex space-x-4">
                                                <button
                                                    onClick={handleSave}
                                                    className="px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
                                                >
                                                    Save Changes
                                                </button>
                                                <button
                                                    onClick={() => {
                                                        setFormData({
                                                            firstName: userData.firstName,
                                                            lastName: userData.lastName,
                                                            email: userData.email,
                                                            phone: userData.phone,
                                                            dateOfBirth: userData.dateOfBirth,
                                                            address: userData.address
                                                        });
                                                        setIsEditing(false);
                                                    }}
                                                    className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                                                >
                                                    Cancel
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* Preferences Tab */}
                            {activeTab === 'preferences' && (
                                <div className="p-6">
                                    <h2 className="text-2xl font-bold text-gray-900 mb-6">Travel Preferences</h2>

                                    <div className="space-y-6">
                                        <div>
                                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Notification Preferences</h3>
                                            <div className="space-y-3">
                                                <label className="flex items-center">
                                                    <input type="checkbox" defaultChecked className="rounded border-gray-300 text-orange-600 focus:ring-orange-500" />
                                                    <span className="ml-3 text-gray-700">Email notifications for booking updates</span>
                                                </label>
                                                <label className="flex items-center">
                                                    <input type="checkbox" defaultChecked className="rounded border-gray-300 text-orange-600 focus:ring-orange-500" />
                                                    <span className="ml-3 text-gray-700">SMS notifications for urgent updates</span>
                                                </label>
                                                <label className="flex items-center">
                                                    <input type="checkbox" className="rounded border-gray-300 text-orange-600 focus:ring-orange-500" />
                                                    <span className="ml-3 text-gray-700">Marketing emails and offers</span>
                                                </label>
                                            </div>
                                        </div>

                                        <div>
                                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Travel Preferences</h3>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-2">Preferred Class</label>
                                                    <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent">
                                                        <option>Economy</option>
                                                        <option>Premium Economy</option>
                                                        <option>Business</option>
                                                        <option>First Class</option>
                                                    </select>
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-2">Seat Preference</label>
                                                    <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent">
                                                        <option>Window</option>
                                                        <option>Aisle</option>
                                                        <option>No Preference</option>
                                                    </select>
                                                </div>
                                            </div>
                                        </div>

                                        <button className="px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors">
                                            Save Preferences
                                        </button>
                                    </div>
                                </div>
                            )}

                            {/* Loyalty Points Tab */}
                            {activeTab === 'loyalty' && (
                                <div className="p-6">
                                    <h2 className="text-2xl font-bold text-gray-900 mb-6">Loyalty Points</h2>

                                    <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg p-8 text-white mb-8">
                                        <div className="text-center">
                                            <div className="text-5xl font-bold mb-2">{userData.loyaltyPoints.toLocaleString()}</div>
                                            <div className="text-orange-100 text-lg">Total Points</div>
                                            <div className="text-orange-200 text-sm mt-2">Next reward at 3,000 points</div>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                                        <div className="text-center p-6 bg-gray-50 rounded-lg">
                                            <div className="text-2xl font-bold text-gray-900">550</div>
                                            <div className="text-gray-600">Points to Next Reward</div>
                                        </div>
                                        <div className="text-center p-6 bg-gray-50 rounded-lg">
                                            <div className="text-2xl font-bold text-gray-900">Gold</div>
                                            <div className="text-gray-600">Current Tier</div>
                                        </div>
                                        <div className="text-center p-6 bg-gray-50 rounded-lg">
                                            <div className="text-2xl font-bold text-gray-900">12</div>
                                            <div className="text-gray-600">Bookings This Year</div>
                                        </div>
                                    </div>

                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Point Activity</h3>
                                        <div className="space-y-3">
                                            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                                                <div>
                                                    <div className="font-medium text-gray-900">Flight Booking</div>
                                                    <div className="text-sm text-gray-600">Delhi to Mumbai - Dec 20, 2024</div>
                                                </div>
                                                <div className="text-orange-600 font-semibold">+250 points</div>
                                            </div>
                                            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                                                <div>
                                                    <div className="font-medium text-gray-900">Hotel Booking</div>
                                                    <div className="text-sm text-gray-600">Taj Hotel, Mumbai - Dec 18, 2024</div>
                                                </div>
                                                <div className="text-orange-600 font-semibold">+150 points</div>
                                            </div>
                                            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                                                <div>
                                                    <div className="font-medium text-gray-900">Package Booking</div>
                                                    <div className="text-sm text-gray-600">Dubai Luxury Escape - Dec 10, 2024</div>
                                                </div>
                                                <div className="text-orange-600 font-semibold">+500 points</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserProfile;

