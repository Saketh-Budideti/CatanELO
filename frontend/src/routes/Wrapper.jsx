import React, { useRef, useState, useEffect, useContext } from "react";
import {
  Fab,
  Box,
  Typography,
  List,
  ListItem,
  ListItemText,
  useTheme,
  useMediaQuery,
  Paper,
  Button,
} from "@mui/material";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import SaveIcon from "@mui/icons-material/Save";
import ShareIcon from "@mui/icons-material/Share";
import AcUnitIcon from "@mui/icons-material/AcUnit"; // Christmas Icon
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../contexts/UserProvider.jsx";
import { useTranslation } from "react-i18next";
import {getCookie} from "../csrf/csrf.jsx";

const Wrapper = () => {
  const theme = useTheme();
  const wrapperRef = useRef();
  const navigate = useNavigate();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const { t } = useTranslation();
  const [currentSection, setCurrentSection] = useState(0);
  const [genres, setGenres] = useState([]);
  const [songs, setSongs] = useState([]);
  const [artists, setArtists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState("medium_term");
  const { user, holiday } = useContext(UserContext);

  const isDarkMode = theme.palette.mode === "dark";

  const holidayThemes = {
    Default: {

      textColor: isDarkMode ? "#ffffff" : "#000000", 
      buttonColor: isDarkMode ? "#000000" : "#ffffff", 
      backgroundColor: isDarkMode ? "#000000" : "#ffffff", 
      hoverBackgroundColor: isDarkMode ? "#ffffff" : "#000000", 
      hoverTextColor: isDarkMode ? "#000000" : "#ffffff", 

    },
    Halloween: {
      backgroundColor: isDarkMode ? "#1f1f1f" : "#fbe8c6",
      textColor: isDarkMode ? "#ffffff" : "#4a2f21",
      buttonColor: isDarkMode ? "#d35400" : "#f39c12",
      listTextColor: isDarkMode ? "#ffffff" : "#4a2f21",
      hoverBackgroundColor: isDarkMode ? "#f39c12" : "#d35400",
      hoverTextColor: isDarkMode ? "#1f1f1f" : "#ffffff",
    },
    Christmas: {
      backgroundColor: isDarkMode ? "#2b3e50" : "#e7f7e7",
      textColor: isDarkMode ? "#adebad" : "#2e523e",
      buttonColor: isDarkMode ? "#ff4d4d" : "#ff6b6b",
      listTextColor: isDarkMode ? "#ffffff" : "#2e523e",
      hoverBackgroundColor: isDarkMode ? "#adebad" : "#ff4d4d",
      hoverTextColor: isDarkMode ? "#2b3e50" : "#ffffff",
    },
  };

  const currentTheme = holidayThemes[holiday] || holidayThemes.Default;

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [songsRes, artistsRes, genresRes] = await Promise.all([
          axios.get("api/wrap/top-songs", {
            withCredentials: true,
            params: {
                spotify_id: user.spotify_id,
                time_range: timeRange,
            },
          }),
          axios.get("api/wrap/top-artists", {
            withCredentials: true,
            params: {
                spotify_id: user.spotify_id,
                time_range: timeRange,
            },
          }),
          axios.get("api/wrap/top-genres", {
            withCredentials: true,
            params: {
                spotify_id: user.spotify_id,
                time_range: timeRange,
            },
          }),
        ]);
        setSongs(songsRes.data || []);
        setArtists(artistsRes.data || []);
        setGenres(genresRes.data || []);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user.spotify_id, timeRange]);

  const scrollToSection = (direction) => {
    if (!wrapperRef.current) return;

    const sections = wrapperRef.current.querySelectorAll(".section");
    let nextSection = currentSection + (direction === "down" ? 1 : -1);

    if (direction === "down" && nextSection >= sections.length) {
      nextSection = 0;
    } else if (direction === "up" && nextSection < 0) {
      nextSection = sections.length - 1;
    }

    const section = sections[nextSection];
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
      setCurrentSection(nextSection);
    }
  };

  const goToProfile = () => {
    navigate("/profile");
  };

  const saveWrap = async () => {
      try {
        const wrapperData = {
          genres,
          artists,
          songs,
        };

        const response = await axios.post(
          "/api/user/save-wrap/",
          {
            wrapper_data: wrapperData,
            spotify_id: user.spotify_id,
          },
          {
            headers: {
              "X-CSRFToken": getCookie("csrftoken"),
            },
            withCredentials: true,
          }
        );

        if (response.status === 201) {
          alert("Spotify Wrapped saved successfully!");
        } else {
          console.error("Failed to save Wrapped:", response.data);
          alert("Failed to save Spotify Wrapped.");
        }
      } catch (error) {
        console.error("Error saving Wrapped:", error);
        alert("An error occurred while saving Spotify Wrapped.");
      }
    };

    const shareWrap = () => {
      const formattedText = `
My 2024 Wrapped!      

Top Genres:
${genres.map((genre, index) => `${index + 1}. ${genre}`).join("\n")}

Top Artists:
${artists.map((artist, index) => `${index + 1}. ${artist}`).join("\n")}

Top Songs:
${songs.map((song, index) => `${index + 1}. ${song.title} - ${song.artist}`).join("\n")}
`;

      const encodedText = encodeURIComponent(formattedText.trim());
      const xShareUrl = `https://twitter.com/intent/tweet?text=${encodedText}`;

      // Open X (Twitter) in a new tab to create a post
      window.open(xShareUrl, '_blank');
    };


  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          backgroundColor: currentTheme.backgroundColor,
          color: currentTheme.textColor,
        }}
      >
        <Typography variant="h4" sx={{ fontWeight: "bold" }}>
          {t("loading")}
        </Typography>
      </Box>
    );
  }

  return (
    <Box
      ref={wrapperRef}
      sx={{
        width: "100vw",
        height: "100%",
        overflowY: "auto",
        backgroundColor: currentTheme.backgroundColor,
        color: currentTheme.textColor,
      }}
    >
      {/* Back Button */}
      <Fab
        sx={{
          position: "fixed",
          top: isMobile ? "12px" : "24px",
          left: isMobile ? "12px" : "24px",
          zIndex: 999,
        backgroundColor: isDarkMode ? "#000000" : "#ffffff", // Black in dark mode, white in light mode
        color: isDarkMode ? "#ffffff" : "#000000", // White icon in dark mode, black icon in light mode
        "&:hover": {
          color: currentTheme.hoverTextColor,
          backgroundColor: currentTheme.hoverBackgroundColor,
        },
        }}
        onClick={goToProfile}
      >
        <ArrowBackIcon />
      </Fab>


     {/* Scroll Down Button */}
      {!isMobile && (
        <Fab
          sx={{
            position: "fixed",
            bottom: "24px",
            right: "24px",
            backgroundColor: isDarkMode ? "#000000" : "#ffffff", // Black in dark mode, white in light mode
            color: isDarkMode ? "#ffffff" : "#000000", // White icon in dark mode, black icon in light mode
            "&:hover": {
              color: currentTheme.hoverTextColor,
              backgroundColor: currentTheme.hoverBackgroundColor,
            },
          }}
          onClick={() => scrollToSection("down")}
        >
          <ArrowDownwardIcon />
        </Fab>
      )}

      {/* Sections */}
      {[
        { title: t("topGenres"), data: genres },
        { title: t("topArtists"), data: artists },
        { title: t("topSongs"), data: songs },
      ].map((section, idx) => (
        <Box
          className="section"
          key={idx}
          sx={{
            height: "100vh",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Typography variant="h3" sx={{ fontWeight: "bold", mb: 3 }}>
            {section.title}{" "}
            {holiday === "Halloween" && "🎃"}
            {holiday === "Christmas" && <AcUnitIcon />}
          </Typography>
          <Paper
            elevation={3}
            sx={{
              p: 4,
              width: "90%",
              maxWidth: "600px",
              backgroundColor: currentTheme.backgroundColor,
              "&:hover": {
                boxShadow: `0 8px 16px ${currentTheme.buttonColor}`,
              },
            }}
          >
            <List>
              {section.data.map((item, index) => (
                <ListItem
                      key={index}
                      sx={{
                        backgroundColor: "transparent", // Default background
                        transition: "background-color 0.3s, color 0.3s", // Smooth transition for hover
                        "&:hover": {
                          backgroundColor: isDarkMode ? "#333333" : "#f0f0f0", // Slightly darker background in dark mode, lighter background in light mode
                          color: isDarkMode ? "#ffffff" : "#000000", // High contrast text color
                          borderRadius: "8px", // Rounded corners on hover
                        },
                      }}
                    >
                <ListItemText
                  primary={`${index + 1}. ${
                    idx === 2 ? item.title : item
                  }`}
                  secondary={
                    idx === 2 ? `${t("artist")}: ${item.artist}` : null
                  }
                  primaryTypographyProps={{
                    fontSize: "1.5rem",
                    fontWeight: "bold",
                    color: currentTheme.textColor, // Default text color from theme
                  }}
                  secondaryTypographyProps={{
                    fontSize: "1.2rem",
                    color: currentTheme.textColor, // Default secondary text color from theme
                  }}
                />
              </ListItem>
              ))}
            </List>
          </Paper>
        </Box>
      ))}
      {/* Summary Section */}
      <Box
        className="section"
        sx={{
          height: "auto",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          gap: 4,
          padding: 4,
          mt: 6,
        }}
      >
        {/* Title */}
        <Typography
          variant="h4"
          sx={{
            fontWeight: "bold",
            mb: 3,
            textAlign: "center",
            color: currentTheme.textColor,
          }}
        >
          {t("Summary")}
        </Typography>

        <Paper
          elevation={3}
          sx={{
            p: 4,
            width: "90%",
            maxWidth: "800px",
            backgroundColor: currentTheme.backgroundColor,
            "&:hover": {
              boxShadow: `0 8px 16px ${currentTheme.buttonColor}`,
            },
          }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              gap: 4,
              flexWrap: "wrap", // Ensure responsiveness
              borderTop: `1px solid ${theme.palette.divider}`,
              pt: 2, // Add padding after the top border
            }}
          >
            {/* Top Genres Column */}
            <Box
              sx={{
                flex: 1,
                minWidth: "200px",
                textAlign: "center",
                borderRight: { xs: "none", sm: `1px solid ${theme.palette.divider}` },
                pr: { sm: 2 },
              }}
            >
              <Typography
                variant="h5"
                sx={{
                  mb: 2,
                  fontWeight: "bold",
                  color: currentTheme.textColor,
                }}
              >
                {t("Top Genres")}
              </Typography>
              <List>
                {genres.length > 0
                  ? genres.map((genre, index) => (
                      <ListItem key={index} sx={{ padding: 0 }}>
                        <ListItemText primary={`${index + 1}. ${genre}`} />
                      </ListItem>
                    ))
                  : t("No genres available.")}
              </List>
            </Box>

            {/* Top Artists Column */}
            <Box
              sx={{
                flex: 1,
                minWidth: "200px",
                textAlign: "center",
                borderRight: { xs: "none", sm: `1px solid ${theme.palette.divider}` },
                pr: { sm: 2 },
              }}
            >
              <Typography
                variant="h5"
                sx={{
                  mb: 2,
                  fontWeight: "bold",
                  color: currentTheme.textColor,
                }}
              >
                {t("Top Artists")}
              </Typography>
              <List>
                {artists.length > 0
                  ? artists.map((artist, index) => (
                      <ListItem key={index} sx={{ padding: 0 }}>
                        <ListItemText primary={`${index + 1}. ${artist}`} />
                      </ListItem>
                    ))
                  : t("No artists available.")}
              </List>
            </Box>

            {/* Top Songs Column */}
            <Box
              sx={{
                flex: 1,
                minWidth: "200px",
                textAlign: "center",
                pr: { sm: 2 },
              }}
            >
              <Typography
                variant="h5"
                sx={{
                  mb: 2,
                  fontWeight: "bold",
                  color: currentTheme.textColor,
                }}
              >
                {t("Top Songs")}
              </Typography>
              <List>
                {songs.length > 0
                  ? songs.map((song, index) => (
                      <ListItem key={index} sx={{ padding: 0 }}>
                        <ListItemText primary={`${index + 1}. ${song.title} by ${song.artist}`} />
                      </ListItem>
                    ))
                  : t("No songs available.")}
              </List>
            </Box>
          </Box>
        </Paper>
      </Box>

      {/* Save and Share Buttons */}
          <Box
      sx={{
        position: "fixed",
        bottom: isMobile ? "20px" : "40px",
        left: "50%",
        transform: "translateX(-50%)",
        display: "flex",
        gap: 2,
        zIndex: 999,
      }}
    >
      <Button
        variant="contained"
        startIcon={<SaveIcon />}
        sx={{
          backgroundColor: currentTheme.buttonColor,
          color: currentTheme.textColor,
          padding: isMobile ? "8px 12px" : "10px 16px", // Adjust padding for mobile
          fontSize: isMobile ? "0.75rem" : "1rem", // Smaller text for mobile
          "&:hover": {
            backgroundColor: currentTheme.hoverBackgroundColor,
            color: currentTheme.hoverTextColor,
          },
          "&:focus": {
            backgroundColor: currentTheme.hoverBackgroundColor, // Ensure focus works
            color: currentTheme.hoverTextColor,
          },
        }}
        onClick={saveWrap}
      >
        {t("save")}
      </Button>

      <Button
        variant="contained"
        startIcon={<ShareIcon />}
        sx={{
          backgroundColor: currentTheme.buttonColor,
          color: currentTheme.textColor,
          padding: isMobile ? "8px 12px" : "10px 16px", // Adjust padding for mobile
          fontSize: isMobile ? "0.75rem" : "1rem", // Smaller text for mobile
          "&:hover": {
            backgroundColor: currentTheme.hoverBackgroundColor,
            color: currentTheme.hoverTextColor,
          },
          "&:focus": {
            backgroundColor: currentTheme.hoverBackgroundColor, // Ensure focus works
            color: currentTheme.hoverTextColor,
          },
        }}
        onClick={shareWrap}
      >
        {t("share")}
      </Button>

       {/* Time Range Button */}
      <Button
        variant="contained"
        sx={{
          backgroundColor: currentTheme.buttonColor,
          color: currentTheme.textColor,
          padding: isMobile ? "8px 12px" : "10px 16px", 
          fontSize: isMobile ? "0.75rem" : "1rem", 
          "&:hover": {
            backgroundColor: currentTheme.hoverBackgroundColor,
            color: currentTheme.hoverTextColor,
          },
          "&:focus": {
            backgroundColor: currentTheme.hoverBackgroundColor, 
            color: currentTheme.hoverTextColor,
          },
        }}
        onClick={() => {
          const ranges = ["short_term", "medium_term", "long_term"];
          const currentIndex = ranges.indexOf(timeRange);
          const nextIndex = (currentIndex + 1) % ranges.length; // Cycle through ranges
          setTimeRange(ranges[nextIndex]); 
        }}
      >
          {t(`timeRange.${timeRange}`)}
      </Button>

      
    </Box>
    </Box>
  );
};

export default Wrapper;