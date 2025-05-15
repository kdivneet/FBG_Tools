import React, { useState } from 'react';
import './FiberComparison.css';
import axios from 'axios';

const FiberComparison = () => {
  // Temperature states
  const [oldTemp, setOldTemp] = useState('');
  const [newTemp, setNewTemp] = useState('');
  const [tempImagePath, setTempImagePath] = useState('');
  const [tempError, setTempError] = useState('');

  // Strain states
  const [strain, setStrain] = useState('');
  const [strainImagePath, setStrainImagePath] = useState('');
  const [strainError, setStrainError] = useState('');

  // Submit handler for temperature shift
  const handleTempSubmit = async (e) => {
    e.preventDefault();
    setTempError('');
    setTempImagePath('');

    try {
      const response = await axios.post('http://localhost:5000/temp-bragg-shift', {
        old_temp: oldTemp,
        new_temp: newTemp,
      });

      if (response.data.imagePath) {
        setTempImagePath(`http://localhost:5000/${response.data.imagePath}`);
      } else {
        setTempError('Failed to generate graph.');
      }
    } catch (err) {
      setTempError(err.response?.data?.error || 'Server error.');
    }
  };

  // Submit handler for strain shift
  const handleStrainSubmit = async (e) => {
    e.preventDefault();
    setStrainError('');
    setStrainImagePath('');

    try {
      const response = await axios.post('http://localhost:5000/strain-bragg-shift', {
        strain: strain,
      });

      if (response.data.imagePath) {
        setStrainImagePath(`http://localhost:5000/${response.data.imagePath}`);
      } else {
        setStrainError('Failed to generate graph.');
      }
    } catch (err) {
      setStrainError(err.response?.data?.error || 'Server error.');
    }
  };

  return (
    <div className="fiber-comp-container">
       <div className="form-stack">
      {/* Temperature Block */}
      <div className="temp-form-container">
        <h2>🌡️ Bragg Wavelength Shift due to Temperature</h2>
        <form onSubmit={handleTempSubmit} className="temp-form">
          <div className="form-group">
            <label>Old Temperature (°C)</label>
            <input
              type="number"
              value={oldTemp}
              onChange={(e) => setOldTemp(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>New Temperature (°C)</label>
            <input
              type="number"
              value={newTemp}
              onChange={(e) => setNewTemp(e.target.value)}
              required
            />
          </div>
          <button type="submit">Generate Temperature Graph</button>
        </form>
        {tempError && <p className="error-text">{tempError}</p>}
        {tempImagePath && (
          <div className="graph-container">
            <h4>📈 Bragg Wavelength vs Temperature</h4>
            <img src={tempImagePath} alt="Temp Shift Graph" />
          </div>
        )}
      </div>

      {/* Strain Block */}
      <div className="temp-form-container">
        <h2>🧬 Bragg Wavelength Shift due to Strain</h2>
        <form onSubmit={handleStrainSubmit} className="temp-form">
          <div className="form-group">
            <label>Strain (ε)</label>
            <input
              type="number"
              value={strain}
              onChange={(e) => setStrain(e.target.value)}
              required
            />
          </div>
          <button type="submit">Generate Strain Graph</button>
        </form>
        {strainError && <p className="error-text">{strainError}</p>}
        {strainImagePath && (
          <div className="graph-container">
            <h4>📈 Bragg Wavelength vs Strain</h4>
            <img src={strainImagePath} alt="Strain Shift Graph" />
          </div>
        )}
      </div>
      </div>
    </div>
  );
};

export default FiberComparison;


