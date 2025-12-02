import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // SIP brand colors
        'sip-purple': {
          50: '#f5f3ff',
          100: '#ede9fe',
          500: '#8b5cf6',
          600: '#7c3aed',
          700: '#6d28d9',
          900: '#4c1d95',
        },
        'sip-green': {
          400: '#4ade80',
          500: '#22c55e',
        },
      },
      fontFamily: {
        mono: ['var(--font-mono)', 'monospace'],
      },
      animation: {
        // Transaction flow animations - 6 second cycle (4 steps x 1.5s)
        // Red (vulnerable) side
        'flow-sender': 'flowStepRed 6s ease-in-out infinite',
        'flow-pool': 'flowStepRed 6s ease-in-out infinite 1.5s',
        'flow-refund': 'flowStepRed 6s ease-in-out infinite 3s',
        'flow-arrow1': 'flowArrowRed 6s ease-in-out infinite 1.5s',
        'flow-arrow2': 'flowArrowRed 6s ease-in-out infinite 3s',
        // Green (protected) side
        'flow-sender-green': 'flowStepGreen 6s ease-in-out infinite',
        'flow-pool-green': 'flowStepGreen 6s ease-in-out infinite 1.5s',
        'flow-refund-green': 'flowStepGreen 6s ease-in-out infinite 3s',
        'flow-arrow1-green': 'flowArrowGreen 6s ease-in-out infinite 1.5s',
        'flow-arrow2-green': 'flowArrowGreen 6s ease-in-out infinite 3s',
      },
      keyframes: {
        flowStepRed: {
          '0%, 20%': { boxShadow: '0 0 0 2px rgba(239, 68, 68, 0.5)' },
          '25%, 100%': { boxShadow: 'none' },
        },
        flowStepGreen: {
          '0%, 20%': { boxShadow: '0 0 0 2px rgba(34, 197, 94, 0.5)' },
          '25%, 100%': { boxShadow: 'none' },
        },
        flowArrowRed: {
          '0%, 20%': { transform: 'scale(1.25)', color: 'rgb(248, 113, 113)' },
          '25%, 100%': { transform: 'scale(1)', color: 'rgb(75, 85, 99)' },
        },
        flowArrowGreen: {
          '0%, 20%': { transform: 'scale(1.25)', color: 'rgb(74, 222, 128)' },
          '25%, 100%': { transform: 'scale(1)', color: 'rgb(75, 85, 99)' },
        },
      },
    },
  },
  plugins: [],
}

export default config
