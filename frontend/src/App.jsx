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
import { AuthProvider, RequireAuth, RequireNoAuth } from './contexts/AuthProvider.jsx';
import { UserProvider } from './contexts/UserProvider.jsx';


function App() {
  // State for theme mode
  const [mode, setMode] = useState('light');

  const toggleTheme = () => {
    setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
  };

  const theme = getTheme(mode);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <Routes>
          {/* Public routes - accessible when not logged in */}
          <Route
            path="/login"
            element={
              <RequireNoAuth>
                <Login />
              </RequireNoAuth>
            }
          />
          <Route
            path="/signin"
            element={
              <RequireNoAuth>
                <SignIn />
              </RequireNoAuth>
            }
          />
          <Route
            path="/create-account"
            element={
              <RequireNoAuth>
                <CreateAccount />
              </RequireNoAuth>
            }
          />

          {/* Protected routes - require authentication */}
          <Route
            path="/main"
            element={
              <RequireAuth>
                <UserProvider>
                  <MainPage />
                </UserProvider>
              </RequireAuth>
            }
          />
          <Route
            path="/profile"
            element={
              <RequireAuth>
                <UserProvider>
                  <ProfilePage />
                </UserProvider>
              </RequireAuth>
            }
          />

          {/* Default redirect */}
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
