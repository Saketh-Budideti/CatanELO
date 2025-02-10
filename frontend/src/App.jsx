import './App.css';
import { Routes, Route, Navigate } from 'react-router-dom';
import { CssBaseline, ThemeProvider, IconButton, Box, Menu, MenuItem, Button } from '@mui/material';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import React, { useState } from 'react';
import getTheme from './Theme.jsx';
import Login from './routes/Login.jsx';
import MainPage from './routes/MainPage.jsx';
import CreateAccount from './routes/CreateAccount.jsx';
import ProfilePage from './routes/ProfilePage.jsx';
import SignIn from './routes/SignIn.jsx';
import ContactPage from './routes/ContactPage.jsx';
import { AuthProvider, RequireAuth, RequireNoAuth } from './contexts/AuthProvider.jsx';
import { UserProvider } from './contexts/UserProvider.jsx';
import Wrapper from './routes/Wrapper.jsx';
import './i18n.jsx';
import { useTranslation } from 'react-i18next';
import { LanguageProvider, useLanguage } from './contexts/LanguageProvider.jsx';
import LanguageMenu from "./routes/LanguageMenu.jsx";


function App() {
  // State for theme mode
  const [mode, setMode] = useState('light');

  const toggleTheme = () => {
    setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
  };

  const theme = getTheme(mode);

  const noAuthRoutes = [
      { path: '/login', Element: Login },
      { path: '/signin', Element: SignIn },
      { path: '/account', Element: CreateAccount },
  ];

  const authRoutes = [
      { path: '/contact', Element: ContactPage },
      { path: '/profile', Element: ProfilePage },
      { path: '/main', Element: MainPage },
      { path: '/wrapper', Element: Wrapper },
  ];

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <LanguageProvider>
          <Box sx={{ position: 'fixed', top: 16, right: 16, zIndex: 9999, display: 'flex', gap: 1 }}>
            <IconButton
              onClick={toggleTheme}
              sx={{
                color: theme.palette.text.primary,
                backgroundColor: theme.palette.action.hover,
                borderRadius: '8px',
                '&:hover': {
                  backgroundColor: theme.palette.action.selected,
                },
              }}
            >
              {mode === 'light' ? <Brightness4Icon /> : <Brightness7Icon />}
            </IconButton>

            {/* Language Dropdown Button */}
            <LanguageMenu />
          </Box>

          {/* Application Routes */}
          <Routes>
            <Route path="/" element={<Navigate to="/main" replace />} />
            {noAuthRoutes.map(({ path, Element }) => (
              <Route
                path={path}
                key={path}
                element={
                  <RequireNoAuth>
                    <Element />
                  </RequireNoAuth>
                }
              />
            ))}

            {authRoutes.map(({ path, Element }) => (
              <Route
                path={path}
                key={path}
                element={
                  <RequireAuth>
                    <UserProvider>
                      <Element />
                    </UserProvider>
                  </RequireAuth>
                }
              />
            ))}
          </Routes>
        </LanguageProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
