import React, { useState, useRef } from 'react';
import '../styles/PasswordGenerator.css';

const PasswordGenerator = () => {
  const [isRandomCharacters, setIsRandomCharacters] = useState(true);
  const [length, setLength] = useState(12); // Default value of 12
  const [generatedPassword, setGeneratedPassword] = useState('');
  const [copySuccess, setCopySuccess] = useState('');
  const passwordRef = useRef(null);

  const handleToggleChange = () => {
    setIsRandomCharacters(!isRandomCharacters);
  };

  const handleSliderChange = (e) => {
    setLength(e.target.value);
  };

  const generatePassword = () => {
    let password = '';

    if (isRandomCharacters) {
      const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+~`|}{[]:;?><,./-=';
      for (let i = 0; i < length; i++) {
        password += characters.charAt(Math.floor(Math.random() * characters.length));
      }
    } else {
      const words = ['apple', 'banana', 'cherry', 'date', 'elderberry', 'fig', 'grape', 'honeydew', 'kiwi', 'lemon', 'mango', 'nectarine', 'orange', 'peach', 'quince', 'raspberry', 'strawberry', 'tangerine', 'watermelon', 'zucchini'];
      for (let i = 0; i < length; i++) {
        password += words[Math.floor(Math.random() * words.length)];
        if (i !== length - 1) {
          password += '-';
        }
      }
    }

    setGeneratedPassword(password);
    setCopySuccess('');
  };

  const copyToClipboard = () => {
    if (passwordRef.current) {
      // Create a temporary textarea element
      const textArea = document.createElement('textarea');
      textArea.value = generatedPassword;
      document.body.appendChild(textArea);
      textArea.select();

      try {
        document.execCommand('copy');
        setCopySuccess('Copied!');
        setTimeout(() => setCopySuccess(''), 2000); // Clear the message after 2 seconds
      } catch (err) {
        setCopySuccess('Failed to copy');
      }

      document.body.removeChild(textArea);
    }
  };

  return (
    <div className="password-generator-container">
      <div className="toggle-container card-content description">
        <label>Characters</label>
        <label className="toggle">
          <input
            type="checkbox"
            checked={!isRandomCharacters}
            onChange={handleToggleChange}
          />
          <span className="slider"></span>
        </label>
        <label>Words</label>
      </div>

      <div className="length-slider-container">
        <label htmlFor="length-slider">
          {isRandomCharacters ? 'Character Length:' : 'Word Count:'}
          <span className="length-value">{length}</span>
        </label>
        <input
          type="range"
          id="password-generator-slider"
          className="length-slider"
          min={isRandomCharacters ? "4" : "1"}
          max={isRandomCharacters ? "50" : "10"}
          value={length}
          onChange={handleSliderChange}
        />
      </div>

      <button onClick={generatePassword} className="generate-btn">Generate Password</button>

      {generatedPassword && (
        <div className="password-display-container">
          <div id="generated-password" ref={passwordRef}>
            {generatedPassword}
          </div>
          <button className="copy-button" onClick={copyToClipboard}>
            {copySuccess || <i className="fas fa-copy"></i>}
          </button>
        </div>
      )}
    </div>
  );
};

export default PasswordGenerator;