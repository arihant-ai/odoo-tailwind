/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./addons/**/*.{html,js,xml,py}",
    "./addons/**/*.xml",
    "./addons/**/*.js",
    "./addons/**/*.py",
    // Include Odoo core templates if needed
    "./odoo/addons/website/**/*.xml",
    "./odoo/addons/web/**/*.xml",
  ],
  theme: {
    extend: {
      // Extend Tailwind's default theme
      colors: {
        // Odoo brand colors
        'odoo-primary': '#714B67',
        'odoo-secondary': '#875A7B',
        'odoo-success': '#28a745',
        'odoo-info': '#17a2b8',
        'odoo-warning': '#ffc107',
        'odoo-danger': '#dc3545',
        'odoo-light': '#f8f9fa',
        'odoo-dark': '#343a40',
        // Custom brand colors
        'brand': {
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#0ea5e9',
          600: '#0284c7',
          700: '#0369a1',
          800: '#075985',
          900: '#0c4a6e',
        }
      },
      fontFamily: {
        // Use Odoo's default fonts
        'sans': ['Roboto', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        'serif': ['ui-serif', 'Georgia', 'serif'],
        'mono': ['ui-monospace', 'SFMono-Regular', 'monospace'],
      },
      spacing: {
        // Additional spacing values
        '18': '4.5rem',
        '88': '22rem',
        '128': '32rem',
      },
      screens: {
        // Custom breakpoints to match Bootstrap
        'xs': '576px',
        'sm': '576px',
        'md': '768px',
        'lg': '992px',
        'xl': '1200px',
        '2xl': '1400px',
      },
      container: {
        center: true,
        padding: {
          DEFAULT: '1rem',
          sm: '2rem',
          lg: '4rem',
          xl: '5rem',
          '2xl': '6rem',
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
    require('@tailwindcss/aspect-ratio'),
  ],
  // Important: Use prefix to avoid conflicts with Bootstrap
  // prefix: 'tw-',
  
  // Configure important to work with Odoo's CSS specificity
  important: false,
  
  // Disable preflight to avoid conflicts with Bootstrap
  corePlugins: {
    preflight: false,
  },
  
  // Safelist important classes that might be used dynamically
  safelist: [
    'text-center',
    'text-left',
    'text-right',
    'flex',
    'grid',
    'hidden',
    'block',
    'inline-block',
    'container',
    'mx-auto',
    'p-4',
    'm-4',
    'bg-blue-500',
    'bg-red-500',
    'bg-green-500',
    'bg-yellow-500',
    'text-white',
    'text-gray-900',
    'text-gray-600',
    'rounded',
    'shadow',
    'hover:bg-blue-700',
    // Add more classes that might be used dynamically
    {
      pattern: /bg-(red|green|blue|yellow|gray|purple|pink|indigo)-(100|200|300|400|500|600|700|800|900)/,
    },
    {
      pattern: /text-(red|green|blue|yellow|gray|purple|pink|indigo)-(100|200|300|400|500|600|700|800|900)/,
    },
    {
      pattern: /(p|m|px|py|mx|my)-(0|1|2|3|4|5|6|8|10|12|16|20|24)/,
    },
  ]
}
