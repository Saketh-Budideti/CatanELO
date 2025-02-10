import React, { useState } from 'react';
import {
    Box,
    Button,
    MenuItem,
    Select,
    Stack,
    TextField,
    Typography,
    useTheme
} from "@mui/material";
import { useTranslation } from "react-i18next";
import NavBar from '../components/NavBar.jsx';
import developerImage1 from '../assets/Developer1.jpeg';
import developerImage2 from '../assets/Developer2.jpeg';
import developerImage3 from '../assets/Developer3.jpeg';
import developerImage4 from '../assets/Developer4.jpeg';
import developerImage5 from '../assets/Developer5.jpeg';

const ContactPage = () => {
    const theme = useTheme();
    const { t } = useTranslation();
    const [selectedEmail, setSelectedEmail] = useState('');
    const [feedback, setFeedback] = useState('');

    const developerEmails = [
        { name: "@alberto.", role: t("backendDeveloper"), email: "alberticoalvarez123@gmail.com", linkedIn: "https://www.linkedin.com/in/albertoalvarez0926", img: developerImage1 },
        { name: "@boris.", role: t("frontendDeveloper"), email: "boriskodappully@gmail.com", linkedIn: "https://www.linkedin.com/in/boris-kodappully-78687a164", img: developerImage2 },
        { name: "@david.", role: t("frontendDeveloper"), email: "carlosrescoto04@gmail.com", linkedIn: "https://www.linkedin.com/in/daevidvera", img: developerImage3 },
        { name: "@devanshi.", role: t("frontendDeveloper"), email: "sooddevanshi@gmail.com", linkedIn: "https://www.linkedin.com/in/devanshi-sood/", img: developerImage4 },
        { name: "@saketh.", role: t("backendDeveloper"), email: "saketh.budideti@gmail.com", linkedIn: "https://www.linkedin.com/in/sbudideti", img: developerImage5 }
    ];

    const handleEmailSelect = (event) => setSelectedEmail(event.target.value);

    const handleFeedbackChange = (event) => setFeedback(event.target.value);

    const handleSubmitFeedback = () => {
        if (selectedEmail && feedback) {
            const subject = encodeURIComponent('Feedback on Your Profile');
            const body = encodeURIComponent(feedback);
            const mailtoLink = `mailto:${selectedEmail}?subject=${subject}&body=${body}`;
            window.location.href = mailtoLink;
            alert(t("feedbackSubmitted", { feedback }));
            setFeedback('');
        } else {
            alert("Please select a developer and provide feedback.");
        }
    };

    return (
        <Box
            sx={{
                bgcolor: theme.palette.background.default,
                color: theme.palette.text.primary,
                minHeight: "100vh",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "flex-start",
                gap: 4,
                paddingBottom: 6
            }}
        >
            {/* Navbar */}
            <NavBar buttons={[t("home"), t("profile"), t("signOut")]} />

            {/* Meet the Team Section */}
            <Box
                sx={{
                    textAlign: "center",
                    width: "100%",
                    maxWidth: "1200px",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    padding: 3
                }}
            >
                <Typography
                    variant="h4"
                    sx={{
                        fontSize: { xs: "1.75rem", md: "2.5rem" },
                        fontWeight: 800,
                        marginBottom: 3,
                        fontFamily: '"League Spartan", sans-serif',
                    }}
                >
                    {t("meetTheTeam")}
                </Typography>
                <Stack
                    direction={{ xs: "column", sm: "row" }} // Stack vertically on small screens
                    spacing={4}
                    sx={{
                        justifyContent: "center",
                        flexWrap: "wrap",
                        gap: { xs: 3, md: 5 },
                    }}
                >
                    {developerEmails.map(dev => (
                        <Box
                            key={dev.email}
                            onClick={() => dev.linkedIn && window.open(dev.linkedIn, '_blank')}
                            sx={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                cursor: 'pointer',
                                transition: 'transform 0.3s ease',
                                '&:hover': {
                                    transform: 'scale(1.1)',
                                },
                            }}
                        >
                            <Box
                                component="img"
                                src={dev.img}
                                alt={dev.name}
                                sx={{
                                    width: { xs: 80, md: 100 },
                                    height: { xs: 80, md: 100 },
                                    borderRadius: "50%",
                                    marginBottom: 1,
                                }}
                            />
                            <Typography
                                sx={{
                                    fontSize: { xs: "1rem", md: "1.25rem" },
                                    fontWeight: 700,
                                    fontFamily: '"League Spartan", sans-serif',
                                }}
                            >
                                {dev.name}
                            </Typography>
                            <Typography
                                sx={{
                                    fontSize: { xs: "0.875rem", md: "1rem" },
                                    fontWeight: 500,
                                    color: theme.palette.text.secondary,
                                }}
                            >
                                {dev.role}
                            </Typography>
                        </Box>
                    ))}
                </Stack>
            </Box>

            {/* Feedback Section */}
            <Box
                sx={{
                    backgroundColor: theme.palette.primary.main,
                    color: theme.palette.primary.contrastText,
                    padding: { xs: 4, md: 6 },
                    borderRadius: 3,
                    width: "100%",
                    maxWidth: "500px",
                    textAlign: "center",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: 3,
                    boxShadow: 3,
                }}
            >
                <Typography
                    variant="h5"
                    sx={{
                        fontWeight: 700,
                        fontFamily: '"League Spartan", sans-serif',
                        fontSize: { xs: "1.5rem", md: "2rem" },
                    }}
                >
                    {t("contactDevelopers")}
                </Typography>
                <Select
                    value={selectedEmail}
                    onChange={handleEmailSelect}
                    displayEmpty
                    sx={{
                        width: "100%",
                        maxWidth: "300px",
                        '& .MuiOutlinedInput-notchedOutline': {
                            borderColor: theme.palette.primary.contrastText,
                        },
                        '&:hover .MuiOutlinedInput-notchedOutline': {
                            borderColor: theme.palette.primary.contrastText,
                        },
                        '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                            borderColor: theme.palette.primary.contrastText,
                        },
                        '& .MuiSelect-select': {
                            color: theme.palette.primary.contrastText,
                        },
                        '& .MuiInputBase-input': {
                            color: theme.palette.primary.contrastText,
                        },
                        '& .MuiSelect-icon': {
                            color: theme.palette.primary.contrastText,
                        },
                    }}
                    renderValue={(selected) => selected || t("selectDeveloperEmail")}
                >
                    {developerEmails.map(dev => (
                        <MenuItem key={dev.email} value={dev.email}>
                            {dev.name} - {dev.email}
                        </MenuItem>
                    ))}
                </Select>
                <TextField
                    placeholder={t("typeFeedback")}
                    value={feedback}
                    onChange={handleFeedbackChange}
                    multiline
                    rows={4}
                    sx={{
                        width: "100%",
                        maxWidth: "300px",
                        '& .MuiOutlinedInput-root': {
                            '& fieldset': {
                                borderColor: theme.palette.primary.contrastText,
                            },
                            '&:hover fieldset': {
                                borderColor: theme.palette.primary.contrastText,
                            },
                            '&.Mui-focused fieldset': {
                                borderColor: theme.palette.primary.contrastText,
                            },
                        },
                        '& .MuiInputBase-input': {
                            color: theme.palette.primary.contrastText,
                        },
                    }}
                />
                <Button
                    onClick={handleSubmitFeedback}
                    sx={{
                        backgroundColor: theme.palette.primary.contrastText,
                        color: theme.palette.primary.main,
                        fontWeight: 700,
                        fontFamily: '"League Spartan", sans-serif',
                        padding: "10px 20px",
                        borderRadius: "50px",
                        '&:hover': {
                            opacity: 0.9,
                        },
                    }}
                >
                    {t("submitFeedback")}
                </Button>
            </Box>
        </Box>
    );
};

export default ContactPage;