import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import PasswordGenerator from '../components/PasswordGenerator';
import FuelCalculator from '../components/FuelCalculator';
import URLCleaner from '../components/URLCleaner';
import FuelEVTracker from '../components/FuelEVTracker';
import '../styles/IOWebTools.css';

const toolsList = [
    {
        id: 'fe-tracker',
        title: 'UK Fuel & EV App',
        icon: 'fas fa-map-marked-alt',
        component: FuelEVTracker
    },
    {
        id: 'url-cleaner',
        title: 'URL Cleaner',
        icon: 'fas fa-link',
        component: URLCleaner
    },
    {
        id: 'password-generator',
        title: 'Password Generator',
        icon: 'fas fa-key',
        component: PasswordGenerator
    },
    {
        id: 'fuel-calculator',
        title: 'Fuel Calculator',
        icon: 'fas fa-gas-pump',
        component: FuelCalculator
    }
];

const IOWebTools = () => {
    // Default to URL Cleaner since it's the most used
    const [activeToolId, setActiveToolId] = useState(toolsList[0].id);

    const activeTool = toolsList.find(t => t.id === activeToolId);
    const ActiveComponent = activeTool ? activeTool.component : null;

    return (
        <div className="io-web-tools-container">
            <Link to="/" className="back-home-link">
                <i className="fas fa-arrow-left"></i> Back to Home
            </Link>
            <h1 className="text-center">IOWebTools</h1>
            <p className="text-center subtitle">A collection of useful web tools</p>

            <div className="tools-layout">
                {/* Sidebar Navigation */}
                <aside className="tools-sidebar">
                    {toolsList.map(tool => (
                        <button
                            key={tool.id}
                            className={`tool-nav-btn ${activeToolId === tool.id ? 'active' : ''}`}
                            onClick={() => setActiveToolId(tool.id)}
                        >
                            <i className={tool.icon}></i>
                            <span>{tool.title}</span>
                        </button>
                    ))}
                </aside>

                {/* Main Content Area */}
                <main className="tool-content-area">
                    {ActiveComponent && (
                        <div className="active-tool-container fade-in" key={activeTool.id}>
                            <h2 className="tool-title">
                                <i className={activeTool.icon}></i> {activeTool.title}
                            </h2>
                            <ActiveComponent />
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
};

export default IOWebTools;
