# SmartHotel - Intelligent Hotel Management System

A modern, full-featured hotel management system with AI chatbot, online booking, and smart room features.

## 🌟 Features

### Frontend Features
- **Responsive Design**: Modern, mobile-friendly interface
- **Room Browsing & Filtering**: Search and filter rooms by type, price, and capacity
- **Online Booking System**: Complete booking workflow with date selection
- **AI Chatbot**: 24/7 intelligent assistant for customer queries
- **User Profiles**: Personal information and preference management
- **Booking Management**: View and manage reservations
- **Review System**: Guest reviews and ratings
- **Contact Form**: Direct communication with hotel staff

### Backend Features
- **RESTful API**: Complete API for all operations
- **User Authentication**: Secure login and registration
- **Booking Management**: Create, read, update, and delete reservations
- **Room Management**: Dynamic room availability checking
- **Database Integration**: MySQL database with proper relationships
- **Session Management**: Secure session handling

## 📁 Project Structure

```
smart-hotel/
│
├── index.html                 # Landing page
├── about.html                 # About page
├── rooms.html                 # Rooms listing
├── room-details.html          # Room details
├── services.html              # Services page
├── contact.html               # Contact page
├── login.html                 # Login page
├── register.html              # Registration page
├── booking.html               # Booking form
├── my-bookings.html           # User bookings
├── profile.html               # User profile
├── chatbot.html               # AI Chatbot
│
├── assets/
│   ├── css/
│   │   └── style.css          # Main stylesheet
│   ├── js/
│   │   ├── main.js            # Main JavaScript
│   │   ├── booking.js         # Booking logic
│   │   └── chatbot.js         # Chatbot logic
│   └── images/                # Images folder
│
├── backend/
│   ├── config/
│   │   └── database.php       # Database connection
│   └── api/
│       ├── login.php          # Login endpoint
│       ├── register.php       # Registration endpoint
│       ├── book-room.php      # Booking endpoint
│       ├── get-rooms.php      # Get rooms endpoint
│       └── chatbot.php        # Chatbot endpoint
│
├── database/
│   └── smart_hotel.sql        # Database schema
│
└── README.md                  # This file
```

## 🚀 Installation

### Prerequisites
- **Web Server**: Apache/Nginx
- **PHP**: Version 7.4 or higher
- **MySQL**: Version 5.7 or higher
- **Browser**: Modern browser (Chrome, Firefox, Safari, Edge)

### Step 1: Clone/Download the Project
```bash
# Download and extract the project files to your web server directory
# For XAMPP: C:/xampp/htdocs/smart-hotel
# For WAMP: C:/wamp/www/smart-hotel
```

### Step 2: Database Setup
1. Open phpMyAdmin (http://localhost/phpmyadmin)
2. Create a new database named `smart_hotel`
3. Import the SQL file:
   - Click on the `smart_hotel` database
   - Go to the "Import" tab
   - Choose file: `database/smart_hotel.sql`
   - Click "Go" to import

### Step 3: Configure Database Connection
1. Open `backend/config/database.php`
2. Update the database credentials if needed:
```php
private $host = "localhost";
private $db_name = "smart_hotel";
private $username = "root";        // Your MySQL username
private $password = "";            // Your MySQL password
```

### Step 4: Start the Server
#### Using XAMPP:
1. Start Apache and MySQL from XAMPP Control Panel
2. Access the site: `http://localhost/smart-hotel`

#### Using PHP Built-in Server:
```bash
cd smart-hotel
php -S localhost:8000
```
Access the site: `http://localhost:8000`

## 👤 Default User Accounts

### Admin Account
- **Email**: admin@smarthotel.com
- **Password**: admin123

### Client Account
- **Email**: john.doe@email.com
- **Password**: password123

## 📖 Usage Guide

### For Guests

#### 1. Browse Rooms
- Visit the homepage and click "Explore Rooms"
- Use filters to find your perfect room
- Click on any room to view details

#### 2. Make a Booking
- Click "Book Now" on any room
- Fill in your details and select dates
- Choose additional services
- Submit the booking

#### 3. Use AI Chatbot
- Click "AI Assistant" in the navigation
- Ask questions about rooms, services, or local attractions
- Get instant responses 24/7

#### 4. Manage Profile
- Login to your account
- Access "Profile" to update personal information
- View "My Bookings" to see all reservations

### For Developers

#### API Endpoints

**Login**
```bash
POST /backend/api/login.php
Body: { "email": "user@email.com", "password": "password" }
```

**Register**
```bash
POST /backend/api/register.php
Body: { 
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@email.com",
  "phone": "+1234567890",
  "password": "password123"
}
```

**Get Rooms**
```bash
GET /backend/api/get-rooms.php?type=deluxe&min_price=100&max_price=300
```

**Book Room**
```bash
POST /backend/api/book-room.php
Body: {
  "roomType": "deluxe",
  "checkin": "2026-02-01",
  "checkout": "2026-02-05",
  "guests": 2,
  "services": ["breakfast", "parking"]
}
```

**Chatbot**
```bash
POST /backend/api/chatbot.php
Body: { "message": "What rooms are available?", "session_id": "xyz123" }
```

## 🎨 Customization

### Change Colors
Edit `assets/css/style.css`:
```css
/* Primary gradient colors */
background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);

/* Change to your colors */
background: linear-gradient(135deg, #YOUR_COLOR1 0%, #YOUR_COLOR2 100%);
```

### Add New Rooms
1. Login to phpMyAdmin
2. Go to `smart_hotel` database
3. Insert into `rooms` table
4. Or use backend admin panel (if implemented)

### Modify Chatbot Responses
Edit `backend/api/chatbot.php` or `assets/js/chatbot.js`:
```javascript
// Add new response patterns
if (msg.includes('your_keyword')) {
    return "Your custom response";
}
```

## 🔧 Troubleshooting

### Database Connection Error
- Check MySQL is running
- Verify credentials in `backend/config/database.php`
- Ensure database `smart_hotel` exists

### 404 Errors for API Calls
- Check `.htaccess` file exists
- Verify mod_rewrite is enabled in Apache
- Check file paths are correct

### JavaScript Not Working
- Open browser console (F12) to check for errors
- Ensure all JS files are properly linked
- Clear browser cache

### Booking Not Saving
- Check database connection
- Verify rooms table has data
- Check browser console for error messages

## 📱 Browser Compatibility

- ✅ Chrome (latest)
- ✅ Firefox (latest)
- ✅ Safari (latest)
- ✅ Edge (latest)
- ⚠️ Internet Explorer (not supported)

## 🔒 Security Notes

**Important for Production:**
1. Change default passwords
2. Use environment variables for sensitive data
3. Implement proper JWT authentication
4. Add CSRF protection
5. Enable HTTPS
6. Sanitize all user inputs
7. Use prepared statements (already implemented)
8. Implement rate limiting

## 📝 License

This project is for educational purposes. Feel free to modify and use for your projects.

## 🤝 Support

For issues or questions:
- Check the troubleshooting section
- Review the code comments
- Contact: support@smarthotel.com (example)

## 🎓 Learning Resources

- **PHP & MySQL**: [PHP.net](https://www.php.net/manual/en/)
- **JavaScript**: [MDN Web Docs](https://developer.mozilla.org/)
- **REST API**: [REST API Tutorial](https://restfulapi.net/)
- **Web Design**: [CSS-Tricks](https://css-tricks.com/)

## 🚀 Future Enhancements

- [ ] Payment gateway integration
- [ ] Email notifications
- [ ] Admin dashboard
- [ ] Real-time availability updates
- [ ] Mobile app
- [ ] Multi-language support
- [ ] Advanced analytics
- [ ] IoT room controls

---

**Built with ❤️ for SmartHotel Project**

Version: 1.0.0
Last Updated: January 2026