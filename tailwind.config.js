/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
    "./context/**/*.{js,jsx,ts,tsx}",
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        primary: "#ff4757",
        "primary-dark": "#ff5252",
        secondary: "#ffe8e8",
        accent: "#ffd0d0",
        foreground: "#1a1a1a",
        "muted-foreground": "#9ca3af",
        destructive: "#ef4444",
      },
    },
  },
  plugins: [],
};
