import React from 'react';
import { Link } from 'react-router-dom';
import ChargeCheckTool from '../components/ChargeCheck';
import '../styles/IOWebTools.css';

const ChargeCheckPage = () => {
    return (
        <div className="io-web-tools-container">
            <Link to="/" className="back-home-link">
                <i className="fas fa-arrow-left"></i> Back to Home
            </Link>
            <h1 className="text-center">ChargeCheck</h1>
            <p className="text-center subtitle">
                UK EV public charging True Price calculator
            </p>

            <div className="active-tool-container fade-in">
                <h2 className="tool-title">
                    <i className="fas fa-bolt"></i> ChargeCheck
                </h2>
                <ChargeCheckTool />
            </div>
        </div>
    );
};

export default ChargeCheckPage;
