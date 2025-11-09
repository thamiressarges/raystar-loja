import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'gray-100': '#E9E9E9',
        'red': '#AE0606',
        'green': '#06AE33',
        'blue': '#086DF0',
      },
      fontFamily: {
        sans: ['var(--font-poppins)', 'sans-serif'],
        logo: ['var(--font-ibarra)', 'serif'],
      },
    },
  },
  plugins: [],
}
export default config