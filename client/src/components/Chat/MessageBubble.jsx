import React from 'react';
import './MessageBubble.css';

const MessageBubble = ({ message, isOwn, timestamp, isRead }) => {
    return (
        <div className={`message-bubble ${isOwn ? 'own' : 'friend'}`}>
            <div className="bubble-content">
                <p className="message-text">{message}</p>
                <div className="bubble-meta">
                    <span className="message-time">{timestamp}</span>
                    {isOwn && (
                        <span className={`read-status ${isRead ? 'read' : 'sent'}`}>
                            {isRead ? '✓✓' : '✓'}
                        </span>
                    )}
                </div>
            </div>
        </div>
    );
};

export default MessageBubble;