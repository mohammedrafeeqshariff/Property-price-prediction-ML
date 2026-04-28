import { useState, useRef, useEffect } from 'react';
import Bytez from 'bytez.js';
import './App.css';

function App() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [apiKey, setApiKey] = useState('');
  const [isApiKeySet, setIsApiKeySet] = useState(false);
  const [sdk, setSdk] = useState(null);
  const [modelName, setModelName] = useState('katanemo/Arch-Router-1.5B');
  const messagesEndRef = useRef(null);

  // Auto-scroll to bottom when new messages arrive
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Handle API key submission
  const handleApiKeySubmit = (e) => {
    e.preventDefault();
    if (apiKey.trim()) {
      try {
        const bytezSdk = new Bytez(apiKey.trim());
        setSdk(bytezSdk);
        setIsApiKeySet(true);
        setError('');
      } catch (err) {
        setError('Failed to initialize SDK. Please check your API key.');
        console.error('SDK Initialization Error:', err);
      }
    } else {
      setError('Please enter a valid API key');
    }
  };

  // Send message to Bytez API
  const sendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim()) {
      setError('Please enter a message');
      return;
    }

    if (!sdk) {
      setError('SDK not initialized. Please refresh and enter your API key again.');
      return;
    }

    const userMessage = { role: 'user', content: input.trim() };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setLoading(true);
    setError('');

    try {
      const model = sdk.model(modelName);
      let result;

      // Check model type (text or image)
      const isImageModel = modelName.toLowerCase().includes('stabilityai');

      if (isImageModel) {
        // Image generation models need structured prompt input
        result = await model.run({ prompt: userMessage.content });
      } else {
        // Text generation models can take conversation arrays
        const conversationHistory = [...messages, userMessage];
        result = await model.run(conversationHistory);
      }

      const { error: apiError, output } = result;
      if (apiError) throw new Error(apiError);

      let assistantContent = '';

      // Handle output type
      if (isImageModel) {
        // If the output contains a base64 image string
        if (output?.image_base64) {
          assistantContent = `<img src="data:image/png;base64,${output.image_base64}" alt="Generated Image" style="max-width:100%;border-radius:12px;" />`;
        } else if (Array.isArray(output) && output[0]?.image_base64) {
          assistantContent = `<img src="data:image/png;base64,${output[0].image_base64}" alt="Generated Image" style="max-width:100%;border-radius:12px;" />`;
        } else {
          assistantContent = `Unexpected image output: ${JSON.stringify(output)}`;
        }
      } else {
        // Text output handling
        if (typeof output === 'string') {
          assistantContent = output;
        } else if (Array.isArray(output) && output.length > 0) {
          assistantContent =
            output[output.length - 1].content || JSON.stringify(output);
        } else if (output?.content) {
          assistantContent = output.content;
        } else {
          assistantContent = JSON.stringify(output);
        }
      }

      const assistantMessage = {
        role: 'assistant',
        content: assistantContent,
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (err) {
      console.error('API Error:', err);
      setError(`Failed to get response. ${err.message || 'Unknown error.'}`);
    } finally {
      setLoading(false);
    }
  };

  // Clear chat history
  const clearChat = () => {
    setMessages([]);
    setError('');
  };

  // Reset API key
  const resetApiKey = () => {
    setIsApiKeySet(false);
    setApiKey('');
    setSdk(null);
    setMessages([]);
    setError('');
  };

  // API Key Setup Screen
  if (!isApiKeySet) {
    return (
      <div className="container">
        <div className="api-key-card">
          <h1>Bytez AI Chat App</h1>
          <p className="subtitle">Enter your Bytez API key to get started</p>

          <form onSubmit={handleApiKeySubmit}>
            <input
              type="text"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="Enter your Bytez API key..."
              className="api-input"
            />

            {error && <div className="error-message">{error}</div>}

            <button type="submit" className="primary-button">
              Start Chatting
            </button>
          </form>

          <div className="info-text">
            <p>Supports Text & Image Models via Bytez.js</p>
            <p style={{ marginTop: '8px', fontSize: '12px' }}>
              Example Key: dcb3348acac86b0762a9668de77f1e67
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Main Chat Interface
  return (
    <div className="app">
      <header className="header">
        <div className="header-content">
          <h1>Potta dharan AI</h1>

          {/* Model Selection */}
          <select
            className="model-select"
            value={modelName}
            onChange={(e) => setModelName(e.target.value)}
          >
            <option value="katanemo/Arch-Router-1.5B">Text Generation</option>
            <option value="stabilityai/stable-diffusion-xl-base-1.0">
              Image Generation
            </option>
          </select>

          <div className="button-group">
            <button onClick={clearChat} className="secondary-button">
              Clear Chat
            </button>
            <button onClick={resetApiKey} className="danger-button">
              Change Key
            </button>
          </div>
        </div>
      </header>

      <div className="chat-container">
        <div className="messages-area">
          {messages.length === 0 ? (
            <div className="empty-state">
              <p className="emoji">👋</p>
              <p className="empty-title">Start a conversation</p>
              <p className="empty-subtitle">
                Type a message or image prompt below to begin
              </p>
            </div>
          ) : (
            <div className="messages">
              {messages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`message ${
                    msg.role === 'user' ? 'user-message' : 'assistant-message'
                  }`}
                >
                  <div
                    className="message-content"
                    dangerouslySetInnerHTML={{ __html: msg.content }}
                  />
                </div>
              ))}
              {loading && (
                <div className="message assistant-message">
                  <div className="message-content">
                    <div className="loading-dots">
                      <span></span>
                      <span></span>
                      <span></span>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {error && <div className="error-banner">{error}</div>}

        <form onSubmit={sendMessage} className="input-form">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={
              modelName.includes('stabilityai')
                ? 'Describe an image to generate...'
                : 'Type your message...'
            }
            disabled={loading}
            className="message-input"
          />
          <button
            type="submit"
            disabled={loading || !input.trim()}
            className="send-button"
          >
            {loading ? 'Sending...' : 'Send'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default App;
