import React, { useContext, useEffect, useState } from "react";
import {
  Stack,
  Button,
  Box,
  Typography,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  CircularProgress,
  CardContent,
  CardActions,
  Card,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { getCookie } from "../csrf/csrf.jsx";
import axios from "axios";
import { UserContext } from "../contexts/UserProvider.jsx";
import NavBar from "../components/NavBar.jsx";
import { ThemeProvider, useTheme } from "@mui/material/styles";

const ProfilePage = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { user, userDataLoading } = useContext(UserContext);
  const [deleteAccountPromptVisible, setDeleteAccountPromptVisible] = useState(false);
  const [deleteWrapPromptVisible, setDeleteWrapPromptVisible] = useState(false);
  const [savedWraps, setSavedWraps] = useState([]);
  const [loadingWraps, setLoadingWraps] = useState(false);
  const [deleteWrapId, setDeleteWrapId] = useState(null);

  const toggleDeleteAccountPrompt = () => {
    setDeleteAccountPromptVisible(!deleteAccountPromptVisible);
  };

  const toggleDeleteWrapPrompt = (wrapId = null) => {
    setDeleteWrapId(wrapId);
    setDeleteWrapPromptVisible(!deleteWrapPromptVisible);
  };

  const handleDeleteAccount = () => {
    axios.delete('/api/user/delete-account/', {
        headers: {
            'X-CSRFToken': getCookie('csrftoken'),
        },
        withCredentials: true,
    })
    .then(() => navigate('/login'))
    .catch((ex) => {
        console.error('Account deletion failed: ', ex.response?.data || ex.message);
        window.alert('An error has occurred in deleting your account. Check console for more information.');
        toggleDeleteAccountPrompt();
    });
  };

  return (
    <ThemeProvider theme={theme}>
      <Box
        sx={{
          minHeight: "100vh",
          backgroundColor: theme.palette.background.default,
          paddingBottom: 4,
        }}
      >
        {/* Navigation */}
        <NavBar buttons={["home", "signOut"]} />

        <Box
          sx={{
            maxWidth: "1200px",
            margin: "0 auto",
            padding: 4,
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            gap: 4,
          }}
        >
          {/* Sidebar */}
          <Stack
            spacing={4}
            sx={{
              flex: "1 1 auto",
              alignItems: "center",
              backgroundColor: theme.palette.background.paper,
              borderRadius: 2,
              padding: 4,
              boxShadow: theme.shadows[2],
              transition: "transform 0.3s ease, box-shadow 0.3s ease",
              "&:hover": { transform: "scale(1.02)", boxShadow: theme.shadows[4] },
            }}
          >
            <Typography variant="h5" sx={{ textAlign: "center", fontWeight: "bold" }}>
              @{user.username}
            </Typography>
            <Typography variant="subtitle1" color="textSecondary" sx={{ textAlign: "center" }}>
              {user.email}
            </Typography>
            <Button
              fullWidth
              variant="contained"
              color="error"
              sx={{
                borderRadius: 20,
                textTransform: "none",
                fontWeight: "bold",
                transition: "transform 0.2s ease",
                "&:hover": { transform: "scale(1.05)" },
              }}
              onClick={toggleDeleteAccountPrompt}
            >
              Delete Account
            </Button>
          </Stack>
        </Box>
      </Box>

      {/* Dialogs */}
      {/* Delete Account Dialog */}
      <Dialog open={deleteAccountPromptVisible} onClose={toggleDeleteAccountPrompt}>
        <DialogTitle>Delete Account</DialogTitle>
        <DialogContent>
          <DialogContentText>Are you sure you want to delete your account? This action cannot be undone.</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={toggleDeleteAccountPrompt}>Cancel</Button>
          <Button onClick={handleDeleteAccount} color="error">
            Confirm
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Wrap Dialog */}
      <Dialog open={deleteWrapPromptVisible} onClose={toggleDeleteWrapPrompt}>
        <DialogTitle>Delete Wrap</DialogTitle>
        <DialogContent>
          <DialogContentText>Are you sure you want to delete this wrap? This action cannot be undone.</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => toggleDeleteWrapPrompt()}>Cancel</Button>
          <Button onClick={handleDeleteWrap} color="error">
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </ThemeProvider>
  );
};

export default ProfilePage;