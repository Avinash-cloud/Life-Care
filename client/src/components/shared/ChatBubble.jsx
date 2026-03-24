import React from 'react';

const ChatBubble = ({ message, isSender, timestamp, status = 'sent', avatar }) => {
  // Format timestamp
  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // Get status icon
  const getStatusIcon = () => {
    switch (status) {
      case 'sent': return <i className="bi bi-check"></i>;
      case 'delivered': return <i className="bi bi-check-all"></i>;
      case 'read': return <i className="bi bi-check-all text-primary"></i>;
      default: return null;
    }
  };

  return (
    <div className={`chat-bubble-container ${isSender ? 'sender' : 'receiver'}`}>
      {!isSender && (
        <div className="chat-avatar">
          <img src={avatar} alt="Avatar" />
        </div>
      )}
      <div className="chat-content">
        <div className={`chat-bubble ${isSender ? 'sender' : 'receiver'}`}>
          <p className="chat-message">{message}</p>
        </div>
        <div className="chat-meta">
          <span className="chat-time">{formatTime(timestamp)}</span>
          {isSender && <span className="chat-status">{getStatusIcon()}</span>}
        </div>
      </div>
    </div>
  );
};

export default ChatBubble;