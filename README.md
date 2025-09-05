# Recent and Rhythm Tours and Travels - Flight Booking Website

A modern, responsive flight booking website built with React and Tailwind CSS, inspired by Qatar Airways design.

## 🚀 Features

- **Responsive Design**: Mobile-first approach with modern UI/UX
- **Flight Search**: Comprehensive search form with multiple options
- **Popular Flights**: Showcase of trending flight routes
- **Holiday Packages**: All-inclusive travel packages with hotels and flights
- **Hotel Booking**: Luxury hotels and resorts worldwide
- **Why Choose Us**: Company benefits and statistics
- **Modern UI**: Clean design with rounded corners, shadows, and smooth transitions

## 🛠️ Tech Stack

- **Frontend**: React 19
- **Styling**: Tailwind CSS v4
- **Build Tool**: Vite
- **Package Manager**: npm

## 📁 Project Structure

```
src/
├── components/
│   ├── Navbar.jsx          # Navigation bar with logo and menu
│   ├── Hero.jsx            # Hero section with search form
│   ├── PopularFlights.jsx  # Popular flights showcase
│   ├── PopularPackages.jsx # Holiday packages
│   ├── Hotels.jsx          # Hotel listings
│   ├── WhyChooseUs.jsx     # Company benefits
│   └── Footer.jsx          # Footer with links and contact
├── App.jsx                 # Main application component
├── main.jsx               # Application entry point
└── index.css              # Global styles and Tailwind imports
```

## 🎨 Design Features

- **Color Scheme**: Blue and purple gradients with white backgrounds
- **Typography**: Clean, readable fonts with proper hierarchy
- **Components**: Reusable UI components with consistent styling
- **Animations**: Smooth hover effects and transitions
- **Responsive**: Mobile, tablet, and desktop optimized

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm (v8 or higher)

### Installation

1. Clone the repository
2. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

3. Install dependencies:
   ```bash
   npm install
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

5. Open your browser and visit `http://localhost:5173`

### Build for Production

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## 📱 Responsive Breakpoints

- **Mobile**: < 768px
- **Tablet**: 768px - 1024px
- **Desktop**: > 1024px

## 🎯 Component Details

### Navbar
- Fixed positioning with backdrop blur
- Responsive mobile menu
- Logo and navigation links
- Login/Signup buttons

### Hero Section
- Full-screen background with gradient overlay
- Flight search form with tabs
- Multiple flight type options
- Date pickers and passenger selection

### Popular Flights
- Grid layout of flight cards
- Airline information and pricing
- Route visualization with icons
- Booking buttons

### Popular Packages
- Holiday package showcase
- Hotel + flight combinations
- Discount badges and ratings
- What's included lists

### Hotels
- Luxury hotel grid
- High-quality images
- Amenities and ratings
- Price and booking options

### Why Choose Us
- Feature highlights with icons
- Company statistics
- Call-to-action sections

### Footer
- Company information
- Quick links organized by category
- Newsletter subscription
- Social media links
- Contact information

## 🔧 Customization

### Colors
The color scheme can be customized in `tailwind.config.js`:

```javascript
colors: {
  blue: {
    // Custom blue shades
  },
  purple: {
    // Custom purple shades
  }
}
```

### Images
Replace placeholder images in components with your own:
- Hero background
- Hotel images
- Package images

### Content
Update text content, prices, and dummy data in each component to match your business requirements.

## 📊 Performance

- **Bundle Size**: Optimized with Vite
- **Images**: Responsive images with proper sizing
- **CSS**: Purged unused Tailwind classes in production
- **Lazy Loading**: Components load efficiently

## 🔮 Future Enhancements

- [ ] API integration for real flight data
- [ ] User authentication system
- [ ] Booking management
- [ ] Payment gateway integration
- [ ] Multi-language support
- [ ] Dark mode toggle
- [ ] Advanced search filters
- [ ] Wishlist functionality

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📞 Support

For support and questions, please contact:
- Email: support@skyways.com
- Phone: +91 1800-123-4567

---

Built with ❤️ using React and Tailwind CSS
