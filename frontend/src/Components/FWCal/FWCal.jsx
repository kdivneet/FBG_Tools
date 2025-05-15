import React, { useState } from 'react';
import './FWCal.css';
import white_arrow from '../../assets/white-arrow.png';
import bgf from '../../assets/bgf.png';
import aboutt2 from '../../assets/aboutt2.png';

const FWCal = () => {
  const [imageURL, setImageURL] = useState('');
  const [resultText, setResultText] = useState('');
  const [fileName, setFileName] = useState('No file chosen');
  const [fileInputKey, setFileInputKey] = useState(Date.now()); // Unique key to reset input
  const [coherenceLength, setCoherenceLength] = useState(null);
  const [isHighlighted, setIsHighlighted] = useState(false);

  // ✅ Upload & Analyze CSV
  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;
    
    setFileName(file.name); // Show uploaded file name
    
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('http://localhost:5000/analyze', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      
      if (data.error) {
        alert(data.error);
        return;
      }

      setResultText(data.resultText);
      setImageURL(`http://localhost:5000/${data.imagePath}?t=${Date.now()}`); // Force new image

      // Get the coherence length from the response
      if (data.coherenceLength) {
        setCoherenceLength(parseFloat(data.coherenceLength).toFixed(4)); // Correctly format the value in meters
        setIsHighlighted(true); // Add highlight class
      }

    } catch (error) {
      console.error('Error uploading file:', error);
      alert('Failed to upload file.');
    }
  };

  // ✅ Reset Analysis
  const resetAnalysis = async () => {
    try {
      await fetch('http://localhost:5000/reset', { method: 'POST' });

      // 🔥 Reset all states
      setFileName('No file chosen');
      setResultText('');
      setImageURL('');
      setCoherenceLength(null);
      setIsHighlighted(false); // Remove highlight when reset
      setFileInputKey(Date.now()); // Reset file input field
      
      alert('Analysis reset! You can now upload a new file.');
    } catch (error) {
      console.error('Error resetting analysis:', error);
      alert('Failed to reset.');
    }
  };

  return (
    <div className='FWHM'>
      <div className='FWHM-right'>
        <h3>FBG Spectrum Analyzer</h3>
        <h2>Upload CSV & Analyze Spectrum</h2>

        <div className='Contact'>
          <div className='Contact-col'>
            {/* ✅ File Input */}
            <input
              key={fileInputKey} // Reset input field when key changes
              type="file"
              accept=".csv"
              onChange={handleFileUpload}
            />
            <span>{fileName}</span>

            {/* ✅ Analyze & Reset Buttons */}
            <button className='btn dark-btn' onClick={resetAnalysis}>
              Reset & Upload New File
            </button>
          </div>
        </div>

        {/* ✅ Show Result Text */}
        {resultText && <p className="result-text">{resultText}</p>}

        {/* ✅ Show Image If Available */}
        {imageURL ? (
          <img src={imageURL} alt="FBG Spectrum" className="spectrum-image" />
        ) : (
          <p className="no-image">No image available</p>
        )}

        {/* ✅ Coherence Length Box */}
        {coherenceLength && (
          <div className={`coherence-length ${isHighlighted ? 'highlight' : ''}`}>
            <h3>Calculated Coherence Length</h3>
            <p>{coherenceLength} meters</p>
          </div>
        )}
      </div>

      <div className='FWHM-left'>
        <img src={aboutt2} className='about-img' alt="About University" />
      </div>
    </div>
  );
};


export default FWCal;
