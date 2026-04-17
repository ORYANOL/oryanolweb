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
      <nav className="nav justify-content-end header-nav">
        <Link to="/chargecheck" className="header-nav-link" title="ChargeCheck — EV charging true-price calculator">
          <i className="fa-solid fa-bolt"></i>
          <span>ChargeCheck</span>
        </Link>
        <Link to="/webtools" className="header-nav-link" title="Web Tools">
          <i className="fa-solid fa-toolbox"></i>
          <span>Tools</span>
        </Link>
        <ThemeToggle />
      </nav>
    </header>
  );
};

export default Header;