# Quick Start Guide

## Step 1: Install Dependencies

Open your terminal in the `Code_files` directory and run:

```bash
npm install
```

This will install all required packages including:
- React and React DOM
- Vite (build tool)
- React Router
- React Query
- Tailwind CSS
- And all other dependencies

## Step 2: Configure Base44 (Required)

Before running the app, you need to configure your Base44 client:

1. Open `/api/base44Client.js`
2. Replace the placeholder code with your actual Base44 SDK initialization:

```javascript
// Example:
import { Base44Client } from '@base44/sdk'; // or your SDK import

export const base44 = new Base44Client({
  projectId: 'your-project-id',
  apiKey: 'your-api-key'
});
```

**Note:** If you don't have Base44 set up yet, the app will still run but features won't work. You can test the UI without it.

## Step 3: Run the Development Server

```bash
npm run dev
```

The app will start at `http://localhost:3000` and automatically open in your browser.

## Step 4: Build for Production (Optional)

When you're ready to deploy:

```bash
npm run build
```

This creates an optimized build in the `dist` folder.

## Troubleshooting

### Port Already in Use
If port 3000 is already in use, Vite will automatically try the next available port (3001, 3002, etc.)

### Module Not Found Errors
Make sure all dependencies are installed:
```bash
rm -rf node_modules package-lock.json
npm install
```

### Base44 Errors
The app will show errors if Base44 is not configured. Configure it in `/api/base44Client.js` or use placeholder data for UI testing.

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Project Structure

```
Code_files/
├── src/
│   ├── App.jsx          # Main app with routes
│   ├── main.jsx         # Entry point
│   └── index.css        # Global styles
├── Components/          # React components
├── Pages/               # Page components
├── api/                 # API configuration
├── utils.js             # Utility functions
└── package.json         # Dependencies
```

## Next Steps

1. ✅ Install dependencies (`npm install`)
2. ✅ Configure Base44 client
3. ✅ Run the app (`npm run dev`)
4. ✅ Test the features
5. ✅ Configure SMS provider (for emergency alerts)
6. ✅ Deploy to production

Happy coding! 🚀
