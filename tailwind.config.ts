import type { Config } from "tailwindcss";

const config: Config = {
  // 1. Dark Mode පන්තිය (class) මගින් පාලනය කිරීමට මෙය අනිවාර්ය වේ
  darkMode: "class",

  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    
  ],
  theme: {
    extend: {
      // ඔබේ custom colors මෙහි තිබේ
    },
  },
  plugins: [],
  important:true,
};

export default config;