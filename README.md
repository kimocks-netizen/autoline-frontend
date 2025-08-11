# Autoline Panel Frontend

A React-based panel beating business management system with admin dashboard, quote management, invoice system, and gallery.

## Features

- 🏢 Admin dashboard for business management
- 📋 Quote request system
- 🧾 Invoice generation and management
- 🖼️ Gallery management with image uploads
- 🔐 Secure admin authentication
- 📱 Responsive design with Tailwind CSS

## Technical Specifications

### API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/admin/login` | POST | Admin authentication |
| `/api/quotes` | POST | Submit quote requests |
| `/api/admin/quotes` | GET | Admin quote management |
| `/api/admin/invoices` | GET/POST | Invoice management |
| `/api/gallery` | GET | Public gallery display |
| `/api/admin/gallery` | GET/POST/PUT/DELETE | Gallery management |

### Tech Stack

- **Frontend**: React, TypeScript, Tailwind CSS
- **Routing**: React Router
- **API Client**: Fetch API
- **Build Tool**: Vite

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/coming-soon/batman-panic-button.git
   cd batman-panic-button

2. Clone the repository:
   ```bash
   npm install

3. Start development server:
   ```bash
   npm run dev
   ```
## Environment Variables

Create a `.env.local` file based on `env.example`:

```env
# Backend API Base URL - Choose one:
VITE_API_BASE_URL=https://autolinepanel-backend-gixq.vercel.app
# VITE_API_BASE_URL=https://autolinepanel-backend-production.up.railway.app
# VITE_API_BASE_URL=http://localhost:3002
```

**Available Backend URLs:**
- **Vercel (Default)**: `https://autolinepanel-backend-gixq.vercel.app`
- **Railway Production**: `https://autolinepanel-backend-production.up.railway.app`
- **Railway Staging**: `https://autolinepanel-backend-staging.up.railway.app`
- **Local Development**: `http://localhost:3002`  
## Project Structure
```text
frontend-autoline/
├── public/
├── src/
│   ├── components/        # Reusable components
│   │   ├── AdminNavbar.tsx
│   │   ├── GalleryCard.tsx
│   │   ├── InvoiceModal.tsx
│   │   ├── QuoteForm.tsx
│   │   └── ...
│   ├── pages/            # Page components
│   │   ├── AdminDashboard.tsx
│   │   ├── AdminLogin.tsx
│   │   ├── Gallery.tsx
│   │   ├── Home.tsx
│   │   └── ...
│   ├── utils/            # Utility functions
│   │   └── api.ts        # API configuration
│   ├── types/            # TypeScript type definitions
│   ├── App.tsx           # Main app component
│   └── main.tsx          # App entry point
├── env.example           # Environment variables template
├── package.json
└── vite.config.ts
```      
## Testing Credentials
Use these credentials for testing:
- **Email:** kimocks20@gmail.com
- **Password:** 12345678

## Backend Configuration

The frontend is configured to work with multiple backend deployments:

1. **Vercel (Default)**: `https://autolinepanel-backend-gixq.vercel.app`
2. **Railway Production**: `https://autolinepanel-backend-production.up.railway.app`
3. **Railway Staging**: `https://autolinepanel-backend-staging.up.railway.app`
4. **Local Development**: `http://localhost:3002`

To switch between backends, update the `VITE_API_BASE_URL` in your `.env.local` file.

## Deployment
To deploy to Vercel:

1. Install Vercel CLI:
   ```bash
   npm install -g vercel
   ```
2. Deploy:
   ```bash
   vercel
   ```
## License
This project has currently no license