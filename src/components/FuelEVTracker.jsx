import React, { useState, useMemo, useCallback } from 'react';
import '../styles/FuelEVTracker.css';

// ─── Haversine distance (km) ─────────────────────────────────────────────────
function haversineKm(lat1, lon1, lat2, lon2) {
    const R = 6371;
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
        Math.sin(dLat / 2) ** 2 +
        Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) ** 2;
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

// ─── Postcode → lat/lng ──────────────────────────────────────────────────────
async function resolvePostcode(postcode) {
    const full = await fetch(`https://api.postcodes.io/postcodes/${encodeURIComponent(postcode.trim())}`);
    if (full.ok) {
        const data = await full.json();
        return { lat: data.result.latitude, lng: data.result.longitude };
    }
    const out = await fetch(`https://api.postcodes.io/outcodes/${encodeURIComponent(postcode.trim())}`);
    if (out.ok) {
        const data = await out.json();
        return { lat: data.result.latitude, lng: data.result.longitude };
    }
    throw new Error('Postcode not found. Please enter a valid UK postcode (e.g. CF36 3YR or CF36).');
}

// ─── DESNZ fuel price feed ───────────────────────────────────────────────────
async function fetchFuelStations(lat, lng, radiusKm = 10) {
    const res = await fetch(
        'https://young-waterfall-11e5.oryanol46.workers.dev',
        { signal: AbortSignal.timeout(10000) }
    );
    if (!res.ok) throw new Error('Fuel price data unavailable. Please try again later.');
    const json = await res.json();
    const records = json.result?.records ?? [];

    return records
        .filter((r) => r.latitude && r.longitude)
        .map((r) => ({
            id: r._id,
            brand: r.brand,
            name: r.site_name || r.brand,
            address: r.address,
            distanceKm: haversineKm(lat, lng, parseFloat(r.latitude), parseFloat(r.longitude)),
            prices: {
                E10: r.E10 ? parseFloat(r.E10) : null,
                E5: r.E5 ? parseFloat(r.E5) : null,
                B7: r.B7 ? parseFloat(r.B7) : null,
            },
        }))
        .filter((s) => s.distanceKm <= radiusKm)
        .sort((a, b) => a.distanceKm - b.distanceKm)
        .slice(0, 30);
}

// ─── Open Charge Map EV stations ─────────────────────────────────────────────
async function fetchEVStations(lat, lng, radiusKm = 10) {
    const url = new URL('https://api.openchargemap.io/v3/poi/');
    url.searchParams.set('output', 'json');
    url.searchParams.set('latitude', lat);
    url.searchParams.set('longitude', lng);
    url.searchParams.set('distance', radiusKm);
    url.searchParams.set('distanceunit', 'km');
    url.searchParams.set('maxresults', '30');
    url.searchParams.set('compact', 'true');
    url.searchParams.set('verbose', 'false');
    url.searchParams.set('countrycode', 'GB');

    const res = await fetch(url.toString(), { signal: AbortSignal.timeout(10000) });
    if (!res.ok) throw new Error('EV charger data unavailable. Please try again later.');
    const data = await res.json();

    return data.map((poi) => {
        const conns = poi.Connections ?? [];
        const maxKw = conns.reduce((m, c) => Math.max(m, c.PowerKW ?? 0), 0);
        const available = conns.filter((c) => c.StatusType?.IsOperational).length;

        return {
            id: poi.ID,
            brand: poi.OperatorInfo?.Title ?? 'Unknown',
            name: poi.AddressInfo?.Title ?? 'Charging Point',
            address: poi.AddressInfo?.AddressLine1 ?? '',
            distanceKm: haversineKm(lat, lng, poi.AddressInfo.Latitude, poi.AddressInfo.Longitude),
            speed: maxKw ? `${maxKw}kW` : 'Unknown',
            price: conns[0]?.UsageCost ?? null,
            available,
            total: conns.length,
        };
    });
}

// ─── Component ────────────────────────────────────────────────────────────────
const FuelEVTracker = () => {
    const [mode, setMode] = useState('fuel');
    const [searchInput, setSearchInput] = useState('');
    const [locationLabel, setLocationLabel] = useState('');
    const [fuelType, setFuelType] = useState('E10');
    const [sortBy, setSortBy] = useState('price');
    const [radiusKm, setRadiusKm] = useState(10);

    const [fuelStations, setFuelStations] = useState([]);
    const [evStations, setEvStations] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [searched, setSearched] = useState(false);

    const handleSearch = useCallback(async () => {
        const query = searchInput.trim();
        if (!query) return;
        setLoading(true);
        setError(null);
        setSearched(true);
        setFuelStations([]);
        setEvStations([]);

        try {
            const { lat, lng } = await resolvePostcode(query);
            setLocationLabel(query.toUpperCase());

            if (mode === 'fuel') {
                const stations = await fetchFuelStations(lat, lng, radiusKm);
                setFuelStations(stations);
            } else {
                const stations = await fetchEVStations(lat, lng, radiusKm);
                setEvStations(stations);
            }
        } catch (err) {
            setError(err.message || 'Something went wrong. Please try again.');
        } finally {
            setLoading(false);
        }
    }, [searchInput, mode, radiusKm]);

    const sortedStations = useMemo(() => {
        if (mode === 'fuel') {
            return [...fuelStations]
                .filter((s) => s.prices[fuelType] !== null)
                .sort((a, b) =>
                    sortBy === 'price'
                        ? a.prices[fuelType] - b.prices[fuelType]
                        : a.distanceKm - b.distanceKm
                );
        }
        return [...evStations].sort((a, b) => a.distanceKm - b.distanceKm);
    }, [mode, fuelStations, evStations, fuelType, sortBy]);

    return (
        <div className="fuel-ev-tracker-container">
            {/* Header / Mode Toggle */}
            <div className="fe-header">
                <div className="fe-toggle-group">
                    <button
                        className={`fe-toggle-btn ${mode === 'fuel' ? 'active' : ''}`}
                        onClick={() => { setMode('fuel'); setSearched(false); setError(null); }}
                    >
                        <i className="fas fa-gas-pump"></i> Petrol & Diesel
                    </button>
                    <button
                        className={`fe-toggle-btn ${mode === 'ev' ? 'active' : ''}`}
                        onClick={() => { setMode('ev'); setSearched(false); setError(null); }}
                    >
                        <i className="fas fa-charging-station"></i> EV Charging
                    </button>
                </div>
            </div>

            {/* Search & Filters */}
            <div className="fe-filters-card">
                <div className="fe-search-bar">
                    <i className="fas fa-map-marker-alt"></i>
                    <input
                        type="text"
                        placeholder="Enter UK postcode (e.g. CF36 3YR)"
                        value={searchInput}
                        onChange={(e) => setSearchInput(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                    />
                    <button
                        className="fe-search-btn"
                        onClick={handleSearch}
                        disabled={loading || !searchInput.trim()}
                    >
                        {loading ? 'Searching…' : 'Search'}
                    </button>
                </div>

                <div className="fe-controls-row">
                    {mode === 'fuel' && (
                        <div className="fe-filter-group">
                            <label>Fuel Type:</label>
                            <select value={fuelType} onChange={(e) => setFuelType(e.target.value)}>
                                <option value="E10">Unleaded (E10)</option>
                                <option value="E5">Super Unleaded (E5)</option>
                                <option value="B7">Diesel (B7)</option>
                            </select>
                        </div>
                    )}
                    <div className="fe-filter-group">
                        <label>Sort By:</label>
                        <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                            <option value="price">Cheapest First</option>
                            <option value="distance">Nearest First</option>
                        </select>
                    </div>
                    <div className="fe-filter-group">
                        <label>Radius:</label>
                        <select value={radiusKm} onChange={(e) => setRadiusKm(Number(e.target.value))}>
                            <option value={5}>5 km</option>
                            <option value={10}>10 km</option>
                            <option value={20}>20 km</option>
                            <option value={30}>30 km</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Error */}
            {error && (
                <div className="fe-error">
                    <i className="fas fa-exclamation-triangle"></i> {error}
                </div>
            )}

            {/* Results info */}
            {!loading && searched && !error && (
                <div className="fe-results-info">
                    Found <strong>{sortedStations.length}</strong> stations within <strong>{radiusKm}km</strong> of <strong>{locationLabel}</strong>
                </div>
            )}

            {/* Station cards */}
            <div className="fe-stations-grid">
                {loading && (
                    <div className="fe-loading">
                        <i className="fas fa-circle-notch fa-spin"></i> Finding stations near {searchInput}…
                    </div>
                )}

                {!loading && sortedStations.map((station, index) => {
                    const isCheapest = sortBy === 'price' && index === 0;
                    const mapsUrl = `https://www.google.com/maps/search/${encodeURIComponent(
                        [station.name, station.address].filter(Boolean).join(' ')
                    )}`;

                    return (
                        <div key={station.id} className={`fe-station-card ${isCheapest ? 'cheapest-highlight' : ''}`}>
                            {isCheapest && (
                                <div className="fe-cheapest-badge">
                                    <i className="fas fa-star"></i> Best Price
                                </div>
                            )}

                            <div className="fe-station-header">
                                <h3 className="fe-brand-title">{station.brand}</h3>
                                <div className="fe-distance">
                                    <i className="fas fa-location-arrow"></i> {station.distanceKm.toFixed(1)} km
                                </div>
                            </div>
                            <p className="fe-station-name">{station.name}{station.address ? ` · ${station.address}` : ''}</p>

                            {mode === 'fuel' ? (
                                <div className="fe-prices-grid">
                                    <div className={`fe-price-box ${fuelType === 'E10' ? 'active-type' : ''}`}>
                                        <span className="fe-p-label">Unleaded</span>
                                        <span className="fe-p-value">{station.prices.E10 != null ? `${station.prices.E10}p` : '—'}</span>
                                    </div>
                                    <div className={`fe-price-box ${fuelType === 'E5' ? 'active-type' : ''}`}>
                                        <span className="fe-p-label">Super</span>
                                        <span className="fe-p-value">{station.prices.E5 != null ? `${station.prices.E5}p` : '—'}</span>
                                    </div>
                                    <div className={`fe-price-box ${fuelType === 'B7' ? 'active-type' : ''}`}>
                                        <span className="fe-p-label">Diesel</span>
                                        <span className="fe-p-value">{station.prices.B7 != null ? `${station.prices.B7}p` : '—'}</span>
                                    </div>
                                </div>
                            ) : (
                                <div className="fe-ev-details">
                                    <div className="fe-ev-stat">
                                        <i className="fas fa-bolt"></i>
                                        <span>{station.speed}</span>
                                    </div>
                                    {station.price && (
                                        <div className="fe-ev-stat">
                                            <i className="fas fa-pound-sign"></i>
                                            <span>{station.price}</span>
                                        </div>
                                    )}
                                    <div className="fe-ev-stat availability">
                                        <i className="fas fa-plug"></i>
                                        <span className={station.available > 0 ? 'text-success' : 'text-danger'}>
                                            {station.available}/{station.total} Available
                                        </span>
                                    </div>
                                </div>
                            )}

                            <a
                                className="fe-navigate-btn"
                                href={mapsUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                <i className="fas fa-directions"></i> Get Directions
                            </a>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default FuelEVTracker;