import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  CalendarIcon,
  UserIcon,
  ClockIcon,
  MapPinIcon,
  StarIcon,
  HeartIcon,
  ShareIcon,
  BookmarkIcon
} from '@heroicons/react/24/outline';

const BlogPage = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Blog categories
  const categories = [
    { id: 'all', name: 'All Posts', count: 24 },
    { id: 'destinations', name: 'Destinations', count: 8 },
    { id: 'travel-tips', name: 'Travel Tips', count: 6 },
    { id: 'airline-news', name: 'Airline News', count: 4 },
    { id: 'hotel-reviews', name: 'Hotel Reviews', count: 3 },
    { id: 'food-culture', name: 'Food & Culture', count: 3 }
  ];

  // Mock blog posts data
  const blogPosts = [
    {
      id: 1,
      title: "Top 10 Must-Visit Destinations in Europe for 2024",
      excerpt: "Discover the most enchanting European cities that should be on your travel radar this year. From hidden gems to classic favorites, we've curated the ultimate list.",
      content: "Europe continues to be a top destination for travelers worldwide, offering a perfect blend of history, culture, and modern attractions. In 2024, several cities are emerging as must-visit destinations that combine traditional charm with contemporary appeal...",
      author: "Sarah Johnson",
      authorAvatar: "https://via.placeholder.com/40x40/4F46E5/FFFFFF?text=SJ",
      publishDate: "2024-01-15",
      readTime: "8 min read",
      category: "destinations",
      tags: ["Europe", "Travel Guide", "2024", "Culture"],
      image: "https://images.unsplash.com/photo-1499856871958-5b9627545d1a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      featured: true,
      views: 1247,
      likes: 89,
      comments: 23
    },
    {
      id: 2,
      title: "Essential Travel Tips for First-Time International Travelers",
      excerpt: "Planning your first international trip? Here are the essential tips and tricks to make your journey smooth and memorable.",
      content: "International travel can be both exciting and overwhelming, especially for first-time travelers. From passport preparation to cultural etiquette, there's a lot to consider...",
      author: "Michael Chen",
      authorAvatar: "https://via.placeholder.com/40x40/059669/FFFFFF?text=MC",
      publishDate: "2024-01-12",
      readTime: "12 min read",
      category: "travel-tips",
      tags: ["Travel Tips", "Beginners", "International", "Planning"],
      image: "https://images.unsplash.com/photo-1488646953014-85cb44e25828?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      featured: false,
      views: 892,
      likes: 67,
      comments: 18
    },
    {
      id: 3,
      title: "Qatar Airways Introduces New Premium Economy Class",
      excerpt: "Experience luxury travel at an affordable price with Qatar Airways' new Premium Economy offering on select routes.",
      content: "Qatar Airways has announced the launch of its new Premium Economy class, designed to bridge the gap between Economy and Business class...",
      author: "Aisha Rahman",
      authorAvatar: "https://via.placeholder.com/40x40/DC2626/FFFFFF?text=AR",
      publishDate: "2024-01-10",
      readTime: "5 min read",
      category: "airline-news",
      tags: ["Qatar Airways", "Premium Economy", "New Service", "Luxury"],
      image: "https://images.unsplash.com/photo-1556388158-158ea5ccacbd?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      featured: false,
      views: 1567,
      likes: 124,
      comments: 31
    },
    {
      id: 4,
      title: "Luxury Hotels in Dubai: A Complete Guide",
      excerpt: "From iconic landmarks to hidden gems, discover the best luxury accommodations in the City of Gold.",
      content: "Dubai is renowned for its opulent hotels and world-class hospitality. Whether you're looking for beachfront luxury or city center convenience...",
      author: "David Thompson",
      authorAvatar: "https://via.placeholder.com/40x40/7C3AED/FFFFFF?text=DT",
      publishDate: "2024-01-08",
      readTime: "10 min read",
      category: "hotel-reviews",
      tags: ["Dubai", "Luxury Hotels", "Hospitality", "Travel"],
      image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      featured: false,
      views: 734,
      likes: 45,
      comments: 12
    },
    {
      id: 5,
      title: "Street Food Adventures: Best Local Eats Around the World",
      excerpt: "Embark on a culinary journey through the world's most vibrant street food scenes and discover authentic local flavors.",
      content: "Street food is the heart and soul of local culture, offering authentic flavors that you won't find in fancy restaurants...",
      author: "Maria Garcia",
      authorAvatar: "https://via.placeholder.com/40x40/EA580C/FFFFFF?text=MG",
      publishDate: "2024-01-05",
      readTime: "15 min read",
      category: "food-culture",
      tags: ["Street Food", "Local Cuisine", "Culture", "Food Travel"],
      image: "https://images.unsplash.com/photo-1504674900240-9a8839e6f6c5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      featured: false,
      views: 1123,
      likes: 78,
      comments: 19
    },
    {
      id: 6,
      title: "Sustainable Travel: How to Explore the World Responsibly",
      excerpt: "Learn how to minimize your environmental impact while traveling and contribute to sustainable tourism practices.",
      content: "As travelers become more conscious of their environmental impact, sustainable travel practices are gaining popularity...",
      author: "Emma Wilson",
      authorAvatar: "https://via.placeholder.com/40x40/16A34A/FFFFFF?text=EW",
      publishDate: "2024-01-03",
      readTime: "11 min read",
      category: "travel-tips",
      tags: ["Sustainable Travel", "Eco-friendly", "Responsible Tourism", "Environment"],
      image: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      featured: false,
      views: 987,
      likes: 56,
      comments: 14
    }
  ];

  // Filter posts based on category and search
  const filteredPosts = blogPosts.filter(post => {
    const matchesCategory = selectedCategory === 'all' || post.category === selectedCategory;
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getCategoryColor = (category) => {
    const colors = {
      destinations: 'bg-orange-100 text-orange-800',
      'travel-tips': 'bg-green-100 text-green-800',
      'airline-news': 'bg-purple-100 text-purple-800',
      'hotel-reviews': 'bg-yellow-100 text-yellow-800',
      'food-culture': 'bg-orange-100 text-orange-800'
    };
    return colors[category] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="relative bg-orange-500 overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0">
          <img
            src="images/white-clouds-blue-sky-daytime.jpg"
            alt="Airplane flying over clouds"
            className="w-full h-full object-cover opacity-100"
          />
          <div className="absolute inset-0 bg-orange-600/80 opacity-40"></div>
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white">Travel Blog</h1>
              <p className="text-orange-100 mt-1">Discover travel inspiration, tips, and insights from our travel experts</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Search and Filters */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            {/* Search Bar */}
            <div className="relative flex-1 max-w-md">
              <input
                type="text"
                placeholder="Search articles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              />
              <svg className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>

            {/* Category Filter */}
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${selectedCategory === category.id
                    ? 'bg-orange-500 text-white'
                    : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                    }`}
                >
                  {category.name} ({category.count})
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Featured Post */}
        {filteredPosts.filter(post => post.featured).length > 0 && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Featured Article</h2>
            {filteredPosts.filter(post => post.featured).map((post) => (
              <div key={post.id} className="bg-white rounded-2xl shadow-lg overflow-hidden">
                <div className="md:flex">
                  <div className="md:w-1/2">
                    <img
                      src={post.image}
                      alt={post.title}
                      className="w-full h-64 md:h-full object-cover"
                    />
                  </div>
                  <div className="md:w-1/2 p-8">
                    <div className="flex items-center space-x-2 mb-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getCategoryColor(post.category)}`}>
                        {categories.find(cat => cat.id === post.category)?.name}
                      </span>
                      <span className="text-gray-500 text-sm">•</span>
                      <span className="text-gray-500 text-sm">{formatDate(post.publishDate)}</span>
                    </div>

                    <h3 className="text-2xl font-bold text-gray-900 mb-4">{post.title}</h3>
                    <p className="text-gray-600 mb-6 leading-relaxed">{post.excerpt}</p>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <img
                          src={post.authorAvatar}
                          alt={post.author}
                          className="w-10 h-10 rounded-full"
                        />
                        <div>
                          <p className="font-medium text-gray-900">{post.author}</p>
                          <div className="flex items-center space-x-2 text-sm text-gray-500">
                            <ClockIcon className="w-4 h-4" />
                            <span>{post.readTime}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center space-x-4">
                        <button className="flex items-center space-x-2 text-gray-500 hover:text-red-500 transition-colors">
                          <HeartIcon className="w-5 h-5" />
                          <span className="text-sm">{post.likes}</span>
                        </button>
                        <button className="text-gray-500 hover:text-orange-500 transition-colors">
                          <ShareIcon className="w-5 h-5" />
                        </button>
                        <button className="text-gray-500 hover:text-yellow-500 transition-colors">
                          <BookmarkIcon className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Blog Posts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredPosts.filter(post => !post.featured).map((post) => (
            <article key={post.id} className="bg-white rounded-xl shadow-sm border overflow-hidden hover:shadow-lg transition-shadow">
              {/* Post Image */}
              <div className="relative">
                <img
                  src={post.image}
                  alt={post.title}
                  className="w-full h-48 object-cover"
                />
                <div className="absolute top-4 left-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getCategoryColor(post.category)}`}>
                    {categories.find(cat => cat.id === post.category)?.name}
                  </span>
                </div>
              </div>

              {/* Post Content */}
              <div className="p-6">
                <div className="flex items-center space-x-2 text-sm text-gray-500 mb-3">
                  <CalendarIcon className="w-4 h-4" />
                  <span>{formatDate(post.publishDate)}</span>
                  <span>•</span>
                  <ClockIcon className="w-4 h-4" />
                  <span>{post.readTime}</span>
                </div>

                <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2">
                  {post.title}
                </h3>

                <p className="text-gray-600 mb-4 line-clamp-3">
                  {post.excerpt}
                </p>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {post.tags.slice(0, 3).map((tag, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>

                {/* Author and Stats */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <img
                      src={post.authorAvatar}
                      alt={post.author}
                      className="w-8 h-8 rounded-full"
                    />
                    <div>
                      <p className="text-sm font-medium text-gray-900">{post.author}</p>
                      <div className="flex items-center space-x-1 text-xs text-gray-500">
                        <StarIcon className="w-3 h-3 text-yellow-400 fill-current" />
                        <span>{post.views} views</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <button className="flex items-center space-x-1 text-gray-500 hover:text-red-500 transition-colors">
                      <HeartIcon className="w-4 h-4" />
                      <span className="text-sm">{post.likes}</span>
                    </button>
                    <button className="text-gray-500 hover:text-orange-500 transition-colors">
                      <ShareIcon className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* Newsletter Signup */}
        <div className="mt-16 bg-green-500 rounded-2xl p-8 text-center text-white">
          <h3 className="text-2xl font-bold mb-4">Stay Updated with Travel Insights</h3>
          <p className="text-green-100 mb-6 max-w-2xl mx-auto">
            Get the latest travel tips, destination guides, and exclusive offers delivered to your inbox every week.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email address"
              className="flex-1 px-4 py-3 rounded-lg text-gray-900 focus:ring-2 focus:ring-white focus:outline-none"
            />
            <button className="bg-white text-green-500 px-6 py-3 rounded-lg font-medium hover:bg-gray-100 transition-colors">
              Subscribe
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogPage;
