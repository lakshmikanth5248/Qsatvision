/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        space: {
          950: '#060913',
          900: '#0B132B',
          850: '#111A35',
          800: '#1C2541',
          700: '#2A365C',
          600: '#3A4A7C',
        },
        cyanCustom: {
          400: '#22D3EE',
          500: '#06B6D4',
          600: '#0891B2',
          700: '#0E7490',
        },
        quantum: {
          400: '#C084FC',
          500: '#A855F7',
          600: '#9333EA',
          700: '#7E22CE',
          800: '#6B21A8',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'Consolas', 'monospace'],
      },
      boxShadow: {
        'glow-cyan': '0 0 20px -5px rgba(6, 182, 212, 0.4)',
        'glow-purple': '0 0 20px -5px rgba(168, 85, 247, 0.4)',
        'glass': '0 8px 32px 0 rgba(0, 0, 0, 0.12)',
      }
    },
  },
  plugins: [],
}
