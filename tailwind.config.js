/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        bg: '#0A0A0A',
        surface: '#1c1a19',
        card: '#33312F',
        cardhi: '#3d3b38',
        border: 'rgba(148,143,136,0.4)',
        borderhi: 'rgba(183,180,174,0.55)',
        ink: '#B7B4AE',
        onaccent: '#0A0A0A',
        muted: '#948F88',
        mutedlo: '#726E68',
        signal: '#B7B4AE',
        signal2: '#c9c6c1',
        signaldim: '#726E68',
        verified: '#371E1E',
        verifieddim: '#251414',
      },
      fontFamily: {
        display: ['Archivo', 'sans-serif'],
        body: ['"IBM Plex Sans"', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      letterSpacing: {
        tightest: '-0.04em',
      },
    },
  },
  plugins: [],
}
