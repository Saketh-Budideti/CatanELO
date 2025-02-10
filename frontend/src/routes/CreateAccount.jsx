import React, { useContext, useState } from "react";
import {
  TextField,
  InputAdornment,
  IconButton,
  Button,
  Stack,
  Snackbar,
  useTheme,
  useMediaQuery,
  Box,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../contexts/AuthProvider.jsx";
import Logo from "../components/Logo.jsx";
import SpotifyPreview from "../components/SpotifyPreview.jsx";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useTranslation } from "react-i18next"; // Import translation hook

function CreateAccount() {
  const navigate = useNavigate();
  const location = useLocation();
  const { checkUserAuth } = useContext(AuthContext);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const { t } = useTranslation(); // Access translations

  const searchParams = Object.fromEntries(new URLSearchParams(location.search));
  const [formData, setFormData] = useState({
    username: searchParams["display_name"],
    email: searchParams["email"],
    password: "",
    password2: "",
  });

  const [serverError, setServerError] = useState("");
  const dismissServerErrors = () => setServerError("");
  const [formErrors, setFormErrors] = useState({});

  const handleFormChange = (field, value) => {
    setFormData((fs) => ({ ...fs, [field]: value }));
    if (field in formErrors)
      setFormErrors((fe) => {
        const newfe = { ...fe };
        delete newfe[field];
        return newfe;
      });
  };

  const handleFormSubmit = () => {
    setFormErrors({});
    axios.post("api/user/register/", formData)
      .then(() => navigate("/main"))
      .catch((ex) => {
        const res = ex.response;
        if (res && res.status === 400) {
          setFormErrors(res.data);
        } else {
          setServerError(
            `${t("serverError")} (error code ${res.status})`
          );
          console.error(res);
        }
      });
  };

  const [showPassword, setShowPassword] = useState(false);
  const handleTogglePasswordVisibility = () =>
    setShowPassword((prev) => !prev);

  const handleGoBack = () => {
    navigate("/login");
  };

  return (
    <>
      <Snackbar
        open={!!serverError}
        autoHideDuration={5000}
        onClose={dismissServerErrors}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        message={serverError}
      />

      {/* Back Button */}
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
        <SpotifyPreview {...searchParams} />

        {/* Username Field */}
        <TextField
          id="username"
          label={t("username")}
          variant="outlined"
          autoComplete="username"
          sx={{
            width: isMobile ? "90%" : "500px",
          }}
          value={formData.username}
          onChange={(e) => handleFormChange("username", e.target.value)}
          error={"username" in formErrors}
          helperText={"username" in formErrors ? formErrors.username : null}
        />

        {/* Email Field */}
        <TextField
          id="email"
          label={t("email")}
          variant="outlined"
          autoComplete="email"
          sx={{
            width: isMobile ? "90%" : "500px",
          }}
          value={formData.email}
          onChange={(e) => handleFormChange("email", e.target.value)}
          error={"email" in formErrors}
          helperText={"email" in formErrors ? formErrors.email : null}
        />

        {/* Password Field */}
        <TextField
          id="password"
          label={t("password")}
          variant="outlined"
          type={showPassword ? "text" : "password"}
          autoComplete="password"
          sx={{
            width: isMobile ? "90%" : "500px",
          }}
          value={formData.password}
          onChange={(e) => handleFormChange("password", e.target.value)}
          error={"password" in formErrors}
          helperText={"password" in formErrors ? formErrors.password : null}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  onClick={handleTogglePasswordVisibility}
                  edge="end"
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />

        {/* Confirm Password Field */}
        <TextField
          id="confirm-password"
          label={t("confirmPassword")}
          variant="outlined"
          type={showPassword ? "text" : "password"}
          autoComplete="confirmed-password"
          sx={{
            width: isMobile ? "90%" : "500px",
          }}
          value={formData.password2}
          onChange={(e) => handleFormChange("password2", e.target.value)}
          error={"password2" in formErrors}
          helperText={"password2" in formErrors ? formErrors.password2 : null}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  onClick={handleTogglePasswordVisibility}
                  edge="end"
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />

        {/* Register Button */}
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