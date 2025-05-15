import React, { useState } from 'react';
import { motion } from 'framer-motion'; // Import framer-motion
import './About.css';
import about_img from '../../assets/about.png';
import about_img2 from '../../assets/About2.png';
import play_icon from '../../assets/play-icon.png';
import white_arrow from '../../assets/white-arrow.png';

const About = () => {
  const [lambda, setLambda] = useState('');
  const [spectralBandwidth, setSpectralBandwidth] = useState('');
  const [neff, setNeff] = useState('');
  const [unit, setUnit] = useState('nm'); // New state for units (nm, pm, or µm)
  const [result, setResult] = useState('');

  // Define dynamic ranges based on unit selection
  const getLambdaRange = (unit) => {
    switch (unit) {
      case 'µm':
        return { min: 1.525, max: 1.565 };
      case 'pm':
        return { min: 1525000, max: 1565000 };
      case 'nm':
      default:
        return { min: 1525, max: 1565 };
    }
  };

  const getSpectralBandwidthRange = (unit) => {
    switch (unit) {
      case 'µm':
        return { min: 0.01, max: 0.02 }; // µm bandwidth range
      case 'pm':
        return { min: 10000, max: 20000 }; // Spectral bandwidth range in pm (10 - 20 nm -> 10000 - 20000 pm)
      case 'nm':
      default:
        return { min: 10, max: 20 }; // nm bandwidth range
    }
  };

  const getNeffRange = () => {
    return { min: 1.44, max: 1.45 }; // This range doesn't change with units
  };

  // Dynamic placeholders based on unit
  const getLambdaPlaceholder = (unit) => {
    switch (unit) {
      case 'µm':
        return '1.525 - 1.565';
      case 'pm':
        return '1525000 - 1565000';
      case 'nm':
      default:
        return '1525 - 1565';
    }
  };

  const getSpectralBandwidthPlaceholder = (unit) => {
    switch (unit) {
      case 'µm':
        return '0.01 - 0.02';
      case 'pm':
        return '10000 - 20000';
      case 'nm':
      default:
        return '10 - 20';
    }
  };

  const calculateCoherenceLength = (event) => {
    event.preventDefault();

    // Get the dynamic range based on the unit selected
    const { min: lambdaMin, max: lambdaMax } = getLambdaRange(unit);
    const { min: spectralBandwidthMin, max: spectralBandwidthMax } = getSpectralBandwidthRange(unit);
    const { min: neffMin, max: neffMax } = getNeffRange();

    // Validation
    if (!lambda || !spectralBandwidth || !neff) {
      setResult('⚠️ Please enter all fields.');
      return;
    }

    const lambdaVal = parseFloat(lambda);
    const spectralBandwidthVal = parseFloat(spectralBandwidth);
    const neffVal = parseFloat(neff);

    // Validate numeric values
    if (isNaN(lambdaVal) || isNaN(spectralBandwidthVal) || isNaN(neffVal)) {
      setResult('⚠️ Please enter valid numerical values.');
      return;
    }

    // Range Validation
    if (lambdaVal < lambdaMin || lambdaVal > lambdaMax) {
      setResult(`⚠️ Lambda must be between ${lambdaMin} and ${lambdaMax} ${unit}.`);
      return;
    }
    if (spectralBandwidthVal < spectralBandwidthMin || spectralBandwidthVal > spectralBandwidthMax) {
      setResult(`⚠️ Spectral Bandwidth must be between ${spectralBandwidthMin} and ${spectralBandwidthMax} ${unit}.`);
      return;
    }
    if (neffVal < neffMin || neffVal > neffMax) {
      setResult('⚠️ Effective index must be between 1.44 and 1.45.');
      return;
    }

    // Convert lambda and spectralBandwidth based on the selected unit
    let lambdaInNm = lambdaVal;
    let spectralBandwidthInNm = spectralBandwidthVal;

    if (unit === 'pm') {
      lambdaInNm = lambdaVal * 0.001; // Convert pm to nm
      spectralBandwidthInNm = spectralBandwidthVal * 0.001; // Convert pm to nm
    } else if (unit === 'µm') {
      lambdaInNm = lambdaVal * 1000; // Convert µm to nm
      spectralBandwidthInNm = spectralBandwidthVal * 1000; // Convert µm to nm
    }

    // Calculate Coherence Length (in nm)
    const coherenceLength = (lambdaInNm ** 2 * neffVal) / spectralBandwidthInNm;

    // Convert the result back to selected unit for display
    let resultInUnit = coherenceLength;
    if (unit === 'pm') {
      resultInUnit = coherenceLength * 1000; // Convert nm to pm
    } else if (unit === 'µm') {
      resultInUnit = coherenceLength / 1000; // Convert nm to µm
    }

    setResult(`✅ Coherence Length: ${resultInUnit.toFixed(2)} ${unit === 'pm' ? 'pm' : unit === 'µm' ? 'µm' : 'nm'}`);
  };

  return (
    <div className='about'>
      <motion.div
        className='about-left'
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <img src={about_img2} className='about-img' alt="About University" />
      </motion.div>
      <div className='about-right'>
        <motion.h3
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 1, delay: 0.5 }}
        >
          Let's Calculate
        </motion.h3>
        <motion.h2
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 1, delay: 1 }}
        >
          Coherence Length Calculator
        </motion.h2>
        
        <motion.div
          className='Contact'
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.5 }}
        >
          <div className='Contact-col'>
            <form onSubmit={calculateCoherenceLength}>
              <label>Lambda ({unit}):</label>
              <motion.input
                type="text"
                name="lambda"
                value={lambda}
                onChange={(e) => setLambda(e.target.value)}
                placeholder={getLambdaPlaceholder(unit)} // Dynamically update placeholder
                required
                whileFocus={{ scale: 1.05 }}
                transition={{ duration: 0.2 }}
              />

              <label>Spectral Bandwidth ({unit}):</label>
              <motion.input
                type="text"
                name="spectralBandwidth"
                value={spectralBandwidth}
                onChange={(e) => setSpectralBandwidth(e.target.value)}
                placeholder={getSpectralBandwidthPlaceholder(unit)} // Dynamically update placeholder
                required
                whileFocus={{ scale: 1.05 }}
                transition={{ duration: 0.2 }}
              />

              <label>Effective Index (neff):</label>
              <motion.input
                type="text"
                name="neff"
                value={neff}
                onChange={(e) => setNeff(e.target.value)}
                placeholder="1.44 - 1.45"
                required
                whileFocus={{ scale: 1.05 }}
                transition={{ duration: 0.2 }}
              />

              <label>Unit:</label>
              <select value={unit} onChange={(e) => setUnit(e.target.value)} required>
                <option value="nm">nm</option>
                <option value="pm">pm</option>
                <option value="µm">µm</option>
              </select>

              <div className="space-between"></div> {/* Add space between select and button */}
              <br></br>
              <motion.button
                type="submit"
                className='btn dark-btn'
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                transition={{ duration: 0.2 }}
              >
                Calculate Now <img src={white_arrow} alt="Arrow" />
              </motion.button>
            </form>
          </div>
        </motion.div>

        {result && <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          {result}
        </motion.span>}
      </div>
    </div>
  );
};

export default About;
