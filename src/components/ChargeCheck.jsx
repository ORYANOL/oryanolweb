import React, { useState, useEffect, useMemo, useRef } from 'react';
import '../styles/chargecheck-tw.css';
import EV_DATABASE from '../data/evDatabase.json';

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

const fmtDist = (n, unit) => {
    if (!isFinite(n)) return '—';
    const label = unit.includes('km') ? 'km' : 'mi';
    return `${n.toFixed(0)} ${label}`;
};

const fmtCpd = (n, unit) => {
    if (!isFinite(n)) return '—';
    const label = unit.includes('km') ? 'p/km' : 'p/mi';
    return `${(n * 100).toFixed(1)}${label}`;
};

const calc = ({ battery, startSOC, targetSOC, rate, fee, efficiency, effUnit }) => {
    const delta = Math.max(0, targetSOC - startSOC) / 100;
    const energy = battery * delta;
    const energyCost = energy * rate;
    const total = energyCost + fee;
    const truePrice = energy > 0 ? total / energy : NaN;
    
    let distPerKwh = 0;
    if (effUnit === 'mi/kWh' || effUnit === 'km/kWh') {
        distPerKwh = efficiency;
    } else if (effUnit === 'kWh/100mi' || effUnit === 'kWh/100km') {
        distPerKwh = efficiency > 0 ? 100 / efficiency : 0;
    }

    const rangeAdded = energy * distPerKwh;
    const costPerDist = rangeAdded > 0 ? total / rangeAdded : NaN;
    return { energy, total, truePrice, rangeAdded, costPerDist };
};

/* ─── Charger Panel (no presets) ─── */
const ChargerPanel = ({
    label,
    rate,
    setRate,
    fee,
    setFee,
    results,
    highlight,
    comparing,
    effUnit,
}) => {
    const borderClass = comparing && highlight === 'cheaper'
        ? 'border-emerald-400/60 shadow-lg shadow-emerald-500/10'
        : comparing && highlight === 'pricier'
            ? 'border-rose-400/60 shadow-lg shadow-rose-500/10'
            : 'cc-panel-border';

    return (
        <div className={`rounded-2xl border-2 ${borderClass} cc-panel-bg p-5 flex flex-col gap-4 transition-all duration-300`}>
            {/* Header */}
            <div className="flex items-center justify-between">
                <span className="text-sm font-semibold tracking-wide text-indigo-300 uppercase">{label}</span>
                {comparing && highlight === 'cheaper' && (
                    <span className="px-3 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold uppercase tracking-wider">Cheaper</span>
                )}
                {comparing && highlight === 'pricier' && (
                    <span className="px-3 py-0.5 rounded-full bg-rose-500/20 text-rose-300 text-xs font-bold uppercase tracking-wider">Pricier</span>
                )}
            </div>

            {/* Inputs */}
            <div className="grid grid-cols-2 gap-3">
                <label className="flex flex-col gap-1.5">
                    <span className="text-xs font-medium text-slate-400">Rate (£/kWh)</span>
                    <input
                        type="number"
                        inputMode="decimal"
                        step="0.01"
                        min="0"
                        value={rate}
                        onChange={(e) => setRate(parseFloat(e.target.value) || 0)}
                        className="cc-num-input cc-input w-full rounded-xl px-3 py-2.5 text-base"
                    />
                </label>
                <label className="flex flex-col gap-1.5">
                    <span className="text-xs font-medium text-slate-400">Session / parking fee (£)</span>
                    <input
                        type="number"
                        inputMode="decimal"
                        step="0.10"
                        min="0"
                        value={fee}
                        onChange={(e) => setFee(parseFloat(e.target.value) || 0)}
                        className="cc-num-input cc-input w-full rounded-xl px-3 py-2.5 text-base"
                    />
                </label>
            </div>

            {/* Results */}
            <div className="grid grid-cols-2 gap-2">
                <div className="col-span-2 rounded-xl bg-gradient-to-r from-indigo-500 to-violet-500 p-4 flex flex-col gap-0.5">
                    <span className="text-[11px] font-semibold uppercase tracking-wider text-white/70">Total cost</span>
                    <span className="text-2xl font-extrabold text-white">{fmtGBP(results.total)}</span>
                </div>
                <div className="rounded-xl bg-white/5 p-3 flex flex-col gap-0.5">
                    <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">True £/kWh</span>
                    <span className="text-lg font-bold text-white">{fmtPence(results.truePrice)}</span>
                </div>
                <div className="rounded-xl bg-white/5 p-3 flex flex-col gap-0.5">
                    <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">Cost / dist</span>
                    <span className="text-lg font-bold text-white">{fmtCpd(results.costPerDist, effUnit)}</span>
                </div>
                <div className="col-span-2 rounded-xl bg-white/5 p-3 flex items-center justify-between">
                    <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">Range added</span>
                    <span className="text-lg font-bold text-emerald-300">{fmtDist(results.rangeAdded, effUnit)}</span>
                </div>
            </div>
        </div>
    );
};

/* ─── Main component ─── */
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

    // Custom battery mode
    const [useCustomBattery, setUseCustomBattery] = useState(saved.current?.useCustomBattery ?? false);
    const [customBattery, setCustomBattery] = useState(saved.current?.customBattery ?? 60);

    const [startSOC, setStartSOC] = useState(saved.current?.startSOC ?? 20);
    const [targetSOC, setTargetSOC] = useState(saved.current?.targetSOC ?? 80);
    const [efficiency, setEfficiency] = useState(saved.current?.efficiency ?? 3.5);
    const [effUnit, setEffUnit] = useState(saved.current?.effUnit ?? 'mi/kWh');

    const [rateA, setRateA] = useState(saved.current?.rateA ?? 0.79);
    const [feeA, setFeeA] = useState(saved.current?.feeA ?? 0);
    const [rateB, setRateB] = useState(saved.current?.rateB ?? 0.59);
    const [feeB, setFeeB] = useState(saved.current?.feeB ?? 1.0);
    const [comparing, setComparing] = useState(saved.current?.comparing ?? false);

    const selectedEV = EV_DATABASE[selectedEvIdx] ?? EV_DATABASE[0];
    const battery = useCustomBattery ? customBattery : selectedEV.kwh;

    const filtered = useMemo(() => {
        const q = query.trim().toLowerCase();
        if (!q) return EV_DATABASE;
        return EV_DATABASE.filter((v) =>
            `${v.make} ${v.model}`.toLowerCase().includes(q),
        );
    }, [query]);

    const resultsA = useMemo(
        () => calc({ battery, startSOC, targetSOC, rate: rateA, fee: feeA, efficiency, effUnit }),
        [battery, startSOC, targetSOC, rateA, feeA, efficiency, effUnit],
    );
    const resultsB = useMemo(
        () => calc({ battery, startSOC, targetSOC, rate: rateB, fee: feeB, efficiency, effUnit }),
        [battery, startSOC, targetSOC, rateB, feeB, efficiency, effUnit],
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
            effUnit,
            rateA,
            feeA,
            rateB,
            feeB,
            comparing,
            useCustomBattery,
            customBattery,
        };
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
        } catch {
            // Storage full or disabled — silently ignore.
        }
    }, [selectedEV, startSOC, targetSOC, efficiency, effUnit, rateA, feeA, rateB, feeB, comparing, useCustomBattery, customBattery]);

    const pickEV = (idx) => {
        setSelectedEvIdx(idx);
        setQuery('');
        setShowList(false);
        setUseCustomBattery(false);
    };

    // Close dropdown when clicking outside
    const pickerRef = useRef(null);
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (pickerRef.current && !pickerRef.current.contains(e.target)) {
                setShowList(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div className="w-full max-w-2xl mx-auto flex flex-col gap-6">
            {/* Tagline */}
            <div className="rounded-xl border cc-panel-border cc-panel-bg px-4 py-3 text-sm text-[color:var(--secondary-color)] opacity-90 leading-relaxed">
                <strong className="text-indigo-300">True Price</strong> reveals the real £/kWh once the session fee is factored in.
                A cheap headline rate can cost more than a pricier one with no fee.
            </div>

            {/* ─── Vehicle selector ─── */}
            <section className="flex flex-col gap-3">
                <span className="text-xs font-semibold uppercase tracking-widest text-indigo-300">Vehicle</span>

                {/* Toggle: select from list or custom */}
                <div className="flex items-center gap-3">
                    <button
                        type="button"
                        onClick={() => setUseCustomBattery(false)}
                        className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 cursor-pointer ${!useCustomBattery
                            ? 'bg-indigo-500 text-white shadow-md shadow-indigo-500/25'
                            : 'bg-white/5 text-slate-400 hover:bg-white/10 hover:text-slate-200'
                            }`}
                    >
                        Select car
                    </button>
                    <button
                        type="button"
                        onClick={() => setUseCustomBattery(true)}
                        className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 cursor-pointer ${useCustomBattery
                            ? 'bg-indigo-500 text-white shadow-md shadow-indigo-500/25'
                            : 'bg-white/5 text-slate-400 hover:bg-white/10 hover:text-slate-200'
                            }`}
                    >
                        Custom battery
                    </button>
                </div>

                {!useCustomBattery ? (
                    /* Car picker dropdown */
                    <div className="relative" ref={pickerRef}>
                        <input
                            type="text"
                            placeholder={`${selectedEV.make} ${selectedEV.model} · ${selectedEV.kwh} kWh`}
                            value={query}
                            onFocus={() => setShowList(true)}
                            onChange={(e) => { setQuery(e.target.value); setShowList(true); }}
                            className="cc-input w-full rounded-xl px-4 py-3 text-base"
                        />
                        {showList && (
                            <ul className="absolute z-20 top-full mt-1 left-0 right-0 max-h-60 overflow-y-auto rounded-xl border cc-panel-border bg-[color:var(--primary-color)] shadow-2xl list-none m-0 p-1">
                                {filtered.length === 0 && (
                                    <li className="px-4 py-3 text-center text-slate-500 text-sm">No matches</li>
                                )}
                                {filtered.map((v) => {
                                    const key = `${v.make} ${v.model}`;
                                    const idx = EV_DATABASE.indexOf(v);
                                    const isSel = idx === selectedEvIdx;
                                    return (
                                        <li
                                            key={key}
                                            onClick={() => pickEV(idx)}
                                            className={`flex items-center justify-between px-4 py-2.5 rounded-lg cursor-pointer text-sm transition-colors ${isSel
                                                ? 'bg-indigo-500/20 text-indigo-200'
                                                : 'text-slate-300 hover:bg-white/5 hover:text-white'
                                                }`}
                                        >
                                            <span>{v.make} {v.model}</span>
                                            <span className="text-xs text-slate-500 font-medium">{v.kwh} kWh</span>
                                        </li>
                                    );
                                })}
                            </ul>
                        )}
                    </div>
                ) : (
                    /* Custom battery input */
                    <div className="flex items-center gap-3">
                        <input
                            type="number"
                            inputMode="decimal"
                            step="0.1"
                            min="1"
                            max="250"
                            value={customBattery}
                            onChange={(e) => setCustomBattery(parseFloat(e.target.value) || 1)}
                            className="cc-num-input cc-input w-36 rounded-xl px-4 py-3 text-base"
                        />
                        <span className="text-sm text-slate-400">kWh usable capacity</span>
                    </div>
                )}

                {/* Battery readout */}
                <p className="text-sm text-slate-400">
                    Usable battery: <strong className="text-indigo-300">{battery} kWh</strong>
                    {useCustomBattery && <span className="ml-2 text-xs text-indigo-400/70">(custom)</span>}
                </p>

                {/* Efficiency */}
                <div className="flex flex-col gap-1.5 pt-2">
                    <span className="text-sm text-slate-300">Efficiency</span>
                    <div className="flex items-center gap-3">
                        <input
                            type="number"
                            inputMode="decimal"
                            step="0.1"
                            min="0"
                            value={efficiency}
                            onChange={(e) => setEfficiency(parseFloat(e.target.value) || 0)}
                            className="cc-num-input cc-input w-24 rounded-xl px-3 py-2.5 text-base"
                        />
                        <select
                            value={effUnit}
                            onChange={(e) => setEffUnit(e.target.value)}
                            className="cc-input rounded-xl px-3 py-2.5 text-sm outline-none cursor-pointer"
                        >
                            <option value="mi/kWh">mi/kWh</option>
                            <option value="km/kWh">km/kWh</option>
                            <option value="kWh/100mi">kWh/100mi</option>
                            <option value="kWh/100km">kWh/100km</option>
                        </select>
                    </div>
                </div>
            </section>

            {/* ─── SOC + Efficiency sliders ─── */}
            <section className="flex flex-col gap-5 rounded-2xl border cc-panel-border cc-panel-bg p-5">
                {/* Start SOC */}
                <div className="flex flex-col gap-1.5">
                    <div className="flex items-baseline justify-between">
                        <span className="text-sm text-slate-300">Start SOC</span>
                        <strong className="text-indigo-300 tabular-nums">{startSOC}%</strong>
                    </div>
                    <input
                        type="range" min="0" max="100" value={startSOC}
                        onChange={(e) => {
                            const v = parseInt(e.target.value, 10);
                            setStartSOC(v);
                            if (v >= targetSOC) setTargetSOC(Math.min(100, v + 1));
                        }}
                        className="cc-range w-full appearance-none bg-transparent cursor-pointer"
                    />
                </div>

                {/* Target SOC */}
                <div className="flex flex-col gap-1.5 pt-3">
                    <div className="flex items-baseline justify-between">
                        <span className="text-sm text-slate-300">Target SOC</span>
                        <strong className="text-indigo-300 tabular-nums">{targetSOC}%</strong>
                    </div>
                    <input
                        type="range" min="1" max="100" value={targetSOC}
                        onChange={(e) => {
                            const v = parseInt(e.target.value, 10);
                            setTargetSOC(v);
                            if (v <= startSOC) setStartSOC(Math.max(0, v - 1));
                        }}
                        className="cc-range w-full appearance-none bg-transparent cursor-pointer"
                    />
                </div>



                {/* Energy summary */}
                <div className="text-center text-sm text-[color:var(--secondary-color)] opacity-90 cc-panel-bg border cc-panel-border rounded-xl py-2.5 px-3 mt-3">
                    Adding <strong className="text-indigo-300">{resultsA.energy.toFixed(1)} kWh</strong> <span className="opacity-70">(Δ {targetSOC - startSOC}%)</span>
                </div>
            </section>

            {/* ─── Compare toggle ─── */}
            <div className="flex justify-center">
                <button
                    type="button"
                    onClick={() => setComparing((c) => !c)}
                    className={`px-6 py-2.5 rounded-full text-sm font-semibold transition-all duration-200 cursor-pointer ${comparing
                        ? 'bg-indigo-500 text-white shadow-lg shadow-indigo-500/25'
                        : 'border-2 border-indigo-400/40 text-indigo-300 hover:bg-indigo-500/10'
                        }`}
                >
                    {comparing ? 'Single charger' : 'Compare two chargers'}
                </button>
            </div>

            {/* ─── Charger panel(s) ─── */}
            <div className={`flex flex-col gap-4 ${comparing ? 'md:grid md:grid-cols-2' : ''}`}>
                <ChargerPanel
                    label={comparing ? 'Charger A' : 'This charger'}
                    rate={rateA} setRate={setRateA}
                    fee={feeA} setFee={setFeeA}
                    results={resultsA}
                    highlight={highlightA}
                    comparing={comparing}
                    effUnit={effUnit}
                />
                {comparing && (
                    <ChargerPanel
                        label="Charger B"
                        rate={rateB} setRate={setRateB}
                        fee={feeB} setFee={setFeeB}
                        results={resultsB}
                        highlight={highlightB}
                        comparing={comparing}
                        effUnit={effUnit}
                    />
                )}
            </div>

            {/* ─── Verdict ─── */}
            {comparing && isFinite(resultsA.total) && isFinite(resultsB.total) && (
                <div className="cc-fade-up text-center rounded-xl cc-panel-bg border cc-panel-border py-3 px-4 text-sm text-[color:var(--secondary-color)] opacity-90">
                    {resultsA.total === resultsB.total ? (
                        <span>Identical total cost.</span>
                    ) : (
                        <span>
                            {highlightA === 'cheaper' ? 'Charger A' : 'Charger B'} saves{' '}
                            <strong className="text-emerald-300">{fmtGBP(Math.abs(resultsA.total - resultsB.total))}</strong>{' '}
                            for this session.
                        </span>
                    )}
                </div>
            )}
        </div>
    );
};

export default ChargeCheck;
