import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Stack, Button, Typography, useTheme } from "@mui/material";
import NavBar from "../components/NavBar.jsx";
import { UserContext } from "../contexts/UserProvider.jsx";

function MainPage({ toggleTheme, currentMode }) {
    const navigate = useNavigate();
    const theme = useTheme();

    const { user } = useContext(UserContext);
    const userName = user?.username ? `@${user.username}` : "@Guest";

    const navigatemyWrap = () => {
        navigate("/wrapper");
    };

    return (
        <Box
            sx={{
                bgcolor: theme.palette.background.default,
                color: theme.palette.text.primary,
                minHeight: "100vh",
                display: "flex",
                flexDirection: "column",
            }}
        >
            {/* Navbar at the top */}
            <NavBar
                buttons={["Profile", "Sign Out"]}
                toggleTheme={toggleTheme}
                currentMode={currentMode}
            />

            {/* Content area below Navbar */}
            <Box
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "flex-start",
                    alignItems: "center",
                    flex: 1,
                    paddingTop: { xs: 25, sm: 25, md: 25 },
                    px: { xs: 2, md: 5 },
                }}
            >
                {/* Title */}
                <Typography
                    variant="h1"
                    sx={{
                        fontFamily: '"League Spartan", sans-serif',
                        fontWeight: 900,
                        fontSize: {
                            xs: "2rem",
                            sm: "3rem",
                            md: "4rem",
                            lg: "5rem",
                        },
                        textAlign: "center",
                        marginBottom: { xs: 4, sm: 5, md: 6 },
                        transition: "transform 0.3s ease",
                        "&:hover": {
                            transform: "scale(1.1)",
                        },
                    }}
                >
                    Welcome {userName}!
                </Typography>

                {/* Button */}
                <Stack
                    spacing={4}
                    sx={{
                        width: "100%",
                        alignItems: "center",
                    }}
                >
                    <Button
                        onClick={navigatemyWrap}
                        sx={{
                            width: "100%",
                            maxWidth: "300px",
                            background: theme.palette.primary.main,
                            color: theme.palette.primary.contrastText,
                            fontWeight: 900,
                            borderRadius: "90px",
                            textTransform: "none",
                            padding: { xs: 1, sm: 1.5, md: 2 },
                            fontSize: {
                                xs: "0.875rem",
                                sm: "1rem",
                                md: "1.25rem",
                            },
                            transition: "transform 0.3s ease",
                            "&:hover": {
                                transform: "scale(1.1)",
                                background: theme.palette.primary.dark,
                            },
                        }}
                    >
                        Get My Wrap
                    </Button>
                </Stack>
            </Box>
        </Box>
    );
}

export default MainPage;