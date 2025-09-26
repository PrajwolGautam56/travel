import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const UserProfile = () => {
    const [activeTab, setActiveTab] = useState('overview');
    const [isEditing, setIsEditing] = useState(false);

    // Mock user data
    const userData = {
        name: 'Rhythm Tours',
        email: 'rhythmtours@gmail.com',
        phone: '+977 01 4001078',
        dateOfBirth: '1990-05-15',
        address: 'Uttar Dhoka, Kathmandu, Nepal',
        memberSince: '2023-01-15',
        totalBookings: 12,
        loyaltyPoints: 2450,
        profileImage: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80'
    };

    const [formData, setFormData] = useState(userData);

    const handleInputChange = (field, value) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleSave = () => {
        // Here you would typically save to backend
        console.log('Saving profile data:', formData);
        setIsEditing(false);
    };

    const recentBookings = [
        {
            id: 'BK001',
            type: 'Flight',
            destination: 'Delhi to Mumbai',
            date: '2024-12-20',
            status: 'Confirmed',
            amount: 'Rs.8,500'
        },
        {
            id: 'BK002',
            type: 'Hotel',
            destination: 'Taj Hotel, Mumbai',
            date: '2024-12-18',
            status: 'Confirmed',
            amount: 'Rs.15,000'
        },
        {
            id: 'BK003',
            type: 'Package',
            destination: 'Dubai Luxury Escape',
            date: '2024-12-10',
            status: 'Completed',
            amount: 'Rs.65,500'
        }
    ];

    const tabs = [
        { id: 'overview', label: 'Overview', icon: '📊' },
        { id: 'bookings', label: 'My Bookings', icon: '✈️' },
        { id: 'profile', label: 'Profile Settings', icon: '👤' },
        { id: 'preferences', label: 'Preferences', icon: '⚙️' },
        { id: 'loyalty', label: 'Loyalty Points', icon: '⭐' }
    ];

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
                                            <div className="text-3xl font-bold text-green-600">Rs.89,000</div>
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
                                                        <div className="font-semibold text-gray-900">{booking.amount}</div>
                                                        <div className={`text-sm px-2 py-1 rounded-full ${booking.status === 'Confirmed'
                                                            ? 'bg-green-100 text-green-800'
                                                            : 'bg-blue-100 text-blue-800'
                                                            }`}>
                                                            {booking.status}
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

                                    <div className="space-y-4">
                                        {recentBookings.map((booking) => (
                                            <div key={booking.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                                                <div className="flex items-center justify-between mb-4">
                                                    <div className="flex items-center space-x-4">
                                                        <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                                                            <span className="text-orange-600 text-xl">✈️</span>
                                                        </div>
                                                        <div>
                                                            <h3 className="text-lg font-semibold text-gray-900">{booking.destination}</h3>
                                                            <p className="text-gray-600">Booking ID: {booking.id}</p>
                                                        </div>
                                                    </div>
                                                    <div className="text-right">
                                                        <div className="text-2xl font-bold text-gray-900">{booking.amount}</div>
                                                        <div className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${booking.status === 'Confirmed'
                                                            ? 'bg-green-100 text-green-800'
                                                            : 'bg-blue-100 text-blue-800'
                                                            }`}>
                                                            {booking.status}
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="flex items-center justify-between text-sm text-gray-600">
                                                    <span>Date: {booking.date}</span>
                                                    <span>Type: {booking.type}</span>
                                                </div>
                                                <div className="mt-4 flex space-x-3">
                                                    <button className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors">
                                                        View Details
                                                    </button>
                                                    <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                                                        Download Ticket
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
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
                                                <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                                                <input
                                                    type="text"
                                                    value={formData.name}
                                                    onChange={(e) => handleInputChange('name', e.target.value)}
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
                                                        setFormData(userData);
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
