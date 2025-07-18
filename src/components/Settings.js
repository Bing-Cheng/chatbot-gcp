import React from 'react';
import './Settings.css';

const Settings = ({ isOpen, onClose, settings, onSettingsChange }) => {
  const llmOptions = [
    { id: 'gemini-2.5-flash', name: 'Gemini 2.5 flash' }
  ];

  const themeOptions = [
    { id: 'default', name: 'Default', colors: { primary: '#667eea', secondary: '#764ba2' } },
    { id: 'ocean', name: 'Ocean', colors: { primary: '#00b4db', secondary: '#0083b0' } },
    { id: 'forest', name: 'Forest', colors: { primary: '#2ecc71', secondary: '#27ae60' } },
    { id: 'sunset', name: 'Sunset', colors: { primary: '#ff6b6b', secondary: '#ee5253' } },
    { id: 'purple', name: 'Purple', colors: { primary: '#9b59b6', secondary: '#8e44ad' } }
  ];

  const handleThemeChange = (theme) => {
    onSettingsChange({ ...settings, theme });
    document.documentElement.style.setProperty('--primary-color', theme.colors.primary);
    document.documentElement.style.setProperty('--secondary-color', theme.colors.secondary);
  };

  if (!isOpen) return null;

  return (
    <div className="settings-overlay">
      <div className="settings-panel">
        <div className="settings-header">
          <h2>Settings</h2>
          <button className="close-button" onClick={onClose}>×</button>
        </div>
        
        <div className="settings-section">
          <h3>Language Model</h3>
          <div className="settings-options">
            {llmOptions.map(option => (
              <label key={option.id} className="option-label">
                <input
                  type="radio"
                  name="llm"
                  value={option.id}
                  checked={settings.llm === option.id}
                  onChange={(e) => onSettingsChange({ ...settings, llm: e.target.value })}
                />
                <span className="option-text">{option.name}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="settings-section">
          <h3>Theme</h3>
          <div className="theme-options">
            {themeOptions.map(theme => (
              <div
                key={theme.id}
                className={`theme-option ${settings.theme.id === theme.id ? 'selected' : ''}`}
                onClick={() => handleThemeChange(theme)}
                style={{
                  background: `linear-gradient(135deg, ${theme.colors.primary} 0%, ${theme.colors.secondary} 100%)`
                }}
              >
                <span className="theme-name">{theme.name}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="settings-section">
          <h3>Chat Settings</h3>
          <div className="settings-options">
            <label className="option-label">
              <input
                type="checkbox"
                checked={settings.autoScroll}
                onChange={(e) => onSettingsChange({ ...settings, autoScroll: e.target.checked })}
              />
              <span className="option-text">Auto-scroll to new messages</span>
            </label>
            <label className="option-label">
              <input
                type="checkbox"
                checked={settings.showTypingIndicator}
                onChange={(e) => onSettingsChange({ ...settings, showTypingIndicator: e.target.checked })}
              />
              <span className="option-text">Show typing indicator</span>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings; 