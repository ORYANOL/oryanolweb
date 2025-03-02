import React, { useState, useEffect } from 'react';
import '../styles/FuelCalculator.css';

const FuelCalculator = () => {
    const [distance, setDistance] = useState(100);
    const [mpg, setMpg] = useState(30);
    const [isKilometers, setIsKilometers] = useState(false);
    const [fuelConsumption, setFuelConsumption] = useState(0);

    const LITERS_PER_GALLON = 3.78541;
    const KM_PER_MILE = 1.60934;

    useEffect(() => {
        let distanceInMiles = isKilometers ? distance / KM_PER_MILE : distance;
        let gallons = distanceInMiles / mpg;
        let liters = gallons * LITERS_PER_GALLON;
        setFuelConsumption(liters);
    }, [distance, mpg, isKilometers]);

    return (
        <div className="fuel-calculator-container">
            <div className="input-group">
                <div className="input-header">
                    <label className="label">Distance</label>
                    <div className="toggle-container">
                        <label className="toggle-switch">
                            <input
                                type="checkbox"
                                checked={isKilometers}
                                onChange={() => setIsKilometers(!isKilometers)}
                            />
                            <span className="toggle-slider">
                                <span className="toggle-circle"></span>
                            </span>
                        </label>
                    </div>
                </div>
                <input
                    type="number"
                    min="0"
                    value={distance}
                    onChange={(e) => setDistance(parseFloat(e.target.value) || 0)}
                    className="number-input"
                />
            </div>

            <div className="input-group">
                <div className="input-header">
                    <span className="label">Fuel Efficiency (MPG)</span>
                    <span className="mpg-value">{mpg} MPG</span>
                </div>
                <input
                    type="range"
                    min="10"
                    max="100"
                    value={mpg}
                    onChange={(e) => setMpg(parseInt(e.target.value))}
                    className="slider"
                />
            </div>

            <div className="results">
                <h3 className="results-title">Fuel Consumption</h3>
                <p className="results-value">{fuelConsumption.toFixed(1)} L</p>
            </div>

            <p className="summary">
                A {mpg} MPG vehicle will consume {fuelConsumption.toFixed(1)} liters of fuel
                to travel {distance} {isKilometers ? 'kilometers' : 'miles'}.
            </p>
        </div>
    );
};

export default FuelCalculator;