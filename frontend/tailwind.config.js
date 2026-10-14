/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        alexa: {
          blue: '#00CAFF',
          darkBlue: '#0055FF',
          cyan: '#00E5FF',
          navy: '#0B132B',
          deep: '#1C2541'
        }
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
      },
      keyframes: {
        glow: {
          '0%': { boxShadow: '0 0 15px rgba(0, 202, 255, 0.4)' },
          '100%': { boxShadow: '0 0 35px rgba(0, 202, 255, 0.85)' }
        }
      }
    },
  },
  plugins: [],
}
