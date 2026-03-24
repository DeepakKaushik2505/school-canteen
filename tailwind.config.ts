import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        playfair: ["var(--font-playfair)", "serif"],
      },
      colors: {
        "olive-leaf": "#606c38",
        "black-forest": "#283618",
        cornsilk: "#fefae0",
        "light-caramel": "#dda15e",
      },
      backgroundImage: {
        "gradient-header": "linear-gradient(135deg, #283618 0%, #606c38 100%)",
        "gradient-card": "linear-gradient(180deg, #fefae0 0%, #f5f0d8 100%)",
        "gradient-button": "linear-gradient(135deg, #606c38 0%, #283618 100%)",
        "gradient-page": "linear-gradient(180deg, #fefae0 0%, #dda15e 50%, #fefae0 100%)",
      },
    },
  },
  plugins: [],
};
export default config;
