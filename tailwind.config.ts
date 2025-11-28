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
        linear: {
          bg: '#0d0d0d',
          surface: '#1a1a1a',
          border: '#2a2a2a',
          hover: '#2d2d2d',
          text: '#e0e0e0',
          muted: '#9ca3af',
          primary: '#5e6ad2',
          'primary-hover': '#505ac9',
        }
      },
    },
  },
  plugins: [],
};
export default config;
