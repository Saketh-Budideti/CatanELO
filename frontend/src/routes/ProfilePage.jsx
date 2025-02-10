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
  MenuItem,
  Select,
  CardContent,
  CardActions,
  Card,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { getCookie } from "../csrf/csrf.jsx";
import axios from "axios";
import { UserContext } from "../contexts/UserProvider.jsx";
import NavBar from "../components/NavBar.jsx";
import SpotifyPreview from "../components/SpotifyPreview.jsx";
import { ThemeProvider, useTheme } from "@mui/material/styles";
import { useTranslation } from "react-i18next";
import { useLanguage } from "../contexts/LanguageProvider.jsx";

const ProfilePage = () => {
  const { t } = useTranslation();
  const theme = useTheme();
  const navigate = useNavigate();
  const { user, userDataLoading, setHoliday } = useContext(UserContext);
  const { currentLanguage } = useLanguage();
  const [deleteAccountPromptVisible, setDeleteAccountPromptVisible] = useState(false);
  const [deleteWrapPromptVisible, setDeleteWrapPromptVisible] = useState(false);
  const [savedWraps, setSavedWraps] = useState([]);
  const [loadingWraps, setLoadingWraps] = useState(false);
  const [deleteWrapId, setDeleteWrapId] = useState(null);
  const [holidayDialogVisible, setHolidayDialogVisible] = useState(false);
  const [selectedHoliday, setSelectedHoliday] = useState("");
  const [summary, setSummary] = useState("");
  const [loadingSummary, setLoadingSummary] = useState(true);

  const holidays = ["Default", "Halloween", "Christmas"];

  const toggleDeleteAccountPrompt = () => {
    setDeleteAccountPromptVisible(!deleteAccountPromptVisible);
  };

  const toggleDeleteWrapPrompt = (wrapId = null) => {
    setDeleteWrapId(wrapId);
    setDeleteWrapPromptVisible(!deleteWrapPromptVisible);
  };



  useEffect(() => {
    const fetchSavedWraps = async () => {
      setLoadingWraps(true);
      try {
        const response = await axios.get("/api/user/get-saved-wraps/", {
          params: { spotify_id: user.spotify_id },
          headers: { "X-CSRFToken": getCookie("csrftoken") },
          withCredentials: true,
        });
        setSavedWraps(response.data || []);
      } catch (error) {
        console.error("Error fetching saved wraps:", error);
      } finally {
        setLoadingWraps(false);
      }
    };
    if (user.spotify_id) fetchSavedWraps();
  }, [user.spotify_id]);

  useEffect(() => {
    const fetchSummary = async () => {
      setLoadingSummary(true);
      try {
        const response = await axios.get("/api/wrap/summary", {
          params: { spotify_id: user.spotify_id, cur_language: currentLanguage },
          withCredentials: true,
        });
        setSummary(response.data || t("noSummary"));
      } catch (error) {
        console.error("Error fetching summary:", error);
        setSummary(t("errorFetchingSummary"));
      } finally {
        setLoadingSummary(false);
      }
    };
    if (user.spotify_id) fetchSummary();
  }, [user.spotify_id, currentLanguage]);

  const handleSelectHoliday = () => {
        setHoliday(selectedHoliday);
        setHolidayDialogVisible(false);
        window.alert(`Holiday selected: ${selectedHoliday}`);
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

  const handleDeleteWrap = async () => {
      try {
          await axios.delete('/api/user/delete-wrap/', {
              params: {
                  spotify_id: user.spotify_id,
                  wrap_id: deleteWrapId
                },
              headers: {
                  'X-CSRFToken': getCookie('csrftoken'),
                },
              withCredentials: true,
          });

            // Remove the deleted wrap from the state
          setSavedWraps(prevWraps =>
              prevWraps.filter(wrap => wrap.id !== deleteWrapId)
          );

            // Close the delete prompt
          toggleDeleteWrapPrompt();
    } catch (error) {
          console.error('Error deleting wrap:', error.response?.data || error.message);
          window.alert('Failed to delete wrap. Please try again.');
        }
  };

    useEffect(() => {
          const fetchSavedWraps = async () => {
              setLoadingWraps(true);
              try {
                  const response = await axios.get('/api/user/get-saved-wraps/', {
                      params: { spotify_id: user.spotify_id },
                      withCredentials: true,
                      headers: {
                          'X-CSRFToken': getCookie('csrftoken'),
                      },
                  });

                  setSavedWraps(response.data || []);

              } catch (error) {
                  console.error('Error fetching saved wraps:', error.response?.data || error.message);
              } finally {
                  setLoadingWraps(false);
              }
          };
          fetchSavedWraps();
      }, [user.spotify_id]);

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
        <NavBar buttons={[t("home"), t("contact"), t("signOut")]} />

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
            <SpotifyPreview {...user} />
            <Typography variant="h5" sx={{ textAlign: "center", fontWeight: "bold" }}>
              @{user.username}
            </Typography>
            <Typography variant="subtitle1" color="textSecondary" sx={{ textAlign: "center" }}>
              {user.email}
            </Typography>
            <Button
              fullWidth
              variant="contained"
              color="primary"
              sx={{
                borderRadius: 20,
                textTransform: "none",
                fontWeight: "bold",
                transition: "transform 0.2s ease",
                "&:hover": { transform: "scale(1.05)" },
              }}
              onClick={() => setHolidayDialogVisible(true)}
            >
              {t("selectHolidayWrapper")}
            </Button>
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
              {t("deleteAccount")}
            </Button>
          </Stack>

          {/* Main Content */}
          <Box sx={{ flex: "3 1 auto", display: "flex", flexDirection: "column", gap: 4 }}>
            {/* Saved Wraps */}
            <Box
              sx={{
                backgroundColor: theme.palette.background.paper,
                borderRadius: 2,
                padding: 4,
                boxShadow: theme.shadows[2],
                transition: "transform 0.3s ease, box-shadow 0.3s ease",
                "&:hover": { transform: "scale(1.02)", boxShadow: theme.shadows[4] },
              }}
            >
              <Typography variant="h6" sx={{ marginBottom: 2 }}>
                {t("myWraps")}
              </Typography>
              {loadingWraps ? (
                <CircularProgress />
              ) : savedWraps.length > 0 ? (
                savedWraps.map((wrap) => (
                  <Card
                    key={wrap.id}
                    sx={{
                      marginBottom: 2,
                      boxShadow: theme.shadows[1],
                      transition: "transform 0.3s ease, box-shadow 0.3s ease",
                      "&:hover": { transform: "scale(1.03)", boxShadow: theme.shadows[4] },
                    }}
                  >
                    <CardContent>
                      <Typography variant="body1">{t("wrapTitle", { id: wrap.id })}</Typography>
                      <Typography variant="body2" color="textSecondary">
                        {t("dateCreated", {
                          date: new Date(wrap.created_at).toLocaleDateString(currentLanguage, {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          }),
                        })}
                      </Typography>
                    </CardContent>
                    <CardActions sx={{ justifyContent: "space-between" }}>
                      <Button
                        size="small"
                        href={wrap.pdf_file_url}
                        target="_blank"
                        sx={{
                          transition: "transform 0.2s ease",
                          "&:hover": { transform: "scale(1.1)" },
                        }}
                      >
                        {t("openWrap")}
                      </Button>
                      <Button
                        size="small"
                        color="error"
                        onClick={() => toggleDeleteWrapPrompt(wrap.id)}
                        sx={{
                          transition: "transform 0.2s ease",
                          "&:hover": { transform: "scale(1.1)" },
                        }}
                      >
                        {t("deleteWrap")}
                      </Button>
                    </CardActions>
                  </Card>
                ))
              ) : (
                <Typography>{t("noWraps")}</Typography>
              )}
            </Box>

            {/* Summary Section */}
            <Box
              sx={{
                backgroundColor: theme.palette.background.paper,
                borderRadius: 2,
                padding: 4,
                boxShadow: theme.shadows[2],
                transition: "transform 0.3s ease, box-shadow 0.3s ease",
                "&:hover": { transform: "scale(1.02)", boxShadow: theme.shadows[4] },
              }}
            >
              <Typography variant="h6" sx={{ marginBottom: 2 }}>
                {t("describingYou")}
              </Typography>
              {loadingSummary ? <CircularProgress /> : <Typography>{summary}</Typography>}
            </Box>
          </Box>
        </Box>
      </Box>

      {/* Dialogs */}
      {/* Holiday Dialog */}
      <Dialog open={holidayDialogVisible} onClose={() => setHolidayDialogVisible(false)}>
        <DialogTitle>{t("selectHolidayWrapper")}</DialogTitle>
        <DialogContent>
          <Select
            value={selectedHoliday}
            onChange={(e) => setSelectedHoliday(e.target.value)}
            fullWidth
          >
            {holidays.map((holiday) => (
              <MenuItem key={holiday} value={holiday}>
                {holiday}
              </MenuItem>
            ))}
          </Select>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setHolidayDialogVisible(false)}>{t("cancel")}</Button>
          <Button onClick={handleSelectHoliday} disabled={!selectedHoliday}>
            {t("apply")}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Account Dialog */}
      <Dialog open={deleteAccountPromptVisible} onClose={toggleDeleteAccountPrompt}>
        <DialogTitle>{t("deleteAccount")}</DialogTitle>
        <DialogContent>
          <DialogContentText>{t("deleteAccountPrompt")}</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={toggleDeleteAccountPrompt}>{t("cancel")}</Button>
          <Button onClick={handleDeleteAccount} color="error">
            {t("confirm")}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Wrap Dialog */}
      <Dialog open={deleteWrapPromptVisible} onClose={toggleDeleteWrapPrompt}>
        <DialogTitle>{t("deleteWrap")}</DialogTitle>
        <DialogContent>
          <DialogContentText>{t("deleteWrapPrompt")}</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => toggleDeleteWrapPrompt()}>{t("cancel")}</Button>
          <Button onClick={handleDeleteWrap} color="error">
            {t("confirm")}
          </Button>
        </DialogActions>
      </Dialog>
    </ThemeProvider>
  );
};

export default ProfilePage;