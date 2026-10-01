import React, { useState, useEffect, useRef, useCallback } from 'react';
import '../styles/PasswordGenerator.css';

const WORD_LIST = [
  'alpha', 'amber', 'anchor', 'angel', 'apple', 'arcade', 'arrow', 'atlas', 'autumn', 'beacon',
  'breeze', 'bridge', 'bubble', 'canyon', 'castle', 'cedar', 'celestial', 'cherry', 'cipher', 'clover',
  'cobalt', 'comet', 'copper', 'coral', 'cosmos', 'crater', 'crystal', 'current', 'delta', 'desert',
  'diamond', 'dolphin', 'dragon', 'drift', 'eagle', 'echo', 'eclipse', 'ember', 'falcon', 'feather',
  'flame', 'forest', 'fossil', 'galaxy', 'garden', 'glacier', 'glider', 'golden', 'granite', 'harbor',
  'haven', 'hawk', 'horizon', 'island', 'jasper', 'jungle', 'jupiter', 'lagoon', 'lantern', 'laser',
  'leaf', 'legend', 'lemon', 'lightning', 'lotus', 'lunar', 'magnet', 'mango', 'marble', 'matrix',
  'meadow', 'meteor', 'mirage', 'monarch', 'mountain', 'nebula', 'neon', 'nexus', 'nova', 'oasis',
  'ocean', 'olive', 'onyx', 'opal', 'orbit', 'orchid', 'origami', 'pacific', 'panther', 'paradox',
  'pearl', 'pebble', 'phoenix', 'pioneer', 'planet', 'plasma', 'polar', 'prism', 'pulse', 'pyramid',
  'quantum', 'quartz', 'quasar', 'radiant', 'rainbow', 'ranger', 'raven', 'ripple', 'river', 'rocket',
  'ruby', 'sable', 'safari', 'sailor', 'sapphire', 'saturn', 'shadow', 'shield', 'sierra', 'silver',
  'solstice', 'spark', 'sphere', 'spiral', 'spring', 'star', 'stellar', 'storm', 'stride', 'summit',
  'sunburst', 'surge', 'timber', 'titan', 'topaz', 'tornado', 'trail', 'trident', 'tundra', 'twilight',
  'valley', 'vapor', 'velvet', 'vortex', 'voyage', 'wave', 'willow', 'winter', 'zenith', 'zephyr'
];

const UPPERCASE_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const LOWERCASE_CHARS = 'abcdefghijklmnopqrstuvwxyz';
const NUMBER_CHARS = '0123456789';
const SYMBOL_CHARS = '!@#$%^&*()_+-=[]{}|;:,.<>?';
const AMBIGUOUS_SET = new Set(['0', 'O', 'o', '1', 'l', 'I', '|', '`', '\'', '"']);

// Cryptographically secure random integer between 0 and max - 1
const getSecureRandomInt = (max) => {
  if (window.crypto && window.crypto.getRandomValues) {
    const array = new Uint32Array(1);
    window.crypto.getRandomValues(array);
    return array[0] % max;
  }
  return Math.floor(Math.random() * max);
};

// Calculate entropy and strength rating
const calculateStrength = (password, mode) => {
  if (!password) {
    return { score: 0, label: 'Empty', color: '#999', percent: 0, entropy: 0 };
  }

  let poolSize = 0;
  let len = password.length;

  if (mode === 'password') {
    if (/[a-z]/.test(password)) poolSize += 26;
    if (/[A-Z]/.test(password)) poolSize += 26;
    if (/[0-9]/.test(password)) poolSize += 10;
    if (/[^a-zA-Z0-9]/.test(password)) poolSize += 32;
  } else if (mode === 'passphrase') {
    poolSize = WORD_LIST.length;
    len = password.split(/[-_., /]/).length;
  } else {
    // PIN
    poolSize = 10;
  }

  const entropy = Math.round(len * Math.log2(Math.max(poolSize, 2)));

  if (entropy < 35) {
    return { score: 1, label: 'Very Weak', color: '#e53935', percent: 20, entropy };
  } else if (entropy < 55) {
    return { score: 2, label: 'Weak', color: '#fb8c00', percent: 40, entropy };
  } else if (entropy < 75) {
    return { score: 3, label: 'Fair', color: '#fbc02d', percent: 60, entropy };
  } else if (entropy < 95) {
    return { score: 4, label: 'Strong', color: '#7cb342', percent: 80, entropy };
  } else {
    return { score: 5, label: 'Very Strong', color: '#00897b', percent: 100, entropy };
  }
};

const PasswordGenerator = () => {
  // Mode: 'password' | 'passphrase' | 'pin'
  const [mode, setMode] = useState('password');

  // Random Password Options
  const [length, setLength] = useState(16);
  const [includeUppercase, setIncludeUppercase] = useState(true);
  const [includeLowercase, setIncludeLowercase] = useState(true);
  const [includeNumbers, setIncludeNumbers] = useState(true);
  const [includeSymbols, setIncludeSymbols] = useState(true);
  const [excludeAmbiguous, setExcludeAmbiguous] = useState(false);

  // Passphrase Options
  const [wordCount, setWordCount] = useState(4);
  const [separator, setSeparator] = useState('-');
  const [capitalizeWords, setCapitalizeWords] = useState(true);
  const [includeNumberInPassphrase, setIncludeNumberInPassphrase] = useState(true);

  // PIN Options
  const [pinLength, setPinLength] = useState(6);

  // State for output & UI
  const [generatedPassword, setGeneratedPassword] = useState('');
  const [copySuccess, setCopySuccess] = useState(false);
  const [isMasked, setIsMasked] = useState(false);
  const [history, setHistory] = useState([]);
  const [showHistory, setShowHistory] = useState(false);
  const [isSpinning, setIsSpinning] = useState(false);

  const passwordRef = useRef(null);

  // Password Generation Logic
  const generate = useCallback(() => {
    let result = '';

    if (mode === 'password') {
      let pool = '';
      const guaranteed = [];

      const filterAmbiguous = (str) =>
        excludeAmbiguous ? str.split('').filter(c => !AMBIGUOUS_SET.has(c)).join('') : str;

      const upper = filterAmbiguous(UPPERCASE_CHARS);
      const lower = filterAmbiguous(LOWERCASE_CHARS);
      const nums = filterAmbiguous(NUMBER_CHARS);
      const syms = filterAmbiguous(SYMBOL_CHARS);

      if (includeUppercase && upper.length > 0) {
        pool += upper;
        guaranteed.push(upper[getSecureRandomInt(upper.length)]);
      }
      if (includeLowercase && lower.length > 0) {
        pool += lower;
        guaranteed.push(lower[getSecureRandomInt(lower.length)]);
      }
      if (includeNumbers && nums.length > 0) {
        pool += nums;
        guaranteed.push(nums[getSecureRandomInt(nums.length)]);
      }
      if (includeSymbols && syms.length > 0) {
        pool += syms;
        guaranteed.push(syms[getSecureRandomInt(syms.length)]);
      }

      // Fallback if user unchecks all
      if (pool.length === 0) {
        pool = lower;
      }

      const chars = [...guaranteed];
      const remaining = Math.max(0, length - guaranteed.length);
      for (let i = 0; i < remaining; i++) {
        chars.push(pool[getSecureRandomInt(pool.length)]);
      }

      // Fisher-Yates shuffle
      for (let i = chars.length - 1; i > 0; i--) {
        const j = getSecureRandomInt(i + 1);
        [chars[i], chars[j]] = [chars[j], chars[i]];
      }

      result = chars.slice(0, length).join('');
    } else if (mode === 'passphrase') {
      const chosenWords = [];
      for (let i = 0; i < wordCount; i++) {
        let w = WORD_LIST[getSecureRandomInt(WORD_LIST.length)];
        if (capitalizeWords) {
          w = w.charAt(0).toUpperCase() + w.slice(1);
        }
        chosenWords.push(w);
      }

      if (includeNumberInPassphrase) {
        const num = getSecureRandomInt(90) + 10; // 2-digit number (10-99)
        chosenWords.push(num.toString());
      }

      result = chosenWords.join(separator);
    } else if (mode === 'pin') {
      for (let i = 0; i < pinLength; i++) {
        result += getSecureRandomInt(10).toString();
      }
    }

    setGeneratedPassword(result);
    setCopySuccess(false);

    // Add to history (keep max 6 items, avoid duplicates)
    if (result) {
      setHistory(prev => [result, ...prev.filter(item => item !== result)].slice(0, 6));
    }
  }, [
    mode,
    length,
    includeUppercase,
    includeLowercase,
    includeNumbers,
    includeSymbols,
    excludeAmbiguous,
    wordCount,
    separator,
    capitalizeWords,
    includeNumberInPassphrase,
    pinLength
  ]);

  // Generate on initial render and when parameters change
  useEffect(() => {
    generate();
  }, [generate]);

  // Handle Refresh Click with subtle spin animation
  const handleRegenerate = () => {
    setIsSpinning(true);
    generate();
    setTimeout(() => setIsSpinning(false), 450);
  };

  // Copy to clipboard
  const copyToClipboard = (textToCopy = generatedPassword) => {
    if (!textToCopy) return;

    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(textToCopy).then(() => {
        setCopySuccess(true);
        setTimeout(() => setCopySuccess(false), 2000);
      }).catch(() => fallbackCopy(textToCopy));
    } else {
      fallbackCopy(textToCopy);
    }
  };

  const fallbackCopy = (text) => {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.opacity = '0';
    document.body.appendChild(textArea);
    textArea.select();
    try {
      document.execCommand('copy');
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch {
      // ignore
    }
    document.body.removeChild(textArea);
  };

  // Ensure at least one character type is always selected in password mode
  const handleTypeToggle = (type, currentVal, setter) => {
    const activeCount = [includeUppercase, includeLowercase, includeNumbers, includeSymbols].filter(Boolean).length;
    if (activeCount === 1 && currentVal) {
      return; // Disallow unchecking the last option
    }
    setter(!currentVal);
  };

  const strength = calculateStrength(generatedPassword, mode);

  return (
    <div className="password-generator-container">
      {/* Mode Selector Tabs */}
      <div className="pg-mode-tabs" role="tablist">
        <button
          type="button"
          role="tab"
          aria-selected={mode === 'password'}
          className={`pg-tab-btn ${mode === 'password' ? 'active' : ''}`}
          onClick={() => setMode('password')}
        >
          <i className="fas fa-shield-alt"></i> Password
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={mode === 'passphrase'}
          className={`pg-tab-btn ${mode === 'passphrase' ? 'active' : ''}`}
          onClick={() => setMode('passphrase')}
        >
          <i className="fas fa-font"></i> Passphrase
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={mode === 'pin'}
          className={`pg-tab-btn ${mode === 'pin' ? 'active' : ''}`}
          onClick={() => setMode('pin')}
        >
          <i className="fas fa-hashtag"></i> PIN Code
        </button>
      </div>

      {/* Password Display Box */}
      <div className="pg-output-card">
        <div className="pg-password-field-wrapper">
          <input
            type={isMasked ? 'password' : 'text'}
            readOnly
            value={generatedPassword}
            ref={passwordRef}
            className="pg-password-input"
            onClick={() => copyToClipboard()}
            title="Click to copy"
          />
        </div>

        <div className="pg-output-actions">
          <button
            type="button"
            className="pg-action-icon-btn"
            onClick={() => setIsMasked(!isMasked)}
            aria-label={isMasked ? 'Reveal password' : 'Hide password'}
            title={isMasked ? 'Reveal password' : 'Hide password'}
          >
            <i className={`fas ${isMasked ? 'fa-eye-slash' : 'fa-eye'}`}></i>
          </button>

          <button
            type="button"
            className={`pg-action-icon-btn ${isSpinning ? 'spinning' : ''}`}
            onClick={handleRegenerate}
            aria-label="Generate new password"
            title="Regenerate password"
          >
            <i className="fas fa-sync-alt"></i>
          </button>

          <button
            type="button"
            className={`pg-copy-btn ${copySuccess ? 'copied' : ''}`}
            onClick={() => copyToClipboard()}
            aria-label="Copy password to clipboard"
          >
            <i className={`fas ${copySuccess ? 'fa-check' : 'fa-copy'}`}></i>
            <span>{copySuccess ? 'Copied!' : 'Copy'}</span>
          </button>
        </div>
      </div>

      {/* Strength Meter */}
      <div className="pg-strength-section">
        <div className="pg-strength-meta">
          <span className="pg-strength-label">
            Strength: <strong style={{ color: strength.color }}>{strength.label}</strong>
          </span>
          <span className="pg-entropy-pill">
            {strength.entropy} bits entropy
          </span>
        </div>
        <div className="pg-strength-bar-track">
          <div
            className="pg-strength-bar-fill"
            style={{
              width: `${strength.percent}%`,
              backgroundColor: strength.color,
            }}
          />
        </div>
      </div>

      {/* Controls Container */}
      <div className="pg-controls-card">
        {/* ================= Mode: Random Characters Password ================= */}
        {mode === 'password' && (
          <div className="pg-mode-settings fade-in">
            {/* Length Slider & Quick Presets */}
            <div className="pg-setting-group">
              <div className="pg-setting-header">
                <label htmlFor="pg-length-slider" className="pg-setting-title">
                  Password Length
                </label>
                <div className="pg-length-badge">{length} characters</div>
              </div>

              <div className="pg-slider-row">
                <input
                  type="range"
                  id="pg-length-slider"
                  min="6"
                  max="64"
                  value={length}
                  onChange={(e) => setLength(parseInt(e.target.value, 10))}
                  className="pg-range-input"
                />
              </div>

              <div className="pg-preset-pills">
                {[12, 16, 20, 24, 32].map(preset => (
                  <button
                    key={preset}
                    type="button"
                    className={`pg-preset-btn ${length === preset ? 'active' : ''}`}
                    onClick={() => setLength(preset)}
                  >
                    {preset}
                  </button>
                ))}
              </div>
            </div>

            {/* Character Set Checkboxes */}
            <div className="pg-setting-group">
              <span className="pg-setting-title">Characters Included</span>
              <div className="pg-options-grid">
                <label className="pg-checkbox-card">
                  <input
                    type="checkbox"
                    checked={includeUppercase}
                    onChange={() => handleTypeToggle('upper', includeUppercase, setIncludeUppercase)}
                  />
                  <div className="pg-checkbox-custom">
                    <i className="fas fa-check"></i>
                  </div>
                  <div className="pg-checkbox-text">
                    <span className="pg-option-name">Uppercase Letters</span>
                    <span className="pg-option-hint">(A - Z)</span>
                  </div>
                </label>

                <label className="pg-checkbox-card">
                  <input
                    type="checkbox"
                    checked={includeLowercase}
                    onChange={() => handleTypeToggle('lower', includeLowercase, setIncludeLowercase)}
                  />
                  <div className="pg-checkbox-custom">
                    <i className="fas fa-check"></i>
                  </div>
                  <div className="pg-checkbox-text">
                    <span className="pg-option-name">Lowercase Letters</span>
                    <span className="pg-option-hint">(a - z)</span>
                  </div>
                </label>

                <label className="pg-checkbox-card">
                  <input
                    type="checkbox"
                    checked={includeNumbers}
                    onChange={() => handleTypeToggle('nums', includeNumbers, setIncludeNumbers)}
                  />
                  <div className="pg-checkbox-custom">
                    <i className="fas fa-check"></i>
                  </div>
                  <div className="pg-checkbox-text">
                    <span className="pg-option-name">Numbers</span>
                    <span className="pg-option-hint">(0 - 9)</span>
                  </div>
                </label>

                <label className="pg-checkbox-card">
                  <input
                    type="checkbox"
                    checked={includeSymbols}
                    onChange={() => handleTypeToggle('syms', includeSymbols, setIncludeSymbols)}
                  />
                  <div className="pg-checkbox-custom">
                    <i className="fas fa-check"></i>
                  </div>
                  <div className="pg-checkbox-text">
                    <span className="pg-option-name">Symbols</span>
                    <span className="pg-option-hint">(!@#$%^&*)</span>
                  </div>
                </label>
              </div>
            </div>

            {/* Avoid Ambiguous Characters */}
            <div className="pg-setting-group">
              <label className="pg-toggle-row">
                <div className="pg-toggle-info">
                  <span className="pg-toggle-title">Avoid Ambiguous Characters</span>
                  <span className="pg-toggle-subtitle">
                    Excludes easily confused symbols: <code>0, O, o, 1, l, I</code>
                  </span>
                </div>
                <div className="pg-switch">
                  <input
                    type="checkbox"
                    checked={excludeAmbiguous}
                    onChange={(e) => setExcludeAmbiguous(e.target.checked)}
                  />
                  <span className="pg-switch-slider"></span>
                </div>
              </label>
            </div>
          </div>
        )}

        {/* ================= Mode: Memorable Passphrase ================= */}
        {mode === 'passphrase' && (
          <div className="pg-mode-settings fade-in">
            {/* Word Count Slider */}
            <div className="pg-setting-group">
              <div className="pg-setting-header">
                <label htmlFor="pg-word-slider" className="pg-setting-title">
                  Word Count
                </label>
                <div className="pg-length-badge">{wordCount} words</div>
              </div>

              <div className="pg-slider-row">
                <input
                  type="range"
                  id="pg-word-slider"
                  min="3"
                  max="8"
                  value={wordCount}
                  onChange={(e) => setWordCount(parseInt(e.target.value, 10))}
                  className="pg-range-input"
                />
              </div>

              <div className="pg-preset-pills">
                {[3, 4, 5, 6].map(num => (
                  <button
                    key={num}
                    type="button"
                    className={`pg-preset-btn ${wordCount === num ? 'active' : ''}`}
                    onClick={() => setWordCount(num)}
                  >
                    {num} words
                  </button>
                ))}
              </div>
            </div>

            {/* Word Separator Selector */}
            <div className="pg-setting-group">
              <span className="pg-setting-title">Word Separator</span>
              <div className="pg-separators-row">
                {[
                  { id: '-', label: 'Hyphen (-)', char: '-' },
                  { id: '_', label: 'Underscore (_)', char: '_' },
                  { id: '.', label: 'Period (.)', char: '.' },
                  { id: ' ', label: 'Space ( )', char: ' ' },
                  { id: '/', label: 'Slash (/)', char: '/' }
                ].map(sep => (
                  <button
                    key={sep.id}
                    type="button"
                    className={`pg-sep-btn ${separator === sep.id ? 'active' : ''}`}
                    onClick={() => setSeparator(sep.id)}
                  >
                    <code>{sep.char === ' ' ? '␣' : sep.char}</code>
                    <span>{sep.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Toggles for Capitalize & Number */}
            <div className="pg-setting-group">
              <div className="pg-options-grid">
                <label className="pg-checkbox-card">
                  <input
                    type="checkbox"
                    checked={capitalizeWords}
                    onChange={(e) => setCapitalizeWords(e.target.checked)}
                  />
                  <div className="pg-checkbox-custom">
                    <i className="fas fa-check"></i>
                  </div>
                  <div className="pg-checkbox-text">
                    <span className="pg-option-name">Capitalize Words</span>
                    <span className="pg-option-hint">e.g. Tiger-Falcon-Moon</span>
                  </div>
                </label>

                <label className="pg-checkbox-card">
                  <input
                    type="checkbox"
                    checked={includeNumberInPassphrase}
                    onChange={(e) => setIncludeNumberInPassphrase(e.target.checked)}
                  />
                  <div className="pg-checkbox-custom">
                    <i className="fas fa-check"></i>
                  </div>
                  <div className="pg-checkbox-text">
                    <span className="pg-option-name">Include Random Number</span>
                    <span className="pg-option-hint">Adds 2-digit number (e.g. -42)</span>
                  </div>
                </label>
              </div>
            </div>
          </div>
        )}

        {/* ================= Mode: PIN Code ================= */}
        {mode === 'pin' && (
          <div className="pg-mode-settings fade-in">
            <div className="pg-setting-group">
              <div className="pg-setting-header">
                <label htmlFor="pg-pin-slider" className="pg-setting-title">
                  PIN Length
                </label>
                <div className="pg-length-badge">{pinLength} digits</div>
              </div>

              <div className="pg-slider-row">
                <input
                  type="range"
                  id="pg-pin-slider"
                  min="4"
                  max="12"
                  value={pinLength}
                  onChange={(e) => setPinLength(parseInt(e.target.value, 10))}
                  className="pg-range-input"
                />
              </div>

              <div className="pg-preset-pills">
                {[4, 6, 8, 10].map(preset => (
                  <button
                    key={preset}
                    type="button"
                    className={`pg-preset-btn ${pinLength === preset ? 'active' : ''}`}
                    onClick={() => setPinLength(preset)}
                  >
                    {preset} digits
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Action Button: Generate */}
        <button
          type="button"
          onClick={handleRegenerate}
          className="pg-main-generate-btn"
        >
          <i className="fas fa-sync-alt"></i> Generate New Password
        </button>

        {/* History Accordion */}
        {history.length > 1 && (
          <div className="pg-history-container">
            <button
              type="button"
              className="pg-history-toggle"
              onClick={() => setShowHistory(!showHistory)}
            >
              <span>
                <i className="fas fa-history"></i> Recent Passwords ({history.length})
              </span>
              <i className={`fas fa-chevron-${showHistory ? 'up' : 'down'}`}></i>
            </button>

            {showHistory && (
              <div className="pg-history-list fade-in">
                {history.map((pw, idx) => (
                  <div key={idx} className="pg-history-item">
                    <span className="pg-history-text">{pw}</span>
                    <button
                      type="button"
                      className="pg-history-copy-btn"
                      onClick={() => copyToClipboard(pw)}
                      title="Copy this password"
                    >
                      <i className="fas fa-copy"></i>
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default PasswordGenerator;