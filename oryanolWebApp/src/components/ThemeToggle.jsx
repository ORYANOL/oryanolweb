import React, { useContext } from 'react';
import { ThemeContext } from '../contexts/ThemeContext.jsx';

const ThemeToggle = () => {
  const { darkMode, toggleDarkMode } = useContext(ThemeContext);

  return (
    <img
      src={darkMode ? '/img/dti/sun.png' : '/img/dti/moon.png'}
      className="theme-toggle-icon"
      alt="Dark mode toggle"
      aria-label="Toggle dark mode"
      onClick={toggleDarkMode}
    />
  );
};

export default ThemeToggle;