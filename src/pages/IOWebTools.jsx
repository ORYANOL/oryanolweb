import React from 'react';
import { Link } from 'react-router-dom';
import PasswordGenerator from '../components/PasswordGenerator';
import FuelCalculator from '../components/FuelCalculator';
import URLCleaner from '../components/URLCleaner';
import '../styles/IOWebTools.css';

const IOWebTools = () => {
    return (
        <div className="io-web-tools-container">
            <Link to="/" className="back-home-link">
                <i className="fas fa-arrow-left"></i> Back to Home
            </Link>
            <h1 className="text-center">IOWebTools</h1>
            <p className="text-center subtitle">A collection of useful web tools</p>

            <div className="tools-grid">
                <div className="tool-container">
                    <h2 className="tool-title">Password Generator</h2>
                    <PasswordGenerator />
                </div>

                <div className="tool-container">
                    <h2 className="tool-title">Fuel Calculator</h2>
                    <FuelCalculator />
                </div>

                <div className="tool-container">
                    <h2 className="tool-title">URL Cleaner</h2>
                    <URLCleaner />
                </div>
            </div>
        </div>
    );
};

export default IOWebTools;
