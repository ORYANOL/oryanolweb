import React, { useState } from 'react';
import '../styles/URLCleaner.css';
import { cleanURL } from '../utils/urlCleanerHelpers.js';

// ─── React Component ──────────────────────────────────────────────────────────
const URLCleaner = () => {
    const [inputURL, setInputURL] = useState('');
    const [cleanedURL, setCleanedURL] = useState('');
    const [removedParams, setRemovedParams] = useState([]);
    const [isClean, setIsClean] = useState(false);
    const [wasRedirect, setWasRedirect] = useState(false);
    const [error, setError] = useState('');
    const [copySuccess, setCopySuccess] = useState(false);
    const [batchMode, setBatchMode] = useState(false);
    const [batchResults, setBatchResults] = useState([]);
    const [batchCopySuccess, setBatchCopySuccess] = useState(false);

    const handleInput = (e) => {
        const raw = e.target.value;
        setInputURL(raw);
        setCopySuccess(false);
        setBatchCopySuccess(false);

        if (batchMode) {
            // Batch processing: newline-separated
            const lines = raw.split('\n').map(l => l.trim()).filter(Boolean);
            if (lines.length === 0) {
                setBatchResults([]);
                return;
            }
            const results = lines.map((ln) => {
                try {
                    const { clean, removed } = cleanURL(ln);
                    const inputHost = new URL(/^https?:\/\//i.test(ln) ? ln : `https://${ln}`).hostname;
                    const outputHost = new URL(clean).hostname;
                    return {
                        input: ln,
                        clean,
                        removed,
                        isClean: removed.length === 0 && inputHost === outputHost,
                        wasRedirect: inputHost !== outputHost,
                        error: null,
                    };
                } catch (err) {
                    return { input: ln, clean: '', removed: [], isClean: false, wasRedirect: false, error: 'Invalid URL' };
                }
            });
            setBatchResults(results);
            return;
        }

        if (!raw.trim()) {
            setCleanedURL('');
            setRemovedParams([]);
            setIsClean(false);
            setWasRedirect(false);
            setError('');
            return;
        }

        try {
            const { clean, removed } = cleanURL(raw);
            // Detect redirect unwrap: the domain changed
            const inputHost = new URL(/^https?:\/\//i.test(raw) ? raw : `https://${raw}`).hostname;
            const outputHost = new URL(clean).hostname;
            setWasRedirect(inputHost !== outputHost);
            setCleanedURL(clean);
            setRemovedParams(removed);
            setIsClean(removed.length === 0 && inputHost === outputHost);
            setError('');
        } catch {
            setCleanedURL('');
            setRemovedParams([]);
            setIsClean(false);
            setWasRedirect(false);
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
        setWasRedirect(false);
        setError('');
        setCopySuccess(false);
        setBatchResults([]);
        setBatchCopySuccess(false);
    };

    const toggleBatch = () => {
        const next = !batchMode;
        setBatchMode(next);
        setInputURL('');
        setCleanedURL('');
        setRemovedParams([]);
        setIsClean(false);
        setWasRedirect(false);
        setError('');
        setBatchResults([]);
        setCopySuccess(false);
        setBatchCopySuccess(false);
    };

    const copyBatchAll = async () => {
        if (!batchResults || batchResults.length === 0) return;
        const lines = batchResults.map(r => r.clean || '').filter(Boolean).join('\n');
        if (!lines) return;
        try {
            await navigator.clipboard.writeText(lines);
            setBatchCopySuccess(true);
            setTimeout(() => setBatchCopySuccess(false), 2000);
        } catch {
            const ta = document.createElement('textarea');
            ta.value = lines;
            document.body.appendChild(ta);
            ta.select();
            document.execCommand('copy');
            document.body.removeChild(ta);
            setBatchCopySuccess(true);
            setTimeout(() => setBatchCopySuccess(false), 2000);
        }
    };

    return (
        <div className="url-cleaner-container">

            {/* Input */}
            <div className="toggle-container" style={{ marginBottom: 8 }}>
                <label>Single</label>
                <label className="toggle">
                    <input type="checkbox" checked={batchMode} onChange={toggleBatch} />
                    <span className="slider"></span>
                </label>
                <label>Batch</label>
            </div>

            <div className="url-input-wrapper">
                {batchMode ? (
                    <textarea
                        className="url-textarea"
                        placeholder="Paste newline-separated URLs…"
                        value={inputURL}
                        onChange={handleInput}
                        spellCheck={false}
                        rows={6}
                    />
                ) : (
                    <input
                        type="text"
                        className="url-input"
                        placeholder="Paste any URL here…"
                        value={inputURL}
                        onChange={handleInput}
                        spellCheck={false}
                    />
                )}

                {inputURL && (
                    <button className="url-clear-btn" onClick={handleClear} title="Clear">
                        <i className="fas fa-times"></i>
                    </button>
                )}
            </div>

            {error && <p className="url-error">{error}</p>}

            {/* Output */}
            {!batchMode && cleanedURL && !error && (
                <>
                    {wasRedirect ? (
                        <div className="url-status url-status--redirect">
                            <i className="fas fa-external-link-alt"></i> Redirect unwrapped
                        </div>
                    ) : isClean ? (
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

            {batchMode && batchResults && batchResults.length > 0 && (
                <div className="batch-results">
                    <div className="batch-actions">
                        <div className="url-status url-status--clean">
                            <i className="fas fa-list"></i> {batchResults.length} URL{batchResults.length > 1 ? 's' : ''}
                        </div>
                        <button className="url-copy-btn" onClick={copyBatchAll}>
                            {batchCopySuccess ? <><i className="fas fa-check"></i> Copied!</> : <><i className="fas fa-copy"></i> Copy All</>}
                        </button>
                    </div>

                    <div className="batch-list">
                        {batchResults.map((r, idx) => (
                            <div key={`${r.input}-${idx}`} className="batch-item">
                                <div className="url-output-wrapper">
                                    <p className="url-output">{r.clean || r.input}</p>
                                    <button className="url-copy-btn" onClick={async () => {
                                        try {
                                            await navigator.clipboard.writeText(r.clean || r.input);
                                            setBatchCopySuccess(true);
                                            setTimeout(() => setBatchCopySuccess(false), 1200);
                                        } catch {
                                            const ta = document.createElement('textarea');
                                            ta.value = r.clean || r.input;
                                            document.body.appendChild(ta);
                                            ta.select();
                                            document.execCommand('copy');
                                            document.body.removeChild(ta);
                                            setBatchCopySuccess(true);
                                            setTimeout(() => setBatchCopySuccess(false), 1200);
                                        }
                                    }}>
                                        <i className="fas fa-copy"></i> Copy
                                    </button>
                                </div>
                                {r.error && <div className="url-error">{r.error}</div>}
                                {r.removed && r.removed.length > 0 && (
                                    <div className="url-badges">
                                        {r.removed.map(p => <span key={p} className="url-badge">{p}</span>)}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default URLCleaner;
