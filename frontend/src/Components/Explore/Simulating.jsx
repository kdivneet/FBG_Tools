import React, { useState } from "react";
import axios from "axios";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

import './Simulating.css'

const COLORS = [
  "#8884d8",
  "#82ca9d",
  "#ff7300",
  "#ff0000",
  "#00aaff",
  "#ffaa00",
  "#aa00ff",
];

const defaultParams = {
  delta_n: 0.001,
  grating_period: 0.53,
  fbg_length: 20,
  n_eff: 1.45,
  num_points: 200,
  lambda_start: 0,
  lambda_end: 0,
};

function Simulating() {
  const [simulations, setSimulations] = useState([
    { ...updateWavelengthRange({ ...defaultParams }), id: 1, name: "Sim 1", data: null, loading: false },
  ]);

  function calcBragg(p) {
    return 2 * p.n_eff * p.grating_period;
  }

  function updateWavelengthRange(p) {
    const bragg = calcBragg(p);
    return {
      ...p,
      lambda_start: bragg - 12,
      lambda_end: bragg + 12,
    };
  }

  const handleInputChange = (id, e) => {
    const { name, value } = e.target;
    setSimulations((sims) =>
      sims.map((sim) =>
        sim.id === id
          ? {
              ...updateWavelengthRange({ ...sim, [name]: parseFloat(value) || 0 }),
              data: null, // clear old data on param change
            }
          : sim
      )
    );
  };

  const runSimulation = async (sim) => {
    setSimulations((sims) =>
      sims.map((s) =>
        s.id === sim.id ? { ...s, loading: true, data: null } : s
      )
    );
    try {
      const res = await axios.post("http://127.0.0.1:5000/simulate", {
        lambda_start: sim.lambda_start,
        lambda_end: sim.lambda_end,
        num_points: sim.num_points,
        delta_n: sim.delta_n,
        grating_period: sim.grating_period,
        fbg_length: sim.fbg_length,
        n_eff: sim.n_eff,
      });
      setSimulations((sims) =>
        sims.map((s) =>
          s.id === sim.id ? { ...s, data: res.data, loading: false } : s
        )
      );
    } catch (error) {
      console.error("Simulation error:", error);
      setSimulations((sims) =>
        sims.map((s) =>
          s.id === sim.id ? { ...s, loading: false, data: null } : s
        )
      );
    }
  };

  // Run all simulations concurrently
  const runAllSimulations = () => {
    simulations.forEach(runSimulation);
  };

  // Reset all simulations to default and clear data
  const resetAllSimulations = () => {
    setSimulations((sims) =>
      sims.map((sim, index) => ({
        ...updateWavelengthRange({ ...defaultParams }),
        id: sim.id,
        name: sim.name,
        data: null,
        loading: false,
      }))
    );
  };

  const addSimulation = () => {
    const newId = simulations.length > 0 ? Math.max(...simulations.map((s) => s.id)) + 1 : 1;
    setSimulations((sims) => [
      ...sims,
      { ...updateWavelengthRange({ ...defaultParams }), id: newId, name: `Sim ${newId}`, data: null, loading: false },
    ]);
  };

  const removeSimulation = (id) => {
    setSimulations((sims) => sims.filter((sim) => sim.id !== id));
  };

  let chartData = [];
  if (simulations.length && simulations.every((s) => s.data)) {
    const wavelengths = simulations[0].data.wavelengths;
    chartData = wavelengths.map((w, idx) => {
      const point = { wavelength: w };
      simulations.forEach((sim) => {
        point[sim.name] = sim.data.reflection[idx];
      });
      return point;
    });
  }

  return (
    <div className="fbg-simulator-container">
      <header className="app-header">
      <br></br>
      <br></br>
      <br></br>
        <h1>FBG Reflector Simulator</h1>
        <p className="subtitle">Visualize and analyze fiber Bragg grating reflections.<b> XAxis represent Wavelength(nm) and YAxis (Reflectivity).</b></p>
      </header>

      {simulations.map((sim) => (
        <div key={sim.id} className="simulation-card">
          <h3>{sim.name}</h3>

          {["delta_n", "grating_period", "fbg_length", "n_eff", "num_points"].map((key) => (
            <div key={key} className="input-group">
              <label>
                {key}:&nbsp;
                <input
                  type="number"
                  name={key}
                  value={sim[key]}
                  onChange={(e) => handleInputChange(sim.id, e)}
                  step={key === "num_points" ? "1" : "any"}
                  min={key === "num_points" ? "10" : undefined}
                />
              </label>
            </div>
          ))}

          <div className="sim-info">
            <strong>Bragg Wavelength:</strong> {calcBragg(sim).toFixed(2)} nm
          </div>
          <div className="sim-info">
            <strong>Wavelength Range:</strong> {sim.lambda_start.toFixed(2)} nm - {sim.lambda_end.toFixed(2)} nm
          </div>

          <div className="sim-buttons" style={{ marginTop: '10px' }}>
            <button
              className="remove-btn"
              onClick={() => removeSimulation(sim.id)}
              title="Remove this simulation"
            >
              Remove
            </button>
          </div>
        </div>
      ))}

     <div style={{ display: "flex", gap: "12px", marginBottom: "1rem" }}>
  <button className="common-action-btn simulate-all-btn" onClick={runAllSimulations}>
    Simulate All
  </button>
  <button className="common-action-btn reset-all-btn" onClick={resetAllSimulations}>
    Reset All
  </button>
  <button className="common-action-btn add-sim-btn" onClick={addSimulation}>
    Add Simulation
  </button>
</div>


      {chartData.length > 0 && (
        <div className="chart-container" style={{ marginTop: "30px" }}>
          <ResponsiveContainer>
            <LineChart data={chartData}
              margin={{ top: 20, right: 30, left: 40, bottom: 40 }} >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="wavelength"
                label={{ value: "Wavelength (nm)", position: "insideBottom", offset: -5, dy: 20 }}
                tickFormatter={(tick) => tick.toFixed(3)}
                interval="preserveEnd"
                minTickGap={20}
              />
              <YAxis
                label={{ value: "Reflectivity", angle: -90, position: "insideLeft", dy: 0, dx: -4 }}
                tickFormatter={(tick) => tick.toFixed(4)}
                interval="preserveStartEnd"
                minTickGap={20}
              />
              <Tooltip />
              <Legend />
              {simulations.map((sim, idx) => (
                <Line
                  key={sim.id}
                  type="monotone"
                  dataKey={sim.name}
                  stroke={COLORS[idx % COLORS.length]}
                  dot={false}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}

export default Simulating;
