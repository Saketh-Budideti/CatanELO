import React from 'react';
import { Menu, MenuItem, Button } from '@mui/material';
import { useLanguage } from '../contexts/LanguageProvider.jsx';
import { useTranslation } from 'react-i18next';

function LanguageMenu() {
  const { languageAnchorEl, handleLanguageMenuOpen, handleLanguageMenuClose, changeLanguage } = useLanguage();
  const { i18n } = useTranslation();

  return (
    <>
      <Button
        variant="outlined"
        sx={{
          color: 'text.primary',
          borderColor: 'divider',
          textTransform: 'none',
          fontSize: '0.875rem',
          padding: '6px 16px',
          borderRadius: '8px',
          display: 'flex',
          alignItems: 'center',
          gap: 1,
          '&:hover': {
            borderColor: 'text.primary',
            backgroundColor: 'action.hover',
          },
        }}
        onClick={handleLanguageMenuOpen}
      >
        {i18n.language.toUpperCase()}
      </Button>
      <Menu
        anchorEl={languageAnchorEl}
        open={Boolean(languageAnchorEl)}
        onClose={handleLanguageMenuClose}
      >
        <MenuItem onClick={() => changeLanguage('en')}>English</MenuItem>
        <MenuItem onClick={() => changeLanguage('es')}>Español</MenuItem>
        <MenuItem onClick={() => changeLanguage('fr')}>Français</MenuItem>
      </Menu>
    </>
  );
}

export default LanguageMenu;
