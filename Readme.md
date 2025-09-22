# WonderLust 🌍
// Test commit


A modern travel and accommodation booking platform built with Node.js, Express, MongoDB, and Mapbox integration.

## 🌐 Live Demo

**Visit the live application:** [https://wonderlust-travel-website-m31l.onrender.com](https://wonderlust-travel-website.onrender.com)

*Experience the full functionality including user authentication, listing management, interactive maps, and review system.*

## 🚀 Features

- **User Authentication**: Secure registration and login system
- **Listing Management**: Create, edit, delete, and view accommodation listings
- **Interactive Maps**: Mapbox integration with geocoding for location display
- **Search & Filter**: Advanced search functionality with category filtering
- **Review System**: User reviews and ratings for listings with star rating UI
- **Responsive Design**: Modern, mobile-friendly UI with Bootstrap
- **Real-time Validation**: Form validation using Joi schemas
- **Location Services**: Interactive maps with street names and surrounding area details
- **Image Upload**: Cloud storage integration for listing images
- **Session Management**: Persistent user sessions with MongoDB store

## 🛠️ Tech Stack

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web application framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling
- **Passport.js** - Authentication middleware
- **Joi** - Data validation library

### Frontend
- **EJS** - Embedded JavaScript templating
- **Bootstrap 5** - CSS framework
- **Mapbox GL JS** - Interactive maps
- **Custom CSS** - Styling and animations

### Development Tools
- **Nodemon** - Auto-restart development server
- **Dotenv** - Environment variable management

## 📋 Prerequisites

Before running this project, make sure you have:

- **Node.js** (v14 or higher)
- **MongoDB** installed and running locally
- **Mapbox API Token** (free tier available)

## 🚀 Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/KARTIKPatil-44/WonderLust.git
   cd WonderLust
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   Create a `.env` file in the root directory:
   ```env
   MAP_TOKEN=your_mapbox_token_here
   DB_URL=mongodb://localhost:27017/wonderlust
   PORT=3000
   ```

4. **Initialize Database**
   ```bash
   npm run init-db
   ```

5. **Start the server**
   ```bash
   # Development mode
   npm run dev
   
   # Production mode
   npm start
   ```

6. **Access the application**
   Open your browser and navigate to `http://localhost:3000`

## 🚀 Deployment

This application is deployed on **Render** for production use.

### Deployment Features:
- **Automatic deployments** from Git repository
- **Environment variable management**
- **SSL certificate** for secure HTTPS connections
- **Global CDN** for fast loading worldwide
- **Auto-scaling** based on traffic

### Production URL:
**https://wonderlust-travel-website-m31l.onrender.com**

### Deployment Status:
✅ **Live and Operational**

## 📝 Recent Updates

### Latest Features Added:
- **Enhanced Map Experience**: Improved street name visibility and surrounding area details
- **Optimized Rating System**: Restored original starability rating UI with better performance
- **Cache Management**: Implemented cache-busting for better deployment updates
- **Error Handling**: Enhanced error handling for map loading and user experience
- **Mobile Optimization**: Improved responsive design for better mobile experience

### Technical Improvements:
- **CSS Optimization**: Fixed rating system styling and cache issues
- **Map Configuration**: Enhanced Mapbox integration with better zoom levels
- **Performance**: Improved loading times and user interface responsiveness

## 📁 Project Structure

```
WonderLust/
├── app.js                 # Main server file
├── package.json           # Project dependencies
├── .env                   # Environment variables
├── .gitignore            # Git ignore rules
├── README.md             # Project documentation
├── controllers/          # Business logic
│   ├── listings.js       # Listing operations
│   ├── reviews.js        # Review operations
│   └── users.js          # User operations
├── models/               # Database schemas
│   ├── listing.js        # Listing model
│   ├── review.js         # Review model
│   └── user.js           # User model
├── routes/               # Route definitions
│   ├── listing.js        # Listing routes
│   ├── review.js         # Review routes
│   └── user.js           # User routes
├── views/                # EJS templates
│   ├── layouts/          # Layout templates
│   ├── includes/         # Reusable components
│   ├── listings/         # Listing pages
│   └── users/            # User pages
├── public/               # Static assets
│   ├── Css/              # Stylesheets
│   └── js/               # Client-side JavaScript
├── middleware.js         # Custom middleware
├── schema.js             # Validation schemas
├── utils/                # Helper functions
└── init/                 # Database initialization
    ├── index.js          # Init script
    └── data.js           # Sample data
```

## 🔧 Configuration

### Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `MAP_TOKEN` | Mapbox API access token | Yes |
| `DB_URL` | MongoDB connection string | Yes |
| `PORT` | Server port number | No (default: 3000) |

### Mapbox Setup

1. Create a free account at [Mapbox](https://www.mapbox.com/)
2. Generate an access token
3. Add the token to your `.env` file

## 🎯 Key Features Explained

### User Authentication
- Secure user registration and login
- Session management with Passport.js
- Protected routes for authenticated users

### Listing Management
- CRUD operations for accommodation listings
- Image upload support
- Category-based organization
- Price and location information

### Interactive Maps
- Real-time geocoding of addresses
- Interactive Mapbox integration
- Location markers with popup information
- Fallback handling for missing coordinates

### Search & Filter
- Full-text search across titles, descriptions, and locations
- Category-based filtering
- Price range filtering
- Location-based search

### Review System
- User-generated reviews and ratings
- Average rating calculations
- Review moderation capabilities

## 🎨 UI/UX Features

- **Responsive Design**: Mobile-first approach
- **Modern Styling**: Clean, professional appearance
- **Smooth Animations**: Hover effects and transitions
- **Intuitive Navigation**: User-friendly interface
- **Accessibility**: Screen reader compatible

## 🔒 Security Features

- **Input Validation**: Server-side validation with Joi
- **Authentication**: Secure user sessions
- **Authorization**: Role-based access control
- **Data Sanitization**: XSS protection
- **CSRF Protection**: Cross-site request forgery prevention

## 🚀 Deployment

### Local Development
```bash
npm run dev
```

### Production Deployment
1. Set up environment variables
2. Configure MongoDB connection
3. Run database initialization
4. Start the production server:
   ```bash
   npm start
   ```

## 📝 API Endpoints

### Authentication
- `GET /signup` - User registration page
- `POST /signup` - Create new user account
- `GET /login` - User login page
- `POST /login` - Authenticate user
- `GET /logout` - User logout

### Listings
- `GET /listings` - View all listings
- `GET /listings/new` - Create new listing form
- `POST /listings` - Create new listing
- `GET /listings/:id` - View specific listing
- `GET /listings/:id/edit` - Edit listing form
- `PUT /listings/:id` - Update listing
- `DELETE /listings/:id` - Delete listing
- `GET /listings/search` - Search listings
- `GET /listings/filter` - Filter listings

### Reviews
- `POST /listings/:id/reviews` - Add review to listing
- `DELETE /listings/:id/reviews/:reviewId` - Delete review

## 🐛 Troubleshooting

### Common Issues

1. **Port Already in Use**
   ```bash
   # Find process using port
   netstat -ano | findstr :3000
   # Kill process
   taskkill /PID <process_id> /F
   ```

2. **MongoDB Connection Error**
   - Ensure MongoDB is running
   - Check connection string in `.env`
   - Verify database permissions

3. **Map Not Displaying**
   - Verify Mapbox token is valid
   - Check browser console for errors
   - Ensure coordinates are properly geocoded

4. **Environment Variables Not Loading**
   - Ensure `.env` file is in project root
   - Restart the server after changes
   - Check file permissions

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Kartik Patil**
- GitHub: [@KARTIKPatil-44](https://github.com/KARTIKPatil-44)
- Repository: [WonderLust](https://github.com/KARTIKPatil-44/WonderLust.git)

## 🙏 Acknowledgments

- [Mapbox](https://www.mapbox.com/) for mapping services
- [Bootstrap](https://getbootstrap.com/) for UI components
- [Unsplash](https://unsplash.com/) for sample images
- [Express.js](https://expressjs.com/) team for the web framework


---

**Made with ❤️ for travelers around the world**
