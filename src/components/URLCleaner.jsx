import React, { useState } from 'react';
import '../styles/URLCleaner.css';

// Universal tracking params (apply to every URL)
const UNIVERSAL_TRACKING_PARAMS = new Set([
    // UTM (Google Analytics)
    'utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content', 'utm_id',
    'utm_reader', 'utm_name', 'utm_place', 'utm_pubreferrer', 'utm_swu',
    // Meta / Facebook
    'fbclid', 'fb_action_ids', 'fb_action_types', 'fb_source', 'fb_ref',
    // Google Ads
    'gclid', 'gclsrc', 'dclid', 'gbraid', 'wbraid',
    // Microsoft / Bing Ads
    'msclkid',
    // Twitter / X  ← the ones the tool was missing!
    'twclid', 's', 't',
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
    'hsa_acc', 'hsa_cam', 'hsa_grp', 'hsa_ad', 'hsa_src', 'hsa_tgt', 'hsa_kw',
    'hsa_mt', 'hsa_net', 'hsa_ver',
    // Marketo
    'mkt_tok',
    // General tracking / analytics
    '_ga', '_gl', '_hs_enc', '_hs_mi',
    'ref', 'referrer', 'source',
    'click_id', 'clickid', 'click-id',
    'affiliate_id', 'aff_id', 'affid',
    'campaign_id', 'ad_id', 'adid',
    'si',              // Spotify share tracking
    'feature',         // YouTube share context
    'pp',              // YouTube premium
    'ab_channel',      // YouTube A/B test
]);

// Per-domain rules: only these params are KEPT (allowlist approach)
const DOMAIN_ALLOWLIST = {
    // Twitter / X: only keep status-related path, strip all query params
    'x.com': [],
    'twitter.com': [],
    // YouTube: keep only v (video id), t (timestamp) and list (playlist)
    'youtube.com': ['v', 't', 'list', 'start_radio', 'index'],
    'youtu.be': ['t'],
    // Amazon: keep only dp path info, remove affiliate/associate tags
    'amazon.com': [],
    'amazon.fr': [],
    'amazon.co.uk': [],
    'amazon.de': [],
    'amazon.es': [],
    'amazon.it': [],
    'amazon.ca': [],
    'amazon.com.au': [],
};

// Extra params to strip for specific domains on top of universal list
const DOMAIN_BLOCKLIST = {
    'amazon.com': ['tag', 'linkCode', 'linkId', 'ref', 'ref_', 'pf_rd_m', 'pf_rd_s',
        'pf_rd_r', 'pf_rd_i', 'pf_rd_p', 'pf_rd_t', 'pd_rd_i', 'pd_rd_r',
        'pd_rd_w', 'pd_rd_wg', '_encoding', 'smid', 'camp', 'creative',
        'creativeASIN', 'ie', 'node', 'keywords', 'field-keywords'],
    'youtube.com': ['si', 'feature', 'pp', 'ab_channel'],
};

function applyDomainBlocklist(hostname, url) {
    const extra = DOMAIN_BLOCKLIST[hostname];
    if (extra) extra.forEach(p => url.searchParams.delete(p));
}

function cleanURL(raw) {
    const toParse = /^https?:\/\//i.test(raw) ? raw : `https://${raw}`;
    const url = new URL(toParse);
    const hostname = url.hostname.replace(/^www\./, '');
    const removed = [];

    // Check if this domain has an allowlist
    if (Object.prototype.hasOwnProperty.call(DOMAIN_ALLOWLIST, hostname)) {
        const allowed = new Set(DOMAIN_ALLOWLIST[hostname]);
        for (const key of [...url.searchParams.keys()]) {
            if (!allowed.has(key)) {
                removed.push(key);
                url.searchParams.delete(key);
            }
        }
    } else {
        // Universal pass: remove all known tracking params
        for (const key of [...url.searchParams.keys()]) {
            if (UNIVERSAL_TRACKING_PARAMS.has(key)) {
                removed.push(key);
                url.searchParams.delete(key);
            }
        }
        // Domain-specific extra blocklist
        applyDomainBlocklist(hostname, url);
    }

    // Remove trailing '?' if no params remain
    const clean = url.toString().replace(/\?$/, '');
    return { clean, removed };
}

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
            const { clean, removed } = cleanURL(raw);
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
