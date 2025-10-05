// Material Design 3 theme configuration
import { createTheme } from '@mui/material/styles'

export const theme = createTheme({
  palette: {
    mode: 'light',
    // NYTimes-inspired palette
    primary: {
      // Bright, popping blue inspired by the references
      main: '#2970FF',
      light: '#5B8CFF',
      dark: '#1B4DFF',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#a61c2f', // NYT red accent
      light: '#c44958',
      dark: '#7a1321',
      contrastText: '#ffffff',
    },
    success: {
      main: '#2e6e4c', // muted green
      light: '#4b8a66',
      dark: '#1f4c34',
    },
    warning: {
      main: '#c5a46d', // gold accent used in graphics
      light: '#d4bb8f',
      dark: '#937a4e',
    },
    error: {
      main: '#8c2b2f',
      light: '#a94a4e',
      dark: '#5f1d20',
    },
    info: {
      main: '#2970FF',
      light: '#5B8CFF',
      dark: '#1B4DFF',
    },
    background: {
      default: '#f7f7f5', // off-white
      paper: '#ffffff',
    },
    text: {
      primary: '#111111',
      secondary: '#555555',
      disabled: '#9e9e9e',
    },
  },
  typography: {
    // Single global font (Inter) across the app and charts
    fontFamily: 'var(--font-inter), Inter, system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif',
    h1: {
      fontSize: '2.6rem',
      fontWeight: 800,
      letterSpacing: '-0.015em',
      lineHeight: 1.15,
    },
    h2: {
      fontSize: '2rem',
      fontWeight: 800,
      letterSpacing: '-0.01em',
      lineHeight: 1.2,
    },
    h3: {
      fontSize: '1.6rem',
      fontWeight: 700,
      letterSpacing: '-0.005em',
      lineHeight: 1.25,
    },
    h4: {
      fontSize: '1.35rem',
      fontWeight: 600,
      letterSpacing: '-0.005em',
    },
    h5: {
      fontSize: '1.15rem',
      fontWeight: 600,
    },
    h6: {
      fontSize: '1rem',
      fontWeight: 600,
      letterSpacing: '0.005em',
    },
    body1: {
      fontSize: '1rem',
      fontWeight: 400,
      letterSpacing: '0.01em',
      lineHeight: 1.6,
    },
    body2: {
      fontSize: '0.9rem',
      fontWeight: 400,
      letterSpacing: '0.01em',
      lineHeight: 1.55,
    },
    button: {
      fontWeight: 600,
    }
  },
  shape: {
    borderRadius: 8,
  },
  shadows: [
    'none',
    '0px 2px 1px -1px rgba(0,0,0,0.2),0px 1px 1px 0px rgba(0,0,0,0.14),0px 1px 3px 0px rgba(0,0,0,0.12)',
    '0px 3px 1px -2px rgba(0,0,0,0.2),0px 2px 2px 0px rgba(0,0,0,0.14),0px 1px 5px 0px rgba(0,0,0,0.12)',
    '0px 3px 3px -2px rgba(0,0,0,0.2),0px 3px 4px 0px rgba(0,0,0,0.14),0px 1px 8px 0px rgba(0,0,0,0.12)',
    '0px 2px 4px -1px rgba(0,0,0,0.2),0px 4px 5px 0px rgba(0,0,0,0.14),0px 1px 10px 0px rgba(0,0,0,0.12)',
    '0px 3px 5px -1px rgba(0,0,0,0.2),0px 5px 8px 0px rgba(0,0,0,0.14),0px 1px 14px 0px rgba(0,0,0,0.12)',
    '0px 3px 5px -1px rgba(0,0,0,0.2),0px 6px 10px 0px rgba(0,0,0,0.14),0px 1px 18px 0px rgba(0,0,0,0.12)',
    '0px 4px 5px -2px rgba(0,0,0,0.2),0px 7px 10px 1px rgba(0,0,0,0.14),0px 2px 16px 1px rgba(0,0,0,0.12)',
    '0px 5px 5px -3px rgba(0,0,0,0.2),0px 8px 10px 1px rgba(0,0,0,0.14),0px 3px 14px 2px rgba(0,0,0,0.12)',
    '0px 5px 6px -3px rgba(0,0,0,0.2),0px 9px 12px 1px rgba(0,0,0,0.14),0px 3px 16px 2px rgba(0,0,0,0.12)',
    '0px 6px 6px -3px rgba(0,0,0,0.2),0px 10px 14px 1px rgba(0,0,0,0.14),0px 4px 18px 3px rgba(0,0,0,0.12)',
    '0px 6px 7px -4px rgba(0,0,0,0.2),0px 11px 15px 1px rgba(0,0,0,0.14),0px 4px 20px 3px rgba(0,0,0,0.12)',
    '0px 7px 8px -4px rgba(0,0,0,0.2),0px 12px 17px 2px rgba(0,0,0,0.14),0px 5px 22px 4px rgba(0,0,0,0.12)',
    '0px 7px 8px -4px rgba(0,0,0,0.2),0px 13px 19px 2px rgba(0,0,0,0.14),0px 5px 24px 4px rgba(0,0,0,0.12)',
    '0px 7px 9px -4px rgba(0,0,0,0.2),0px 14px 21px 2px rgba(0,0,0,0.14),0px 5px 26px 4px rgba(0,0,0,0.12)',
    '0px 8px 9px -5px rgba(0,0,0,0.2),0px 15px 22px 2px rgba(0,0,0,0.14),0px 6px 28px 5px rgba(0,0,0,0.12)',
    '0px 8px 10px -5px rgba(0,0,0,0.2),0px 16px 24px 2px rgba(0,0,0,0.14),0px 6px 30px 5px rgba(0,0,0,0.12)',
    '0px 8px 11px -5px rgba(0,0,0,0.2),0px 17px 26px 2px rgba(0,0,0,0.14),0px 6px 32px 5px rgba(0,0,0,0.12)',
    '0px 9px 11px -5px rgba(0,0,0,0.2),0px 18px 28px 2px rgba(0,0,0,0.14),0px 7px 34px 6px rgba(0,0,0,0.12)',
    '0px 9px 12px -6px rgba(0,0,0,0.2),0px 19px 29px 2px rgba(0,0,0,0.14),0px 7px 36px 6px rgba(0,0,0,0.12)',
    '0px 10px 13px -6px rgba(0,0,0,0.2),0px 20px 31px 3px rgba(0,0,0,0.14),0px 8px 38px 7px rgba(0,0,0,0.12)',
    '0px 10px 13px -6px rgba(0,0,0,0.2),0px 21px 33px 3px rgba(0,0,0,0.14),0px 8px 40px 7px rgba(0,0,0,0.12)',
    '0px 10px 14px -6px rgba(0,0,0,0.2),0px 22px 35px 3px rgba(0,0,0,0.14),0px 8px 42px 7px rgba(0,0,0,0.12)',
    '0px 11px 14px -7px rgba(0,0,0,0.2),0px 23px 36px 3px rgba(0,0,0,0.14),0px 9px 44px 8px rgba(0,0,0,0.12)',
    '0px 11px 15px -7px rgba(0,0,0,0.2),0px 24px 38px 3px rgba(0,0,0,0.14),0px 9px 46px 8px rgba(0,0,0,0.12)',
  ],
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 14,
          border: '1px solid',
          borderColor: 'rgba(16, 24, 40, 0.08)',
          background: 'linear-gradient(180deg, rgba(41,112,255,0.04) 0%, rgba(41,112,255,0.00) 100%)',
          boxShadow: '0 1px 2px rgba(16,24,40,0.06)',
          transition: 'box-shadow 200ms ease, transform 200ms ease',
          position: 'relative',
          '&:hover': {
            boxShadow: '0 12px 24px rgba(41,112,255,0.12), 0 2px 8px rgba(16,24,40,0.06)',
            transform: 'translateY(-2px)',
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: 10,
          fontWeight: 600,
          padding: '8px 16px',
        },
        containedPrimary: {
          color: '#fff',
          backgroundImage: 'linear-gradient(180deg, #5B8CFF 0%, #2970FF 100%)',
          boxShadow: '0 8px 16px rgba(41,112,255,0.24)',
          '&:hover': {
            backgroundImage: 'linear-gradient(180deg, #6C98FF 0%, #2B68F7 100%)',
            boxShadow: '0 10px 20px rgba(41,112,255,0.28)',
          },
        },
        outlinedPrimary: {
          borderColor: 'rgba(41,112,255,0.35)',
          '&:hover': { borderColor: 'rgba(41,112,255,0.6)', backgroundColor: 'rgba(41,112,255,0.06)' },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        outlined: {
          borderColor: 'rgba(41,112,255,0.35)',
        },
        root: {
          fontWeight: 600,
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 14,
        },
      },
    },
  },
})

// Chart color palette (NYTimes-inspired)
export const chartColors = {
  primary: ['#2970FF', '#5B8CFF', '#7BA0FF', '#9BB4FF', '#BED0FF'],
  secondary: ['#a61c2f', '#c44958', '#d46b73', '#e08a91', '#edabb0'],
  success: ['#2e6e4c', '#4b8a66', '#65a17d', '#86b89a', '#a8cfb6'],
  warning: ['#c5a46d', '#d1b685', '#dec79d', '#ead8b6', '#f3e6cd'],
  error: ['#8c2b2f', '#a94a4e', '#c2686b', '#d68586', '#e7a3a3'],
  info: ['#2970FF', '#5B8CFF', '#7BA0FF', '#9BB4FF', '#BED0FF'],
  gradient: [
    '#2970FF',
    '#5B8CFF',
    '#7BA0FF',
    '#9BB4FF',
    '#BED0FF',
    '#E5EDFF',
  ],
}

// Animation configurations
export const animations = {
  duration: {
    short: 200,
    medium: 300,
    long: 500,
  },
  easing: {
    easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
    easeOut: 'cubic-bezier(0.0, 0, 0.2, 1)',
    easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
    sharp: 'cubic-bezier(0.4, 0, 0.6, 1)',
  },
}

