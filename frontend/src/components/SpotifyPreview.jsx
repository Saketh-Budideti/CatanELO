import { Box, Stack, ThemeProvider, useTheme, Typography } from "@mui/material";
import defaultPfp from '../assets/default_pfp.jpeg';

function SpotifyPreview({ display_name, spotify_profile_url, profile_img = defaultPfp }) {
    const theme = useTheme(); // Use the theme context
    const handleSpotifyRedirect = () => window.open(spotify_profile_url, '_blank');

    return display_name && spotify_profile_url && (
        <ThemeProvider theme={theme}>
            <Stack
                direction='row'
                spacing={2}
                alignItems="center" // Ensures avatar and text are vertically aligned
                sx={{
                    height: '60px',
                    width: 'fit-content',
                    borderRadius: '30px',
                    paddingRight: '30px',
                    cursor: 'pointer',
                    backgroundColor: theme.palette.mode === 'dark'
                        ? theme.palette.background.paper // Background color for dark mode
                        : theme.palette.primary.main,    // Background color for light mode
                    color: theme.palette.mode === 'dark'
                        ? theme.palette.text.primary     // Text color for dark mode
                        : theme.palette.primary.contrastText, // Text color for light mode
                    boxShadow: `0 4px 10px ${theme.palette.action.disabledBackground}`, // Subtle shadow
                    transition: 'all 0.3s ease', // Smooth hover transition
                    '&:hover': {
                        backgroundColor: theme.palette.mode === 'dark'
                            ? theme.palette.primary.dark
                            : theme.palette.primary.light,
                        boxShadow: `0 8px 15px ${theme.palette.action.hover}`, // Hover shadow
                    },
                }}
                onClick={handleSpotifyRedirect}
            >
                <img 
                    src={profile_img} 
                    alt={`${display_name}'s profile`} 
                    style={{
                        height: '100%',
                        borderRadius: '50%',
                        border: `2px solid ${theme.palette.primary.main}`, // Border matching the theme
                    }}
                />
                <Box>
                    <Typography
                        variant="body1"
                        sx={{
                            margin: 0,
                            fontWeight: 'bold',
                            fontFamily: '"League Spartan", sans-serif',
                            textAlign: 'center',
                            color: 'inherit', // Inherit the color from the parent
                        }}
                    >
                        {display_name}
                    </Typography>
                </Box>
            </Stack>
        </ThemeProvider>
    );
}

export default SpotifyPreview;