import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#21182F",
        "primary": "#312447",
        "border": "#3F2E5A",
        "inner": "#654D8C",
        "input": "#C7A6EF14",
        "line": "#8D76AA",
        "error": '#9d455b',
        "light-error": '#cb708f',
        "custom-light-purple": "#BCA9DD",
        "inner-text-content": "#C7A6EF",
        "off-white": "#E8EBFF",
        "text-primary": "#E8EBFF",
        "button-primary": "#CCA3FF",
        "button-secondary": "#E8EBFF",
      },
      fontSize: {
        "10": "10px",
        "11": "11px",
        "12": "12px",
        "13": "13px",
        "14": "14px",
        "15": "15px",
        "16": "16px",
        "18": "18px",
        "20": "20px",
        "22": "22px",
        "24": "24px",
        "25": "25px",
        "28": "28px",
        "29": "29px",
        "30": "30px",
        "36": "36px",
        "32": "32px",
        "40": "40px",
        "42": "42px",
        "48": "48px",
      },
      fontWeight: {
        bold: "700",
        semibold: "600",
        medium: "500",
        regular: "400",
      },
    },
  },
  plugins: [],
};

export default config;
