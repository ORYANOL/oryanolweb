import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { ThemeContext } from '../contexts/ThemeContext';
import ThemeToggle from './ThemeToggle';

const Header = () => {
  return (
    <header>
      <ul className="list-inline">
        <li className="list-inline-item titler">
          <h1>
            <Link to="/" className="titler">ORYANOL HUB</Link>
          </h1>
        </li>
      </ul>
      <nav className="nav justify-content-end">
        <ThemeToggle />
      </nav>
    </header>
  );
};

export default Header;