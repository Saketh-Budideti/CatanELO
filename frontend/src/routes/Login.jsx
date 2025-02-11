import '../styles/Login.css';
import { Stack, useMediaQuery } from '@mui/material';
import Button from '@mui/material/Button';
import Logo from '../components/Logo.jsx';
import { useNavigate } from 'react-router-dom';
import Fade from '@mui/material/Fade';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useTheme } from '@mui/material/styles';

function Login() {
    const [showLogo, setShowLogo] = useState(false);
    const theme = useTheme(); // Access the current theme
    const isMobile = useMediaQuery(theme.breakpoints.down('sm')); // Detect mobile screens

    useEffect(() => {
        setShowLogo(true);
    }, []);

    const navigate = useNavigate();

    const handleSignIn = () => navigate('/signin');

    const handleCreateAccount = () => {
        navigate('/create-account');
    };

    return (
        <Stack
            sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100vh',
                gap: isMobile ? 2 : 3, // Adjust gap for mobile screens
                padding: isMobile ? 2 : 4, // Add padding for small screens
            }}
        >
            <Fade in={showLogo} timeout={4400}>
                <div>
                    <Logo fontSize={isMobile ? '60px' : '100px'} /> {/* Responsive logo size */}
                </div>
            </Fade>

            <Fade in={showLogo} timeout={3000}>
                <Button
                    sx={{
                        borderColor: theme.palette.primary.main,
                        color: theme.palette.primary.main,
                        width: isMobile ? '90%' : '500px', // Responsive width
                        borderRadius: '90px',
                        fontSize: isMobile ? '0.8rem' : '1rem', // Responsive font size
                        textTransform: 'none',
                        padding: isMobile ? '8px 16px' : '10px 20px', // Adjust padding for mobile
                        transition: 'transform 0.3s ease',
                        '&:hover': {
                            transform: 'scale(1.05)', // Scale on hover
                            backgroundColor: theme.palette.action.hover,
                        },
                    }}
                    variant="outlined"
                    onClick={handleSignIn}
                >
                    Sign In
                </Button>
            </Fade>

            <Fade in={showLogo} timeout={3000}>
                <Button
                    sx={{
                        borderColor: theme.palette.primary.main,
                        color: theme.palette.primary.main,
                        width: isMobile ? '90%' : '500px', // Responsive width
                        borderRadius: '90px',
                        fontSize: isMobile ? '0.8rem' : '1rem', // Responsive font size
                        textTransform: 'none',
                        padding: isMobile ? '8px 16px' : '10px 20px', // Adjust padding for mobile
                        transition: 'transform 0.3s ease',
                        '&:hover': {
                            transform: 'scale(1.05)', // Scale on hover
                            backgroundColor: theme.palette.action.hover,
                        },
                    }}
                    variant="outlined"
                    onClick={handleCreateAccount}
                >
                    Create Account
                </Button>
            </Fade>
        </Stack>
    );
}

export default Login;