import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './node_modules/flowbite-react/lib/**/*.js',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Paleta Jaguar - Amarillo/Café/Negro
        primary: {
          50: '#FFFDF0',  // Amarillo muy claro
          100: '#FFF9C4', // Amarillo claro
          200: '#FFF176', // Amarillo medio claro
          300: '#FFEB3B', // Amarillo brillante
          400: '#FFC107', // Amarillo principal (dorado)
          500: '#FF8F00', // Amarillo/naranja
          600: '#F57C00', // Naranja dorado
          700: '#E65100', // Naranja oscuro
          800: '#BF360C', // Café rojizo
          900: '#8D4E00', // Café oscuro
        },
        jaguar: {
          50: '#FFF8E1',  // Crema
          100: '#FFECB3', // Amarillo muy claro
          200: '#FFE082', // Amarillo claro
          300: '#FFD54F', // Amarillo dorado
          400: '#FFCA28', // Amarillo jaguar principal
          500: '#FFC107', // Dorado intenso
          600: '#FFB300', // Dorado oscuro
          700: '#FF8F00', // Naranja dorado
          800: '#F57C00', // Café claro
          900: '#E65100', // Café jaguar
        },
        coffee: {
          50: '#F3E5AB',  // Café muy claro
          100: '#E6D690', // Café claro
          200: '#D4C078', // Café medio claro
          300: '#C2A660', // Café medio
          400: '#A0824A', // Café
          500: '#8B6914', // Café oscuro
          600: '#6F4E37', // Café chocolate
          700: '#5D4037', // Café marrón
          800: '#4E342E', // Café muy oscuro
          900: '#3E2723', // Café negro
        },
        dark: {
          50: '#F5F5DC',  // Beige claro
          100: '#F0E68C', // Khaki claro
          200: '#DDD6C0', // Beige
          300: '#C8B99C', // Beige oscuro
          400: '#A0824A', // Café claro
          500: '#8B6914', // Café medio
          600: '#6F4E37', // Café chocolate
          700: '#4A2C2A', // Café muy oscuro
          800: '#2F1B14', // Casi negro café
          900: '#1A0E0A', // Negro café
          950: '#0D0706', // Negro jaguar
        },
        background: '#1A0E0A', // Negro café
        accent: '#FFCA28', // Amarillo jaguar
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      backgroundImage: {
        'jaguar-pattern': 'radial-gradient(circle at 25% 25%, #FFCA28 2px, transparent 2px), radial-gradient(circle at 75% 75%, #8B6914 2px, transparent 2px)',
        'jaguar-spots': 'radial-gradient(ellipse 60% 80% at 50% 50%, #8B6914, transparent)',
      },
    },
  },
  plugins: [
    require('flowbite/plugin')
  ],
}

export default config