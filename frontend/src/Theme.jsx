import { createTheme } from '@mui/material/styles';

const getTheme = (mode) => createTheme({
    palette: {
        mode,
        ...(mode === 'dark'
            ? {
                  background: {
                      default: '#000000', // Pure black for the background
                      paper: '#1A1A1A', // Slightly lighter black for paper
                  },
                  text: {
                      primary: '#FFFFFF', // Pure white for text
                      secondary: '#BBBBBB', // Light gray for secondary text
                  },
                  primary: {
                      main: '#FFFFFF', // White as the primary accent
                      contrastText: '#000000', // Black text on white
                  },
              }
            : {
                  background: {
                      default: '#FFFFFF', // Pure white for the background
                      paper: '#F7F7F7', // Off-white for paper
                  },
                  text: {
                      primary: '#000000', // Pure black for text
                      secondary: '#555555', // Dark gray for secondary text
                  },
                  primary: {
                      main: '#000000', // Black as the primary accent
                      contrastText: '#FFFFFF', // White text on black
                  },
              }),
    },
    typography: {
        fontFamily: '"Poppins", "Roboto", "Arial", sans-serif',
        h1: {
            fontWeight: 700,
            fontSize: '2.5rem',
        },
        h2: {
            fontWeight: 600,
            fontSize: '2rem',
        },
        body1: {
            fontSize: '1rem',
            lineHeight: 1.5,
        },
        body2: {
            fontSize: '0.875rem',
            lineHeight: 1.43,
        },
    },
    components: {
        MuiCssBaseline: {
            styleOverrides: {
                body: {
                    backgroundImage: mode === 'dark'
                        ? 'linear-gradient(180deg, #000000, #1A1A1A)'
                        : 'linear-gradient(180deg, #FFFFFF, #F7F7F7)',
                    backgroundRepeat: 'no-repeat',
                    backgroundSize: 'cover',
                    transition: 'background-color 0.3s ease',
                },
            },
        },
        MuiButton: {
            styleOverrides: {
                root: {
                    borderRadius: '12px',
                    textTransform: 'none',
                    fontWeight: 500,
                },
                contained: {
                    backgroundColor: mode === 'dark' ? '#FFFFFF' : '#000000',
                    color: mode === 'dark' ? '#000000' : '#FFFFFF',
                    '&:hover': {
                        backgroundColor: mode === 'dark' ? '#E0E0E0' : '#1A1A1A',
                    },
                },
                outlined: {
                    borderColor: mode === 'dark' ? '#FFFFFF' : '#000000',
                    color: mode === 'dark' ? '#FFFFFF' : '#000000',
                    '&:hover': {
                        backgroundColor: mode === 'dark' ? '#1A1A1A' : '#E0E0E0',
                        color: mode === 'dark' ? '#FFFFFF' : '#000000',
                    },
                },
            },
        },
        MuiOutlinedInput: {
            styleOverrides: {
                root: {
                    borderRadius: '10px',
                    '& .MuiOutlinedInput-notchedOutline': {
                        borderColor: mode === 'dark' ? '#FFFFFF' : '#000000',
                    },
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                        borderColor: mode === 'dark' ? '#E0E0E0' : '#333333',
                    },
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                        borderColor: mode === 'dark' ? '#FFFFFF' : '#000000',
                    },
                },
                input: {
                    color: mode === 'dark' ? '#FFFFFF' : '#000000',
                },
            },
        },
        MuiInputLabel: {
            styleOverrides: {
                root: {
                    color: mode === 'dark' ? '#FFFFFF' : '#000000',
                    '&.Mui-focused': {
                        color: mode === 'dark' ? '#FFFFFF' : '#000000',
                    },
                },
            },
        },
        MuiCard: {
            styleOverrides: {
                root: {
                    backgroundColor: mode === 'dark' ? '#1A1A1A' : '#FFFFFF',
                    color: mode === 'dark' ? '#FFFFFF' : '#000000',
                    boxShadow: mode === 'dark'
                        ? '0px 4px 10px rgba(255, 255, 255, 0.2)'
                        : '0px 4px 10px rgba(0, 0, 0, 0.1)',
                    borderRadius: '12px',
                },
            },
        },
    },
});

export default getTheme;