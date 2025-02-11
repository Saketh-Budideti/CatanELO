import React, { useState } from "react";
import {
  Snackbar,
  TextField,
  InputAdornment,
  IconButton,
  Button,
  Stack,
  Box,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Logo from "../components/Logo.jsx";
import { getCookie } from "../csrf/csrf.jsx";
import { useTranslation } from "react-i18next";

function CreateAccount() {
  const theme = useTheme();
  const navigate = useNavigate();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const { t } = useTranslation();

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    password2: "",
  });

  const [serverError, setServerError] = useState("");
  const [formErrors, setFormErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);

  const dismissServerErrors = () => setServerError("");

  const handleFormChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (field in formErrors) {
      setFormErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const handleFormSubmit = async () => {
    // Basic validation
    if (!formData.username || !formData.email || !formData.password || !formData.password2) {
      setFormErrors({ form: "All fields are required" });
      return;
    }

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setFormErrors({ email: "Please enter a valid email address" });
      return;
    }

    try {
      const response = await axios.post(
        "/api/user/register/",
        formData,
        {
          headers: { "X-CSRFToken": getCookie("csrftoken") },
          withCredentials: true,
        }
      );

      if (response.status === 201) {
        // Registration successful, navigate to main page
        navigate("/main");
      }
    } catch (error) {
      if (error.response?.status === 400) {
        // Handle validation errors from the backend
        setFormErrors(error.response.data);
      } else {
        // Handle other errors
        setServerError("An error occurred during registration. Please try again.");
        console.error("Registration error:", error);
      }
    }
  };

  const handleTogglePasswordVisibility = () => setShowPassword((prev) => !prev);

  const handleGoBack = () => navigate("/login");

  return (
    <>
      <Snackbar
        open={!!serverError}
        autoHideDuration={5000}
        onClose={dismissServerErrors}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        message={serverError}
      />

      <Box
        sx={{
          display: "flex",
          justifyContent: isMobile ? "center" : "flex-start",
          alignItems: "center",
          mt: isMobile ? 2 : 4,
          mb: isMobile ? 3 : 0,
        }}
      >
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={handleGoBack}
          sx={{
            color: theme.palette.primary.main,
            fontWeight: 900,
            textAlign: "center",
          }}
        >
          {t("back")}
        </Button>
      </Box>

      <Stack
        direction="column"
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          gap: isMobile ? 2 : 3,
          mx: "auto",
          bgcolor: theme.palette.background.default,
          color: theme.palette.text.primary,
        }}
      >
        <Logo fontSize={isMobile ? "70px" : "100px"} />

        <TextField
          id="username"
          label={t("username")}
          variant="outlined"
          autoComplete="username"
          sx={{ width: isMobile ? "90%" : "500px" }}
          value={formData.username}
          onChange={(e) => handleFormChange("username", e.target.value)}
          error={"username" in formErrors}
          helperText={formErrors.username}
        />

        <TextField
          id="email"
          label={t("email")}
          variant="outlined"
          autoComplete="email"
          sx={{ width: isMobile ? "90%" : "500px" }}
          value={formData.email}
          onChange={(e) => handleFormChange("email", e.target.value)}
          error={"email" in formErrors}
          helperText={formErrors.email}
        />

        <TextField
          id="password"
          label={t("password")}
          variant="outlined"
          type={showPassword ? "text" : "password"}
          autoComplete="new-password"
          sx={{ width: isMobile ? "90%" : "500px" }}
          value={formData.password}
          onChange={(e) => handleFormChange("password", e.target.value)}
          error={"password" in formErrors}
          helperText={formErrors.password}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={handleTogglePasswordVisibility} edge="end">
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />

        <TextField
          id="confirm-password"
          label={t("confirmPassword")}
          variant="outlined"
          type={showPassword ? "text" : "password"}
          autoComplete="new-password"
          sx={{ width: isMobile ? "90%" : "500px" }}
          value={formData.password2}
          onChange={(e) => handleFormChange("password2", e.target.value)}
          error={"password2" in formErrors}
          helperText={formErrors.password2}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={handleTogglePasswordVisibility} edge="end">
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />

        <Button
          sx={{
            color: theme.palette.primary.contrastText,
            backgroundColor: theme.palette.primary.main,
            width: isMobile ? "90%" : "500px",
            fontFamily: '"League Spartan", sans-serif',
            fontWeight: 900,
            borderRadius: "90px",
            textTransform: "none",
            "&:hover": {
              backgroundColor: theme.palette.primary.dark,
            },
          }}
          variant="contained"
          onClick={handleFormSubmit}
        >
          {t("register")}
        </Button>
      </Stack>
    </>
  );
}

export default CreateAccount;