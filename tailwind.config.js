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
          gray: '#4B5563',
        },
        dark: {
          blue: '#1E40AF',
          red: '#991B1B',
          gray: '#1F2937',
        },
      },
      animation: {
        'bounce-delay': 'bounce-delay 4s infinite',
      },
      keyframes: {
        'bounce-delay': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
      },
    },
  },
  plugins: [],
}
