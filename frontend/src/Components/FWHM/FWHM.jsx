import React from 'react';
import './FWHM.css';
import white_arrow from '../../assets/white-arrow.png';
import about_img2 from '../../assets/About2.png';
import fiberr from '../../assets/fiberr.png'
import bgf from '../../assets/bgf.png'

const FWHM = () => {

  // ✅ Only download CSV from backend
  const downloadCSV = async () => {
    try {
      const response = await fetch('http://localhost:5000/simulate-fbg');
      const data = await response.json();

      // Prepare CSV content
      const header = 'Wavelength (nm),Reflectivity\n';
      const csvContent = header + data.map(d => `${d.wavelength_nm},${d.reflectivity}`).join('\n');
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);

      // Trigger download
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'fbg_spectrum.csv');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

    } catch (error) {
      console.error('Error fetching data:', error);
      alert('Failed to fetch spectrum from backend.');
    }
  }; 

  return (
    <div className='FWHM'>
      <div className='FWHM-right'>
      
      <h3>FBG Spectrum Generator</h3>
        <h2>Download Simulated Spectrum CSV</h2>

        <div className='Contact'>
          <div className='Contact-col'>
            <button className='btn dark-btn' onClick={downloadCSV}>
              Download CSV <img src={white_arrow} alt="Arrow" />
            </button>
          </div>
        </div>
      </div>
    
      <div className='FWHM-left'>
      <img src={bgf} className='about-img' alt="About University" />
      </div>
    </div>
  );
};

export default FWHM;

