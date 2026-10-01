import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  normalizeBarcode,
  calculateCheckDigit,
  validateCheckDigit,
  getGS1Country,
  getGS1Company,
  fetchProductDetails
} from '../utils/barcodeUtils.js';
import '../styles/BarcodeScanner.css';

const SAMPLE_CATEGORIES = [
  {
    category: '📚 Books (ISBN)',
    items: [
      { label: 'Roald Dahl Book', code: '9780140328721' }
    ]
  },
  {
    category: '🍫 Food & Groceries',
    items: [
      { label: 'Fruit & Fibre Cereal (EAN-8)', code: '20696351' },
      { label: 'Nutella (France)', code: '3017620422003' },
      { label: 'Coca-Cola (Belgium)', code: '5449000000996' },
      { label: 'Heinz Beans (UK)', code: '5000157024671' },
      { label: 'Haribo Goldbears (DE)', code: '4001686301265' }
    ]
  },
  {
    category: '📱 Tech & Electronics',
    items: [
      { label: 'Apple iPhone 13 Pro', code: '0194252042458' },
      { label: 'Google Pixel 8 Pro', code: '0842776100000' },
      { label: 'Nintendo Switch OLED', code: '0045496453435' },
      { label: 'Sony PS5 Controller', code: '0711719541028' }
    ]
  },
  {
    category: '🧱 Toys & Bricks',
    items: [
      { label: 'LEGO Star Wars Set', code: '5702017156553' },
      { label: 'LEGO Flower Bouquet', code: '5702016913980' }
    ]
  },
  {
    category: '⚠️ Validation Tests',
    items: [
      { label: 'Invalid Check Digit', code: '3017620422004' }
    ]
  }
];

const BarcodeScanner = () => {
  const [barcode, setBarcode] = useState('');
  const [formatPreference, setFormatPreference] = useState('auto'); // 'auto' | 'ean13' | 'ean8'
  const [showNutrition, setShowNutrition] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [showSamples, setShowSamples] = useState(false);
  const [scannerStatus, setScannerStatus] = useState('');
  const [facingMode, setFacingMode] = useState('environment');
  const [hasTorch, setHasTorch] = useState(false);
  const [torchOn, setTorchOn] = useState(false);
  const [loadingProduct, setLoadingProduct] = useState(false);
  const [productData, setProductData] = useState(null);
  const [scanHistory, setScanHistory] = useState([]);

  const inputRef = useRef(null);
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const scanIntervalRef = useRef(null);
  const zxingControlsRef = useRef(null);
  const fileInputRef = useRef(null);

  // Focus the input to allow immediate keyboard typing
  const focusInput = () => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  // Stop camera tracks cleanly
  const stopCamera = useCallback(() => {
    if (scanIntervalRef.current) {
      clearInterval(scanIntervalRef.current);
      scanIntervalRef.current = null;
    }
    if (zxingControlsRef.current) {
      try {
        zxingControlsRef.current.stop();
      } catch (err) {
        // ignore
      }
      zxingControlsRef.current = null;
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setIsScanning(false);
    setTorchOn(false);
    setHasTorch(false);
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, [stopCamera]);

  // Set barcode from sample, scan, or paste
  const handleBarcodeSelect = useCallback((rawCode) => {
    const clean = normalizeBarcode(rawCode);
    if (clean.length === 8) {
      setFormatPreference('auto');
    }
    setBarcode(clean);
    setShowSamples(false);
    setShowNutrition(false);
  }, []);

  // Live product lookup when an 8-digit EAN-8 or 12/13-digit code is entered
  useEffect(() => {
    let isCancelled = false;

    const isEan8Candidate = barcode.length === 8;
    const isFullCandidate = barcode.length >= 12;

    if (isEan8Candidate || isFullCandidate) {
      const normalized = normalizeBarcode(barcode);
      setLoadingProduct(true);

      fetchProductDetails(normalized).then(data => {
        if (!isCancelled) {
          setProductData(data);
          setLoadingProduct(false);

          setScanHistory(prev => {
            const filtered = prev.filter(item => item.code !== normalized);
            const title = data?.name || `Barcode ${normalized}`;
            const countryInfo = getGS1Country(normalized);
            return [{ code: normalized, title, flag: countryInfo.flag }, ...filtered].slice(0, 6);
          });
        }
      }).catch(() => {
        if (!isCancelled) {
          setLoadingProduct(false);
        }
      });
    } else {
      setProductData(null);
      setLoadingProduct(false);
    }

    return () => {
      isCancelled = true;
    };
  }, [barcode]);

  // Handle direct keyboard input
  const handleInputChange = (e) => {
    const raw = e.target.value;
    const cleanDigits = raw.replace(/\D/g, '').slice(0, 13);
    if (formatPreference === 'ean8') {
      setBarcode(cleanDigits.slice(0, 8));
    } else {
      setBarcode(cleanDigits);
    }
  };

  // Clear current input
  const handleClear = () => {
    setBarcode('');
    setProductData(null);
    setShowNutrition(false);
    setScannerStatus('');
    focusInput();
  };

  // Quick clipboard paste
  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      const clean = normalizeBarcode(text);
      if (clean) {
        setBarcode(clean);
        focusInput();
      }
    } catch (err) {
      console.warn('Clipboard read failed:', err);
    }
  };

  // Start Camera scanning with BarcodeDetector or ZXing fallback
  const startCamera = async (currentFacing = facingMode) => {
    stopCamera();
    setShowSamples(false);
    setScannerStatus('Requesting camera access...');
    setIsScanning(true);

    try {
      const constraints = {
        video: {
          facingMode: currentFacing,
          width: { ideal: 1280 },
          height: { ideal: 720 }
        }
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      streamRef.current = stream;

      const video = videoRef.current;
      if (!video) return;

      video.srcObject = stream;
      await video.play();

      const videoTrack = stream.getVideoTracks()[0];
      if (videoTrack) {
        const capabilities = videoTrack.getCapabilities ? videoTrack.getCapabilities() : {};
        if (capabilities.torch) {
          setHasTorch(true);
        }
      }

      setScannerStatus('Align barcode inside the box');

      // Native BarcodeDetector if available
      if ('BarcodeDetector' in window) {
        try {
          const detector = new window.BarcodeDetector({
            formats: ['ean_13', 'upc_a', 'ean_8', 'code_128']
          });

          scanIntervalRef.current = setInterval(async () => {
            if (!videoRef.current || videoRef.current.readyState < 2) return;
            try {
              const barcodes = await detector.detect(videoRef.current);
              if (barcodes && barcodes.length > 0) {
                const detected = barcodes[0].rawValue;
                if (detected) {
                  handleBarcodeSelect(detected);
                  stopCamera();
                }
              }
            } catch (err) {
              // frame drop
            }
          }, 200);
          return;
        } catch (detectorErr) {
          console.warn('BarcodeDetector instantiation failed, falling back to ZXing', detectorErr);
        }
      }

      // Fallback to ZXing
      try {
        const { BrowserMultiFormatReader } = await import('@zxing/browser');
        const codeReader = new BrowserMultiFormatReader();

        const controls = await codeReader.decodeFromVideoElement(video, (result) => {
          if (result) {
            handleBarcodeSelect(result.getText());
            stopCamera();
          }
        });
        zxingControlsRef.current = controls;
      } catch (zxingErr) {
        console.warn('ZXing fallback scanner error:', zxingErr);
        setScannerStatus('Live scanning unavailable. Type number or upload a photo.');
      }

    } catch (err) {
      console.error('Camera error:', err);
      stopCamera();
      setScannerStatus('Camera access denied or unavailable. Tap below to type or upload an image.');
    }
  };

  // Toggle Torch / Flashlight
  const toggleTorch = async () => {
    if (!streamRef.current) return;
    const track = streamRef.current.getVideoTracks()[0];
    if (track && track.applyConstraints) {
      const nextState = !torchOn;
      try {
        await track.applyConstraints({
          advanced: [{ torch: nextState }]
        });
        setTorchOn(nextState);
      } catch (err) {
        console.warn('Could not toggle torch:', err);
      }
    }
  };

  // Switch between front and back camera
  const flipCamera = () => {
    const nextFacing = facingMode === 'environment' ? 'user' : 'environment';
    setFacingMode(nextFacing);
    startCamera(nextFacing);
  };

  // Handle Photo / File Upload
  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setScannerStatus('Decoding image...');
    setShowSamples(false);

    try {
      const imgUrl = URL.createObjectURL(file);
      const img = new Image();
      img.src = imgUrl;

      await new Promise((resolve, reject) => {
        img.onload = resolve;
        img.onerror = reject;
      });

      // Try BarcodeDetector
      if ('BarcodeDetector' in window) {
        try {
          const detector = new window.BarcodeDetector({
            formats: ['ean_13', 'upc_a', 'ean_8', 'code_128']
          });
          const barcodes = await detector.detect(img);
          if (barcodes && barcodes.length > 0) {
            handleBarcodeSelect(barcodes[0].rawValue);
            setScannerStatus('');
            URL.revokeObjectURL(imgUrl);
            return;
          }
        } catch (detErr) {
          console.warn('BarcodeDetector image error:', detErr);
        }
      }

      // Fallback to ZXing
      const { BrowserMultiFormatReader } = await import('@zxing/browser');
      const reader = new BrowserMultiFormatReader();
      const result = await reader.decodeFromImageUrl(imgUrl);

      if (result) {
        handleBarcodeSelect(result.getText());
        setScannerStatus('');
      } else {
        setScannerStatus('No barcode detected in this image. Try another photo.');
      }
      URL.revokeObjectURL(imgUrl);
    } catch (err) {
      console.warn('Image decode error:', err);
      setScannerStatus('Could not read a barcode from that image. Ensure good lighting and focus.');
    }

    if (e.target) {
      e.target.value = '';
    }
  };

  // Determine if active format is EAN-8 (8 digits) or standard (13 digits)
  const isEan8 = formatPreference === 'ean8' || (formatPreference === 'auto' && barcode.length === 8);
  const totalDigits = isEan8 ? 8 : 13;

  // GS1 Prefix detection (matches immediately upon typing 2 or 3 digits)
  const gs1Country = getGS1Country(barcode);
  const hasPrefixMatch = gs1Country.matched;

  // Check GS1 Company (Apple, Google, Lego, Nintendo, Sony, etc.)
  const gs1Company = getGS1Company(barcode);

  // Modulo-10 Check Digit computation
  const isCompleteCode = isEan8 ? barcode.length === 8 : barcode.length === 13;
  const isCheckValid = isCompleteCode && validateCheckDigit(barcode);
  const expectedCheckDigit = isEan8
    ? (barcode.length >= 7 ? calculateCheckDigit(barcode.slice(0, 7)) : null)
    : (barcode.length >= 12 ? calculateCheckDigit(barcode.slice(0, 12)) : null);

  // Active cursor index (the next unfilled digit box)
  const activeCursorIndex = barcode.length < totalDigits ? barcode.length : -1;

  // Dynamic Boxes array based on active total digits (8 for EAN-8, 13 for EAN-13)
  const digitBoxes = Array.from({ length: totalDigits }, (_, i) => barcode[i] || '');

  // Prefix length calculation for brackets
  const prefixLength = gs1Country.prefix ? Math.max(gs1Country.prefix.length, 2) : 2;
  const checkDigitIndex = isEan8 ? 7 : 12;

  return (
    <div className="barcode-scanner-root">
      {/* Intro Description */}
      <div className="barcode-intro">
        <p>Type digits directly into the boxes below, use your camera to scan, or pick a sample.</p>
      </div>

      {/* Action Toolbar */}
      <div className="barcode-toolbar">
        <div className="toolbar-left">
          <button
            type="button"
            className={`toolbar-btn primary-btn ${isScanning ? 'active' : ''}`}
            onClick={isScanning ? stopCamera : () => startCamera()}
          >
            <i className={`fas ${isScanning ? 'fa-stop-circle' : 'fa-camera'}`}></i>
            <span>{isScanning ? 'Stop' : 'Scan'}</span>
          </button>

          <button
            type="button"
            className="toolbar-btn secondary-btn"
            onClick={() => fileInputRef.current?.click()}
            title="Upload photo of barcode"
          >
            <i className="fas fa-image"></i>
            <span>Photo</span>
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            style={{ display: 'none' }}
            onChange={handleFileUpload}
          />

          <button
            type="button"
            className="toolbar-btn secondary-btn"
            onClick={handlePaste}
            title="Paste barcode from clipboard"
          >
            <i className="fas fa-paste"></i>
            <span>Paste</span>
          </button>

          {/* Toggleable Samples button (Keeps UI clean until user clicks) */}
          <button
            type="button"
            className={`toolbar-btn secondary-btn samples-btn ${showSamples ? 'active' : ''}`}
            onClick={() => setShowSamples(!showSamples)}
            title="View sample barcodes for Tech, Toys, Books, and Groceries"
          >
            <i className="fas fa-lightbulb"></i>
            <span>Samples {showSamples ? '▴' : '▾'}</span>
          </button>
        </div>

        {/* Barcode Format Selector (Auto / 13 Digits / 8 Digits) */}
        <div className="toolbar-center">
          <div className="format-pills" role="group" aria-label="Barcode format selector">
            <button
              type="button"
              className={`format-pill-btn ${formatPreference === 'auto' ? 'active' : ''}`}
              onClick={() => setFormatPreference('auto')}
              title="Automatically detect EAN-8 or EAN-13 based on length"
            >
              Auto
            </button>
            <button
              type="button"
              className={`format-pill-btn ${formatPreference === 'ean13' ? 'active' : ''}`}
              onClick={() => {
                setFormatPreference('ean13');
                focusInput();
              }}
              title="Standard 13-Digit EAN-13"
            >
              13 Digits
            </button>
            <button
              type="button"
              className={`format-pill-btn ${formatPreference === 'ean8' ? 'active' : ''}`}
              onClick={() => {
                setFormatPreference('ean8');
                if (barcode.length > 8) setBarcode(barcode.slice(0, 8));
                focusInput();
              }}
              title="Compact 8-Digit EAN-8"
            >
              8 Digits
            </button>
          </div>
        </div>

        <div className="toolbar-right">
          <span className="status-indicator">
            {barcode.length === 0
              ? 'Tap to type'
              : isEan8
                ? `${barcode.length}/8 (EAN-8)`
                : `${barcode.length}/13 (EAN-13)`}
          </span>
          {barcode.length > 0 && (
            <button
              type="button"
              className="toolbar-btn clear-btn"
              onClick={handleClear}
              title="Clear all digits"
            >
              <i className="fas fa-times"></i>
              <span>Clear</span>
            </button>
          )}
        </div>
      </div>

      {/* Collapsible Samples Popover (Only visible when user toggles Samples) */}
      {showSamples && (
        <div className="samples-popover">
          <div className="samples-popover-header">
            <span className="samples-popover-title">
              <i className="fas fa-barcode"></i> Select a Sample Barcode
            </span>
            <button
              type="button"
              className="samples-close-btn"
              onClick={() => setShowSamples(false)}
              aria-label="Close samples"
            >
              <i className="fas fa-times"></i>
            </button>
          </div>

          {SAMPLE_CATEGORIES.map((cat, cIdx) => (
            <div key={cIdx} className="samples-category-group">
              <span className="samples-category-title">{cat.category}</span>
              <div className="samples-grid">
                {cat.items.map((item) => (
                  <button
                    key={item.code}
                    type="button"
                    className={`sample-chip ${barcode === item.code ? 'active-chip' : ''}`}
                    onClick={() => {
                      handleBarcodeSelect(item.code);
                      focusInput();
                    }}
                  >
                    <span>{item.label}</span>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Scanner Status or Error Notice */}
      {scannerStatus && (
        <div className="scanner-status-msg">
          <i className="fas fa-info-circle" style={{ marginRight: '6px' }}></i>
          {scannerStatus}
        </div>
      )}

      {/* Live Camera Scanner Viewport */}
      {isScanning && (
        <div className="camera-scanner-panel">
          <video ref={videoRef} playsInline muted className="scanner-video" />
          <div className="scanner-overlay">
            <div className="scanner-reticle">
              <div className="scanner-laser"></div>
            </div>
          </div>
          <div className="scanner-controls">
            {hasTorch && (
              <button type="button" className="scanner-ctrl-btn" onClick={toggleTorch}>
                <i className="fas fa-lightbulb"></i>
                <span>{torchOn ? 'Flash Off' : 'Flash On'}</span>
              </button>
            )}
            <button type="button" className="scanner-ctrl-btn" onClick={flipCamera}>
              <i className="fas fa-sync-alt"></i>
              <span>Flip Camera</span>
            </button>
            <button type="button" className="scanner-ctrl-btn" onClick={stopCamera}>
              <i className="fas fa-times"></i>
              <span>Close</span>
            </button>
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────
          Interactive Stage: Digits as Direct Text Input
          (TALLER on mobile: 410px clearance, NO overlapping text)
          ───────────────────────────────────────────────────────── */}
      <div
        className="barcode-stage-container"
        onClick={focusInput}
        title="Click or tap to enter barcode digits"
      >
        {/* Hidden full-capture input to bring up mobile keyboard & capture typing */}
        <input
          ref={inputRef}
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          autoComplete="off"
          value={barcode}
          onChange={handleInputChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className="hidden-stage-input"
          aria-label="Barcode input field"
        />

        <div
          className={`barcode-stage ${isFocused ? 'is-focused' : ''}`}
          style={{ '--total-digits': totalDigits }}
        >
          {/* Top Bracket 1: GS1 Prefix / Registered Country
              ANIMATES IN AS SOON AS THE PREFIX IS IDENTIFIED (length >= 2) */}
          <div
            className={`bracket-anno ${hasPrefixMatch ? 'is-visible' : ''}`}
            style={{
              '--s': 0,
              '--n': Math.min(prefixLength, isEan8 ? 3 : 3),
              '--h': '165px',
              '--bracket-color': '#2563eb'
            }}
          >
            <i className="bracket-stem"></i>
            <i className="bracket-frame"></i>
            <div className="bracket-label">
              <div className="bracket-title">{gs1Country.flag} Registered in {gs1Country.name}</div>
              <small>Prefix ({gs1Country.prefix || barcode.slice(0, 3)}) · GS1 Registry</small>
            </div>
          </div>

          {/* Top Bracket 2: Product & Brand Information
              ANIMATES IN WHEN DIGITS 3+ ARE BEING ENTERED */}
          <div
            className={`bracket-anno ${barcode.length >= 2 ? 'is-visible' : ''}`}
            style={{
              '--s': prefixLength,
              '--n': Math.max((isEan8 ? 7 : 12) - prefixLength, 1),
              '--h': '95px',
              '--bracket-color': 'var(--tertiary-color)'
            }}
          >
            <i className="bracket-stem"></i>
            <i className="bracket-frame"></i>
            <div className="bracket-label">
              {loadingProduct ? (
                <>
                  <div className="bracket-title"><i className="fas fa-spinner fa-spin"></i> Looking up product...</div>
                  <small>Global Product Index</small>
                </>
              ) : productData && productData.found ? (
                <>
                  <div className="bracket-title">{productData.name}</div>
                  <small>{productData.brand} · Catalog Match</small>
                </>
              ) : gs1Company ? (
                <>
                  <div className="bracket-title">{gs1Company.name}</div>
                  <small>{gs1Company.category}</small>
                </>
              ) : (
                <>
                  <div className="bracket-title">Product & Company Data</div>
                  <small>
                    {barcode.length >= (isEan8 ? 7 : 12)
                      ? 'Catalog search complete'
                      : `Digits ${prefixLength + 1}–${isEan8 ? 7 : 12} · Entered ${Math.min(barcode.length, isEan8 ? 7 : 12)}/${isEan8 ? 7 : 12}`}
                  </small>
                </>
              )}
            </div>
          </div>

          {/* Digits Grid: Automatically renders 8 or 13 boxes */}
          <div className="digits-row">
            {digitBoxes.map((digit, idx) => {
              const isFilled = Boolean(digit);
              const isActiveCursor = isFocused && idx === activeCursorIndex;

              let colorClass = '';
              if (idx < prefixLength) {
                colorClass = 'prefix-digit';
              } else if (idx < checkDigitIndex) {
                colorClass = 'body-digit';
              } else if (isCompleteCode) {
                colorClass = isCheckValid ? 'chk-valid' : 'chk-invalid';
              }

              return (
                <div
                  key={idx}
                  className={`digit-box ${isFilled ? 'filled' : ''} ${isFilled ? colorClass : ''} ${isActiveCursor ? 'active-cursor' : ''}`}
                >
                  {isFilled ? digit : <span className="digit-placeholder">·</span>}
                </div>
              );
            })}
          </div>

          {/* Bottom Bracket 2.5: Describes company & item build */}
          <div
            className={`bracket-anno-bottom ${barcode.length >= 2 ? 'is-visible' : ''}`}
            style={{
              '--s': 0,
              '--n': isEan8 ? 7 : 12,
              '--bracket-color': 'rgba(128, 128, 128, 0.35)'
            }}
          >
            <i className="bracket-frame"></i>
            <div className="bottom-bracket-subtext">
              {isEan8 ? 'Item & prefix reference (7 digits)' : 'Company & item reference digits'}
            </div>
          </div>

          {/* Bottom Bracket 3: Modulo-10 Check Digit
              ANIMATES IN IMMEDIATELY UPON 8TH DIGIT (EAN-8) OR 13TH DIGIT (EAN-13) */}
          <div
            className={`bracket-anno-bottom ${isCompleteCode ? 'is-visible' : ''}`}
            style={{
              '--s': checkDigitIndex,
              '--n': 1,
              '--bracket-color': isCheckValid ? '#16a34a' : '#dc2626'
            }}
          >
            <i className="bracket-stem"></i>
            <i className="bracket-frame"></i>
            <div className="bracket-label">
              {isCheckValid ? (
                <>
                  <div className="bracket-title" style={{ color: '#16a34a' }}>✓ Check digit matches</div>
                  <small>GS1 Modulo-10 verified</small>
                </>
              ) : (
                <>
                  <div className="bracket-title" style={{ color: '#dc2626' }}>✗ Check digit mismatch</div>
                  <small>Expected digit: {expectedCheckDigit}</small>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Immediate Real-Time Country Identification Badge
          Shows up AS SOON AS 2 or 3 digits identify the country! */}
      {hasPrefixMatch && (
        <div className="instant-country-badge">
          <div className="badge-country-info">
            <span style={{ fontSize: '1.25rem' }}>{gs1Country.flag}</span>
            <span>
              Registered in <strong>{gs1Country.name}</strong> (GS1 Prefix {gs1Country.prefix})
            </span>
          </div>
          <div className="badge-progress-count">
            {barcode.length < totalDigits ? `${barcode.length} of ${totalDigits} digits` : 'Complete'}
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────
          Detailed Product Information Card (Tech, Toys, Food, Books)
          ───────────────────────────────────────────────────────── */}
      {(isCompleteCode || barcode.length >= 12) && (
        <div className="product-card">
          <div className="product-card-top">
            <div className="product-photo-wrap">
              {productData?.image ? (
                <img
                  src={productData.image}
                  alt={productData?.name || 'Product'}
                  className="product-photo"
                  loading="lazy"
                />
              ) : (
                <i className={`fas ${/^97[89]/.test(barcode) ? 'fa-book' : 'fa-box-open'} product-photo-fallback`}></i>
              )}
            </div>

            <div className="product-headline">
              <h3 className="product-name">
                {productData?.name || (loadingProduct ? 'Searching database...' : 'Product details')}
              </h3>
              {productData?.brand && (
                <div className="product-brand">{productData.brand}</div>
              )}

              <div className="product-badge-row">
                {hasPrefixMatch && (
                  <span className="badge badge-country">
                    {gs1Country.flag} GS1: {gs1Country.name}
                  </span>
                )}

                {isCompleteCode && (
                  <span className={`badge ${isCheckValid ? 'badge-valid' : 'badge-invalid'}`}>
                    <i className={`fas ${isCheckValid ? 'fa-check' : 'fa-times'}`}></i>
                    {isCheckValid ? 'Valid Checksum' : 'Checksum Mismatch'}
                  </span>
                )}

                {productData?.source && (
                  <span className="badge badge-source">
                    <i className="fas fa-database"></i> {productData.source}
                  </span>
                )}

                {productData?.nutriscore && (
                  <span className={`badge badge-nutri nutri-${productData.nutriscore.toLowerCase()}`}>
                    Nutri-Score {productData.nutriscore.toUpperCase()}
                  </span>
                )}

                {isEan8 && (
                  <span className="badge badge-source" style={{ background: 'rgba(37, 99, 235, 0.15)', color: '#2563eb' }}>
                    EAN-8 Format
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="product-details-grid">
            {/* GS1 Registered Country */}
            <div className="detail-row">
              <span className="detail-label">
                <i className="fas fa-registered"></i> Registered in:
              </span>
              <span className="detail-value">
                {gs1Country.flag} {gs1Country.name}
              </span>
            </div>

            {/* Brand / Manufacturer */}
            <div className="detail-row">
              <span className="detail-label">
                <i className="fas fa-building"></i> Brand / Manufacturer:
              </span>
              <span className="detail-value highlight-origin">
                {productData?.brand || (gs1Company ? gs1Company.name : 'Unknown')}
              </span>
            </div>

            {/* Category / Type */}
            <div className="detail-row">
              <span className="detail-label">
                <i className="fas fa-tags"></i> Product Type:
              </span>
              <span className="detail-value">
                {productData?.category || (gs1Company ? gs1Company.category : 'General Retail Item')}
              </span>
            </div>

            {/* Headquarters / Origin */}
            {(productData?.headquarters || productData?.origin) && (
              <div className="detail-row">
                <span className="detail-label">
                  <i className="fas fa-map-marker-alt"></i> Headquarters / Origin:
                </span>
                <span className="detail-value">
                  {productData?.origin || productData?.headquarters}
                </span>
              </div>
            )}

            {/* Package / Size */}
            {productData?.quantity && (
              <div className="detail-row">
                <span className="detail-label">
                  <i className="fas fa-cube"></i> Quantity / Spec:
                </span>
                <span className="detail-value">{productData.quantity}</span>
              </div>
            )}

            {/* Barcode Number */}
            <div className="detail-row">
              <span className="detail-label">
                <i className="fas fa-barcode"></i> {isEan8 ? 'EAN-8' : 'EAN / UPC'}:
              </span>
              <span className="detail-value" style={{ fontFamily: 'monospace' }}>
                {barcode}
              </span>
            </div>
          </div>

          {/* Food Nutrition & Health Info ("More Info" Toggle) */}
          {Boolean(productData?.isFood || productData?.nutrientLevels || productData?.nutriments || productData?.ingredients) && (
            <div className="food-info-section">
              <button
                type="button"
                className={`food-info-toggle-btn ${showNutrition ? 'active' : ''}`}
                onClick={() => setShowNutrition(!showNutrition)}
                aria-expanded={showNutrition}
              >
                <div className="food-btn-title">
                  <i className="fas fa-apple-alt"></i>
                  <span>{showNutrition ? 'Hide Nutritional & Health Info' : 'More Info: Nutrition, Ingredients & Health'}</span>
                </div>
                <i className={`fas ${showNutrition ? 'fa-chevron-up' : 'fa-chevron-down'}`}></i>
              </button>

              {showNutrition && (
                <div className="food-nutrition-panel">
                  {/* Traffic Light Health Parameters Grid */}
                  {productData?.nutrientLevels && (
                    <div className="nutrient-traffic-section">
                      <div className="nutrition-section-header">
                        <span className="section-title">
                          <i className="fas fa-heartbeat"></i> Health & Nutrient Levels (per 100g)
                        </span>
                        <div className="traffic-light-legend">
                          <span className="legend-tag tag-low">● Low</span>
                          <span className="legend-tag tag-moderate">● Moderate</span>
                          <span className="legend-tag tag-high">● High</span>
                        </div>
                      </div>

                      <div className="nutrient-cards-grid">
                        {/* Sugars */}
                        <div className={`nutrient-card card-${productData.nutrientLevels.sugars || 'neutral'}`}>
                          <div className="nutrient-card-name">Sugars</div>
                          <div className="nutrient-card-amount">
                            {productData.nutriments?.sugars != null ? `${productData.nutriments.sugars} g` : '—'}
                          </div>
                          <span className={`nutrient-pill pill-${productData.nutrientLevels.sugars || 'neutral'}`}>
                            {productData.nutrientLevels.sugars || 'Unknown'}
                          </span>
                        </div>

                        {/* Fat */}
                        <div className={`nutrient-card card-${productData.nutrientLevels.fat || 'neutral'}`}>
                          <div className="nutrient-card-name">Fat</div>
                          <div className="nutrient-card-amount">
                            {productData.nutriments?.fat != null ? `${productData.nutriments.fat} g` : '—'}
                          </div>
                          <span className={`nutrient-pill pill-${productData.nutrientLevels.fat || 'neutral'}`}>
                            {productData.nutrientLevels.fat || 'Unknown'}
                          </span>
                        </div>

                        {/* Saturated Fat */}
                        <div className={`nutrient-card card-${productData.nutrientLevels['saturated-fat'] || 'neutral'}`}>
                          <div className="nutrient-card-name">Saturated Fat</div>
                          <div className="nutrient-card-amount">
                            {productData.nutriments?.saturatedFat != null ? `${productData.nutriments.saturatedFat} g` : '—'}
                          </div>
                          <span className={`nutrient-pill pill-${productData.nutrientLevels['saturated-fat'] || 'neutral'}`}>
                            {productData.nutrientLevels['saturated-fat'] || 'Unknown'}
                          </span>
                        </div>

                        {/* Salt */}
                        <div className={`nutrient-card card-${productData.nutrientLevels.salt || 'neutral'}`}>
                          <div className="nutrient-card-name">Salt</div>
                          <div className="nutrient-card-amount">
                            {productData.nutriments?.salt != null ? `${productData.nutriments.salt} g` : '—'}
                          </div>
                          <span className={`nutrient-pill pill-${productData.nutrientLevels.salt || 'neutral'}`}>
                            {productData.nutrientLevels.salt || 'Unknown'}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Quantitative Nutriments (Calories, Fiber, Protein) */}
                  {productData?.nutriments && (
                    <div className="nutriment-metrics-row">
                      {productData.nutriments.energyKcal != null && (
                        <div className="metric-chip">
                          <span className="metric-label">Energy:</span>
                          <span className="metric-val">{productData.nutriments.energyKcal} kcal</span>
                        </div>
                      )}
                      {productData.nutriments.fiber != null && (
                        <div className="metric-chip">
                          <span className="metric-label">Dietary Fiber:</span>
                          <span className="metric-val">{productData.nutriments.fiber} g</span>
                        </div>
                      )}
                      {productData.nutriments.proteins != null && (
                        <div className="metric-chip">
                          <span className="metric-label">Proteins:</span>
                          <span className="metric-val">{productData.nutriments.proteins} g</span>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Nutri-Score & NOVA Group Classification */}
                  {(productData?.nutriscore || productData?.nova) && (
                    <div className="health-badges-row">
                      {productData.nutriscore && (
                        <div className={`score-badge-card score-${productData.nutriscore.toLowerCase()}`}>
                          <div className="score-badge-left">
                            <span className="score-badge-title">Nutri-Score</span>
                            <span className="score-badge-grade">{productData.nutriscore.toUpperCase()}</span>
                          </div>
                          <div className="score-badge-desc">
                            {productData.nutriscore.toLowerCase() === 'a' ? 'High nutritional quality' :
                             productData.nutriscore.toLowerCase() === 'b' ? 'Good nutritional quality' :
                             productData.nutriscore.toLowerCase() === 'c' ? 'Average nutritional balance' :
                             productData.nutriscore.toLowerCase() === 'd' ? 'Moderate / Elevated sugar or salt' :
                             'Lower nutritional quality'}
                          </div>
                        </div>
                      )}

                      {productData.nova && (
                        <div className={`score-badge-card nova-card nova-${productData.nova}`}>
                          <div className="score-badge-left">
                            <span className="score-badge-title">NOVA</span>
                            <span className="score-badge-grade">Group {productData.nova}</span>
                          </div>
                          <div className="score-badge-desc">
                            {productData.nova === 1 ? 'Unprocessed or minimally processed' :
                             productData.nova === 2 ? 'Processed culinary ingredients' :
                             productData.nova === 3 ? 'Processed foods' :
                             'Ultra-processed food products'}
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Ingredients List */}
                  {productData?.ingredients && (
                    <div className="ingredients-box">
                      <div className="ingredients-header">
                        <i className="fas fa-clipboard-list"></i>
                        <span>Ingredients List:</span>
                      </div>
                      <p className="ingredients-content">{productData.ingredients}</p>
                    </div>
                  )}

                  {/* Allergen Warning */}
                  {productData?.allergens && (
                    <div className="allergens-callout">
                      <i className="fas fa-exclamation-triangle"></i>
                      <span>
                        <strong>Allergens:</strong> {productData.allergens}
                      </span>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Quick Search Action Buttons (For full specs on Google, Amazon, UPCitemdb) */}
          <div className="product-search-actions">
            <span className="search-action-label">Look up details:</span>
            <a
              href={`https://www.google.com/search?q=${encodeURIComponent((productData?.brand || '') + ' ' + (productData?.name || barcode))}`}
              target="_blank"
              rel="noopener noreferrer"
              className="search-action-btn"
            >
              <i className="fab fa-google"></i> Google
            </a>
            <a
              href={`https://www.amazon.com/s?k=${barcode}`}
              target="_blank"
              rel="noopener noreferrer"
              className="search-action-btn"
            >
              <i className="fab fa-amazon"></i> Amazon
            </a>
            <a
              href={`https://www.upcitemdb.com/upc/${barcode}`}
              target="_blank"
              rel="noopener noreferrer"
              className="search-action-btn"
            >
              <i className="fas fa-search"></i> UPCitemdb
            </a>
          </div>

          {/* Educational Distinction Callout */}
          <div className="distinction-callout">
            <strong><i className="fas fa-info-circle"></i> Good to know:</strong> A barcode's GS1 prefix designates the country where the company or subsidiary is registered. The actual manufacturing location ("Made in") may differ and is taken from package origin statements.
          </div>
        </div>
      )}

      {/* Recent Scan History */}
      {scanHistory.length > 0 && (
        <div className="scan-history-section">
          <div className="history-title">
            <i className="fas fa-history"></i>
            <span>Recent Scans:</span>
          </div>
          <div className="history-chips">
            {scanHistory.map((item) => (
              <button
                key={item.code}
                type="button"
                className="history-chip"
                onClick={() => {
                  handleBarcodeSelect(item.code);
                  focusInput();
                }}
                title={item.title}
              >
                <span>{item.flag}</span>
                <span>{item.title.length > 20 ? item.title.slice(0, 18) + '…' : item.title}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default BarcodeScanner;
