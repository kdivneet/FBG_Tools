import React, { useState } from "react";
import "./ChatBot.css";

const ChatBox = ({ onClose }) => {
  const [messages, setMessages] = useState([{ type: "bot", text: "Hey there! How can I help you?" }]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(true);



  const sendMessage = async () => {
    if (!input.trim()) return;
  
    if (showSuggestions) setShowSuggestions(false); // hide once first message sent
  
    const userMessage = { type: "user", text: input };
    setMessages((prev) => [...prev, userMessage]);
  
    try {
      const response = await fetch("http://localhost:5000/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: input }),
      });
      const data = await response.json();
      const botReply = { type: "bot", text: data.response };
      setMessages((prev) => [...prev, botReply]);
    } catch (error) {
      setMessages((prev) => [...prev, { type: "bot", text: "Sorry, server error 😔" }]);
    }
  
    setInput("");
  };
  

  return (
    <div className="chatbox-container">
      <div className="chatbox-header">
        <span>💬 FBG Bot</span>
        <button onClick={onClose}>×</button>
      </div>
      {showSuggestions && (
    <div className="chat-suggestions">
      <div className="suggestion-title">💡 Try asking:</div>
      {["What are FBGs?",  "Applications of FBGs"].map((suggestion, index) => (
        <button
          key={index}
          onClick={() => {
            setInput(suggestion);
            setShowSuggestions(false);
            setTimeout(sendMessage, 100);
          }}
        >
          {suggestion}
        </button>
      ))}
    </div>
  )}
      <div className="chatbox-messages">
  {messages.map((msg, i) => (
    <div key={i} className={`message ${msg.type}`}>
  {msg.type === "bot" && <span className="avatar">🤖</span>}
  {msg.text}
</div>

  ))}

 

  {typing && (
    <div className="message bot">
      Bot is typing...
      <div className="typing-indicator">
        <div className="typing-dot" />
        <div className="typing-dot" />
        <div className="typing-dot" />
      </div>
    </div>
  )}
</div>

      <div className="chatbox-input">
        <input
          type="text"
          value={input}
          placeholder="Ask me anything..."
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />
        <button onClick={sendMessage}>➤</button>
      </div>
    </div>
  );
};

export default ChatBox;
