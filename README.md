# Event Hub 🎭

A modern, full-stack web application for discovering and managing events using the Ticketmaster API. Built with React and Flask, Event Hub provides users to search, explore, and save their favorite events.


<img width="1913" height="908" alt="image" src="https://github.com/user-attachments/assets/611fbc3b-300f-4fce-a44e-1a4610652e2b" />

## 🌟 Features

- **Event Discovery**: Search for concerts, sports, theater, and more through Ticketmaster's extensive database
- **Advanced Search**: Filter events by location, date range, and category
- **User Authentication**: Secure registration and login system
- **Favorites Management**: Save and manage favorite events in your personal dashboard
- **Responsive Design**: Beautiful, mobile-friendly interface with modern UI/UX
- **Real-time Updates**: Dynamic event data from Ticketmaster API

## 🎨 Screenshots

### Event Search
Search by keyword, location, and date range with advanced filtering options

<img width="1171" height="353" alt="image" src="https://github.com/user-attachments/assets/a62b353c-a92b-4fcf-b9dc-b5dd5259f7b5" />

### Event Grid Display
Browse events in a beautiful card-based layout with all essential information

<img width="1348" height="897" alt="image" src="https://github.com/user-attachments/assets/276e79e4-779e-4fe2-a31a-6951bce74e3b" />

### User Dashboard
Manage your profile and keep track of your favorite events

<img width="1149" height="744" alt="image" src="https://github.com/user-attachments/assets/3f0eb1d6-7e56-4943-b07b-bd65e9bedc4f" />

### Authentication
Secure and user-friendly login and registration system

<img width="431" height="636" alt="image" src="https://github.com/user-attachments/assets/cd592e06-819e-426b-966c-98fc5c3fb20c" />
<img width="425" height="453" alt="image" src="https://github.com/user-attachments/assets/3fbe1080-410a-43a4-bea8-508ff12b1660" />

## 🛠 Tech Stack

### Frontend
- **React 18.2** - Modern UI framework
- **Axios** - HTTP client for API requests
- **CSS3** - Custom styling with animations and gradients
- **Local Storage** - Client-side data persistence

### Backend
- **Flask 3.0** - Python web framework
- **MongoDB** - NoSQL database for user data
- **Flask-CORS** - Cross-origin resource sharing
- **Flask-PyMongo** - MongoDB integration
- **Flask-Bcrypt** - Password hashing
- **Ticketmaster API** - Event data source

## 📁 Project Structure

```
event-hub/
├── backend/
│   ├── app/
│   │   ├── __init__.py         # Flask app initialization
│   │   ├── config.py           # Configuration settings
│   │   ├── routes/
│   │   │   └── routes.py       # API endpoints
│   │   ├── models/
│   │   │   └── user.py         # User model & database operations
│   │   └── services/
│   │       └── event_service.py # Ticketmaster API integration
│   ├── run.py                  # Application entry point
│   └── requirements.txt        # Python dependencies
│
└── frontend/
    ├── src/
    │   ├── components/
    │   │   ├── Header/          # Navigation bar
    │   │   ├── SearchBar/       # Event search interface
    │   │   ├── EventGrid/       # Event display grid
    │   │   ├── EventCard/       # Individual event cards
    │   │   ├── Auth/            # Login/Register modals
    │   │   └── UserDashboard/   # User profile & favorites
    │   ├── services/
    │   │   ├── api.js           # API client configuration
    │   │   ├── eventService.js  # Event-related API calls
    │   │   └── userService.js   # User authentication & favorites
    │   ├── utils/
    │   │   └── constants.js     # Application constants
    │   ├── App.js               # Main application component
    │   └── index.js             # React entry point
    └── package.json             # Node dependencies
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v14 or higher)
- Python 3.8+
- MongoDB (local or cloud instance)
- Ticketmaster API Key

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/event-hub.git
   cd event-hub
   ```

2. **Backend Setup**
   ```bash
   cd backend
   pip install -r requirements.txt
   ```

3. **Frontend Setup**
   ```bash
   cd frontend
   npm install
   ```

4. **Environment Configuration**
   
   Create `.env` files in both backend and frontend directories:
   
   Backend `.env`:
   ```env
   SECRET_KEY=your-secret-key
   FLASK_DEBUG=True
   MONGO_URI=mongodb://localhost:27017/eventhub
   TICKETMASTER_API_KEY=your-ticketmaster-api-key
   ```
   
   Frontend `.env`:
   ```env
   REACT_APP_API_URL=http://localhost:5000/api
   ```

### Running the Application

1. **Start MongoDB** (if running locally)
   ```bash
   mongod
   ```

2. **Start Backend Server**
   ```bash
   cd backend
   python run.py
   ```
   The server will run on `http://localhost:5000`

3. **Start Frontend Development Server**
   ```bash
   cd frontend
   npm start
   ```
   The application will open at `http://localhost:3000`

## 📡 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login

### Events
- `GET /api/events/search` - Search events with filters
- `GET /api/events/:id` - Get event details

### User Favorites
- `GET /api/users/:userId/favorites` - Get user's favorite events
- `POST /api/users/:userId/favorites` - Add event to favorites
- `DELETE /api/users/:userId/favorites/:eventId` - Remove from favorites

## 🔒 Security

- Password hashing with Bcrypt
- CORS configuration for API security
- Environment variables for sensitive data
- Input validation and sanitization

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.



**Developed with ❤️ for event enthusiasts**