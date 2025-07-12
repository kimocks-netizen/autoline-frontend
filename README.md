# Batman Panic Button System

A React-based emergency alert system for Commissioner Gordon to contact Batman.

## Features

- 🚨 Emergency panic button with geolocation
- 📜 Panic history tracking with filtering
- 🔄 Real-time status updates
- 🔐 Secure authentication
- 📱 Responsive design

## Technical Specifications

### API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/login` | POST | Authenticate users |
| `/panic/send` | POST | Create new panic alert |
| `/panic/cancel` | POST | Cancel active panic |
| `/panic/history` | GET | Get panic history |

### Tech Stack

- **Frontend**: React, TypeScript, Tailwind CSS
- **State Management**: Zustand
- **Routing**: React Router
- **API Client**: Axios
- **Maps**: React Leaflet

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
Create a .env file with:
   ```env
   VITE_API_BASE_URL=https://batman-assessment.fusebox-prod.co.za/api/v1 
   ```  
## Project Structure
```text
batman-panic-button/
├── public/
├── src/
│   ├── api/            #API service layer
│   │   ├── auth.ts
│   │   ├── panic.ts
│   │   └── index.ts
│   ├── components/        #Reusable components
│   │   ├── Layout.tsx
│   │   ├── PanicButton.tsx
│   │   └── ActivePanics.tsx
│   ├── pages/                    #Page components
│   │   ├── LoginPage.tsx
│   │   ├── DashboardPage.tsx
│   │   └── HistoryPage.tsx
│   ├── store/                #State management
│   │   └── authStore.ts
│   ├── App.tsx          # Main app component
│   └── main.tsx         # App entry point
├── .env                   # Environment variables
├── package.json
└── vite.config.ts   
```      
## Testing Credentials
Use these credentials for testing:
- **Email:** kimocks20@gmail.com
- **Password:** 12345678

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