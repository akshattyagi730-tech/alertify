# Alertify - Emergency Safety App

A React-based emergency alert system that helps users stay safe by sending SOS alerts to trusted contacts.

## Features

- 🚨 **SOS Emergency Alerts** - Quick access emergency button
- 📍 **Live Location Tracking** - Real-time GPS tracking during emergencies
- 📱 **SMS Notifications** - Automatic SMS alerts to trusted contacts
- 🗺️ **Journey Tracking** - Track your trips safely
- 👥 **Trusted Contacts** - Manage emergency contacts
- 📊 **Alert History** - View past alerts and incidents

## Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Base44 account (for backend services)

## Installation

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Configure Base44 Client:**
   - Open `/src/api/base44Client.js`
   - Replace the placeholder implementation with your actual Base44 SDK initialization
   - Add your Base44 project ID and API key

3. **Set up environment variables (optional):**
   Create a `.env` file in the root directory:
   ```env
   VITE_BASE44_PROJECT_ID=your-project-id
   VITE_BASE44_API_KEY=your-api-key
   ```

## Running the Project

### Development Mode
```bash
npm run dev
```
This will start the development server at `http://localhost:3000`

### Build for Production
```bash
npm run build
```
This creates an optimized production build in the `dist` folder.

### Preview Production Build
```bash
npm run preview
```
Preview the production build locally.

## Project Structure

```
Code_files/
├── src/
│   ├── App.jsx          # Main app component with routing
│   ├── main.jsx          # Entry point
│   └── index.css         # Global styles
├── Components/          # React components
│   ├── SOS/             # SOS-related components
│   ├── Contacts/        # Contact management
│   ├── Journey/         # Journey tracking
│   └── ui/              # UI components
├── Pages/               # Page components
├── api/                 # API client configuration
├── utils.js             # Utility functions
└── Layout.js/           # Backend functions
```

## Configuration

### Base44 Setup

1. Sign up for a Base44 account
2. Create a new project
3. Enable backend functions in your project settings
4. Configure the following entities:
   - `TrustedContact`
   - `Journey`
   - `SOSAlert`
   - `LocationUpdate`

### SMS Configuration

To enable SMS alerts:
1. Go to Base44 Dashboard → Settings → Enable Backend Functions
2. Configure your SMS provider (Fast2SMS, Twilio, or MSG91)
3. Add API keys to Base44 Secrets:
   - `FAST2SMS_API_KEY` (for Fast2SMS)
   - `TWILIO_ACCOUNT_SID` and `TWILIO_AUTH_TOKEN` (for Twilio)

## Technologies Used

- **React** - UI framework
- **Vite** - Build tool
- **React Router** - Routing
- **React Query** - Data fetching
- **Framer Motion** - Animations
- **Tailwind CSS** - Styling
- **Leaflet** - Maps
- **Lucide React** - Icons

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

MIT

## Support

For issues and questions, please contact support or check the documentation.
