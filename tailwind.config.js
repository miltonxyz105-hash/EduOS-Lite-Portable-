export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'accent-red': '#ef4444',
        'accent-red-dark': '#dc2626',
      },
      boxShadow: {
        'neon-red': '0 0 8px rgba(239, 68, 68, 0.45)',
        'neon-red-lg': '0 0 14px rgba(239, 68, 68, 0.5)',
      },
    },
  },
  plugins: [],
}
