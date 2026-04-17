import React, { useState, useEffect, useMemo, useRef } from 'react';
import '../styles/ChargeCheck.css';

// Usable battery capacity (kWh) for common UK-market EVs.
// Figures are manufacturer-stated "usable" capacity where known.
const EV_DATABASE = [
    { make: 'Tesla', model: 'Model 3 Standard Range', kwh: 57.5 },
    { make: 'Tesla', model: 'Model 3 Long Range', kwh: 75 },
    { make: 'Tesla', model: 'Model 3 Performance', kwh: 75 },
    { make: 'Tesla', model: 'Model Y Standard Range', kwh: 60 },
    { make: 'Tesla', model: 'Model Y Long Range', kwh: 75 },
    { make: 'Tesla', model: 'Model Y Performance', kwh: 75 },
    { make: 'Tesla', model: 'Model S', kwh: 95 },
    { make: 'Tesla', model: 'Model X', kwh: 95 },
    { make: 'Nissan', model: 'Leaf 40', kwh: 39 },
    { make: 'Nissan', model: 'Leaf e+ 62', kwh: 56 },
    { make: 'Nissan', model: 'Ariya 63', kwh: 63 },
    { make: 'Nissan', model: 'Ariya 87', kwh: 87 },
    { make: 'VW', model: 'ID.3 Pure', kwh: 45 },
    { make: 'VW', model: 'ID.3 Pro', kwh: 58 },
    { make: 'VW', model: 'ID.3 Pro S', kwh: 77 },
    { make: 'VW', model: 'ID.4 Pro', kwh: 77 },
    { make: 'VW', model: 'ID.5 Pro', kwh: 77 },
    { make: 'VW', model: 'ID.7', kwh: 77 },
    { make: 'VW', model: 'ID.Buzz', kwh: 77 },
    { make: 'Kia', model: 'EV6 Standard', kwh: 74 },
    { make: 'Kia', model: 'EV6 Long Range', kwh: 77.4 },
    { make: 'Kia', model: 'EV9', kwh: 99.8 },
    { make: 'Kia', model: 'Niro EV', kwh: 64.8 },
    { make: 'Kia', model: 'Soul EV', kwh: 64 },
    { make: 'Hyundai', model: 'Ioniq 5 58', kwh: 58 },
    { make: 'Hyundai', model: 'Ioniq 5 77', kwh: 77.4 },
    { make: 'Hyundai', model: 'Ioniq 6', kwh: 77.4 },
    { make: 'Hyundai', model: 'Kona Electric 39', kwh: 39 },
    { make: 'Hyundai', model: 'Kona Electric 64', kwh: 64 },
    { make: 'Polestar', model: '2 Standard', kwh: 67 },
    { make: 'Polestar', model: '2 Long Range', kwh: 78 },
    { make: 'Polestar', model: '3', kwh: 107 },
    { make: 'Polestar', model: '4', kwh: 94 },
    { make: 'BMW', model: 'i3', kwh: 37.9 },
    { make: 'BMW', model: 'i4 eDrive40', kwh: 81.3 },
    { make: 'BMW', model: 'i4 M50', kwh: 81.3 },
    { make: 'BMW', model: 'i5', kwh: 81.2 },
    { make: 'BMW', model: 'i7', kwh: 101.7 },
    { make: 'BMW', model: 'iX3', kwh: 74 },
    { make: 'BMW', model: 'iX xDrive40', kwh: 76.6 },
    { make: 'BMW', model: 'iX xDrive50', kwh: 111.5 },
    { make: 'Audi', model: 'Q4 e-tron 40', kwh: 77 },
    { make: 'Audi', model: 'Q4 e-tron 50', kwh: 77 },
    { make: 'Audi', model: 'Q6 e-tron', kwh: 94.9 },
    { make: 'Audi', model: 'Q8 e-tron 50', kwh: 89 },
    { make: 'Audi', model: 'Q8 e-tron 55', kwh: 106 },
    { make: 'Audi', model: 'e-tron GT', kwh: 83.7 },
    { make: 'Mercedes', model: 'EQA 250', kwh: 66.5 },
    { make: 'Mercedes', model: 'EQA 300/350', kwh: 66.5 },
    { make: 'Mercedes', model: 'EQB', kwh: 66.5 },
    { make: 'Mercedes', model: 'EQC 400', kwh: 80 },
    { make: 'Mercedes', model: 'EQE', kwh: 90 },
    { make: 'Mercedes', model: 'EQS 450+', kwh: 107.8 },
    { make: 'Mercedes', model: 'EQS SUV', kwh: 107.8 },
    { make: 'Ford', model: 'Mustang Mach-E SR', kwh: 70 },
    { make: 'Ford', model: 'Mustang Mach-E ER', kwh: 91 },
    { make: 'Ford', model: 'Explorer EV', kwh: 77 },
    { make: 'Ford', model: 'Puma Gen-E', kwh: 43 },
    { make: 'Renault', model: 'Zoe ZE50', kwh: 52 },
    { make: 'Renault', model: 'Megane E-Tech EV40', kwh: 40 },
    { make: 'Renault', model: 'Megane E-Tech EV60', kwh: 60 },
    { make: 'Renault', model: '5 E-Tech 40', kwh: 40 },
    { make: 'Renault', model: '5 E-Tech 52', kwh: 52 },
    { make: 'Renault', model: 'Scenic E-Tech 60', kwh: 60 },
    { make: 'Renault', model: 'Scenic E-Tech 87', kwh: 87 },
    { make: 'Peugeot', model: 'e-208 50', kwh: 46.3 },
    { make: 'Peugeot', model: 'e-208 51', kwh: 51 },
    { make: 'Peugeot', model: 'e-2008 50', kwh: 46.3 },
    { make: 'Peugeot', model: 'e-2008 54', kwh: 54 },
    { make: 'Peugeot', model: 'e-308', kwh: 54 },
    { make: 'Peugeot', model: 'e-3008', kwh: 73 },
    { make: 'Vauxhall', model: 'Corsa Electric 50', kwh: 46.3 },
    { make: 'Vauxhall', model: 'Corsa Electric 51', kwh: 51 },
    { make: 'Vauxhall', model: 'Mokka Electric', kwh: 51 },
    { make: 'Vauxhall', model: 'Astra Electric', kwh: 54 },
    { make: 'Vauxhall', model: 'Grandland Electric', kwh: 73 },
    { make: 'Fiat', model: '500e', kwh: 37.3 },
    { make: 'Fiat', model: '600e', kwh: 51 },
    { make: 'MG', model: 'MG4 SE 51', kwh: 50.8 },
    { make: 'MG', model: 'MG4 Long Range 64', kwh: 61.7 },
    { make: 'MG', model: 'MG4 Extended Range 77', kwh: 74.4 },
    { make: 'MG', model: 'MG5 EV', kwh: 57.4 },
    { make: 'MG', model: 'ZS EV Standard', kwh: 51 },
    { make: 'MG', model: 'ZS EV Long Range', kwh: 70 },
    { make: 'MG', model: 'Cyberster', kwh: 77 },
    { make: 'MINI', model: 'Electric (F56)', kwh: 28.9 },
    { make: 'MINI', model: 'Cooper E', kwh: 36.6 },
    { make: 'MINI', model: 'Cooper SE', kwh: 49.2 },
    { make: 'MINI', model: 'Countryman E', kwh: 64.6 },
    { make: 'MINI', model: 'Countryman SE ALL4', kwh: 64.6 },
    { make: 'Porsche', model: 'Taycan', kwh: 79.2 },
    { make: 'Porsche', model: 'Taycan Performance Plus', kwh: 93.4 },
    { make: 'Porsche', model: 'Macan Electric', kwh: 95 },
    { make: 'Jaguar', model: 'I-Pace', kwh: 84.7 },
    { make: 'Cupra', model: 'Born 58', kwh: 58 },
    { make: 'Cupra', model: 'Born 77', kwh: 77 },
    { make: 'Cupra', model: 'Tavascan', kwh: 77 },
    { make: 'Skoda', model: 'Enyaq 60', kwh: 58 },
    { make: 'Skoda', model: 'Enyaq 85', kwh: 77 },
    { make: 'Skoda', model: 'Elroq 50', kwh: 52 },
    { make: 'Skoda', model: 'Elroq 85', kwh: 77 },
    { make: 'Volvo', model: 'EX30 Single 51', kwh: 49 },
    { make: 'Volvo', model: 'EX30 Twin 69', kwh: 64 },
    { make: 'Volvo', model: 'EX40', kwh: 78 },
    { make: 'Volvo', model: 'EC40', kwh: 78 },
    { make: 'Volvo', model: 'EX90', kwh: 107 },
    { make: 'BYD', model: 'Atto 3', kwh: 60.5 },
    { make: 'BYD', model: 'Dolphin Active', kwh: 44.9 },
    { make: 'BYD', model: 'Dolphin Comfort', kwh: 60.4 },
    { make: 'BYD', model: 'Seal Design', kwh: 82.5 },
    { make: 'BYD', model: 'Seal U', kwh: 71.8 },
    { make: 'Ora', model: '03 / Funky Cat 45', kwh: 45.4 },
    { make: 'Ora', model: '03 / Funky Cat 63', kwh: 63 },
    { make: 'Honda', model: 'e:Ny1', kwh: 61.9 },
    { make: 'Subaru', model: 'Solterra', kwh: 71.4 },
    { make: 'Toyota', model: 'bZ4X', kwh: 71.4 },
    { make: 'Lexus', model: 'UX 300e', kwh: 72.8 },
    { make: 'Lexus', model: 'RZ 450e', kwh: 71.4 },
    { make: 'Smart', model: '#1', kwh: 66 },
    { make: 'Smart', model: '#3', kwh: 66 },
    { make: 'Genesis', model: 'GV60', kwh: 77.4 },
    { make: 'Genesis', model: 'Electrified GV70', kwh: 77.4 },
    { make: 'Genesis', model: 'Electrified G80', kwh: 82.5 },
    { make: 'Citroen', model: 'e-C3', kwh: 44 },
    { make: 'Citroen', model: 'e-C4', kwh: 50 },
    { make: 'Citroen', model: 'e-Berlingo', kwh: 50 },
    { make: 'DS', model: 'DS 3 E-Tense', kwh: 50 },
    { make: 'DS', model: 'DS 4 E-Tense', kwh: 54 },
    { make: 'Alfa Romeo', model: 'Junior Elettrica', kwh: 51 },
    { make: 'Jeep', model: 'Avenger EV', kwh: 51 },
    { make: 'Lotus', model: 'Eletre', kwh: 109 },
    { make: 'Lotus', model: 'Emeya', kwh: 102 },
    { make: 'Maxus', model: 'MIFA 9', kwh: 90 },
];

// Popular UK public charging tariffs (pence/kWh converted to £).
// Operators review prices regularly; treat as defaults, not gospel.
const TARIFF_PRESETS = [
    { id: 'bp-pulse-150', name: 'BP Pulse 150kW', rate: 0.85, fee: 0 },
    { id: 'shell-recharge', name: 'Shell Recharge', rate: 0.85, fee: 0 },
    { id: 'ionity', name: 'IONITY (ad-hoc)', rate: 0.74, fee: 0 },
    { id: 'tesla-scg-other', name: 'Tesla Supercharger (non-Tesla)', rate: 0.60, fee: 0 },
    { id: 'tesla-scg-tesla', name: 'Tesla Supercharger (Tesla)', rate: 0.45, fee: 0 },
    { id: 'gridserve', name: 'Gridserve Electric Highway', rate: 0.79, fee: 0 },
    { id: 'instavolt', name: 'InstaVolt', rate: 0.85, fee: 0 },
    { id: 'fastned', name: 'Fastned', rate: 0.69, fee: 0 },
    { id: 'osprey', name: 'Osprey', rate: 0.79, fee: 0 },
    { id: 'ubitricity', name: 'Ubitricity (lamp post)', rate: 0.49, fee: 0 },
    { id: 'podpoint-lidl', name: 'Pod Point (Lidl 50kW)', rate: 0.59, fee: 0 },
    { id: 'tesco-ck', name: 'Tesco / Connected Kerb 7kW', rate: 0.55, fee: 0 },
    { id: 'mfg-ev', name: 'MFG EV Power', rate: 0.79, fee: 0 },
    { id: 'motor-fuel-fee', name: 'Budget + £1 session fee', rate: 0.45, fee: 1.0 },
];

const STORAGE_KEY = 'chargecheck.v1';

const loadSaved = () => {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (!raw) return null;
        return JSON.parse(raw);
    } catch {
        return null;
    }
};

const fmtGBP = (n) => {
    if (!isFinite(n)) return '—';
    return `£${n.toFixed(2)}`;
};

const fmtPence = (n) => {
    if (!isFinite(n)) return '—';
    return `${(n * 100).toFixed(1)}p`;
};

const fmtMiles = (n) => {
    if (!isFinite(n)) return '—';
    return `${n.toFixed(0)} mi`;
};

const fmtCpm = (n) => {
    if (!isFinite(n)) return '—';
    return `${(n * 100).toFixed(1)}p/mi`;
};

const calc = ({ battery, startSOC, targetSOC, rate, fee, efficiency }) => {
    const delta = Math.max(0, targetSOC - startSOC) / 100;
    const energy = battery * delta;
    const energyCost = energy * rate;
    const total = energyCost + fee;
    const truePrice = energy > 0 ? total / energy : NaN;
    const rangeAdded = energy * efficiency;
    const costPerMile = rangeAdded > 0 ? total / rangeAdded : NaN;
    return { energy, total, truePrice, rangeAdded, costPerMile };
};

const TariffPresets = ({ onPick }) => (
    <div className="cc-presets">
        {TARIFF_PRESETS.map((t) => (
            <button
                key={t.id}
                type="button"
                className="cc-preset-btn"
                onClick={() => onPick(t)}
                title={`${fmtPence(t.rate)}/kWh${t.fee ? ` + ${fmtGBP(t.fee)} fee` : ''}`}
            >
                {t.name}
            </button>
        ))}
    </div>
);

const ChargerPanel = ({
    label,
    rate,
    setRate,
    fee,
    setFee,
    results,
    highlight,
    comparing,
}) => {
    const cls = [
        'cc-charger',
        comparing && highlight === 'cheaper' ? 'cc-cheaper' : '',
        comparing && highlight === 'pricier' ? 'cc-pricier' : '',
    ].join(' ').trim();

    return (
        <div className={cls}>
            <div className="cc-charger-head">
                <span className="cc-charger-label">{label}</span>
                {comparing && highlight === 'cheaper' && (
                    <span className="cc-badge cc-badge-good">Cheaper</span>
                )}
                {comparing && highlight === 'pricier' && (
                    <span className="cc-badge cc-badge-bad">Pricier</span>
                )}
            </div>

            <TariffPresets onPick={(t) => { setRate(t.rate); setFee(t.fee); }} />

            <div className="cc-row">
                <label className="cc-field">
                    <span>Rate (£/kWh)</span>
                    <input
                        type="number"
                        inputMode="decimal"
                        step="0.01"
                        min="0"
                        value={rate}
                        onChange={(e) => setRate(parseFloat(e.target.value) || 0)}
                    />
                </label>
                <label className="cc-field">
                    <span>Session / parking fee (£)</span>
                    <input
                        type="number"
                        inputMode="decimal"
                        step="0.10"
                        min="0"
                        value={fee}
                        onChange={(e) => setFee(parseFloat(e.target.value) || 0)}
                    />
                </label>
            </div>

            <div className="cc-results">
                <div className="cc-result cc-result-primary">
                    <span className="cc-result-label">Total cost</span>
                    <span className="cc-result-value">{fmtGBP(results.total)}</span>
                </div>
                <div className="cc-result">
                    <span className="cc-result-label">True £/kWh</span>
                    <span className="cc-result-value">{fmtPence(results.truePrice)}</span>
                </div>
                <div className="cc-result">
                    <span className="cc-result-label">Cost / mile</span>
                    <span className="cc-result-value">{fmtCpm(results.costPerMile)}</span>
                </div>
                <div className="cc-result">
                    <span className="cc-result-label">Range added</span>
                    <span className="cc-result-value">{fmtMiles(results.rangeAdded)}</span>
                </div>
            </div>
        </div>
    );
};

const ChargeCheck = () => {
    const saved = useRef(loadSaved());

    const [query, setQuery] = useState('');
    const [selectedEvIdx, setSelectedEvIdx] = useState(() => {
        const s = saved.current;
        if (!s?.evKey) return 0;
        const idx = EV_DATABASE.findIndex(
            (v) => `${v.make} ${v.model}` === s.evKey,
        );
        return idx >= 0 ? idx : 0;
    });
    const [showList, setShowList] = useState(false);

    const [startSOC, setStartSOC] = useState(saved.current?.startSOC ?? 20);
    const [targetSOC, setTargetSOC] = useState(saved.current?.targetSOC ?? 80);
    const [efficiency, setEfficiency] = useState(saved.current?.efficiency ?? 3.5);

    const [rateA, setRateA] = useState(saved.current?.rateA ?? 0.79);
    const [feeA, setFeeA] = useState(saved.current?.feeA ?? 0);
    const [rateB, setRateB] = useState(saved.current?.rateB ?? 0.59);
    const [feeB, setFeeB] = useState(saved.current?.feeB ?? 1.0);
    const [comparing, setComparing] = useState(saved.current?.comparing ?? false);

    const selectedEV = EV_DATABASE[selectedEvIdx] ?? EV_DATABASE[0];
    const battery = selectedEV.kwh;

    const filtered = useMemo(() => {
        const q = query.trim().toLowerCase();
        if (!q) return EV_DATABASE.slice(0, 30);
        return EV_DATABASE.filter((v) =>
            `${v.make} ${v.model}`.toLowerCase().includes(q),
        ).slice(0, 40);
    }, [query]);

    const resultsA = useMemo(
        () => calc({ battery, startSOC, targetSOC, rate: rateA, fee: feeA, efficiency }),
        [battery, startSOC, targetSOC, rateA, feeA, efficiency],
    );
    const resultsB = useMemo(
        () => calc({ battery, startSOC, targetSOC, rate: rateB, fee: feeB, efficiency }),
        [battery, startSOC, targetSOC, rateB, feeB, efficiency],
    );

    let highlightA = null;
    let highlightB = null;
    if (comparing && isFinite(resultsA.total) && isFinite(resultsB.total)) {
        if (resultsA.total < resultsB.total) {
            highlightA = 'cheaper';
            highlightB = 'pricier';
        } else if (resultsB.total < resultsA.total) {
            highlightB = 'cheaper';
            highlightA = 'pricier';
        }
    }

    // Persist to localStorage on change.
    useEffect(() => {
        const payload = {
            evKey: `${selectedEV.make} ${selectedEV.model}`,
            startSOC,
            targetSOC,
            efficiency,
            rateA,
            feeA,
            rateB,
            feeB,
            comparing,
        };
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
        } catch {
            // Storage full or disabled — silently ignore.
        }
    }, [selectedEV, startSOC, targetSOC, efficiency, rateA, feeA, rateB, feeB, comparing]);

    const pickEV = (idx) => {
        setSelectedEvIdx(idx);
        setQuery('');
        setShowList(false);
    };

    return (
        <div className="cc-container">
            <p className="cc-tagline">
                <strong>True Price</strong> reveals the real £/kWh once the session fee is factored in.
                A cheap headline rate can cost more than a pricier one with no fee.
            </p>

            {/* Vehicle selector */}
            <section className="cc-section">
                <label className="cc-label">Vehicle</label>
                <div className="cc-ev-picker">
                    <input
                        type="text"
                        className="cc-ev-input"
                        placeholder={`${selectedEV.make} ${selectedEV.model} · ${battery} kWh`}
                        value={query}
                        onFocus={() => setShowList(true)}
                        onChange={(e) => { setQuery(e.target.value); setShowList(true); }}
                    />
                    {showList && (
                        <ul className="cc-ev-list" onMouseLeave={() => setShowList(false)}>
                            {filtered.length === 0 && (
                                <li className="cc-ev-empty">No matches</li>
                            )}
                            {filtered.map((v) => {
                                const key = `${v.make} ${v.model}`;
                                const idx = EV_DATABASE.indexOf(v);
                                const isSel = idx === selectedEvIdx;
                                return (
                                    <li
                                        key={key}
                                        className={`cc-ev-item ${isSel ? 'active' : ''}`}
                                        onClick={() => pickEV(idx)}
                                    >
                                        <span>{v.make} {v.model}</span>
                                        <span className="cc-ev-kwh">{v.kwh} kWh</span>
                                    </li>
                                );
                            })}
                        </ul>
                    )}
                </div>
                <div className="cc-ev-meta">
                    Usable battery: <strong>{battery} kWh</strong>
                </div>
            </section>

            {/* SOC + efficiency */}
            <section className="cc-section cc-section-soc">
                <div className="cc-soc-row">
                    <label className="cc-slider-label">
                        <span>Start SOC</span>
                        <strong>{startSOC}%</strong>
                    </label>
                    <input
                        type="range"
                        min="0"
                        max="100"
                        value={startSOC}
                        onChange={(e) => {
                            const v = parseInt(e.target.value, 10);
                            setStartSOC(v);
                            if (v >= targetSOC) setTargetSOC(Math.min(100, v + 1));
                        }}
                        className="cc-slider"
                    />
                </div>
                <div className="cc-soc-row">
                    <label className="cc-slider-label">
                        <span>Target SOC</span>
                        <strong>{targetSOC}%</strong>
                    </label>
                    <input
                        type="range"
                        min="1"
                        max="100"
                        value={targetSOC}
                        onChange={(e) => {
                            const v = parseInt(e.target.value, 10);
                            setTargetSOC(v);
                            if (v <= startSOC) setStartSOC(Math.max(0, v - 1));
                        }}
                        className="cc-slider"
                    />
                </div>
                <div className="cc-soc-row">
                    <label className="cc-slider-label">
                        <span>Efficiency</span>
                        <strong>{efficiency.toFixed(1)} mi/kWh</strong>
                    </label>
                    <input
                        type="range"
                        min="1.5"
                        max="6"
                        step="0.1"
                        value={efficiency}
                        onChange={(e) => setEfficiency(parseFloat(e.target.value))}
                        className="cc-slider"
                    />
                </div>
                <div className="cc-energy-line">
                    Adding <strong>{resultsA.energy.toFixed(1)} kWh</strong> (Δ {targetSOC - startSOC}%)
                </div>
            </section>

            {/* Compare toggle */}
            <div className="cc-compare-toggle">
                <button
                    type="button"
                    className={`cc-compare-btn ${comparing ? 'active' : ''}`}
                    onClick={() => setComparing((c) => !c)}
                >
                    {comparing ? 'Single charger' : 'Compare two chargers'}
                </button>
            </div>

            {/* Charger panels */}
            <div className={`cc-chargers ${comparing ? 'cc-chargers-compare' : ''}`}>
                <ChargerPanel
                    label={comparing ? 'Charger A' : 'This charger'}
                    rate={rateA}
                    setRate={setRateA}
                    fee={feeA}
                    setFee={setFeeA}
                    results={resultsA}
                    highlight={highlightA}
                    comparing={comparing}
                />
                {comparing && (
                    <ChargerPanel
                        label="Charger B"
                        rate={rateB}
                        setRate={setRateB}
                        fee={feeB}
                        setFee={setFeeB}
                        results={resultsB}
                        highlight={highlightB}
                        comparing={comparing}
                    />
                )}
            </div>

            {comparing && isFinite(resultsA.total) && isFinite(resultsB.total) && (
                <div className="cc-verdict">
                    {resultsA.total === resultsB.total ? (
                        <span>Identical total cost.</span>
                    ) : (
                        <span>
                            {highlightA === 'cheaper' ? 'Charger A' : 'Charger B'} saves{' '}
                            <strong>{fmtGBP(Math.abs(resultsA.total - resultsB.total))}</strong>{' '}
                            for this session.
                        </span>
                    )}
                </div>
            )}
        </div>
    );
};

export default ChargeCheck;
