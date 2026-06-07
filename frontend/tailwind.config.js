export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        // Backgrounds
        bg: {
          base:    'var(--bg-base)',
          surface: 'var(--bg-surface)',
          raised:  'var(--bg-raised)',
        },

        // Text
        text: {
          primary:   'var(--text-primary)',
          secondary: 'var(--text-secondary)',
          muted:     'var(--text-muted)',
          disabled:  'var(--text-disabled)',
        },

        // Borders
        border: {
          DEFAULT: 'var(--border)',
          strong:  'var(--border-strong)',
        },

        // Accent principal
        primary: {
          DEFAULT: 'var(--primary)',
          hover:   'var(--primary-hover)',
          subtle:  'var(--primary-subtle)',
          text:    'var(--primary-text)',
        },

        // Sémantiques
        success: {
          bg:   'var(--success-bg)',
          text: 'var(--success-text)',
        },
        warning: {
          bg:   'var(--warning-bg)',
          text: 'var(--warning-text)',
        },
        route: {
          mine:  'var(--route-mine)',
          other: 'var(--route-other)',
          full:  'var(--route-full)',
        },
        danger: {
          bg:   'var(--danger-bg)',
          text: 'var(--danger-text)',
        },
        info: {
          bg:   'var(--info-bg)',
          text: 'var(--info-text)',
        },
      },

      borderRadius: {
        sm:   'var(--radius-sm)',
        md:   'var(--radius-md)',
        lg:   'var(--radius-lg)',
        xl:   'var(--radius-xl)',
        full: 'var(--radius-full)',
      },

      boxShadow: {
        sm: 'var(--shadow-sm)',
        md: 'var(--shadow-md)',
        lg: 'var(--shadow-lg)',
      },

      fontFamily: {
        sans: 'var(--font-sans)',
        mono: 'var(--font-mono)',
      },
    },
  },
  plugins: [],
};