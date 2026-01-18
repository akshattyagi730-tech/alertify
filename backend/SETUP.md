# Backend Setup Guide

## Quick Start

1. **Install dependencies:**
   ```bash
   cd backend
   npm install
   ```

2. **Start the server:**
   ```bash
   npm start
   ```
   
   Or for development with auto-reload:
   ```bash
   npm run dev
   ```

3. **Test the server:**
   - Open browser: http://localhost:5000
   - Health check: http://localhost:5000/health

## Project Structure

```
backend/
├── index.js              # Main server entry point
├── package.json          # Dependencies and scripts
├── routes/               # API routes
│   └── health.js        # Health check route
├── controllers/          # Route controllers (empty, ready for use)
├── models/              # Database models (empty, ready for use)
├── middleware/          # Custom middleware
│   └── errorHandler.js  # Error handling middleware
└── config/              # Configuration files
    └── database.js      # Database config (placeholder)
```

## Environment Variables

Create a `.env` file (optional for basic setup):
```env
PORT=5000
```

## API Endpoints

### Health Check
- **GET** `/health`
- Response: `{ status: "OK", timestamp: "...", uptime: ... }`

### Root
- **GET** `/`
- Response: API information

## Next Steps

- Add MongoDB connection in `config/database.js`
- Create models in `models/`
- Add controllers in `controllers/`
- Create new routes in `routes/`
