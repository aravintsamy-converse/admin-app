import type { Config } from 'tailwindcss'
 
export default {
  darkMode: ['class'],
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: `"Inter var"`,
      },
      transitionProperty: {
        theme: 'background-color, color',
      },
      screens: {
        s: '300px',
        xs: '340px',
        '3xl': '1800px',
        '4xl': '2100px',
      },
      colors: {
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        metricborder: 'hsla(var(--metric-border))',
        formheaderborder: 'hsla(var(--form-header-border))',
        popoverradioforground: 'hsla(var(--popover-radio-foreground))',
        popoverheaderforeground: 'hsla(var(--popover-header-foreground))',
        popoversecondaryforground: 'hsla(var(--popover-secondary-forground))',
        infoIcon: 'hsla(var(--info-icon))',
        formHeaderCardBackground: 'hsla(var(--form-header-card-background))',
        selectsecondaryforeground: 'hsl(var(--select-secondary-foreground))',
        dotMenuDeselected: 'hsla(var(--dot-menu-deselected))',
        formcardbackground: 'hsl(var(--form-card-background))',
        accordionTriggerBg: 'var(--accordion-trigger-bg)',
        mainbackground: 'hsl(var(--mainbackground))',
        parentbackground: 'hsl(var(--parentbackground))',
        selectedValue: 'hsl(var(--selected-value))',
        icon: 'hsl(var(--icon))',
        tooltip: 'hsl(var(--tooltip))',
        tooltipForeground: 'hsl(var(--tooltip-foreground))',
        chart: {
          '1': 'hsl(var(--chart-1))',
          '2': 'hsl(var(--chart-2))',
          '3': 'hsl(var(--chart-3))',
          '4': 'hsl(var(--chart-4))',
          '5': 'hsl(var(--chart-5))',
        },
        sidebar: {
          DEFAULT: 'hsl(var(--sidebar-background))',
          foreground: 'hsl(var(--sidebar-foreground))',
          primary: 'hsl(var(--sidebar-primary))',
          'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
          accent: 'hsl(var(--sidebar-accent))',
          'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
          border: 'hsl(var(--sidebar-border))',
          ring: 'hsl(var(--sidebar-ring))',
        },
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      boxShadow: {
        primaryButtonActive: '2px 2px 5px 0px hsla(var(--shadow-active))',
        custom: '0px 2px 10px 0px hsl(var(--shadow-color))',
        viewboxshadow: '0px 2px 10px 0px hsla(var(--view-box-shadow))',
        customhover: '2px 2px 5px 0px hsl(var(--shadow-color))',
        sheetShadow: '3px 0px 10px 0px hsl(var(--shadow-color))',
      },
      keyframes: {
        'accordion-down': {
          from: {
            height: '0',
          },
          to: {
            height: 'var(--radix-accordion-content-height)',
          },
        },
        'accordion-up': {
          from: {
            height: 'var(--radix-accordion-content-height)',
          },
          to: {
            height: '0',
          },
        },
        slideDown: {
          '0%': { height: '0', opacity: '0' },
          '10%': { opacity: '20' },
          '100%': {
            height: 'var(--radix-collapsible-content-height)',
            opacity: '1',
          },
        },
        slideUp: {
          '0%': {
            height: 'var(--radix-collapsible-content-height)',
            opacity: '1',
          },
          '100%': { height: '0', opacity: '0' },
        },
        slideFadeIn: {
          '0%': { opacity: '0', transform: 'translateY(-10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        rippleOverlay: {
          '0%': { transform: 'scale(0)', opacity: '0.6' },
          '100%': { transform: 'scale(8)', opacity: '0' },
        },
        slideFadeOutUp: {
          '0%': { opacity: '1', transform: 'translateY(0)' },
          '100%': { opacity: '0', transform: 'translateY(-10px)' },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        slideDown: 'slideDown 300ms ease-out',
        slideUp: 'slideUp 500ms ease-out',
        slideFadeIn: 'slideFadeIn 0.4s ease forwards',
        slideFadeOutUp: 'slideFadeOutUp 0.4s ease forwards',
        rippleOverlay: 'rippleOverlay 0.8s ease-out',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
} satisfies Config
 