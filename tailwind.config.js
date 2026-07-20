/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        canvas: '#F5F7FA',
        panel: '#FFFFFF',
        ink: {
          900: '#0F172A',
          700: '#334155',
          500: '#64748B',
          300: '#CBD5E1',
        },
        line: '#E5E9F0',
        brand: {
          DEFAULT: '#1E4FA3',
          dark: '#123B80',
          light: '#EAF1FC',
        },
        gain: {
          DEFAULT: '#0F9D58',
          soft: '#E7F6EE',
        },
        loss: {
          DEFAULT: '#D93025',
          soft: '#FCEAE9',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', '"Roboto Mono"', 'monospace'],
      },
      boxShadow: {
        card: '0 1px 2px rgba(15, 23, 42, 0.04), 0 8px 24px -12px rgba(15, 23, 42, 0.12)',
        cardHover: '0 4px 10px rgba(15, 23, 42, 0.06), 0 16px 32px -12px rgba(15, 23, 42, 0.16)',
      },
      borderRadius: {
        xl2: '14px',
      },
    },
  },
  plugins: [],
};
