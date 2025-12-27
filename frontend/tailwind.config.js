/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Light mode
        light: {
          bg: {
            primary: '#FFFFFF',
            secondary: '#F5F5F5',
            tertiary: '#E8E8E8',
          },
          text: {
            primary: '#1A1A1A',
            secondary: '#4A4A4A',
            tertiary: '#8A8A8A',
          },
        },
        // Dark mode
        dark: {
          bg: {
            primary: '#1A1A1A',
            secondary: '#2D2D2D',
            tertiary: '#3A3A3A',
          },
          text: {
            primary: '#F0F0F0',
            secondary: '#B0B0B0',
            tertiary: '#808080',
          },
        },
        // Neon mode
        neon: {
          bg: {
            primary: '#0D0D0D',
            secondary: '#1E1E1E',
            tertiary: '#2A2A2A',
          },
          purple: '#9D4EDD',
          pink: '#FF006E',
          orange: '#FB5607',
          blue: '#3A86FF',
          green: '#06FFA5',
        },
        // Status colors
        success: '#4CAF50',
        warning: '#FF9800',
        error: '#F44336',
        info: '#2196F3',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-in-out',
        'slide-up': 'slideUp 0.4s ease-out',
        'gentle-pulse': 'gentlePulse 2s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        gentlePulse: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.7' },
        },
      },
    },
  },
  plugins: [],
};
