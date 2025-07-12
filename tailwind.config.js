// tailwind.config.js
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          blue: '#2563EB',
          red: '#DC2626',
          gray: '#4B5563'
        },
        dark: {
          blue: '#1E40AF',
          red: '#991B1B',
          gray: '#1F2937'
        }
      },
    },
  },
  plugins: [],
}