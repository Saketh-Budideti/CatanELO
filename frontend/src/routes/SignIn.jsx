import React, { useState } from "react";
import {
  Snackbar,
  TextField,
  InputAdornment,
  IconButton,
  Button,
  Stack,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Logo from "../components/Logo.jsx";
import { getCookie } from "../csrf/csrf.jsx";
import { ThemeProvider, useTheme } from "@mui/material/styles";
import { useTranslation } from "react-i18next";

function SignIn() {
  const theme = useTheme(); // Hook to use the current theme
  const navigate = useNavigate();
  const { t } = useTranslation(); // Hook to use translations

  const [formErrors, setFormErrors] = useState("");
  const [serverError, setServerError] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const dismissServerErrors = () => setServerError("");
  const handleUsernameChange = (e) => {
    setUsername(e.target.value);
    if (formErrors) setFormErrors("");
  };
  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
    if (formErrors) setFormErrors("");
  };

  const handleSignIn = () => {
    setFormErrors("");
    axios
      .post(
        "api/user/login/",
        { username, password },
        {
          headers: { "X-CSRFToken": getCookie("csrftoken") },
          withCredentials: true,
        }
      )
      .then(() => navigate("/main"))
      .catch((ex) => {
        const res = ex.response;
        if (res?.status === 400) {
          setFormErrors(res.data.error);
        } else {
          setServerError(t("serverError", { code: res?.status || "unknown" }));
          console.error(res);
        }
      });
  };

  const handleTogglePasswordVisibility = () => setShowPassword((prev) => !prev);

  const handleGoBack = () => {
    navigate("/login");
  };

  return (
    <ThemeProvider theme={theme}>
      <Snackbar
        open={!!serverError}
        autoHideDuration={5000}
        onClose={dismissServerErrors}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        message={serverError}
      />
      <Button
        startIcon={<ArrowBackIcon />}
        onClick={handleGoBack}
        sx={{
          position: "absolute",
          top: 16,
          left: 16,
          color: theme.palette.primary.main,
          fontWeight: 900,
          fontSize: { xs: "0.8rem", sm: "1rem" }, // Responsive font size
        }}
      >
        {t("back")}
      </Button>

      <Stack
        direction="column"
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          gap: 3,
          padding: { xs: 2, sm: 4 }, // Padding for smaller screens
        }}
      >
        <Logo fontSize={{ xs: "70px", sm: "90px", md: "100px" }} />

        {/* Username Field */}
        <TextField
          id="username"
          label={t("username")}
          variant="outlined"
          autoComplete="username"
          value={username}
          onChange={handleUsernameChange}
          error={!!formErrors}
          placeholder={t("usernamePlaceholder")}
          sx={{
            width: { xs: "90%", sm: "80%", md: "500px" }, // Responsive width
            "& .MuiOutlinedInput-root": {
              "& fieldset": {
                borderColor: theme.palette.primary.main,
              },
              "&:hover fieldset": {
                borderColor: theme.palette.primary.dark,
              },
              "&.Mui-focused fieldset": {
                borderColor: theme.palette.primary.dark,
              },
            },
          }}
        />

        {/* Password Field */}
        <TextField
          id="password"
          label={t("password")}
          type={showPassword ? "text" : "password"}
          variant="outlined"
          autoComplete="password"
          value={password}
          onChange={handlePasswordChange}
          error={!!formErrors}
          helperText={formErrors}
          placeholder={t("passwordPlaceholder")}
          sx={{
            width: { xs: "90%", sm: "80%", md: "500px" }, // Responsive width
            "& .MuiOutlinedInput-root": {
              "& fieldset": {
                borderColor: theme.palette.primary.main,
              },
              "&:hover fieldset": {
                borderColor: theme.palette.primary.dark,
              },
              "&.Mui-focused fieldset": {
                borderColor: theme.palette.primary.dark,
              },
            },
          }}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  onClick={handleTogglePasswordVisibility}
                  edge="end"
                  aria-label={t(
                    showPassword
                      ? "togglePasswordVisibility.hide"
                      : "togglePasswordVisibility.show"
                  )}
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />

        {/* Sign-In Button */}
        <Button
          variant="contained"
          sx={{
            backgroundColor: theme.palette.primary.main,
            color: theme.palette.mode === "light" ? "#FFFFFF" : "#000000", // Adjust button text color dynamically
            width: { xs: "90%", sm: "80%", md: "500px" }, // Responsive width
            fontFamily: '"League Spartan", sans-serif',
            fontWeight: 900,
            fontSize: { xs: "0.8rem", sm: "1rem" }, // Responsive font size
            "&:hover": {
              backgroundColor: theme.palette.primary.dark,
            },
          }}
          onClick={handleSignIn}
        >
          {t("signIn")}
        </Button>
      </Stack>
    </ThemeProvider>
  );
}

export default SignIn;