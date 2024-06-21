// tailwind.config.js
import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#3ED68C", // Teal
        secondary: "#003C68", // Navy
        accent: "#0657E0", // Electric Blue
        "background-light": "#0657E0", // Light Gray
        "foreground-light": "#E0E0E0", // Dark Gray
        "background-dark": "#121212", // Very Dark Gray
        "foreground-dark": "#E0E0E0", // Light Gray
        "primary-dark": "#00235F", // Dark Teal
        "secondary-dark": "#114093", // Dark Navy
        "accent-dark": "#1E2C81", // Dark Electric Blue
      },
    },
  },
  darkMode: 'class',
  plugins: [],
};

export default config;
