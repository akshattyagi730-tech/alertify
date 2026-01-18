# Alertify Backend API

Node.js + Express backend server for the Alertify emergency safety application.

## Features

- RESTful API architecture
- CORS enabled for frontend integration
- Environment variable configuration
- Health check endpoint
- MongoDB integration with Mongoose
- Firebase Authentication integration
- Protected routes with authentication middleware

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Copy environment variables:
```bash
cp .env.example .env
```

3. Update `.env` with your configuration (optional for basic setup)

### Running the Server

**Development mode:**
```bash
npm run dev
```

**Production mode:**
```bash
npm start
```

The server will start on `http://localhost:5000` (or the port specified in `.env`).

## API Endpoints

### Health Check
- **GET** `/health`
- Returns: `{ status: "OK", timestamp: "...", uptime: ... }`
- **No authentication required**

### Authentication
- **GET** `/auth/me`
- Returns: `{ success: true, user: { uid, email, emailVerified, name, picture } }`
- **Requires authentication** - Include Firebase ID token in Authorization header
- Header: `Authorization: Bearer <firebase-id-token>`

### Root
- **GET** `/`
- Returns: API information
- **No authentication required**

## Project Structure

```
backend/
├── index.js              # Main server file
├── routes/               # API routes
│   ├── health.js        # Health check route
│   └── auth.js          # Authentication routes
├── controllers/          # Route controllers (empty, ready for use)
├── models/              # Database models
│   ├── User.js          # User model
│   ├── TrustedContact.js # TrustedContact model
│   ├── SOSAlert.js      # SOSAlert model
│   ├── LocationUpdate.js # LocationUpdate model
│   └── Journey.js       # Journey model
├── middleware/          # Custom middleware
│   ├── auth.js          # Firebase authentication middleware
│   └── errorHandler.js  # Error handling middleware
└── config/             # Configuration files
    ├── db.js           # MongoDB connection
    └── firebase.js     # Firebase Admin SDK setup
```

## Environment Variables

### Required
- `PORT` - Server port (default: 5000)
- `MONGODB_URI` - MongoDB connection string (default: mongodb://localhost:27017/alertify)

### Firebase Authentication
- `FIREBASE_PROJECT_ID` - Firebase project ID
- `FIREBASE_CLIENT_EMAIL` - Firebase service account client email
- `FIREBASE_PRIVATE_KEY` - Firebase service account private key (with \n escaped)

**OR**

- `FIREBASE_SERVICE_ACCOUNT` - Complete Firebase service account JSON as a string

### Optional
- `JWT_SECRET` - JWT secret for future use
- `FAST2SMS_API_KEY` - Fast2SMS API key for SMS
- `TWILIO_ACCOUNT_SID` - Twilio account SID
- `TWILIO_AUTH_TOKEN` - Twilio auth token
- `TWILIO_PHONE_NUMBER` - Twilio phone number

## Development

The server uses ES modules (`"type": "module"`), so use `import` instead of `require`.

## Next Steps

- Add MongoDB connection
- Implement authentication
- Add API routes for:
  - Users
  - Contacts
  - Alerts
  - Journeys
  - SMS sending
