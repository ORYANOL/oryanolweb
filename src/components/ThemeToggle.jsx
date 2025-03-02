import React, { useContext } from 'react';
import { ThemeContext } from '../contexts/ThemeContext.jsx';
import sunIcon from '/img/dti/sun.png';
import moonIcon from '/img/dti/moon.png';

const ThemeToggle = () => {
  const { darkMode, toggleDarkMode } = useContext(ThemeContext);

  return (
    <img
      src={darkMode ? sunIcon : moonIcon}
      className="theme-toggle-icon"
      alt="Dark mode toggle"
      aria-label="Toggle dark mode"
      onClick={toggleDarkMode}
    />
  );
};

export default ThemeToggle;