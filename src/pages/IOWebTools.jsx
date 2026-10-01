import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import PasswordGenerator from '../components/PasswordGenerator';
import FuelCalculator from '../components/FuelCalculator';
import URLCleaner from '../components/URLCleaner';
import FuelEVTracker from '../components/FuelEVTracker';
import ChargeCheck from '../components/ChargeCheck';
import BarcodeScanner from '../components/BarcodeScanner';
import '../styles/IOWebTools.css';

const toolsList = [
    {
        id: 'url-cleaner',
        title: 'URL Cleaner',
        icon: 'fas fa-link',
        component: URLCleaner
    },
    {
        id: 'barcode-food-scanner',
        title: 'Barcode & Food Scanner',
        icon: 'fas fa-barcode',
        component: BarcodeScanner
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
    },
    {
        id: 'fe-tracker',
        title: 'Fuel & Charger finder',
        icon: 'fas fa-map-marked-alt',
        component: FuelEVTracker
    },
    {
        id: 'chargecheck',
        title: 'ChargeCheck',
        icon: 'fas fa-bolt',
        component: ChargeCheck
    },
];

const IOWebTools = () => {
    // When the page first loads, no tool is pre-selected so all tools are shown
    const [activeToolId, setActiveToolId] = useState(null);
    const [isSwitcherOpen, setIsSwitcherOpen] = useState(false);

    const activeTool = toolsList.find(t => t.id === activeToolId) || null;
    const ActiveComponent = activeTool ? activeTool.component : null;

    // Lock body scroll and handle Escape key when quick-switcher sheet is open
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'Escape') {
                setIsSwitcherOpen(false);
            }
        };

        if (isSwitcherOpen) {
            document.body.style.overflow = 'hidden';
            window.addEventListener('keydown', handleKeyDown);
        } else {
            document.body.style.overflow = '';
        }

        return () => {
            document.body.style.overflow = '';
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [isSwitcherOpen]);

    const handleSelectTool = (toolId) => {
        setActiveToolId(toolId);
        setIsSwitcherOpen(false);

        // Smooth scroll to top of tool content area on mobile
        setTimeout(() => {
            const toolElem = document.getElementById('active-tool-content');
            if (toolElem) {
                toolElem.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        }, 50);
    };

    return (
        <div className="io-web-tools-container">
            <div className="top-nav-links">
                <Link to="/" className="back-home-link">
                    <i className="fas fa-arrow-left"></i> Back to Home
                </Link>
                {activeToolId && (
                    <button
                        type="button"
                        className="view-all-tools-btn"
                        onClick={() => setActiveToolId(null)}
                    >
                        <i className="fas fa-th-large"></i> All Tools
                    </button>
                )}
            </div>

            <h1 className="text-center">IOWebTools</h1>
            <p className="text-center subtitle">
                {activeToolId ? 'A collection of useful web tools' : 'Select a tool to get started'}
            </p>

            <div className="tools-layout">
                {/* Tools Navigation (Smoothly shrinks on mobile when a tool is selected) */}
                <aside className={`tools-sidebar ${activeToolId ? 'shrunk' : ''}`}>
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
                <main className="tool-content-area" id="active-tool-content">
                    {ActiveComponent ? (
                        <div className="active-tool-container fade-in" key={activeTool.id}>
                            <h2 className="tool-title">
                                <i className={activeTool.icon}></i> {activeTool.title}
                            </h2>
                            <ActiveComponent />
                        </div>
                    ) : (
                        <div className="tools-welcome-card fade-in">
                            <div className="tools-welcome-icon">
                                <i className="fas fa-tools"></i>
                            </div>
                            <h2>Choose a Tool</h2>
                            <p>Pick any tool above to launch it directly.</p>
                        </div>
                    )}
                </main>
            </div>

            {/* Floating Quick-Switcher Pill (Only shown on mobile when a tool is active) */}
            {activeTool && (
                <div className="floating-switcher-wrapper">
                    <button
                        type="button"
                        className="floating-switcher-pill"
                        onClick={() => setIsSwitcherOpen(true)}
                        aria-label={`Current tool: ${activeTool.title}. Tap to switch tools.`}
                    >
                        <div className="pill-tool-badge">
                            <i className={activeTool.icon}></i>
                        </div>
                        <span className="pill-tool-name">{activeTool.title}</span>
                        <span className="pill-switch-hint">
                            <span>Switch</span>
                            <i className="fas fa-chevron-up"></i>
                        </span>
                    </button>
                </div>
            )}

            {/* Quick-Switcher Bottom Sheet & Backdrop */}
            <div
                className={`switcher-backdrop ${isSwitcherOpen ? 'visible' : ''}`}
                onClick={() => setIsSwitcherOpen(false)}
                aria-hidden={!isSwitcherOpen}
            />

            <div
                className={`switcher-sheet ${isSwitcherOpen ? 'open' : ''}`}
                role="dialog"
                aria-modal="true"
                aria-label="Switch Tool"
            >
                <div className="sheet-handle" onClick={() => setIsSwitcherOpen(false)}></div>
                <div className="sheet-header">
                    <div className="sheet-title-group">
                        <i className="fas fa-th-large sheet-header-icon"></i>
                        <div>
                            <h3 className="sheet-title">Switch Tool</h3>
                            <span className="sheet-subtitle">Select a tool to open</span>
                        </div>
                    </div>
                    <button
                        type="button"
                        className="sheet-close-btn"
                        onClick={() => setIsSwitcherOpen(false)}
                        aria-label="Close tools menu"
                    >
                        <i className="fas fa-times"></i>
                    </button>
                </div>

                <div className="sheet-grid">
                    {toolsList.map(tool => {
                        const isSelected = activeToolId === tool.id;
                        return (
                            <button
                                key={tool.id}
                                type="button"
                                className={`sheet-tool-btn ${isSelected ? 'active' : ''}`}
                                onClick={() => handleSelectTool(tool.id)}
                            >
                                <div className="sheet-tool-icon-wrapper">
                                    <i className={tool.icon}></i>
                                </div>
                                <span className="sheet-tool-name">{tool.title}</span>
                                {isSelected && (
                                    <span className="sheet-selected-mark">
                                        <i className="fas fa-check"></i>
                                    </span>
                                )}
                            </button>
                        );
                    })}
                </div>

                <button
                    type="button"
                    className="sheet-overview-btn"
                    onClick={() => {
                        setActiveToolId(null);
                        setIsSwitcherOpen(false);
                    }}
                >
                    <i className="fas fa-th-large"></i>
                    <span>Show All Tools Menu</span>
                </button>
            </div>
        </div>
    );
};

export default IOWebTools;
