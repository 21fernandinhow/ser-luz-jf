import type { Config } from 'tailwindcss'

export default {
  theme: {
    extend: {
      colors: {
        brand: {
          yellow: '#f0c657',
          blue: '#0e4cab',
        },
        surface: {
          white: '#ffffff',
          muted: '#f5f5f5',
        },
      },
    },
  },
  plugins: [],
} satisfies Config
