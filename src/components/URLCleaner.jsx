import React, { useState } from 'react';
import '../styles/URLCleaner.css';

const TRACKING_PARAMS = [
    // UTM
    'utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content', 'utm_id',
    // Meta / Facebook
    'fbclid', 'fb_action_ids', 'fb_action_types', 'fb_source',
    // Google
    'gclid', 'gclsrc', 'dclid',
    // Microsoft
    'msclkid',
    // Twitter / X
    'twclid',
    // Instagram
    'igshid', 'igsh',
    // TikTok
    'ttclid',
    // Generic
    'ref', 'referrer', 'source', 'mc_cid', 'mc_eid', '_ga', '_gl',
];

const URLCleaner = () => {
    const [inputURL, setInputURL] = useState('');
    const [cleanedURL, setCleanedURL] = useState('');
    const [removedParams, setRemovedParams] = useState([]);
    const [isClean, setIsClean] = useState(false);
    const [error, setError] = useState('');
    const [copySuccess, setCopySuccess] = useState(false);

    const handleInput = (e) => {
        const raw = e.target.value;
        setInputURL(raw);
        setCopySuccess(false);

        if (!raw.trim()) {
            setCleanedURL('');
            setRemovedParams([]);
            setIsClean(false);
            setError('');
            return;
        }

        try {
            // Prepend https:// if no protocol present so URL() can parse it
            const toParse = /^https?:\/\//i.test(raw) ? raw : `https://${raw}`;
            const url = new URL(toParse);

            const removed = [];
            TRACKING_PARAMS.forEach((param) => {
                if (url.searchParams.has(param)) {
                    removed.push(param);
                    url.searchParams.delete(param);
                }
            });

            // Rebuild without trailing '?' if no params remain
            const clean = url.toString().replace(/\?$/, '');
            setCleanedURL(clean);
            setRemovedParams(removed);
            setIsClean(removed.length === 0);
            setError('');
        } catch {
            setCleanedURL('');
            setRemovedParams([]);
            setIsClean(false);
            setError('Paste a valid URL to clean it.');
        }
    };

    const copyToClipboard = async () => {
        if (!cleanedURL) return;
        try {
            await navigator.clipboard.writeText(cleanedURL);
            setCopySuccess(true);
            setTimeout(() => setCopySuccess(false), 2000);
        } catch {
            // Fallback
            const ta = document.createElement('textarea');
            ta.value = cleanedURL;
            document.body.appendChild(ta);
            ta.select();
            document.execCommand('copy');
            document.body.removeChild(ta);
            setCopySuccess(true);
            setTimeout(() => setCopySuccess(false), 2000);
        }
    };

    const handleClear = () => {
        setInputURL('');
        setCleanedURL('');
        setRemovedParams([]);
        setIsClean(false);
        setError('');
        setCopySuccess(false);
    };

    return (
        <div className="url-cleaner-container">

            {/* Input */}
            <div className="url-input-wrapper">
                <input
                    type="text"
                    className="url-input"
                    placeholder="Paste any URL here…"
                    value={inputURL}
                    onChange={handleInput}
                    spellCheck={false}
                />
                {inputURL && (
                    <button className="url-clear-btn" onClick={handleClear} title="Clear">
                        <i className="fas fa-times"></i>
                    </button>
                )}
            </div>

            {error && <p className="url-error">{error}</p>}

            {/* Output */}
            {cleanedURL && !error && (
                <>
                    {isClean ? (
                        <div className="url-status url-status--clean">
                            <i className="fas fa-check-circle"></i> Already clean!
                        </div>
                    ) : (
                        <div className="url-status url-status--dirty">
                            <i className="fas fa-broom"></i> {removedParams.length} tracker{removedParams.length > 1 ? 's' : ''} removed
                        </div>
                    )}

                    <div className="url-output-wrapper">
                        <p className="url-output">{cleanedURL}</p>
                        <button className="url-copy-btn" onClick={copyToClipboard}>
                            {copySuccess
                                ? <><i className="fas fa-check"></i> Copied!</>
                                : <><i className="fas fa-copy"></i> Copy</>
                            }
                        </button>
                    </div>

                    {removedParams.length > 0 && (
                        <div className="url-badges">
                            {removedParams.map((p) => (
                                <span key={p} className="url-badge">{p}</span>
                            ))}
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default URLCleaner;
