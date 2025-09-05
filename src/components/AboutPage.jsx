import React from 'react';

const AboutPage = () => {
    const teamMembers = [
        {
            id: 1,
            name: 'Sarah Johnson',
            position: 'CEO & Founder',
            image: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80',
            description: 'With over 15 years in the travel industry, Sarah founded Recent and Rhythm Tours and Travels with a vision to make travel accessible and enjoyable for everyone.'
        },
        {
            id: 2,
            name: 'Michael Chen',
            position: 'Chief Technology Officer',
            image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80',
            description: 'Michael leads our technology initiatives, ensuring our platform provides seamless booking experiences and innovative travel solutions.'
        },
        {
            id: 3,
            name: 'Emily Rodriguez',
            position: 'Head of Customer Experience',
            image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80',
            description: 'Emily ensures every customer interaction is exceptional, leading our support team to deliver world-class service.'
        },
        {
            id: 4,
            name: 'David Kumar',
            position: 'Head of Operations',
            image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80',
            description: 'David manages our global operations, ensuring smooth travel experiences and maintaining partnerships with airlines and hotels worldwide.'
        }
    ];

    const values = [
        {
            icon: (
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
            ),
            title: 'Passion for Travel',
            description: 'We believe travel enriches lives and creates lasting memories. Our passion drives us to deliver exceptional experiences.'
        },
        {
            icon: (
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            ),
            title: 'Trust & Reliability',
            description: 'We build lasting relationships through transparency, honesty, and consistently delivering on our promises.'
        },
        {
            icon: (
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
            ),
            title: 'Innovation',
            description: 'We continuously innovate to provide cutting-edge technology and services that enhance your travel experience.'
        },
        {
            icon: (
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
            ),
            title: 'Customer-Centric',
            description: 'Our customers are at the heart of everything we do. We listen, learn, and adapt to exceed your expectations.'
        }
    ];

    const milestones = [
        { year: '2010', title: 'Founded', description: 'Recent and Rhythm Tours and Travels was established with a vision to revolutionize travel booking' },
        { year: '2015', title: '1M+ Users', description: 'Reached our first million registered users milestone' },
        { year: '2018', title: 'Global Expansion', description: 'Expanded operations to 50+ countries worldwide' },
        { year: '2020', title: 'Digital Innovation', description: 'Launched AI-powered travel recommendations and mobile app' },
        { year: '2023', title: '10M+ Travelers', description: 'Celebrated serving over 10 million happy travelers globally' }
    ];

    return (
        <div className="min-h-screen bg-white">
            {/* Hero Section */}
            <section className="relative bg-gradient-to-br from-blue-900 via-blue-800 to-blue-700 py-20">
                <div className="absolute inset-0">
                    <img
                        src="images/white-clouds-blue-sky-daytime.jpg"
                        alt="About Recent and Rhythm Tours and Travels"
                        className="w-full h-full object-cover opacity-20"
                    />
                </div>
                <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
                        About Recent and Rhythm Tours and Travels
                    </h1>
                    <p className="text-xl md:text-2xl text-blue-100 max-w-3xl mx-auto leading-relaxed">
                        Connecting the world through exceptional travel experiences, one journey at a time
                    </p>
                </div>
            </section>

            {/* Company Story Section */}
            <section className="py-20 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                        <div>
                            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                                Our Story
                            </h2>
                            <div className="space-y-4 text-lg text-gray-600 leading-relaxed">
                                <p>
                                    Founded in 2010, Recent and Rhythm Tours and Travels began as a small team of travel enthusiasts who believed that
                                    everyone deserves access to affordable, reliable, and memorable travel experiences. What
                                    started as a simple idea has grown into a global platform serving millions of travelers worldwide.
                                </p>
                                <p>
                                    Our journey began when our founder, Sarah Johnson, experienced firsthand the frustrations
                                    of complex booking processes and hidden fees in the travel industry. She envisioned a
                                    platform that would make travel planning simple, transparent, and enjoyable for everyone.
                                </p>
                                <p>
                                    Today, Recent and Rhythm Tours and Travels stands as a testament to that vision. We've built partnerships with over
                                    500 airlines and 1 million hotels worldwide, helping travelers discover new destinations
                                    and create unforgettable memories.
                                </p>
                            </div>
                        </div>
                        <div className="relative">
                            <img
                                src="https://images.unsplash.com/photo-1488646953014-85cb44e25828?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80"
                                alt="Team working together"
                                className="rounded-2xl shadow-2xl"
                            />
                            <div className="absolute -bottom-6 -right-6 bg-blue-600 text-white p-6 rounded-xl shadow-lg">
                                <div className="text-3xl font-bold">10M+</div>
                                <div className="text-blue-100">Happy Travelers</div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Mission & Vision Section */}
            <section className="py-20 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                            Our Mission & Vision
                        </h2>
                        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                            We're driven by a clear purpose and an ambitious vision for the future of travel
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                        <div className="bg-white p-8 rounded-2xl shadow-lg">
                            <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mb-6">
                                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                </svg>
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900 mb-4">Our Mission</h3>
                            <p className="text-gray-600 leading-relaxed">
                                To make travel accessible, affordable, and enjoyable for everyone by providing
                                seamless booking experiences, competitive prices, and exceptional customer service.
                                We believe that travel has the power to transform lives and bring people together.
                            </p>
                        </div>

                        <div className="bg-white p-8 rounded-2xl shadow-lg">
                            <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mb-6">
                                <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                </svg>
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900 mb-4">Our Vision</h3>
                            <p className="text-gray-600 leading-relaxed">
                                To become the world's most trusted and innovative travel platform, connecting
                                people across cultures and continents. We envision a future where travel is
                                barrier-free, sustainable, and enriching for both travelers and local communities.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Values Section */}
            <section className="py-20 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                            Our Core Values
                        </h2>
                        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                            The principles that guide everything we do and shape our company culture
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {values.map((value, index) => (
                            <div key={index} className="text-center group">
                                <div className="bg-blue-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-blue-100 transition-colors duration-300">
                                    <div className="text-blue-600 group-hover:scale-110 transition-transform duration-300">
                                        {value.icon}
                                    </div>
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-3">
                                    {value.title}
                                </h3>
                                <p className="text-gray-600 leading-relaxed">
                                    {value.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Team Section */}
            <section className="py-20 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                            Meet Our Team
                        </h2>
                        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                            The passionate individuals behind Recent and Rhythm Tours and Travels who work tirelessly to make your travel dreams come true
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {teamMembers.map((member) => (
                            <div key={member.id} className="bg-white rounded-2xl shadow-lg overflow-hidden group hover:shadow-xl transition-shadow duration-300">
                                <div className="relative overflow-hidden">
                                    <img
                                        src={member.image}
                                        alt={member.name}
                                        className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                </div>
                                <div className="p-6">
                                    <h3 className="text-xl font-bold text-gray-900 mb-1">
                                        {member.name}
                                    </h3>
                                    <p className="text-blue-600 font-semibold mb-3">
                                        {member.position}
                                    </p>
                                    <p className="text-gray-600 text-sm leading-relaxed">
                                        {member.description}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Milestones Section */}
            <section className="py-20 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                            Our Journey
                        </h2>
                        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                            Key milestones that have shaped our growth and success over the years
                        </p>
                    </div>

                    <div className="relative">
                        <div className="absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-blue-200"></div>
                        <div className="space-y-12">
                            {milestones.map((milestone, index) => (
                                <div key={index} className={`flex items-center ${index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'}`}>
                                    <div className={`w-1/2 ${index % 2 === 0 ? 'pr-8 text-right' : 'pl-8 text-left'}`}>
                                        <div className="bg-white p-6 rounded-xl shadow-lg">
                                            <div className="text-2xl font-bold text-blue-600 mb-2">
                                                {milestone.year}
                                            </div>
                                            <h3 className="text-xl font-bold text-gray-900 mb-2">
                                                {milestone.title}
                                            </h3>
                                            <p className="text-gray-600">
                                                {milestone.description}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="w-8 h-8 bg-blue-600 rounded-full border-4 border-white shadow-lg z-10"></div>
                                    <div className="w-1/2"></div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                        Ready to Start Your Journey?
                    </h2>
                    <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
                        Join millions of travelers who trust Recent and Rhythm Tours and Travels for their dream vacations.
                        Let us help you create unforgettable memories.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <button className="bg-white text-blue-600 hover:bg-gray-100 font-semibold py-4 px-8 rounded-lg transition-colors duration-300 shadow-lg">
                            Book Your Trip
                        </button>
                        <button className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-blue-600 font-semibold py-4 px-8 rounded-lg transition-all duration-300">
                            Contact Us
                        </button>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default AboutPage;
