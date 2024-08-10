'use client'
import { createTheme } from '@mui/material/styles';

const theme = createTheme({
    typography: {
      fontFamily: '"Urbanist", sans-serif',
      h2: {
        fontFamily: '"Urbanist", sans-serif',
        fontWeight: 700,
        letterSpacing: '16px',
        color: '#f4f6f3', // Default font color
      },
      h4: {
        fontFamily: '"Urbanist", sans-serif',
        fontWeight: 700,
        letterSpacing: '16px',
        color: '#f4f6f3', // Default font color
      },
    },
    palette: {
      ochre: {
        main: '#ff6404',
        light: '#f4f6f3',
        dark: '#080404',
        contrastText: '#f4f6f3',
      },
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            backgroundColor: '#f4f6f3', // Default background color
            color: '#080404', // Default font color
            '&:hover': {
              backgroundColor: '#080404', // Background color on hover
              color: '#f4f6f3', // Font color on hover
            },
          },
        },
      },
    },
  });

  export default theme;