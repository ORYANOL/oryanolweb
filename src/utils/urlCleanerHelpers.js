// ─── Helpers ──────────────────────────────────────────────────────────────────

/** Extract base domain (TLD + SLD), ignoring subdomains.
 *  m.youtube.com → youtube.com, music.youtube.com → youtube.com */
export function getBaseDomain(hostname) {
    const parts = hostname.replace(/^www\./, '').split('.');
    // Handle multi-part TLDs like .co.uk, .com.au
    const multiTLD = /^(co|com|org|net|gov|edu|ac)\.[a-z]{2}$/i.test(parts.slice(-2).join('.'));
    return multiTLD ? parts.slice(-3).join('.') : parts.slice(-2).join('.');
}

/** Redirect wrapper params — if any of these exist, decode their value and re-clean it */
export const REDIRECT_PARAMS = new Set([
    'url', 'u', 'dest', 'destination', 'redirect', 'redirect_uri',
    'redirect_url', 'target', 'to', 'out', 'goto', 'link', 'continue',
    'return_to', 'returnTo', 'next', 'forward',
]);

/** Strips default ports from a URL string */
export function removeDefaultPorts(urlStr) {
    return urlStr.replace(/:80(\/|$)/, '$1').replace(/:443(\/|$)/, '$1');
}

// ─── Layer 1: Explicit blocklist ──────────────────────────────────────────────
// Only well-confirmed tracking param names. Do NOT put ambiguous names here.
export const KNOWN_TRACKERS = new Set([
    // UTM (Google Analytics)
    'utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content',
    'utm_id', 'utm_reader', 'utm_name', 'utm_place', 'utm_pubreferrer', 'utm_swu',
    // Facebook / Meta
    'fbclid', 'fb_action_ids', 'fb_action_types', 'fb_source', 'fb_ref', 'mibextid',
    // Google Ads
    'gclid', 'gclsrc', 'dclid', 'gbraid', 'wbraid',
    // Microsoft / Bing Ads
    'msclkid',
    // Twitter / X
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
    // Snapchat Ads
    'ScCid',
    // Generic ad/creative IDs (common across ad platforms)
    'adaccount_id', 'creo_id', 'creative_id',
]);

// ─── Layer 2: Safelist ────────────────────────────────────────────────────────
// These params are ALWAYS kept, checked BEFORE the blocklist so nothing here
// is ever accidentally removed.
export const SAFE_PARAMS = new Set([
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
export const TRACKER_NAME_PATTERNS = [
    /^utm_/i,
    /^aff/i,           // aff_*, affiliate_*
    /affili/i,
    /\btrack/i,        // track_id, tracking
    /click/i,          // click_id, clickid, organic_search_click, click_source
    /campaign/i,
    /^sv_/i,           // sv_* (AliExpress)
    /^pf_rd/i,         // pf_rd_* (Amazon)
    /^pd_rd/i,         // pd_rd_* (Amazon)
    /^hsa_/i,          // hsa_* (HubSpot)
    /^mc_/i,           // mc_cid, mc_eid (Mailchimp)
    /^fb_/i,           // fb_* (Facebook)
    /^ga_/i,           // ga_* (Google Analytics, Etsy, etc.)
    /^_{1,2}[a-z]/i,   // _ga, __hsfp, etc. (analytics)
    /clid$/i,          // gclid, msclkid, fbclid …
    /\breferr/i,       // referrer
    /^ref(?:_|$)/i,    // ref, ref_src, ref_url
    /_ref$/i,          // user_ref, etc.
    /^ad_/i,
    /adid$/i,
    /terminal[-_]?id/i,
    /^ad(?:account)?[-_]/i,   // ad_id, adaccount_id, adset_*
    /^adset/i,                // adset_name, adset_id
    /creo[-_]?id/i,           // creo_id (creative ID)
    /^sc_?cid$/i,             // ScCid (Snapchat click ID)
    /cid$/i,                  // ScCid, mc_cid, etc. — ends in 'cid'
    /log(?:ging)?/i,          // logging_key, log_id, log_key
];

/** Only flag value as suspicious hash when the param NAME also looks like tracking.
 *  This prevents false-positives on Firebase IDs, OAuth state, Stripe IDs etc. */
export function looksLikeTrackingName(key) {
    return TRACKER_NAME_PATTERNS.some(rx => rx.test(key));
}

/** Does the VALUE look like a random tracking hash? */
export function looksLikeTrackingValue(value) {
    if (!value || value.length < 8) return false;
    
    // Decode first to handle percent encoded tokens (e.g. UUID inside complex string)
    let decoded = value;
    try {
        decoded = decodeURIComponent(value);
    } catch { /* ignore */ }

    // UUID format (e.g. Snapchat ScCid, adaccount_id, or nested UUIDs)
    if (/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/i.test(decoded)) return true;
    if (decoded.length < 20) return false;
    if (/^[0-9a-f]{20,}$/i.test(decoded)) return true;
    if (/^[A-Za-z0-9+/=]{24,}$/.test(decoded) && !/^\d+$/.test(decoded)) return true;
    if (/^[A-Za-z0-9_-]{24,}$/.test(decoded) && /[A-Z]/.test(decoded) && /[0-9]/.test(decoded)) return true;
    return false;
}

/** Core decision: is this query param a tracker? */
export function isTracker(key, value) {
    const lk = key.toLowerCase();
    // ① Safelist is always checked FIRST — these are never removed
    if (SAFE_PARAMS.has(lk)) return false;
    // ② Explicit blocklist
    if (KNOWN_TRACKERS.has(key) || KNOWN_TRACKERS.has(lk)) return true;
    // ③ Name-pattern heuristic
    if (looksLikeTrackingName(key)) return true;
    // ④ Value-entropy heuristic
    if (looksLikeTrackingValue(value)) return true;
    return false;
}

// ─── Domain-specific overrides (Hybrid Deep Cleaning) ────────────────────────

function stripAllExcept(url, allowedKeys, removed) {
    const allowed = new Set(allowedKeys);
    for (const key of [...url.searchParams.keys()]) {
        if (!allowed.has(key)) {
            removed.push(key);
            url.searchParams.delete(key);
        }
    }
}

function cleanAmazon(url, removed) {
    if (/\/dp\/|\/gp\/product\//i.test(url.pathname)) {
        // Product listing page: only keep variation/theme keys (psc, th) if they exist
        stripAllExcept(url, ['psc', 'th'], removed);
    } else if (url.pathname.startsWith('/s')) {
        // Search results page: keep key queries
        stripAllExcept(url, ['k', 'field-keywords', 'node', 'rh'], removed);
    } else {
        stripAllExcept(url, [], removed);
    }
}

function cleanEbay(url, removed) {
    if (url.pathname.includes('/itm/')) {
        stripAllExcept(url, [], removed);
    } else if (url.pathname.includes('/sch/')) {
        stripAllExcept(url, ['_nkw', '_sacat', '_from'], removed);
    } else {
        stripAllExcept(url, [], removed);
    }
}

function cleanTwitter(url, removed) {
    if (url.pathname.includes('/search')) {
        stripAllExcept(url, ['q', 'src', 'f'], removed);
    } else {
        stripAllExcept(url, [], removed);
    }
}

export const DOMAIN_RULES = {
    'etsy.com': (url, removed) => {
        if (url.pathname.includes('/listing/')) {
            stripAllExcept(url, [], removed);
        } else if (url.pathname.includes('/search')) {
            stripAllExcept(url, ['q', 'search_query'], removed);
        } else {
            stripAllExcept(url, ['q'], removed);
        }
    },
    'etsy.me': (url, removed) => {
        stripAllExcept(url, [], removed);
    },
    'amazon.com': cleanAmazon,
    'amazon.co.uk': cleanAmazon,
    'amazon.fr': cleanAmazon,
    'amazon.de': cleanAmazon,
    'amazon.es': cleanAmazon,
    'amazon.it': cleanAmazon,
    'amazon.ca': cleanAmazon,
    'amazon.com.au': cleanAmazon,
    'amazon.co.jp': cleanAmazon,

    'ebay.com': cleanEbay,
    'ebay.co.uk': cleanEbay,
    'ebay.de': cleanEbay,
    'ebay.ca': cleanEbay,
    'ebay.com.au': cleanEbay,

    'aliexpress.com': (url, removed) => {
        if (url.pathname.includes('/item/')) {
            stripAllExcept(url, [], removed);
        } else {
            stripAllExcept(url, ['SearchText', 'catId', 'g'], removed);
        }
    },
    'youtube.com': (url, removed) => {
        stripAllExcept(url, ['v', 't', 'list', 'start_radio', 'index'], removed);
    },
    'youtu.be': (url, removed) => {
        stripAllExcept(url, ['t'], removed);
    },
    'x.com': cleanTwitter,
    'twitter.com': cleanTwitter,
};

// ─── Fragment tracker cleaning ────────────────────────────────────────────────
/** Strip known tracking params encoded in #hash fragments */
export function cleanFragment(hash) {
    if (!hash || hash.length <= 1) return hash;
    const body = hash.startsWith('#') ? hash.slice(1) : hash;
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
export function extractRedirectTarget(params) {
    for (const rp of REDIRECT_PARAMS) {
        const val = params.get(rp);
        if (val && /^https?:\/\//i.test(val)) return val;
    }
    return null;
}

// ─── Main pipeline ────────────────────────────────────────────────────────────
export function cleanURL(raw, depth = 0) {
    const MAX_DEPTH = 3;
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

    // Step 2: Clean query params — custom domain rules or fallback heuristics
    if (Object.prototype.hasOwnProperty.call(DOMAIN_RULES, baseDomain)) {
        DOMAIN_RULES[baseDomain](url, removed);
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
    if (cleanedHash !== url.hash) {
        const hashIdx = clean.indexOf('#');
        if (hashIdx !== -1) clean = clean.slice(0, hashIdx);
        if (cleanedHash) clean += cleanedHash;
    }
    
    clean = clean.replace(/[?&]$/, '');
    clean = removeDefaultPorts(clean);

    return { clean, removed };
}
