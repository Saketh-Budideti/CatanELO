import React, { createContext, useState, useEffect, useContext } from 'react';
import { useTranslation } from 'react-i18next';

const LanguageContext = createContext();

export const useLanguage = () => {
  return useContext(LanguageContext);
};

// Language provider component
export const LanguageProvider = ({ children }) => {
  const { i18n } = useTranslation(); // Translation hook
  const [languageAnchorEl, setLanguageAnchorEl] = useState(null);
  const [currentLanguage, setCurrentLanguage] = useState(i18n.language);

  // Update currentLanguage when i18n.language changes
  useEffect(() => {
    setCurrentLanguage(i18n.language);
  }, [i18n.language]);

  const handleLanguageMenuOpen = (event) => {
    setLanguageAnchorEl(event.currentTarget);
  };

  const handleLanguageMenuClose = () => {
    setLanguageAnchorEl(null);
  };

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
    handleLanguageMenuClose();
  };

  return (
    <LanguageContext.Provider value={{
      currentLanguage,
      languageAnchorEl,
      setLanguageAnchorEl,
      handleLanguageMenuOpen,
      handleLanguageMenuClose,
      changeLanguage,
    }}>
      {children}
    </LanguageContext.Provider>
  );
};
