import React, { useContext } from 'react';
import { ThemeContext } from '../contexts/ThemeContext.jsx';

const ThemeToggle = () => {
  const { darkMode, toggleDarkMode } = useContext(ThemeContext);

  return (
    <i
      className={`theme-toggle-icon fa-solid ${darkMode ? 'fa-sun' : 'fa-moon'}`}
      onClick={toggleDarkMode}
      aria-label="Toggle dark mode"
    />
  );
};

export default ThemeToggle;