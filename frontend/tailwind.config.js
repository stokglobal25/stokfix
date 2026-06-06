/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'bg-primary': '#1a1a2e',
        'bg-secondary': '#16213e',
        'bg-card': '#1e2a4a',
        'text-primary': '#e0e0e0',
        'text-secondary': '#a0a0b0',
        'accent': '#4fc3f7',
        'accent-sec': '#7c4dff',
        'success': '#4caf50',
        'warning': '#ff9800',
        'danger': '#f44336',
      },
    },
  },
  plugins: [],
}
