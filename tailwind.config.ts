import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#2d5016",
        accent: "#8b4513",
        cream: "#f5f5f0",
        success: "#2e7d32",
        danger: "#c62828",
        warning: "#f9a825"
      },
      boxShadow: {
        soft: "0 10px 30px rgba(0,0,0,0.08)"
      }
    }
  },
  plugins: []
};

export default config;
