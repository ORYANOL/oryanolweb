import React, { useState } from 'react';
import '../styles/URLCleaner.css';

// ─── Helpers ──────────────────────────────────────────────────────────────────

/** Extract base domain (TLD + SLD), ignoring subdomains.
 *  m.youtube.com → youtube.com, music.youtube.com → youtube.com */
function getBaseDomain(hostname) {
    const parts = hostname.replace(/^www\./, '').split('.');
    // Handle multi-part TLDs like .co.uk, .com.au
    const multiTLD = /^(co|com|org|net|gov|edu|ac)\.[a-z]{2}$/i.test(parts.slice(-2).join('.'));
    return multiTLD ? parts.slice(-3).join('.') : parts.slice(-2).join('.');
}

/** Redirect wrapper params — if any of these exist, decode their value and re-clean it */
const REDIRECT_PARAMS = new Set([
    'url', 'u', 'dest', 'destination', 'redirect', 'redirect_uri',
    'redirect_url', 'target', 'to', 'out', 'goto', 'link', 'continue',
    'return_to', 'returnTo', 'next', 'forward',
]);

/** Strips default ports from a URL string */
function removeDefaultPorts(urlStr) {
    return urlStr.replace(/:80(\/|$)/, '$1').replace(/:443(\/|$)/, '$1');
}

// ─── Layer 1: Explicit blocklist ──────────────────────────────────────────────
// Only well-confirmed tracking param names. Do NOT put ambiguous names here.
const KNOWN_TRACKERS = new Set([
    // UTM (Google Analytics)
    'utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content',
    'utm_id', 'utm_reader', 'utm_name', 'utm_place', 'utm_pubreferrer', 'utm_swu',
    // Facebook / Meta
    'fbclid', 'fb_action_ids', 'fb_action_types', 'fb_source', 'fb_ref', 'mibextid',
    // Google Ads
    'gclid', 'gclsrc', 'dclid', 'gbraid', 'wbraid',
    // Microsoft / Bing Ads
    'msclkid',
    // Twitter / X  (NOTE: 's' and 't' are NOT here — handled by domain allowlist only)
    'twclid',
    // Instagram
    'igshid', 'igsh',
    // TikTok
    'ttclid',
    // Pinterest
    'epik',
    // LinkedIn
    'li_fat_id', 'trk',
    // Mailchimp
    'mc_cid', 'mc_eid',
    // HubSpot
    'hsa_acc', 'hsa_cam', 'hsa_grp', 'hsa_ad', 'hsa_src', 'hsa_tgt',
    'hsa_kw', 'hsa_mt', 'hsa_net', 'hsa_ver',
    '__hsfp', '__hssc', '__hstc',
    // Marketo
    'mkt_tok',
    // Google Analytics extras
    '_ga', '_gl', '_gaexp', '_gaexp_rc',
    '_hs_enc', '_hs_mi',
    // Vero / Ometria / Klaviyo / etc.
    'oly_anon_id', 'oly_enc_id', 'vero_id', 'rb_clickid',
    // Spotify
    'si',
    // YouTube
    'feature', 'pp', 'ab_channel',
    // AliExpress affiliate stack
    'spm', 'aff_fcid', 'aff_fsk', 'aff_platform', 'aff_trace_key',
    'afSmartRedirect', 'Afref', 'sv1', 'sv_campaign_id',
    // Amazon
    'tag', 'linkCode', 'linkId',
    'pf_rd_m', 'pf_rd_s', 'pf_rd_r', 'pf_rd_i', 'pf_rd_p', 'pf_rd_t',
    'pd_rd_i', 'pd_rd_r', 'pd_rd_w', 'pd_rd_wg',
    '_encoding', 'smid', 'camp', 'creative', 'creativeASIN',
    // Generic click / affiliate
    'click_id', 'clickid', 'affiliate_id', 'aff_id', 'affid',
    'campaign_id', 'ad_id', 'adid',
]);

// ─── Layer 2: Safelist ────────────────────────────────────────────────────────
// These params are ALWAYS kept, checked BEFORE the blocklist so nothing here
// is ever accidentally removed.
const SAFE_PARAMS = new Set([
    // Pagination / navigation
    'page', 'p', 'pg', 'per_page', 'limit', 'offset', 'start', 'end',
    // Search / filtering
    'q', 'query', 'search', 's', 'keyword', 'keywords',
    'filter', 'sort', 'order', 'category', 'cat', 'type',
    'tag', 'tags', 'label', 'status',
    // Product / item identifiers
    'id', 'item', 'product', 'sku', 'pid', 'model', 'variant',
    'color', 'colour', 'size', 'qty', 'quantity',
    // Content
    'v', 'list', 'index', 't', 'chapter', 'section',
    'lang', 'locale', 'language', 'currency',
    // Auth / OAuth (functional, not tracking)
    'token', 'key', 'code', 'state', 'nonce', 'scope',
    // Dates
    'date', 'from', 'to', 'start_date', 'end_date', 'year', 'month', 'day',
    // UI state
    'tab', 'view', 'mode', 'theme', 'layout', 'expanded', 'open',
    // Maps / location
    'lat', 'lng', 'zoom', 'center', 'bounds', 'address', 'location',
    // API / infra
    'cursor', 'after', 'before', 'page_token', 'format', 'fields', 'embed',
]);

// ─── Layer 3: Heuristic patterns ──────────────────────────────────────────────

/** Param NAMES that strongly suggest tracking */
const TRACKER_NAME_PATTERNS = [
    /^utm_/i,
    /^aff/i,           // aff_*, affiliate_*
    /affili/i,
    /\btrack/i,        // track_id, tracking
    /click[-_]?id/i,
    /campaign/i,
    /^sv_/i,           // sv_* (AliExpress)
    /^pf_rd/i,         // pf_rd_* (Amazon)
    /^pd_rd/i,         // pd_rd_* (Amazon)
    /^hsa_/i,          // hsa_* (HubSpot)
    /^mc_/i,           // mc_cid, mc_eid (Mailchimp)
    /^fb_/i,           // fb_* (Facebook)
    /^_{1,2}[a-z]/i,   // _ga, __hsfp, etc. (analytics)
    /clid$/i,          // gclid, msclkid, fbclid …
    /\breferr/i,       // referrer (but NOT 'ref' alone — too ambiguous)
    /^ad_/i,
    /adid$/i,
    /terminal[-_]?id/i,
];

/** Only flag value as suspicious hash when the param NAME also looks like tracking.
 *  This prevents false-positives on Firebase IDs, OAuth state, Stripe IDs etc. */
function looksLikeTrackingName(key) {
    return TRACKER_NAME_PATTERNS.some(rx => rx.test(key));
}

/** Does the VALUE look like a random tracking hash? */
function looksLikeTrackingValue(value) {
    if (!value || value.length < 20) return false;
    if (/^[0-9a-f]{20,}$/i.test(value)) return true;                        // hex hash
    if (/^[A-Za-z0-9+/=]{24,}$/.test(value) && !/^\d+$/.test(value)) return true; // base64
    if (/^[A-Za-z0-9_-]{24,}$/.test(value) && /[A-Z]/.test(value) && /[0-9]/.test(value)) return true;
    return false;
}

/** Core decision: is this query param a tracker? */
function isTracker(key, value) {
    const lk = key.toLowerCase();
    // ① Safelist is always checked FIRST — these are never removed
    if (SAFE_PARAMS.has(lk)) return false;
    // ② Explicit blocklist
    if (KNOWN_TRACKERS.has(key) || KNOWN_TRACKERS.has(lk)) return true;
    // ③ Name-pattern heuristic
    if (looksLikeTrackingName(key)) return true;
    // ④ Value-entropy heuristic — only when name is also suspicious-looking
    if (looksLikeTrackingName(key) && looksLikeTrackingValue(value)) return true;
    return false;
}

// ─── Per-domain allowlists ────────────────────────────────────────────────────
// Matched against BASE domain (so m.youtube.com → youtube.com matches).
// Empty array = strip ALL query params.
const DOMAIN_ALLOWLIST = {
    'x.com': [],
    'twitter.com': [],
    'youtube.com': ['v', 't', 'list', 'start_radio', 'index'],
    'youtu.be': ['t'],
    'amazon.com': [], 'amazon.fr': [], 'amazon.co.uk': [], 'amazon.de': [],
    'amazon.es': [], 'amazon.it': [], 'amazon.ca': [], 'amazon.com.au': [],
    'aliexpress.com': [],
};

// ─── Fragment tracker cleaning ────────────────────────────────────────────────
/** Strip known tracking params encoded in #hash fragments */
function cleanFragment(hash) {
    if (!hash || hash.length <= 1) return hash;
    const body = hash.startsWith('#') ? hash.slice(1) : hash;
    // Only attempt if fragment looks like query params
    if (!body.includes('=')) return hash;
    try {
        const fakeParams = new URLSearchParams(body);
        let changed = false;
        for (const [key, value] of [...fakeParams.entries()]) {
            if (isTracker(key, value)) {
                fakeParams.delete(key);
                changed = true;
            }
        }
        if (!changed) return hash;
        const rebuilt = fakeParams.toString();
        return rebuilt ? `#${rebuilt}` : '';
    } catch {
        return hash;
    }
}

// ─── Redirect unwrapping ──────────────────────────────────────────────────────
/** If a param is a redirect wrapper, return the decoded inner URL, else null */
function extractRedirectTarget(params) {
    for (const rp of REDIRECT_PARAMS) {
        const val = params.get(rp);
        if (val && /^https?:\/\//i.test(val)) return val;
    }
    return null;
}

// ─── Main pipeline ────────────────────────────────────────────────────────────
function cleanURL(raw, depth = 0) {
    const MAX_DEPTH = 3; // prevent infinite recursion on weird redirect chains
    const toParse = /^https?:\/\//i.test(raw) ? raw : `https://${raw}`;
    const url = new URL(toParse);
    const baseDomain = getBaseDomain(url.hostname);
    const removed = [];

    // Step 1: Unwrap redirect wrappers (recursive)
    if (depth < MAX_DEPTH) {
        const inner = extractRedirectTarget(url.searchParams);
        if (inner) {
            try {
                return cleanURL(inner, depth + 1);
            } catch { /* fall through and clean as-is */ }
        }
    }

    // Step 2: Clean query params — allowlist or heuristic mode
    if (Object.prototype.hasOwnProperty.call(DOMAIN_ALLOWLIST, baseDomain)) {
        const allowed = new Set(DOMAIN_ALLOWLIST[baseDomain]);
        for (const key of [...url.searchParams.keys()]) {
            if (!allowed.has(key)) {
                removed.push(key);
                url.searchParams.delete(key);
            }
        }
    } else {
        for (const [key, value] of [...url.searchParams.entries()]) {
            if (isTracker(key, value)) {
                removed.push(key);
                url.searchParams.delete(key);
            }
        }
    }

    // Step 3: Clean fragment
    const cleanedHash = cleanFragment(url.hash);
    if (cleanedHash !== url.hash) {
        const stripped = url.hash.slice(1);
        // Count removed fragment params
        try {
            const before = new URLSearchParams(url.hash.slice(1));
            const after = cleanedHash ? new URLSearchParams(cleanedHash.slice(1)) : new URLSearchParams();
            for (const key of [...before.keys()]) {
                if (!after.has(key)) removed.push(`#${key}`);
            }
        } catch { /* ignore */ }
    }

    // Step 4: Rebuild and normalise
    let clean = url.toString();
    // Replace fragment with cleaned version
    if (cleanedHash !== url.hash) {
        const hashIdx = clean.indexOf('#');
        if (hashIdx !== -1) clean = clean.slice(0, hashIdx);
        if (cleanedHash) clean += cleanedHash;
    }
    // Strip trailing '?' or '&'
    clean = clean.replace(/[?&]$/, '');
    // Remove default ports
    clean = removeDefaultPorts(clean);

    return { clean, removed };
}

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
