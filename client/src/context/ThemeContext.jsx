import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState('light');

  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove('dark');
    if (typeof window !== 'undefined') {
      localStorage.removeItem('kaaryamithra_theme');
    }
  }, []);

  const toggleTheme = () => {
    // Light theme only
    setTheme('light');
  };

  const isDark = false;

  return (
    <ThemeContext.Provider value={{ theme, setTheme, toggleTheme, isDark }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    return {
      theme: 'light',
      setTheme: () => {},
      toggleTheme: () => {},
      isDark: false,
    };
  }
  return context;
};

export default ThemeContext;
