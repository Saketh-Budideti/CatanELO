import React, { useState, useContext } from "react";
import {
  AppBar,
  Toolbar,
  Button,
  IconButton,
  Box,
  useMediaQuery,
  CircularProgress,
  Drawer,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import Logo from "./Logo.jsx";
import { useTheme } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { UserContext } from "../contexts/UserProvider.jsx";
import axios from "axios";
import {getCookie} from "../csrf/csrf.jsx";

function Navbar({ buttons }) {
  const { user, userDataLoading } = useContext(UserContext);
  const profileImg = user?.profile_img || "/path-to-default-avatar.jpg";

  const isMobile = useMediaQuery("(max-width:600px)");
  const theme = useTheme();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const [drawerOpen, setDrawerOpen] = useState(false);

  const navigateProfile = () => {
    navigate("/profile");
    setDrawerOpen(false);
  };

  const navigateHome = () => {
    navigate("/main");
    setDrawerOpen(false);
  };

  const navigateSignOut = async () => {
    try {
      const response = await axios.post("/api/user/logout/", {}, {
        withCredentials: true,
        headers: {
          'X-CSRFToken': getCookie('csrftoken')
        },
      });

      if (response.status === 200) {
        navigate("/login");
      } else {
        console.error("Failed to log out");
      }
    } catch (error) {
      console.error("Failed to log out", error);
    }
  };

  const navigateContact = () => {
    navigate("/contact");
    setDrawerOpen(false);
  };

  const translatedButtons = [
    t("home") || "Home",
    t("contact") || "Contact",
    t("profile") || "Profile",
    t("signOut") || "Sign Out",
  ];

  return (
    <AppBar
      position="static"
      sx={{
        backgroundColor: theme.palette.background.paper,
        color: theme.palette.text.primary,
        padding: isMobile ? "8px 16px" : "8px 98px",
        boxShadow: "none",
        borderBottom: `1px solid ${theme.palette.divider}`,
        zIndex: 1201, // Ensure it stays above other elements
      }}
    >
      <Toolbar>
        <Logo fontSize={isMobile ? "20px" : "30px"} />

        {isMobile ? (
          <>
            <IconButton
              edge="end"
              onClick={() => setDrawerOpen(true)}
              aria-label="menu"
              sx={{ color: theme.palette.text.primary }}
            >
              <MenuIcon />
            </IconButton>

            <Drawer
              anchor="right"
              open={drawerOpen}
              onClose={() => setDrawerOpen(false)}
              sx={{
                "& .MuiDrawer-paper": {
                  backgroundColor: theme.palette.background.default,
                  color: theme.palette.text.primary,
                  display: "flex",
                  justifyContent: "center", // Center items vertically
                  alignItems: "center", // Center items horizontally
                },
              }}
            >
              <Box sx={{ width: 250 }} role="presentation">
                <List>
                  <ListItem button onClick={navigateHome}>
                    <ListItemText primary={translatedButtons[0]} />
                  </ListItem>
                  <ListItem button onClick={navigateContact}>
                    <ListItemText primary={translatedButtons[1]} />
                  </ListItem>
                  <ListItem
                    button
                    onClick={userDataLoading ? null : navigateProfile}
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                    }}
                  >
                    {userDataLoading ? (
                      <CircularProgress size={24} sx={{ color: theme.palette.text.primary }} />
                    ) : (
                      <img
                        src={profileImg}
                        alt="Profile"
                        style={{
                          width: 40,
                          height: 40,
                          borderRadius: "50%",
                          border: `2px solid ${theme.palette.divider}`,
                        }}
                      />
                    )}
                    <ListItemText primary={translatedButtons[2]} />
                  </ListItem>
                  <ListItem
                    button
                    sx={{
                      backgroundColor: theme.palette.primary.main,
                      color: theme.palette.primary.contrastText,
                      borderRadius: "10px",
                      textAlign: "center",
                      mt: 1,
                    }}
                    onClick={navigateSignOut}
                  >
                    <ListItemText primary={translatedButtons[3]} />
                  </ListItem>
                </List>
              </Box>
            </Drawer>
          </>
        ) : (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center", // Center align buttons horizontally
              alignItems: "center",
              flexGrow: 1, // Push buttons to the center
              gap: 5, // Add spacing between buttons
              marginRight: "130px",
            }}
          >
            <Button onClick={navigateHome} sx={{ color: theme.palette.text.primary }}>
              {translatedButtons[0]}
            </Button>
            <Button onClick={navigateContact} sx={{ color: theme.palette.text.primary }}>
              {translatedButtons[1]}
            </Button>
            {userDataLoading ? (
              <CircularProgress sx={{ color: theme.palette.text.primary }} />
            ) : (
              <Button
                onClick={navigateProfile}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  padding: 0,
                }}
              >
                <img
                  src={profileImg}
                  alt="Profile"
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: "50%",
                    border: `2px solid ${theme.palette.divider}`,
                  }}
                />
              </Button>
            )}
            <Button
              onClick={navigateSignOut}
              sx={{
                backgroundColor: theme.palette.primary.main,
                color: theme.palette.primary.contrastText,
                borderRadius: "90px",
                fontWeight: 900,
                padding: "5px 20px",
              }}
            >
              {translatedButtons[3]}
            </Button>
          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
}

export default Navbar;