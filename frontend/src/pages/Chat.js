import React, { useState, useRef, useEffect } from 'react';
import { FiSend } from 'react-icons/fi';
import '../styles/Chat.css';
import PremiumPopup from '../components/PremiumPlans';

const Chat = () => {
  const [messages, setMessages] = useState([
    {
      sender: 'bot',
      text: '👋 Hi! I’m your AI Career Assistant. Ask me anything about careers, courses, or colleges.',
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [messageCount, setMessageCount] = useState(0);
  const [user, setUser] = useState(() => JSON.parse(localStorage.getItem('user')));
  const [showPremiumPopup, setShowPremiumPopup] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const newCount = messageCount + 1;
    if (!user?.isPremium && newCount > 25) {
      setShowPremiumPopup(true);
      return;
    }

    setMessageCount(newCount);

    const userMessage = { sender: 'user', text: input };
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch('http://localhost:5000/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: updatedMessages }),
      });

      const data = await res.json();

      if (data.reply) {
        setMessages((prev) => [...prev, { sender: 'bot', text: data.reply }]);
      } else {
        setMessages((prev) => [
          ...prev,
          { sender: 'bot', text: "⚠️ Sorry, I couldn't understand that." },
        ]);
      }
    } catch (error) {
      console.error('Chat API Error:', error);
      setMessages((prev) => [
        ...prev,
        { sender: 'bot', text: '❌ Error connecting to AI service.' },
      ]);
    }

    setLoading(false);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') handleSend();
  };

  return (
    <div className="chat-container">
      <div className="chat-box-wrapper">
        <div className="chat-header">🎓 CareerGenAi Assistant</div>

        <div className="chat-box">
          {messages.map((msg, idx) => (
            <div key={idx} className={`chat-bubble ${msg.sender}`}>
              {msg.sender === 'bot' ? (
                <div className="bot-response-card">
                  {msg.text.split('\n').map((line, i) => (
                    <p key={i} className={line.startsWith('•') || line.startsWith('-') ? 'list-line' : ''}>
                      {line}
                    </p>
                  ))}
                </div>
              ) : (
                <div className="user-message">{msg.text}</div>
              )}
            </div>
          ))}
          {loading && (
            <div className="chat-bubble bot">
              <div className="bot-response-card">⏳ Typing...</div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <div className="chat-input">
          <input
            type="text"
            value={input}
            placeholder="Ask me anything..."
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyPress}
            disabled={loading}
          />
          <button
            onClick={handleSend}
            disabled={loading || !input.trim()}
            className="send-btn"
          >
            {loading ? '...' : <FiSend size={20} />}
          </button>
        </div>
      </div>

      {showPremiumPopup && (
        <PremiumPopup
          onClose={() => setShowPremiumPopup(false)}
          onUpgrade={() => {
            const updatedUser = JSON.parse(localStorage.getItem('user'));
            setUser(updatedUser);
            setShowPremiumPopup(false);
            setMessageCount(0);
          }}
        />
      )}
    </div>
  );
};

export default Chat;
