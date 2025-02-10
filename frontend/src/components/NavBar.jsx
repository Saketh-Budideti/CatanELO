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
import { UserContext } from "../contexts/UserProvider.jsx";
import axios from "axios";
import {getCookie} from "../csrf/csrf.jsx";

function Navbar({ buttons }) {
  const { user, userDataLoading } = useContext(UserContext);
  const profileImg = user?.profile_img || "/path-to-default-avatar.jpg";

  const isMobile = useMediaQuery("(max-width:600px)");
  const theme = useTheme();
  const navigate = useNavigate();

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

  const navButtons = [
    "Home",
    "Profile", 
    "Sign Out"
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
        zIndex: 1201,
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
                  justifyContent: "center",
                  alignItems: "center",
                },
              }}
            >
              <Box sx={{ width: 250 }} role="presentation">
                <List>
                  <ListItem button onClick={navigateHome}>
                    <ListItemText primary={navButtons[0]} />
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
                    <ListItemText primary={navButtons[1]} />
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
                    <ListItemText primary={navButtons[2]} />
                  </ListItem>
                </List>
              </Box>
            </Drawer>
          </>
        ) : (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              flexGrow: 1,
              gap: 5,
              marginRight: "130px",
            }}
          >
            <Button onClick={navigateHome} sx={{ color: theme.palette.text.primary }}>
              {navButtons[0]}
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
              {navButtons[2]}
            </Button>
          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
}

export default Navbar;