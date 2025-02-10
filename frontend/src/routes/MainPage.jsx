import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Stack, Button, Typography, useTheme } from "@mui/material";
import { useTranslation } from "react-i18next"; // Import useTranslation hook
import NavBar from "../components/NavBar.jsx";
import { UserContext } from "../contexts/UserProvider.jsx"; // Import UserContext

function MainPage({ toggleTheme, currentMode }) {
    const { t } = useTranslation(); // Access the translation function
    const navigate = useNavigate();
    const theme = useTheme(); // Access the theme

    const { user } = useContext(UserContext); // Access user data from context
    const userName = user?.username ? `@${user.username}` : "@Guest"; // Add "@" before username

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
                buttons={[t("contact"), t("profile"), t("signOut")]} // Use translations for Navbar buttons
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
                    paddingTop: { xs: 25, sm: 25, md: 25 }, // Responsive spacing below the navbar
                    px: { xs: 2, md: 5 }, // Responsive horizontal padding
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
                    {t("welcomeUser", { user: userName })} {/* Dynamic welcome message */}
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
                        {t("getMyWrap")}
                    </Button>
                </Stack>
            </Box>
        </Box>
    );
}

export default MainPage;