import React, { useState, useEffect } from "react";
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

const gratingTypes = [
  { id: "uniform", label: "Uniform FBG" },
  { id: "chirped", label: "Chirped FBG" },
  { id: "apodized", label: "Apodized FBG" },
  { id: "sampled", label: "Sampled FBG" },
  { id: "strain_tuned", label: "Strain Tuned FBG" },
];

function FiberPipeGraphic({ showLight }) {
  const pipeWidth = 300;
  const pipeHeight = 50;
  const numLines = 40;
  const lines = [];

  for (let i = 0; i < numLines; i++) {
    let x = (pipeWidth / numLines) * i + 10;
    lines.push(
      <line
        key={i}
        x1={x}
        y1={5}
        x2={x}
        y2={pipeHeight - 5}
        stroke={`rgba(0, 123, 255, 0.8)`}
        strokeWidth={2}
      />
    );
  }

  // State to control animation position of light circle
  const [lightX, setLightX] = useState(0);

  useEffect(() => {
    if (showLight) {
      setLightX(0);
      let start = null;
      const duration = 2000; // animation duration in ms

      function animate(timestamp) {
        if (!start) start = timestamp;
        const progress = timestamp - start;
        const newX = (progress / duration) * pipeWidth;

        if (newX < pipeWidth) {
          setLightX(newX);
          requestAnimationFrame(animate);
        } else {
          setLightX(pipeWidth);
        }
      }

      requestAnimationFrame(animate);
    } else {
      setLightX(0);
    }
  }, [showLight]);

  return (
    <svg
      width={pipeWidth}
      height={pipeHeight}
      style={{ borderRadius: 10, background: "#ddd" }}
    >
      <rect
        x={0}
        y={0}
        width={pipeWidth}
        height={pipeHeight}
        rx={10}
        ry={10}
        fill="#222"
        opacity={0.9}
      />
      {lines}
      {showLight && (
        <circle
          cx={lightX}
          cy={pipeHeight / 2}
          r={8}
          fill="#00c6ff"
          opacity={0.8}
          style={{ filter: "drop-shadow(0 0 6px #00c6ff)" }}
        />
      )}
    </svg>
  );
}

function Grating() {
  const [gratingType, setGratingType] = useState("uniform");
  const [parameters, setParameters] = useState({
    length: "",
    refractiveIndex: "",
    period: "",
  });
  const [simulationData, setSimulationData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showLight, setShowLight] = useState(false);
  const [error, setError] = useState("");

  const handleInputChange = (e) => {
    setParameters({ ...parameters, [e.target.name]: e.target.value });
  };

  const validateInputs = () => {
    if (
      parameters.length === "" ||
      parameters.refractiveIndex === "" ||
      parameters.period === ""
    ) {
      setError("Please fill all parameter fields.");
      return false;
    }
    if (
      isNaN(parameters.length) ||
      isNaN(parameters.refractiveIndex) ||
      isNaN(parameters.period)
    ) {
      setError("Please enter valid numeric values.");
      return false;
    }
    setError("");
    return true;
  };

  const runSimulation = async () => {
    if (!validateInputs()) return;

    setLoading(true);
    setShowLight(false);
    setSimulationData(null);

    try {
      const res = await axios.post("http://127.0.0.1:5000/grating", {
        gratingType,
        parameters,
      });
      setSimulationData(res.data);
      setShowLight(true);
    } catch (error) {
      console.error("Simulation error:", error);
      setError("Simulation failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const resetAll = () => {
    setParameters({ length: "", refractiveIndex: "", period: "" });
    setSimulationData(null);
    setShowLight(false);
    setError("");
  };

  return (
    <div
      style={{
        marginTop: "6rem",
        maxWidth: "1000px",
        margin: "6rem auto",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <h2 style={{ textAlign: "center" }}>Grating Simulation</h2>

      {/* Fiber pipe */}
      <div style={{ textAlign: "center", marginBottom: "2rem" }}>
        <FiberPipeGraphic showLight={showLight} />
      </div>

      <div style={{ display: "flex", gap: "2rem" }}>
        {/* Left: Parameter Input */}
        <div style={{ flex: 1 }}>
          <h3>Parameters</h3>
          <input
            name="length"
            value={parameters.length}
            onChange={handleInputChange}
            placeholder="Length (mm)"
            style={{ width: "100%", padding: "0.5rem", marginBottom: "0.5rem" }}
          />
          <input
            name="refractiveIndex"
            value={parameters.refractiveIndex}
            onChange={handleInputChange}
            placeholder="Refractive Index"
            style={{ width: "100%", padding: "0.5rem", marginBottom: "0.5rem" }}
          />
          <input
            name="period"
            value={parameters.period}
            onChange={handleInputChange}
            placeholder="Period (nm)"
            style={{ width: "100%", padding: "0.5rem", marginBottom: "0.5rem" }}
          />

          {error && (
            <p style={{ color: "red", marginTop: "0.5rem", fontWeight: "600" }}>
              {error}
            </p>
          )}

          <button
            onClick={runSimulation}
            style={{
              width: "100%",
              padding: "0.7rem",
              backgroundColor: "#007bff",
              color: "white",
              border: "none",
              borderRadius: 5,
              cursor: "pointer",
              marginBottom: "0.5rem",
            }}
            disabled={loading}
          >
            Simulate
          </button>

          <button
            onClick={resetAll}
            style={{
              width: "100%",
              padding: "0.7rem",
              backgroundColor: "#6c757d",
              color: "white",
              border: "none",
              borderRadius: 5,
              cursor: "pointer",
            }}
            disabled={loading}
          >
            Reset
          </button>

          {loading && <p style={{ marginTop: "1rem" }}>Simulating...</p>}
        </div>

        {/* Right: Grating Selection */}
        <div style={{ width: "200px" }}>
          <h3>Grating Type</h3>
          {gratingTypes.map((g) => (
            <button
              key={g.id}
              onClick={() => setGratingType(g.id)}
              style={{
                width: "100%",
                padding: "0.6rem",
                fontWeight: gratingType === g.id ? "700" : "400",
                backgroundColor: gratingType === g.id ? "#007bff" : "#eee",
                color: gratingType === g.id ? "white" : "#333",
                border: "none",
                borderRadius: 5,
                marginBottom: "0.4rem",
                cursor: "pointer",
              }}
              disabled={loading}
            >
              {g.label}
            </button>
          ))}
        </div>
      </div>

      {/* Graphs side by side */}
      {simulationData && (
        <div
          style={{
            display: "flex",
            gap: "2rem",
            marginTop: "2rem",
          }}
        >
          <div style={{ flex: 1 }}>
            <h3 style={{ textAlign: "center" }}>Reflected Spectrum</h3>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={simulationData.reflected}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="wavelength"
                  label={{ value: "Wavelength (nm)", position: "insideBottom", offset: -5 }}
                />
                <YAxis
                  label={{ value: "Reflectivity", angle: -90, position: "insideLeft" }}
                  domain={[0, 1]}
                />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="intensity" stroke="#007bff" dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div style={{ flex: 1 }}>
            <h3 style={{ textAlign: "center" }}>Transmitted Spectrum</h3>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={simulationData.transmitted}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="wavelength"
                  label={{ value: "Wavelength (nm)", position: "insideBottom", offset: -5 }}
                />
                <YAxis
                  label={{ value: "Transmittance", angle: -90, position: "insideLeft" }}
                  domain={[0, 1]}
                />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="intensity" stroke="#28a745" dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  );
}

export default Grating;
