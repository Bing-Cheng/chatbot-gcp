import React, { useState, useRef, useEffect } from 'react';
import './App.css';
import Login from './components/Login';
import Settings from './components/Settings';

// Import avatar images
import userAvatar from './assets/user-avatar.svg';
import botAvatar from './assets/bot-avatar.svg';

function App() {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [user, setUser] = useState(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [settings, setSettings] = useState({
    llm: 'gemini-2.5-flash',
    theme: {
      id: 'default',
      name: 'Default',
      colors: { primary: '#667eea', secondary: '#764ba2' }
    },
    autoScroll: true,
    showTypingIndicator: true
  });

  const fileInputRef = useRef(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    // Set initial theme
    document.documentElement.style.setProperty('--primary-color', settings.theme.colors.primary);
    document.documentElement.style.setProperty('--secondary-color', settings.theme.colors.secondary);
  }, []);

  const scrollToBottom = () => {
    if (settings.autoScroll) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, settings.autoScroll]);

  const handleLogin = (username) => {
    setUser(username);
    // Add a welcome message
    setMessages([{
      type: 'bot',
      content: `Welcome ${username}! How can I help you today?`
    }]);
  };

  const handleLogout = () => {
    setUser(null);
    setMessages([]);
    setInputMessage('');
    setSelectedFile(null);
  };
  const handleNewSession= async() => {
    console.log("New session started");
    const payload = JSON.stringify({
        message: ""
      })
      const response = await fetch('http://localhost:8000/new_chat', {
        method: 'POST',
        body: payload
      });
      setMessages([]);
      setInputMessage('');
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setMessages(prev => [...prev, {
        type: 'user',
        content: `File selected: ${file.name}`,
        file: file
      }]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!inputMessage.trim() && !selectedFile) return;

    const userMessage = {
      type: 'user',
      content: inputMessage,
      file: selectedFile
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setSelectedFile(null);
    setIsLoading(true);

    try {
      const formData = new FormData();
      formData.append('message', inputMessage);
      if (selectedFile) {
        formData.append('file', selectedFile);
      }
      formData.append('llm', settings.llm);
      const payload = JSON.stringify({
        message: inputMessage
      })
      const response = await fetch('http://localhost:8000/chat', {
        method: 'POST',
        body: payload//formData
      });

      const data = await response.json();
      setMessages(prev => [...prev, { type: 'bot', content: data.response }]);
    } catch (error) {
      console.error('Error:', error);
      setMessages(prev => [...prev, { 
        type: 'bot', 
        content: 'Sorry, I encountered an error. Please try again.' 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  if (!user) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <div className="app">
      <div className="chat-container">
        <div className="chat-header">
          <div className="header-content">
            <div className="user-profile">
              <img src={userAvatar} alt="User" className="header-avatar" />
              <span className="user-name">{user}</span>
            </div>
            <h2 className="app-title">GCP AI Chatbot</h2>
            <div className="header-actions">
              <button className="new-session-button settings-button" onClick={() => handleNewSession()} title="New Session">
                🗨️
              </button>
              <button className="settings-button" onClick={() => setIsSettingsOpen(true)} title="Settings">
                ⚙️
              </button>
              <button onClick={handleLogout} className="logout-button">
                Logout
              </button>
            </div>
          </div>
        </div>
        <div className="messages-container">
          {messages.map((message, index) => (
            <div key={index} className={`message ${message.type}-message`}>
              <div className="avatar">
                <img src={message.type === 'user' ? userAvatar : botAvatar} alt={message.type} />
              </div>
              {message.file ? (
                <div className="file-message">
                  <span className="file-icon">📎</span>
                  <span>{message.content}</span>
                </div>
              ) : (
                <div className="message-content">
                  {message.content}
                </div>
              )}
            </div>
          ))}
          {isLoading && settings.showTypingIndicator && (
            <div className="message bot-message">
              <div className="avatar">
                <img src={botAvatar} alt="bot" />
              </div>
              <div className="loading">
                <div className="dot"></div>
                <div className="dot"></div>
                <div className="dot"></div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
        <form onSubmit={handleSubmit} className="input-form">
          <label className="file-upload">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              style={{ display: 'none' }}
            />
            <span className="upload-icon">🆕</span>
          </label>
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder="Type your message..."
          />
          <button type="submit" disabled={isLoading}>
            Send
          </button>
        </form>
      </div>
      <Settings
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        settings={settings}
        onSettingsChange={setSettings}
      />
    </div>
  );
}

export default App;