import React, { useState } from "react";
import "./ChatBot.css";
import ChatBox from "./ChatBox";

const ChatBotWidget = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
    <div style={{ position: "fixed", bottom: 20, right: 20, zIndex: 999 }}>
      <div className="chatbot-icon" onClick={() => setIsOpen(!isOpen)}>
        {/* Bubble message inside icon */}
        {!isOpen && (
          <div className="speech-bubble">
            Hey, how can I help you?
          </div>
        )}
        <div className="wave-hand">👋</div>
      </div>
    </div>
    {isOpen && <ChatBox onClose={() => setIsOpen(false)} />}
  </>
  
  );
};

export default ChatBotWidget;
