// tailwind.config.js — MarketMakers Light Theme
/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["'Plus Jakarta Sans'", "'DM Sans'", "system-ui", "-apple-system", "sans-serif"],
        display: ["'Plus Jakarta Sans'", "system-ui", "sans-serif"],
        body: ["'DM Sans'", "system-ui", "sans-serif"],
      },
      colors: {
        surface: {
          DEFAULT: '#FAFAF8',
          white: '#FFFFFF',
          subtle: '#F5F5F0',
          muted: '#EDEDEA',
          elevated: '#FFFFFF',
        },
        slate: {
          heading: '#1A1A2E',
          body: '#4A4A68',
          muted: '#8E8EA0',
          light: '#B8B8C8',
          border: '#E5E5E0',
        },
        indigo: {
          50: '#EEF2FF',
          100: '#E0E7FF',
          200: '#C7D2FE',
          300: '#A5B4FC',
          400: '#818CF8',
          500: '#5048E5',
          600: '#4338CA',
          700: '#3730A3',
          800: '#312E81',
          900: '#1E1B4B',
        },
        teal: {
          50: '#F0FDFA',
          100: '#CCFBF1',
          200: '#99F6E4',
          300: '#5EEAD4',
          400: '#2DD4BF',
          500: '#14B8A6',
          600: '#0D9488',
          700: '#0F766E',
          800: '#115E59',
          900: '#134E4A',
        },
        success: {
          light: '#ECFDF5',
          DEFAULT: '#10B981',
          dark: '#065F46',
        },
        warning: {
          light: '#FFFBEB',
          DEFAULT: '#F59E0B',
          dark: '#92400E',
        },
        danger: {
          light: '#FEF2F2',
          DEFAULT: '#EF4444',
          dark: '#991B1B',
        },
      },
      borderRadius: {
        'xl': '12px',
        '2xl': '16px',
        '3xl': '24px',
        '4xl': '32px',
      },
      boxShadow: {
        'soft': '0 1px 3px rgba(0,0,0,0.04), 0 1px 2px rgba(0,0,0,0.06)',
        'card': '0 4px 20px rgba(0,0,0,0.06)',
        'elevated': '0 8px 30px rgba(0,0,0,0.08)',
        'glow-indigo': '0 0 20px rgba(80,72,229,0.15)',
        'glow-teal': '0 0 20px rgba(20,184,166,0.15)',
        'nav': '0 8px 32px rgba(0,0,0,0.08)',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideIn: {
          '0%': { opacity: '0', transform: 'translateY(-10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideDown: {
          '0%': { opacity: '0', transform: 'translateY(-20px)', maxHeight: '0' },
          '100%': { opacity: '1', transform: 'translateY(0)', maxHeight: '500px' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-6px)' },
        },
      },
      animation: {
        fadeIn: 'fadeIn 0.5s ease-out forwards',
        slideIn: 'slideIn 0.3s ease-out',
        slideUp: 'slideUp 0.5s ease-out forwards',
        slideDown: 'slideDown 0.3s ease-out forwards',
        float: 'float 3s ease-in-out infinite',
      },
      backgroundImage: {
        'gradient-mesh': 'radial-gradient(at 0% 0%, rgba(80,72,229,0.06) 0, transparent 50%), radial-gradient(at 100% 0%, rgba(20,184,166,0.06) 0, transparent 50%), radial-gradient(at 50% 100%, rgba(80,72,229,0.03) 0, transparent 50%)',
        'gradient-hero': 'linear-gradient(135deg, rgba(80,72,229,0.05) 0%, rgba(20,184,166,0.05) 100%)',
        'gradient-cta': 'linear-gradient(135deg, #5048E5 0%, #14B8A6 100%)',
      },
    },
  },
  plugins: [],
};
